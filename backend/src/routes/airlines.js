const { Router } = require("express");
const prisma = require("../lib/prisma");

const router = Router();

// GET /airlines
router.get("/", async (req, res, next) => {
  try {
    const airlines = await prisma.airline.findMany({ orderBy: { name: "asc" } });
    res.json(airlines);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
