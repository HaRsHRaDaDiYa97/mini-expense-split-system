import express from "express";

import {
  createGroup,
  getGroups,
  getGroupById,
} from "../controllers/groupController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createGroup);

router.get("/", authMiddleware, getGroups);

router.get("/:id", authMiddleware, getGroupById);

export default router;