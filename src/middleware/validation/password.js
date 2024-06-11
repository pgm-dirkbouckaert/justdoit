import { body } from "express-validator";

export default [
  body("currentPassword")
    .notEmpty()
    .withMessage("Current password is required"),
  body("newPassword")
    .notEmpty()
    .withMessage("New password is required")
    .isLength({ min: 8 })
    .withMessage("Password must have at least eight characters."),
  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirmation is required")
    .bail()
    .custom((value, { req }) => value == req.body.newPassword)
    .withMessage("Passwords do not match"),
];
