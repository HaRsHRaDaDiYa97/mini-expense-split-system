import Expense from "../models/Expense.js";

export const getSummary = async (req, res) => {
  try {
    const expenses = await Expense.find({
      groupId: req.params.id,
    })
      .populate("paidBy", "name")
      .populate("splitAmong.user", "name");

    const balances = {};

    expenses.forEach((expense) => {
      const payer = expense.paidBy.name;

      balances[payer] =
        (balances[payer] || 0) +
        expense.amount;

      expense.splitAmong.forEach((split) => {
        const member = split.user.name;

        balances[member] =
          (balances[member] || 0) -
          split.amount;
      });
    });

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