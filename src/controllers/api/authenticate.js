import AppDataSource from "../../data/dataSource.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const authenticate = async (req, res) => {
  const { email, password } = req.body;

  // Check if user exists
  const userRepo = AppDataSource.getRepository("User");
  const user = await userRepo.findOneBy({ email });
  if (!user) {
    return res.status(404).json({ message: "User was not found." });
  }

  // Check if password is correct
  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Unauthorized." });
  }

  // Create JWT
  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    process.env.TOKEN_SALT,
    { expiresIn: "3h" }
  );
  res.status(200).json({ token });
};
