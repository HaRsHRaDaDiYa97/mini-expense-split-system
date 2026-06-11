import Group from "../models/Group.js";
import Expense from "../models/Expense.js";
import Settlement from "../models/Settlement.js";

// Helper to check user balance in a group
const getUserBalance = async (groupId, userId) => {
  const expenses = await Expense.find({ groupId });
  const settlements = await Settlement.find({ groupId, status: "completed" });

  let balance = 0;

  expenses.forEach((expense) => {
    if (expense.paidBy.toString() === userId.toString()) {
      balance += expense.amount;
    }
    const splitUser = expense.splitAmong.find(
      (s) => s.user.toString() === userId.toString()
    );
    if (splitUser) {
      balance -= splitUser.amount;
    }
  });

  settlements.forEach((settlement) => {
    if (settlement.from.toString() === userId.toString()) {
      balance += settlement.amount;
    }
    if (settlement.to.toString() === userId.toString()) {
      balance -= settlement.amount;
    }
  });

  return balance;
};

export const createGroup = async (req, res) => {
  try {
    const { name, description, category, members = [] } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Group name is required",
      });
    }

    const uniqueMembers = [...new Set(members.filter((id) => id !== req.user.id))];
    const groupMembers = [
      { user: req.user.id, role: "owner" },
      ...uniqueMembers.map((id) => ({ user: id, role: "member" })),
    ];

    const group = await Group.create({
      name,
      description,
      category: category || "other",
      members: groupMembers,
    });

    res.status(201).json({
      success: true,
      message: "Group created successfully",
      group,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroups = async (req, res) => {
  try {
    const { search, category, includeArchived } = req.query;
    
    const query = {
      "members.user": req.user.id,
    };

    if (includeArchived !== "true") {
      query.isArchived = { $ne: true };
    }

    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (category) {
      query.category = category;
    }

    const groups = await Group.find(query).populate("members.user", "name email");

    res.status(200).json({
      success: true,
      groups,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate("members.user", "name email");

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check if the current user is a member
    const isMember = group.members.some(
      (m) => m.user._id.toString() === req.user.id
    );

    if (!isMember) {
      return res.status(403).json({
        success: false,
        message: "Access denied. You are not a member of this group.",
      });
    }

    res.status(200).json({
      success: true,
      group,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const updateGroup = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check permission: Owner/Admin
    const userMember = group.members.find(
      (m) => m.user.toString() === req.user.id
    );

    if (!userMember || (userMember.role !== "owner" && userMember.role !== "admin")) {
      return res.status(403).json({
        success: false,
        message: "Only group Owner or Admin can update details",
      });
    }

    if (name) group.name = name;
    if (description !== undefined) group.description = description;
    if (category) group.category = category;

    await group.save();

    const updatedGroup = await group.populate("members.user", "name email");

    res.status(200).json({
      success: true,
      message: "Group updated successfully",
      group: updatedGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const addMember = async (req, res) => {
  try {
    const { userId, role } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Check permission: Owner/Admin
    const requestor = group.members.find(
      (m) => m.user.toString() === req.user.id
    );

    if (!requestor || (requestor.role !== "owner" && requestor.role !== "admin")) {
      return res.status(403).json({
        success: false,
        message: "Only group Owner or Admin can add members",
      });
    }

    const memberExists = group.members.some(
      (m) => m.user.toString() === userId
    );

    if (memberExists) {
      return res.status(400).json({
        success: false,
        message: "User is already in group",
      });
    }

    group.members.push({
      user: userId,
      role: role || "member",
    });

    await group.save();
    const updatedGroup = await group.populate("members.user", "name email");

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      group: updatedGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const removeMember = async (req, res) => {
  try {
    const { userId } = req.params;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    // Get roles
    const requestor = group.members.find(
      (m) => m.user.toString() === req.user.id
    );
    const target = group.members.find(
      (m) => m.user.toString() === userId
    );

    if (!target) {
      return res.status(404).json({
        success: false,
        message: "Member not found in group",
      });
    }

    if (target.role === "owner") {
      return res.status(400).json({
        success: false,
        message: "Group Owner cannot be removed. Transfer ownership first.",
      });
    }

    // Permission check: Owner can remove anyone; Admin can remove members
    if (!requestor) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized access",
      });
    }

    if (requestor.role === "member") {
      return res.status(403).json({
        success: false,
        message: "Members cannot remove other members",
      });
    }

    if (requestor.role === "admin" && target.role === "admin") {
      return res.status(403).json({
        success: false,
        message: "Group Admins cannot remove other Admins",
      });
    }

    // Balance check
    const balance = await getUserBalance(req.params.id, userId);
    if (Math.abs(balance) > 0.1) {
      return res.status(400).json({
        success: false,
        message: `Cannot remove member. They have an outstanding balance of ₹${balance.toFixed(2)}`,
      });
    }

    // Remove from group
    group.members = group.members.filter(
      (m) => m.user.toString() !== userId
    );

    await group.save();
    const updatedGroup = await group.populate("members.user", "name email");

    res.status(200).json({
      success: true,
      message: "Member removed successfully",
      group: updatedGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const transferOwnership = async (req, res) => {
  try {
    const { newOwnerId } = req.body;
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const currentOwner = group.members.find(
      (m) => m.user.toString() === req.user.id && m.role === "owner"
    );

    if (!currentOwner) {
      return res.status(403).json({
        success: false,
        message: "Only the group Owner can transfer ownership",
      });
    }

    const targetMember = group.members.find(
      (m) => m.user.toString() === newOwnerId
    );

    if (!targetMember) {
      return res.status(404).json({
        success: false,
        message: "Target user is not a member of the group",
      });
    }

    // Transfer roles
    currentOwner.role = "admin";
    targetMember.role = "owner";

    await group.save();
    const updatedGroup = await group.populate("members.user", "name email");

    res.status(200).json({
      success: true,
      message: "Group ownership transferred successfully",
      group: updatedGroup,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const toggleArchive = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const userMember = group.members.find(
      (m) => m.user.toString() === req.user.id
    );

    if (!userMember || userMember.role !== "owner") {
      return res.status(403).json({
        success: false,
        message: "Only the group Owner can archive or unarchive the group",
      });
    }

    group.isArchived = !group.isArchived;
    await group.save();

    res.status(200).json({
      success: true,
      message: group.isArchived ? "Group archived successfully" : "Group unarchived successfully",
      isArchived: group.isArchived,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const getMemberStats = async (req, res) => {
  try {
    const { id: groupId } = req.params;
    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    const expenses = await Expense.find({ groupId });
    const settlements = await Settlement.find({ groupId, status: "completed" });

    const stats = {};

    group.members.forEach((m) => {
      stats[m.user.toString()] = {
        totalPaid: 0,
        totalOwed: 0,
        totalSettledPaid: 0,
        totalSettledReceived: 0,
        totalSettled: 0,
      };
    });

    expenses.forEach((expense) => {
      const payerId = expense.paidBy.toString();
      if (stats[payerId]) {
        stats[payerId].totalPaid += expense.amount;
      }

      expense.splitAmong.forEach((split) => {
        const userId = split.user.toString();
        if (stats[userId]) {
          stats[userId].totalOwed += split.amount;
        }
      });
    });

    settlements.forEach((settlement) => {
      const fromId = settlement.from.toString();
      const toId = settlement.to.toString();

      if (stats[fromId]) {
        stats[fromId].totalSettledPaid += settlement.amount;
        stats[fromId].totalSettled += settlement.amount;
      }
      if (stats[toId]) {
        stats[toId].totalSettledReceived += settlement.amount;
        stats[toId].totalSettled += settlement.amount;
      }
    });

    res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};