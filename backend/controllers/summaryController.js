import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import Settlement from "../models/Settlement.js";

export const getSummary = async (req, res) => {
  try {
    const groupId = req.params.id;
    const group = await Group.findById(groupId).populate("members.user", "name email");

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const expenses = await Expense.find({ groupId });
    const settlements = await Settlement.find({ groupId, status: "completed" });

    const balances = {};
    const userInfo = {};

    group.members.forEach((m) => {
      if (m.user) {
        const uid = m.user._id.toString();
        balances[uid] = 0;
        userInfo[uid] = {
          name: m.user.name,
          email: m.user.email,
        };
      }
    });

    // Calculate balances from expenses
    expenses.forEach((expense) => {
      const payerId = expense.paidBy.toString();
      if (balances[payerId] !== undefined) {
        balances[payerId] += expense.amount;
      }

      expense.splitAmong.forEach((split) => {
        const splitUserId = split.user.toString();
        if (balances[splitUserId] !== undefined) {
          balances[splitUserId] -= split.amount;
        }
      });
    });

    // Adjust balances from completed settlements
    settlements.forEach((settlement) => {
      const fromId = settlement.from.toString();
      const toId = settlement.to.toString();

      if (balances[fromId] !== undefined) {
        balances[fromId] += settlement.amount;
      }
      if (balances[toId] !== undefined) {
        balances[toId] -= settlement.amount;
      }
    });

    // Format output as name keys for backward compatibility
    const formattedBalances = {};
    Object.entries(balances).forEach(([userId, amount]) => {
      const name = userInfo[userId]?.name || "Unknown";
      formattedBalances[name] = Number(amount.toFixed(2));
    });

    res.status(200).json({
      success: true,
      balances: formattedBalances,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
export default getSummary;