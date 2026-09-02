const { Router } = require("express");
const prisma = require("../lib/prisma");

const router = Router();

// GET /airports?city=Toronto
router.get("/", async (req, res, next) => {
  try {
    const { city } = req.query;
    const airports = await prisma.airport.findMany({
      where: city ? { city: { equals: city, mode: "insensitive" } } : undefined,
      orderBy: { city: "asc" },
    });
    res.json(airports);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
