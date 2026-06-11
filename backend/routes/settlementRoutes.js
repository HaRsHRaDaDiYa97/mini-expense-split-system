import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import {
  getSettlements,
  recordSettlement,
  getSettlementHistory,
} from "../controllers/settlementController.js";

const router = express.Router();

router.get(
  "/groups/:id/settlements",
  authMiddleware,
  getSettlements
);

router.post(
  "/groups/:id/settlements",
  authMiddleware,
  recordSettlement
);

router.get(
  "/groups/:id/settlements/history",
  authMiddleware,
  getSettlementHistory
);

export default router;