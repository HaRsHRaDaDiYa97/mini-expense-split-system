import express from "express";
import {
  createGroup,
  getGroups,
  getGroupById,
  updateGroup,
  addMember,
  removeMember,
  transferOwnership,
  toggleArchive,
  getMemberStats,
} from "../controllers/groupController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { groupValidation } from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/", authMiddleware, groupValidation, createGroup);
router.get("/", authMiddleware, getGroups);
router.get("/:id", authMiddleware, getGroupById);
router.put("/:id", authMiddleware, groupValidation, updateGroup);
router.put("/:id/archive", authMiddleware, toggleArchive);
router.put("/:id/add-member", authMiddleware, addMember);
router.delete("/:id/members/:userId", authMiddleware, removeMember);
router.put("/:id/transfer-ownership", authMiddleware, transferOwnership);
router.get("/:id/member-stats", authMiddleware, getMemberStats);

export default router;