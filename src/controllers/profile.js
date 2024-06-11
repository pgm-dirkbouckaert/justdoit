import AppDataSource from "../data/dataSource.js";
import { validationResult } from "express-validator";
import bcrypt from "bcrypt";

const userRepo = AppDataSource.getRepository("User");

/**
 * Show profile
 */
export const showProfile = async (req, res, next) => {
  // Get user
  const user = await userRepo.findOneBy({ id: req.user.id });
  delete user.password;

  // Render
  res.render("profile/index", {
    layout: "profile",
    activeNav: "view",
    user,
  });
};

/**
 * Show page to edit profile
 */
export const showEditProfile = async (req, res, next) => {
  // Get user
  const user = await userRepo.findOneBy({ id: req.user.id });
  delete user.password;

  // Form errors
  const formErrors = req.formErrors ? req.formErrors : [];

  // Form inputs
  const inputs = [
    {
      label: "First name",
      name: "firstname",
      type: "text",
      value: req.body?.firstname ? req.body.firstname : user.firstname,
      error: req.inputErrors?.firstname ? req.inputErrors["firstname"] : "",
    },
    {
      label: "Last name",
      name: "lastname",
      type: "text",
      value: req.body?.lastname ? req.body.lastname : user.lastname,
      error: req.inputErrors?.lastname ? req.inputErrors["lastname"] : "",
    },
    {
      label: "Email",
      name: "email",
      type: "email",
      value: req.body?.email ? req.body.email : user.email,
      error: req.inputErrors?.email ? req.inputErrors["email"] : "",
    },
  ];

  // Render
  res.render("profile/edit", {
    layout: "profile",
    activeNav: "edit",
    user,
    formErrors,
    inputs,
  });
};

/**
 * Save profile
 */
export const saveProfile = async (req, res, next) => {
  try {
    // Check validation errors
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      req.inputErrors = {};
      for (const { param, msg } of validationErrors.array()) req.inputErrors[param] = msg;
      return next();
    } else {
      const userRepo = AppDataSource.getRepository("User");
      const user = await userRepo.findOneBy({ id: req.user.id });
      await userRepo.save({ ...user, ...req.body });
      // Go to view profile page
      return res.redirect(`/profile/${req.user.id}`);
    }
  } catch (error) {
    next(error.message);
  }
};

/**
 * Show page to edit password
 */
export const showEditPassword = async (req, res, next) => {
  // Get user
  const user = await userRepo.findOneBy({ id: req.user.id });
  delete user.password;

  // Form errors
  const formErrors = req.formErrors ? req.formErrors : [];

  // Form inputs
  const inputs = [
    {
      label: "Current password",
      name: "currentPassword",
      type: "password",
      value: req.body?.currentPassword ? req.body.currentPassword : "",
      error: req.inputErrors?.currentPassword ? req.inputErrors["currentPassword"] : "",
    },
    {
      label: "New password",
      name: "newPassword",
      type: "password",
      value: req.body?.newPassword ? req.body.newPassword : "",
      error: req.inputErrors?.newPassword ? req.inputErrors["newPassword"] : "",
    },
    {
      label: "Confirm password",
      name: "confirmPassword",
      type: "password",
      value: req.body?.confirmPassword ? req.body.confirmPassword : "",
      error: req.inputErrors?.confirmPassword ? req.inputErrors["confirmPassword"] : "",
    },
  ];

  // Render
  res.render("profile/password", {
    layout: "profile",
    activeNav: "password",
    user,
    formErrors,
    inputs,
  });
};

/**
 * Save password
 */
export const savePassword = async (req, res, next) => {
  try {
    // Check validation errors
    const validationErrors = validationResult(req);
    if (!validationErrors.isEmpty()) {
      req.inputErrors = {};
      for (const { param, msg } of validationErrors.array()) req.inputErrors[param] = msg;
      return next();
    } else {
      // Get user id and new password
      const { currentPassword, newPassword } = req.body;
      const userId = req.user.id;
      // Check if user  exists
      const user = await userRepo.findOneBy({ id: userId });
      if (!user) {
        req.formErrors = [{ message: "Sorry, something went wrong" }];
        return next();
      }
      // Check if currentPassword in form matches password in database
      if (!bcrypt.compareSync(currentPassword, user.password)) {
        req.formErrors = [{ message: "Sorry, something went wrong" }];
        return next();
      }
      // Save new password
      const hashedPassword = bcrypt.hashSync(newPassword, 12);
      await userRepo.save({ ...user, password: hashedPassword });
      // Go to view profile page
      return res.redirect(`/profile/${req.user.id}`);
    }
  } catch (error) {
    next(error.message);
  }
};
