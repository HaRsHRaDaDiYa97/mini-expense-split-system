import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import mongoose from "mongoose";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import path from "path";
import { fileURLToPath } from "url";

import groupRoutes from "./routes/groupRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import expenseRoutes from "./routes/expenseRoutes.js";
import summaryRoutes from "./routes/summaryRoutes.js";
import settlementRoutes from "./routes/settlementRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Security Middlewares
app.use(helmet({
  crossOriginResourcePolicy: false,
}));
app.use(cors());
app.use(express.json());

// Combined Mongo Injection Sanitization & XSS Protection Middleware
app.use((req, res, next) => {
  const sanitize = (obj) => {
    if (obj && typeof obj === "object") {
      Object.keys(obj).forEach((key) => {
        // Mongo Sanitization: delete keys starting with $ or containing .
        if (key.startsWith("$") || key.includes(".")) {
          delete obj[key];
        } else {
          // XSS Protection: strip HTML tags from strings
          if (typeof obj[key] === "string") {
            obj[key] = obj[key].replace(/<[^>]*>/g, "");
          } else {
            sanitize(obj[key]);
          }
        }
      });
    }
  };

  if (req.body) sanitize(req.body);
  if (req.params) sanitize(req.params);

  try {
    if (req.query) {
      const q = { ...req.query };
      sanitize(q);
      const descriptor = Object.getOwnPropertyDescriptor(req, "query");
      if (!descriptor || descriptor.writable || descriptor.set) {
        req.query = q;
      }
    }
  } catch (e) {
    // Ignore query write errors
  }
  next();
});

// Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 300, // limit each IP to 300 requests per 15 minutes
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use("/api", limiter);

// Serve local uploads statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB Connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

app.use("/api/auth", authRoutes);
app.use("/api/groups", groupRoutes);
app.use("/api", expenseRoutes);
app.use("/api", summaryRoutes);
app.use("/api", settlementRoutes);
app.use("/api", uploadRoutes);
app.use("/api", notificationRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("GLOBAL SERVER ERROR:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

app.get("/", (req, res) => {
  res.send("Expense Split API Running");
});

const PORT = process.env.PORT || 8000;

const server = app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});

export { app, server };