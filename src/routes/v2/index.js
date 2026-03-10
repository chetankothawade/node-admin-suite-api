import express from "express";

const router = express.Router();

// Scaffold for v2 routes.
// Add resource routers here as breaking changes are introduced.
router.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API v2 route group is ready",
  });
});

export default router;
