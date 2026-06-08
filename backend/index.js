import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import groupRoutes from "./routes/groupRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import settlementRoutes from "./routes/settlementRoutes.js";

dotenv.config();

const app = express();

app.use(cors());

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  });

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api", expenseRoutes);
app.use("/api", summaryRoutes);
app.use("/api", settlementRoutes);

app.get("/", (req, res) => {
  res.send("Expense Split API Running");
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});