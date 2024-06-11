import bcrypt from "bcrypt";
import AppDataSource from "../../data/dataSource.js";

const userRepo = AppDataSource.getRepository("User");

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      // const users = await userRepo.find({ relations: ["tasks", "categories"] });
      const users = await userRepo.find({ relations: { tasks: { category: true }, categories: true } });
      // Delete passwords
      for (const user of users) delete user.password;
      return res.status(200).json(users);
    }
    // const user = await userRepo.findOne({ where: { id }, relations: ["tasks", "categories"] });
    const user = await userRepo.findOne({ where: { id }, relations: { tasks: { category: true }, categories: true } });
    if (!user) return res.status(404).json({ message: "User was not found" });
    delete user.password;
    return res.status(200).json(user);
  } catch (error) {
    next(error.message);
  }
};

export const createUser = async (req, res, next) => {
  try {
    // Get data
    const { firstname, lastname, email } = req.body;
    // Check if user already exists
    const user = await userRepo.findOneBy({ email });
    if (user) return res.status(409).json({ message: "User already exists" });
    // Create new user
    const hashedPassword = bcrypt.hashSync("justdoit", 12);
    const newUser = await userRepo.save({ firstname, lastname, email, password: hashedPassword });
    delete newUser.password;
    return res.status(201).json(newUser);
  } catch (error) {
    next(error.message);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    // Get data
    const { id } = req.params;
    const user = await userRepo.findOne({ where: { id } });
    if (!user) return res.status(404).json({ message: "User was not found" });
    const { firstname, lastname, email } = req.body;
    const updatedUser = await userRepo.save({ ...user, firstname, lastname, email });
    delete updatedUser.password;
    return res.status(200).json(updatedUser);
  } catch (error) {
    next(error.message);
  }
};

export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(401).json({ message: "You should supply the user ID" });
    const user = await userRepo.findOne({ where: { id } });
    if (!user) return res.status(404).json({ message: "User was not found" });
    await userRepo.delete(id);
    res.status(200).json({ message: "User was succesfully deleted" });
  } catch (error) {
    next(error.message);
  }
};
