const { Router } = require("express");
const prisma = require("../lib/prisma");

const router = Router();

// GET /hotels?city=Toronto&minRating=3&maxRating=5
router.get("/", async (req, res, next) => {
  try {
    const { city, minRating, maxRating } = req.query;
    const where = {};
    if (city) where.city = { equals: city, mode: "insensitive" };
    if (minRating || maxRating) {
      where.starRating = {};
      if (minRating) where.starRating.gte = Number(minRating);
      if (maxRating) where.starRating.lte = Number(maxRating);
    }

    const hotels = await prisma.hotel.findMany({
      where,
      include: { supplier: true },
      orderBy: { starRating: "desc" },
    });
    res.json(hotels);
  } catch (err) {
    next(err);
  }
});

// GET /hotels/:id — full detail with bookable rooms and rate plans
router.get("/:id", async (req, res, next) => {
  try {
    const hotel = await prisma.hotel.findUnique({
      where: { id: BigInt(req.params.id) },
      include: {
        supplier: true,
        rooms: { include: { ratePlans: true } },
      },
    });
    if (!hotel) return res.status(404).json({ error: "Hotel not found" });
    res.json(hotel);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
