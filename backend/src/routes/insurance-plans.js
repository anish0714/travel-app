const { Router } = require("express");
const prisma = require("../lib/prisma");

const router = Router();

// GET /insurance-plans?tripCost=429.00
// tripCost is optional — when given, each plan includes the actual premium
// it would charge for a trip of that subtotal (rate applied, floored at
// the plan's minimum), matching what POST /bookings will charge.
router.get("/", async (req, res, next) => {
  try {
    const plans = await prisma.insurancePlan.findMany({ orderBy: { premiumRate: "asc" } });
    const tripCost = req.query.tripCost !== undefined ? Number(req.query.tripCost) : null;

    if (tripCost === null || Number.isNaN(tripCost)) {
      return res.json(plans);
    }

    const withEstimate = plans.map((plan) => ({
      ...plan,
      estimatedPremium: Math.max(tripCost * plan.premiumRate.toNumber(), plan.minimumPremium.toNumber()).toFixed(2),
    }));
    res.json(withEstimate);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
