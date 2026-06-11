import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0.01,
    },
    notes: {
      type: String,
      trim: true,
    },
    receiptUrl: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "completed",
    },
  },
  {
    timestamps: true,
  }
);

const Settlement = mongoose.model("Settlement", settlementSchema);

export default Settlement;
