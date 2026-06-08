import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import { getSummary } from "../controllers/summaryController.js";

const router = express.Router();

router.get(
  "/groups/:id/summary",
  authMiddleware,
  getSummary
);

export default router;