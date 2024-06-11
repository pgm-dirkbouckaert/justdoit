import { validationResult } from "express-validator";
import AppDataSource from "../data/dataSource.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const showRegister = (req, res, next) => {
  // Form errors
  const formErrors = req.formErrors ? req.formErrors : [];

  // Form inputs
  const inputs = [
    {
      label: "Email",
      name: "email",
      type: "email",
      value: req.body?.email ? req.body.email : "",
      error: req.inputErrors?.email ? req.inputErrors["email"] : "",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      value: req.body?.password ? req.body.password : "",
      error: req.inputErrors?.password ? req.inputErrors["password"] : "",
    },
  ];

  // Render
  res.render("auth/register", {
    layout: "auth",
    formErrors,
    inputs,
  });
};

export const handleRegister = async (req, res, next) => {
  try {
    // Check validation errors
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      req.inputErrors = {};
      for (const { param, msg } of validationErrors.array()) req.inputErrors[param] = msg;
      return next();
    } else {
      // Get email and password
      const email = req.body.email;
      const password = req.body.password;
      // Check if user already exists
      const userRepo = AppDataSource.getRepository("User");
      const user = await userRepo.findOneBy({ email });
      if (user) {
        req.formErrors = [{ message: "User already exists" }];
        return next();
      }
      // Create new user
      const hashedPassword = bcrypt.hashSync(password, 12);
      await userRepo.save({ email, password: hashedPassword });
      // Go to login page
      return res.redirect("/login");
    }
  } catch (error) {
    next(error.message);
  }
};

export const showLogin = (req, res, next) => {
  // Form errors
  const formErrors = req.formErrors ? req.formErrors : [];

  // Form inputs
  const inputs = [
    {
      label: "Email",
      name: "email",
      type: "email",
      value: req.body?.email ? req.body.email : "",
      error: req.inputErrors?.email ? req.inputErrors["email"] : "",
    },
    {
      label: "Password",
      name: "password",
      type: "password",
      value: req.body?.password ? req.body.password : "",
      error: req.inputErrors?.password ? req.inputErrors["password"] : "",
    },
  ];

  // Render
  res.render("auth/login", {
    layout: "auth",
    formErrors,
    inputs,
  });
};

export const handleLogin = async (req, res, next) => {
  try {
    // Check validation errors
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      req.inputErrors = {};
      for (const { param, msg } of validationErrors.array()) req.inputErrors[param] = msg;
      return next();
    } else {
      // Get email and password
      const email = req.body.email;
      const password = req.body.password;
      // Check if user exists
      const userRepo = AppDataSource.getRepository("User");
      const user = await userRepo.findOneBy({ email });
      if (!user) {
        req.formErrors = [{ message: "Sorry, something went wrong" }];
        return next();
      }
      // Check if password is correct
      if (!bcrypt.compareSync(password, user.password)) {
        req.formErrors = [{ message: "Sorry, something went wrong" }];
        return next();
      }
      // Create JSON Web Token
      const token = jwt.sign({ id: user.id }, process.env.TOKEN_SALT, { expiresIn: 60 * 60 * 24 }); //expiresIn = seconds
      res.cookie("token", token, { httpOnly: true });
      // Go to home page
      return res.redirect("/");
    }
  } catch (error) {
    next(error.message);
  }
};

export const handleLogout = async (req, res, next) => {
  try {
    res.clearCookie("token");
    return res.redirect("/login");
  } catch (error) {
    next(error.message);
  }
};
