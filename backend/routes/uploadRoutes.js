import express from "express";
import multer from "multer";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadFile } from "../controllers/uploadController.js";

const router = express.Router();

// Configure multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    if (mimetype) {
      return cb(null, true);
    }
    cb(new Error("Error: File upload only supports images (jpeg, jpg, png, webp) or PDF!"));
  },
});

router.post("/upload", authMiddleware, upload.single("file"), uploadFile);

export default router;
