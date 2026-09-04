// Tiers are evaluated highest-first against a traveler's cumulative
// lifetime points. The discountRate applies only to the flight/hotel
// subtotal of a booking — never to insurance, which is priced against
// whatever the traveler is actually paying after that discount.
const TIERS = [
  { tier: "PLATINUM", minPoints: 15000, discountRate: 0.12 },
  { tier: "GOLD", minPoints: 5000, discountRate: 0.07 },
  { tier: "SILVER", minPoints: 1000, discountRate: 0.03 },
  { tier: "NONE", minPoints: 0, discountRate: 0 },
];

const POINTS_PER_DOLLAR = 5;

function tierForPoints(points) {
  return TIERS.find((t) => points >= t.minPoints).tier;
}

function discountRateForTier(tier) {
  return TIERS.find((t) => t.tier === tier)?.discountRate ?? 0;
}

function pointsForAmount(amount) {
  return Math.floor(amount * POINTS_PER_DOLLAR);
}

module.exports = { TIERS, POINTS_PER_DOLLAR, tierForPoints, discountRateForTier, pointsForAmount };
