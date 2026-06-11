import mongoose from "mongoose";

const groupSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      trim: true,
    },

    category: {
      type: String,
      enum: ["trip", "office", "friends", "family", "event", "other"],
      default: "other",
    },

    isArchived: {
      type: Boolean,
      default: false,
    },

    members: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        role: {
          type: String,
          enum: ["owner", "admin", "member"],
          default: "member",
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Group = mongoose.model("Group", groupSchema);

export default Group;