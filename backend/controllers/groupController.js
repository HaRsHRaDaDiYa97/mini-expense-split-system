import Group from "../models/Group.js";

export const createGroup = async (req, res) => {
  try {
    const { name, members = [] } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Group name is required",
      });
    }

    const group = await Group.create({
      name,
      members: [
        ...new Set([
          req.user.id,
          ...members,
        ]),
      ],
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
    const groups = await Group.find({
      members: req.user.id,
    }).populate("members", "name email");

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
    const group = await Group.findById(
      req.params.id
    ).populate("members", "name email");

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
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


export const addMember = async (req, res) => {
  try {
    const { userId } = req.body;

    const group = await Group.findById(
      req.params.id
    );

    if (!group) {
      return res.status(404).json({
        success: false,
        message: "Group not found",
      });
    }

    if (
      group.members.includes(userId)
    ) {
      return res.status(400).json({
        success: false,
        message:
          "User already exists in group",
      });
    }

    group.members.push(userId);

    await group.save();

    res.status(200).json({
      success: true,
      message: "Member added",
      group,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};