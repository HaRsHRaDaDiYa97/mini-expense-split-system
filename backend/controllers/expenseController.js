import Expense from "../models/Expense.js";
import Group from "../models/Group.js";

export const addExpense = async (req, res) => {
  try {
    const groupId = req.params.id;

    const {
      paidBy,
      amount,
      description,
      splitType,
      splitAmong,
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

    // Equal Split
    let finalSplit = [];

    if (splitType === "equal") {
      const share =
        amount / group.members.length;

      finalSplit = group.members.map(
        (member) => ({
          user: member,
          amount: share,
        })
      );
    }

    // Unequal Split
    else if (splitType === "unequal") {
      const totalSplit = splitAmong.reduce(
        (sum, item) => sum + item.amount,
        0
      );

      if (totalSplit !== amount) {
        return res.status(400).json({
          success: false,
          message:
            "Split amounts must equal expense amount",
        });
      }

      finalSplit = splitAmong;
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
    });

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


export const getGroupExpenses = async (
  req,
  res
) => {
  try {
    const expenses = await Expense.find({
      groupId: req.params.id,
    })
      .populate("paidBy", "name email")
      .populate(
        "splitAmong.user",
        "name email"
      );

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