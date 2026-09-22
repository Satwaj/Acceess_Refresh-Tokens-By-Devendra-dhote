import { body, validationResult } from "express-validator";

export const authValidator = [
  body("email").isEmail().withMessage("Please provide a valid email").notEmpty().withMessage("Email is required"),
  body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters long").notEmpty().withMessage("Password is required"),

  (req, res, next) => {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array()
      })
    }
    next()
  }
]
