import express from "express";

import {
  createGroup,
  getGroups,
  getGroupById,
  addMember,
} from "../controllers/groupController.js";

import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, createGroup);

router.get("/", authMiddleware, getGroups);

router.get("/:id", authMiddleware, getGroupById);

router.put(
  "/:id/add-member",
  authMiddleware,
  addMember
);

export default router;