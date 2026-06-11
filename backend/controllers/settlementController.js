import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import Settlement from "../models/Settlement.js";
import Notification from "../models/Notification.js";
import { calculateSettlement } from "../utils/calculateSettlement.js";

export const getSettlements = async (req, res) => {
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

    // Map user ID to user object for easy lookup
    const userMap = {};
    const balances = {};

    group.members.forEach((m) => {
      if (m.user) {
        const uid = m.user._id.toString();
        userMap[uid] = m.user;
        balances[uid] = 0;
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

    // Adjust balances from recorded completed settlements
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

    // Calculate dynamic settlements
    const calculated = calculateSettlement(balances);

    // Map IDs to user profiles
    const mappedSettlements = calculated.map((item) => ({
      from: {
        id: item.from,
        name: userMap[item.from]?.name || "Deleted User",
        email: userMap[item.from]?.email || "",
      },
      to: {
        id: item.to,
        name: userMap[item.to]?.name || "Deleted User",
        email: userMap[item.to]?.email || "",
      },
      amount: Number(item.amount.toFixed(2)),
    }));

    res.status(200).json({
      success: true,
      settlements: mappedSettlements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const recordSettlement = async (req, res) => {
  try {
    const groupId = req.params.id;
    const { from, to, amount, notes, receiptUrl } = req.body;

    if (!from || !to || !amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Payer (from), recipient (to), and positive amount are required",
      });
    }

    const group = await Group.findById(groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check if both users are group members
    const isFromMember = group.members.some((m) => m.user.toString() === from);
    const isToMember = group.members.some((m) => m.user.toString() === to);

    if (!isFromMember || !isToMember) {
      return res.status(400).json({
        success: false,
        message: "Both settlement participants must be members of this group",
      });
    }

    const settlement = await Settlement.create({
      groupId,
      from,
      to,
      amount,
      notes,
      receiptUrl,
      status: "completed",
    });

    const populated = await settlement.populate([
      { path: "from", select: "name email" },
      { path: "to", select: "name email" },
    ]);

    // Create notifications for the recipient
    await Notification.create({
      recipient: to,
      sender: from,
      type: "settlement_completed",
      groupId,
      message: `Recorded a payment of ₹${amount} to you.`,
    });

    res.status(201).json({
      success: true,
      message: "Settlement recorded successfully",
      settlement: populated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getSettlementHistory = async (req, res) => {
  try {
    const groupId = req.params.id;
    const settlements = await Settlement.find({ groupId, status: "completed" })
      .populate("from", "name email")
      .populate("to", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      settlements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};