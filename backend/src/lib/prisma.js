const { PrismaClient } = require("@prisma/client");

// Reuse a single client across nodemon reloads in dev instead of opening a
// fresh connection pool on every restart.
const prisma = global.__prisma ?? new PrismaClient();
if (process.env.NODE_ENV !== "production") {
  global.__prisma = prisma;
}

module.exports = prisma;
