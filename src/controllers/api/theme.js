import AppDataSource from "../../data/dataSource.js";

/**
 * Save theme
 */
export const saveTheme = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { theme } = req.body;
    const userRepo = AppDataSource.getRepository("User");
    const user = await userRepo.findOneBy({ id: userId });
    await userRepo.save({ ...user, theme });
    return res.status(200).json({ message: "Theme was successfully saved." });
  } catch (error) {
    next(error.message);
  }
};
