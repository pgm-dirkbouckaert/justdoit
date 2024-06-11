import { body } from "express-validator";

export default [
  body("firstname")
    .notEmpty()
    .withMessage("First name is required"),
  body("lastname")
    .notEmpty()
    .withMessage("Last name is required"),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .bail()
    .isEmail()
    .withMessage("Please add a valid email"),
];
