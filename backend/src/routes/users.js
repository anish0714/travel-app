const { Router } = require("express");
const prisma = require("../lib/prisma");
const { requireAuth } = require("../middleware/auth");

const router = Router();

// GET /users/me
router.get("/me", requireAuth, async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) return res.status(404).json({ error: "User not found" });
    const { passwordHash, ...publicUser } = user;
    res.json(publicUser);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
