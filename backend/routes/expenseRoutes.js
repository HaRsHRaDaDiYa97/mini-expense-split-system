import express from "express";
import {
  addExpense,
  getGroupExpenses,
  updateExpense,
  deleteExpense,
} from "../controllers/expenseController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { expenseValidation } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post(
  "/groups/:id/expenses",
  authMiddleware,
  expenseValidation,
  addExpense
);

router.get(
  "/groups/:id/expenses",
  authMiddleware,
  getGroupExpenses
);

router.put(
  "/expenses/:expenseId",
  authMiddleware,
  expenseValidation,
  updateExpense
);

router.delete(
  "/expenses/:expenseId",
  authMiddleware,
  deleteExpense
);

export default router;