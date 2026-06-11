import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 1,
    },

    description: {
      type: String,
      trim: true,
    },

    splitType: {
      type: String,
      enum: ["equal", "unequal", "percentage", "shares"],
      required: true,
    },

    category: {
      type: String,
      enum: ["food", "transport", "hotel", "shopping", "fuel", "entertainment", "other"],
      default: "other",
    },

    attachmentUrl: {
      type: String,
    },

    splitAmong: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },

        amount: {
          type: Number,
          required: true,
        },

        percentage: {
          type: Number,
        },

        shares: {
          type: Number,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Expense = mongoose.model("Expense", expenseSchema);

export default Expense;