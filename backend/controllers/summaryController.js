import Expense from "../models/Expense.js";
import { calculateSummary } from "../utils/calculateSummary.js";

export const getSummary = async (req, res) => {
  try {
    const groupId = req.params.id;

    const expenses = await Expense.find({
      groupId,
    })
      .populate("paidBy", "name email")
      .populate("splitAmong.user", "name email");

    const balances = calculateSummary(expenses);

    res.status(200).json({
      success: true,
      balances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};