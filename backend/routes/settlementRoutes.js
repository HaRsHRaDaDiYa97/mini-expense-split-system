import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getSettlements,
} from "../controllers/settlementController.js";

const router = express.Router();

router.get(
  "/groups/:id/settlements",
  authMiddleware,
  getSettlements
);

export default router;