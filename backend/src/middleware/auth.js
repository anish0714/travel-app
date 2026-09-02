const httpError = require("../lib/http-error");
const { verifyToken } = require("../lib/auth");

function getTokenFromHeader(req) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) return null;
  return header.slice("Bearer ".length);
}

// Rejects the request if there's no valid token. Use on routes that only
// make sense for a signed-in user (e.g. "my bookings").
function requireAuth(req, res, next) {
  const token = getTokenFromHeader(req);
  if (!token) return next(httpError(401, "Authentication required"));
  try {
    const decoded = verifyToken(token);
    req.user = { id: BigInt(decoded.sub), role: decoded.role };
    next();
  } catch {
    next(httpError(401, "Invalid or expired token"));
  }
}

// Attaches req.user when a valid token is present, but never rejects the
// request — for routes that behave differently for guests vs. signed-in
// users (e.g. booking creation, which allows guest checkout).
function optionalAuth(req, res, next) {
  const token = getTokenFromHeader(req);
  if (!token) return next();
  try {
    const decoded = verifyToken(token);
    req.user = { id: BigInt(decoded.sub), role: decoded.role };
  } catch {
    // Invalid/expired token on an optional-auth route: proceed as anonymous.
  }
  next();
}

module.exports = { requireAuth, optionalAuth };
