import express from "express";
import {
  register,
  login,
  getUsers,
} from "../controllers/authController.js";
import {
  registerValidation,
  loginValidation,
} from "../middleware/validationMiddleware.js";

const router = express.Router();

router.post("/register", registerValidation, register);

router.post("/login", loginValidation, login);

router.get("/users", getUsers);

export default router;