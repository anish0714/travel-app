const { Router } = require("express");
const prisma = require("../lib/prisma");
const httpError = require("../lib/http-error");

const router = Router();

// Insurance isn't supported yet: insurance_policies rows are created for a
// specific booking rather than being a browsable catalog like flight_fares
// or hotel_rate_plans, and there's no seeded insurance product to price
// against. Revisit once an insurance catalog exists.
const SUPPORTED_ITEM_TYPES = ["FLIGHT", "HOTEL"];

function toNumber(decimal) {
  return decimal.toNumber();
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

function validateBookingRequest(body) {
  const { userId, guestEmail, items, travelers = [] } = body;

  if (!userId && !guestEmail) {
    throw httpError(400, "userId or guestEmail is required");
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

// POST /bookings
router.post("/", async (req, res, next) => {
  try {
    validateBookingRequest(req.body);
    const { userId, guestEmail, currency = "CAD", items, travelers = [] } = req.body;

    const booking = await prisma.$transaction(async (tx) => {
      const priced = [];
      for (const item of items) {
        const unitPrice = await priceItem(tx, item);
        priced.push({ ...item, unitPrice });
      }

      const totalAmount = priced.reduce(
        (sum, item) => sum + toNumber(item.unitPrice) * item.quantity,
        0
      );

      const created = await tx.booking.create({
        data: {
          userId: userId ? BigInt(userId) : null,
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

// GET /bookings/:id
router.get("/:id", async (req, res, next) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: BigInt(req.params.id) },
      include: { items: true, travelers: true, payments: true },
    });
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json(booking);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
