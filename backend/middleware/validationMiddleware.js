import { body, validationResult } from "express-validator";

export const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }
  next();
};

export const registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required")
    .isLength({ min: 2 })
    .withMessage("Name must be at least 2 characters long"),
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
  validateRequest,
];

export const loginValidation = [
  body("email")
    .trim()
    .isEmail()
    .withMessage("Please enter a valid email address")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required"),
  validateRequest,
];

export const groupValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Group name is required")
    .isLength({ min: 3 })
    .withMessage("Group name must be at least 3 characters long"),
  body("category")
    .optional()
    .isIn(["trip", "office", "friends", "family", "event", "other"])
    .withMessage("Invalid group category"),
  body("description")
    .optional()
    .trim(),
  validateRequest,
];

export const expenseValidation = [
  body("amount")
    .isNumeric()
    .withMessage("Amount must be a number")
    .custom((value) => value > 0)
    .withMessage("Amount must be greater than zero"),
  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required"),
  body("splitType")
    .isIn(["equal", "unequal", "percentage", "shares"])
    .withMessage("Invalid split type"),
  body("paidBy")
    .notEmpty()
    .withMessage("payer ID is required"),
  body("category")
    .optional()
    .isIn(["food", "transport", "hotel", "shopping", "fuel", "entertainment", "other"])
    .withMessage("Invalid expense category"),
  validateRequest,
];
