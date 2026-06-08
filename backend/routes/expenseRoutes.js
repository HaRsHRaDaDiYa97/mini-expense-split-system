import express from "express";

import {
  addExpense,
  getGroupExpenses,
} from "../controllers/expenseController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post(
  "/groups/:id/expenses",
  authMiddleware,
  addExpense
);

router.get(
  "/groups/:id/expenses",
  authMiddleware,
  getGroupExpenses
);

export default router;