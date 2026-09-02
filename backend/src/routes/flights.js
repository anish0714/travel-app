const { Router } = require("express");
const prisma = require("../lib/prisma");

const router = Router();

// GET /flights?origin=YYZ&destination=YVR&date=2026-09-10
router.get("/", async (req, res, next) => {
  try {
    const { origin, destination, date } = req.query;
    if (!origin || !destination || !date) {
      return res.status(400).json({ error: "origin, destination, and date (YYYY-MM-DD) are required" });
    }

    const dayStart = new Date(`${date}T00:00:00`);
    const dayEnd = new Date(`${date}T23:59:59`);
    if (Number.isNaN(dayStart.getTime())) {
      return res.status(400).json({ error: "date must be in YYYY-MM-DD format" });
    }

    const flights = await prisma.flight.findMany({
      where: {
        origin: { iataCode: origin.toUpperCase() },
        destination: { iataCode: destination.toUpperCase() },
        departureTime: { gte: dayStart, lte: dayEnd },
      },
      include: {
        airline: true,
        origin: true,
        destination: true,
        fares: true,
      },
      orderBy: { departureTime: "asc" },
    });

    res.json(flights);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
