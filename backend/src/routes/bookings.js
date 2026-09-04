const { Router } = require("express");
const prisma = require("../lib/prisma");
const httpError = require("../lib/http-error");
const { requireAuth, optionalAuth } = require("../middleware/auth");

const router = Router();

const STAFF_ROLES = ["SUPPORT", "ADMIN", "FINANCE"];

const SUPPORTED_ITEM_TYPES = ["FLIGHT", "HOTEL", "INSURANCE"];

// Insurance premiums come back as plain numbers (computed from the trip
// subtotal), while flight/hotel prices are Prisma Decimal instances read
// straight from the DB — handle both.
function toNumber(value) {
  return typeof value === "number" ? value : value.toNumber();
}

async function priceItem(tx, item) {
  if (item.itemType === "FLIGHT") {
    const fare = await tx.flightFare.findUnique({ where: { id: BigInt(item.referenceId) } });
    if (!fare) throw httpError(400, `Flight fare ${item.referenceId} not found`);
    if (fare.seatsAvailable < item.quantity) {
      throw httpError(409, `Not enough seats available on fare ${item.referenceId}`);
    }
    return fare.basePrice;
  }

  if (item.itemType === "HOTEL") {
    const ratePlan = await tx.hotelRatePlan.findUnique({ where: { id: BigInt(item.referenceId) } });
    if (!ratePlan) throw httpError(400, `Hotel rate plan ${item.referenceId} not found`);
    return ratePlan.price;
  }

  throw httpError(400, `Item type ${item.itemType} is not supported yet`);
}

// Insurance is priced against the OTHER items in the same booking, so it
// can only be resolved once the trip subtotal (flights + hotels) is known
// — unlike flight/hotel prices, which come straight from a catalog row.
async function priceInsuranceItem(tx, item, tripSubtotal) {
  if (tripSubtotal <= 0) {
    throw httpError(400, "Insurance requires at least one flight or hotel item in the same booking");
  }
  const plan = await tx.insurancePlan.findUnique({ where: { id: BigInt(item.referenceId) } });
  if (!plan) throw httpError(400, `Insurance plan ${item.referenceId} not found`);

  const computed = tripSubtotal * plan.premiumRate.toNumber();
  return Math.max(computed, plan.minimumPremium.toNumber());
}

// Prices every item in a booking request: flights/hotels first (their
// catalog price), then insurance against the resulting subtotal. Returns
// items in their original order with a unitPrice attached.
async function priceItems(tx, items) {
  const priced = new Map();
  let tripSubtotal = 0;

  for (const item of items) {
    if (item.itemType === "INSURANCE") continue;
    const unitPrice = await priceItem(tx, item);
    priced.set(item, unitPrice);
    tripSubtotal += toNumber(unitPrice) * item.quantity;
  }

  for (const item of items) {
    if (item.itemType !== "INSURANCE") continue;
    priced.set(item, await priceInsuranceItem(tx, item, tripSubtotal));
  }

  return items.map((item) => ({ ...item, unitPrice: priced.get(item) }));
}

// userId is never taken from the request body — it's derived from the
// verified auth token so a caller can't create bookings under another
// user's account by just naming their id.
function validateBookingRequest(body, isAuthenticated) {
  const { guestEmail, items, travelers = [] } = body;

  if (!isAuthenticated && !guestEmail) {
    throw httpError(400, "Sign in, or provide a guestEmail for guest checkout");
  }
  if (!Array.isArray(items) || items.length === 0) {
    throw httpError(400, "items must be a non-empty array");
  }
  for (const item of items) {
    if (!SUPPORTED_ITEM_TYPES.includes(item.itemType)) {
      throw httpError(400, `itemType must be one of ${SUPPORTED_ITEM_TYPES.join(", ")}`);
    }
    if (!item.referenceId || !Number.isInteger(item.quantity) || item.quantity < 1) {
      throw httpError(400, "each item needs a referenceId and a positive integer quantity");
    }
  }
  for (const traveler of travelers) {
    if (!traveler.firstName || !traveler.lastName || !traveler.dateOfBirth) {
      throw httpError(400, "each traveler needs firstName, lastName, and dateOfBirth");
    }
  }
}

// POST /bookings — works for a signed-in user (Authorization: Bearer <token>)
// or a guest checkout (guestEmail in the body); optionalAuth attaches
// req.user when a valid token is present but never rejects the request.
router.post("/", optionalAuth, async (req, res, next) => {
  try {
    validateBookingRequest(req.body, Boolean(req.user));
    const { guestEmail, currency = "CAD", items, travelers = [] } = req.body;
    const userId = req.user ? req.user.id : null;

    const booking = await prisma.$transaction(async (tx) => {
      const priced = await priceItems(tx, items);

      const totalAmount = priced.reduce(
        (sum, item) => sum + toNumber(item.unitPrice) * item.quantity,
        0
      );

      const created = await tx.booking.create({
        data: {
          userId,
          guestEmail: userId ? null : guestEmail,
          status: "PENDING",
          totalAmount,
          currency,
          items: {
            create: priced.map((item) => ({
              itemType: item.itemType,
              referenceId: BigInt(item.referenceId),
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              status: "HELD",
            })),
          },
          travelers: {
            create: travelers.map((t) => ({
              firstName: t.firstName,
              lastName: t.lastName,
              dateOfBirth: new Date(t.dateOfBirth),
              passportNumber: t.passportNumber ?? null,
            })),
          },
        },
        include: { items: true, travelers: true },
      });

      // Hold flight seats for this booking so a second booking can't
      // oversell the same fare; hotel rate plans have no inventory count
      // in the schema, so there's nothing to decrement on that side.
      for (const item of priced) {
        if (item.itemType !== "FLIGHT") continue;
        const result = await tx.flightFare.updateMany({
          where: { id: BigInt(item.referenceId), seatsAvailable: { gte: item.quantity } },
          data: { seatsAvailable: { decrement: item.quantity } },
        });
        if (result.count === 0) {
          throw httpError(409, `Seats for fare ${item.referenceId} were taken by another booking`);
        }
      }

      return created;
    });

    res.status(201).json(booking);
  } catch (err) {
    next(err);
  }
});

// GET /bookings/me — must be registered before /:id, or "me" gets parsed
// as a booking id.
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      where: { userId: req.user.id },
      include: { items: true, travelers: true },
      orderBy: { createdAt: "desc" },
    });
    res.json(bookings);
  } catch (err) {
    next(err);
  }
});

// GET /bookings/:id — a guest booking (no userId) is viewable by anyone who
// has the id, matching a typical "manage my booking via confirmation link"
// guest flow; an account-linked booking is restricted to its owner or staff.
router.get("/:id", optionalAuth, async (req, res, next) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: BigInt(req.params.id) },
      include: { items: true, travelers: true, payments: true },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });

    if (booking.userId !== null) {
      const isOwner = req.user && req.user.id === booking.userId;
      const isStaff = req.user && STAFF_ROLES.includes(req.user.role);
      if (!isOwner && !isStaff) {
        return res.status(403).json({ error: "You don't have access to this booking" });
      }
    }

    res.json(booking);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
