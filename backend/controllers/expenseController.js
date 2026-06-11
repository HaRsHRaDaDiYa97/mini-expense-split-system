import Expense from "../models/Expense.js";
import Group from "../models/Group.js";
import Notification from "../models/Notification.js";

export const addExpense = async (req, res) => {
  try {
    const groupId = req.params.id;
    const {
      paidBy,
      amount,
      description,
      splitType,
      splitAmong,
      category,
      attachmentUrl,
    } = req.body;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero",
      });
    }

    // Role check: Admin, Owner, Member can all add expenses
    const requestor = group.members.find(
      (m) => m.user.toString() === req.user.id
    );
    if (!requestor) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not a member of this group.",
      });
    }

    let finalSplit = [];

    // 1. Equal Split
    if (splitType === "equal") {
      const share = Number((amount / group.members.length).toFixed(2));
      finalSplit = group.members.map((member) => ({
        user: member.user,
        amount: share,
      }));
      
      const sum = finalSplit.reduce((s, i) => s + i.amount, 0);
      if (sum !== amount) {
        finalSplit[finalSplit.length - 1].amount += Number((amount - sum).toFixed(2));
      }
    }
    
    // 2. Unequal Split
    else if (splitType === "unequal") {
      if (!splitAmong || splitAmong.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Split details are required for unequal split",
        });
      }
      const totalSplit = splitAmong.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );

      if (Math.abs(totalSplit - amount) > 0.1) {
        return res.status(400).json({
          success: false,
          message: `Split amounts (₹${totalSplit.toFixed(2)}) must equal total expense amount (₹${amount})`,
        });
      }

      finalSplit = splitAmong.map((item) => ({
        user: item.user,
        amount: Number(Number(item.amount).toFixed(2)),
      }));
    }

    // 3. Percentage Split
    else if (splitType === "percentage") {
      if (!splitAmong || splitAmong.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Split details are required for percentage split",
        });
      }
      const totalPercent = splitAmong.reduce(
        (sum, item) => sum + Number(item.percentage || 0),
        0
      );

      if (Math.abs(totalPercent - 100) > 0.01) {
        return res.status(400).json({
          success: false,
          message: "Percentages must total exactly 100%",
        });
      }

      finalSplit = splitAmong.map((item) => ({
        user: item.user,
        percentage: Number(item.percentage),
        amount: Number(((Number(item.percentage) / 100) * amount).toFixed(2)),
      }));

      const sum = finalSplit.reduce((s, i) => s + i.amount, 0);
      if (sum !== amount) {
        finalSplit[finalSplit.length - 1].amount += Number((amount - sum).toFixed(2));
      }
    }

    // 4. Share Split
    else if (splitType === "shares") {
      if (!splitAmong || splitAmong.length === 0) {
        return res.status(400).json({
          success: false,
          message: "Split details are required for share split",
        });
      }
      const totalShares = splitAmong.reduce(
        (sum, item) => sum + Number(item.shares || 0),
        0
      );

      if (totalShares <= 0) {
        return res.status(400).json({
          success: false,
          message: "Total shares must be greater than zero",
        });
      }

      finalSplit = splitAmong.map((item) => ({
        user: item.user,
        shares: Number(item.shares),
        amount: Number(((Number(item.shares) / totalShares) * amount).toFixed(2)),
      }));

      const sum = finalSplit.reduce((s, i) => s + i.amount, 0);
      if (sum !== amount) {
        finalSplit[finalSplit.length - 1].amount += Number((amount - sum).toFixed(2));
      }
    }

    else {
      return res.status(400).json({
        success: false,
        message: "Invalid split type",
      });
    }

    const expense = await Expense.create({
      groupId,
      paidBy,
      amount,
      description,
      splitType,
      splitAmong: finalSplit,
      category: category || "other",
      attachmentUrl,
    });

    // Create notifications for group members except the payer
    const notifyMembers = group.members.filter(
      (m) => m.user.toString() !== paidBy.toString()
    );
    const notifications = notifyMembers.map((m) => ({
      recipient: m.user,
      sender: paidBy,
      type: "expense_added",
      groupId: group._id,
      message: `Added a new expense "${description}" for ₹${amount} in "${group.name}".`,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(201).json({
      success: true,
      message: "Expense added successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupExpenses = async (req, res) => {
  try {
    const { category, memberId, startDate, endDate, minAmount, maxAmount } = req.query;
    const query = { groupId: req.params.id };

    if (category) {
      query.category = category;
    }

    if (memberId) {
      query.$or = [
        { paidBy: memberId },
        { "splitAmong.user": memberId },
      ];
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) query.createdAt.$gte = new Date(startDate);
      if (endDate) query.createdAt.$lte = new Date(endDate);
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }

    const expenses = await Expense.find(query)
      .populate("paidBy", "name email")
      .populate("splitAmong.user", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      expenses,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const {
      paidBy,
      amount,
      description,
      splitType,
      splitAmong,
      category,
      attachmentUrl,
    } = req.body;

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const group = await Group.findById(expense.groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Associated group not found",
      });
    }

    // Permission check: owner/admin or payer/creator
    const requestor = group.members.find(
      (m) => m.user.toString() === req.user.id
    );

    if (!requestor) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not a member of this group.",
      });
    }

    const isAuthorized =
      requestor.role === "owner" ||
      requestor.role === "admin" ||
      expense.paidBy.toString() === req.user.id;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Only group Owner, Admin, or the payer can modify this expense",
      });
    }

    let finalSplit = [];
    const targetAmount = amount || expense.amount;
    const targetSplitType = splitType || expense.splitType;
    const targetSplitAmong = splitAmong || expense.splitAmong;

    if (targetSplitType === "equal") {
      const share = Number((targetAmount / group.members.length).toFixed(2));
      finalSplit = group.members.map((member) => ({
        user: member.user,
        amount: share,
      }));
      
      const sum = finalSplit.reduce((s, i) => s + i.amount, 0);
      if (sum !== targetAmount) {
        finalSplit[finalSplit.length - 1].amount += Number((targetAmount - sum).toFixed(2));
      }
    } else if (targetSplitType === "unequal") {
      const totalSplit = targetSplitAmong.reduce(
        (sum, item) => sum + Number(item.amount),
        0
      );

      if (Math.abs(totalSplit - targetAmount) > 0.1) {
        return res.status(400).json({
          success: false,
          message: "Split amounts must equal total expense amount",
        });
      }

      finalSplit = targetSplitAmong.map((item) => ({
        user: item.user,
        amount: Number(Number(item.amount).toFixed(2)),
      }));
    } else if (targetSplitType === "percentage") {
      const totalPercent = targetSplitAmong.reduce(
        (sum, item) => sum + Number(item.percentage || 0),
        0
      );

      if (Math.abs(totalPercent - 100) > 0.01) {
        return res.status(400).json({
          success: false,
          message: "Percentages must total exactly 100%",
        });
      }

      finalSplit = targetSplitAmong.map((item) => ({
        user: item.user,
        percentage: Number(item.percentage),
        amount: Number(((Number(item.percentage) / 100) * targetAmount).toFixed(2)),
      }));

      const sum = finalSplit.reduce((s, i) => s + i.amount, 0);
      if (sum !== targetAmount) {
        finalSplit[finalSplit.length - 1].amount += Number((targetAmount - sum).toFixed(2));
      }
    } else if (targetSplitType === "shares") {
      const totalShares = targetSplitAmong.reduce(
        (sum, item) => sum + Number(item.shares || 0),
        0
      );

      if (totalShares <= 0) {
        return res.status(400).json({
          success: false,
          message: "Total shares must be greater than zero",
        });
      }

      finalSplit = targetSplitAmong.map((item) => ({
        user: item.user,
        shares: Number(item.shares),
        amount: Number(((Number(item.shares) / totalShares) * targetAmount).toFixed(2)),
      }));

      const sum = finalSplit.reduce((s, i) => s + i.amount, 0);
      if (sum !== targetAmount) {
        finalSplit[finalSplit.length - 1].amount += Number((targetAmount - sum).toFixed(2));
      }
    }

    if (paidBy) expense.paidBy = paidBy;
    if (amount) expense.amount = amount;
    if (description) expense.description = description;
    if (splitType) expense.splitType = splitType;
    if (splitAmong) expense.splitAmong = finalSplit;
    if (category) expense.category = category;
    if (attachmentUrl !== undefined) expense.attachmentUrl = attachmentUrl;

    await expense.save();

    // Trigger update notifications
    const notifyMembers = group.members.filter(
      (m) => m.user.toString() !== req.user.id
    );
    const notifications = notifyMembers.map((m) => ({
      recipient: m.user,
      sender: req.user.id,
      type: "expense_updated",
      groupId: group._id,
      message: `Updated expense "${expense.description}" in "${group.name}".`,
    }));

    if (notifications.length > 0) {
      await Notification.insertMany(notifications);
    }

    res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      expense,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const { expenseId } = req.params;
    const expense = await Expense.findById(expenseId);

    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const group = await Group.findById(expense.groupId);
    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const requestor = group.members.find(
      (m) => m.user.toString() === req.user.id
    );

    if (!requestor) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not a member of this group.",
      });
    }

    const isAuthorized =
      requestor.role === "owner" ||
      requestor.role === "admin" ||
      expense.paidBy.toString() === req.user.id;

    if (!isAuthorized) {
      return res.status(403).json({
        success: false,
        message: "Only group Owner, Admin, or the payer can delete this expense",
      });
    }

    await Expense.deleteOne({ _id: expenseId });

    res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};