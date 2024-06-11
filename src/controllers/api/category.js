import AppDataSource from "../../data/dataSource.js";

const categoryRepo = AppDataSource.getRepository("Category");
const userRepo = AppDataSource.getRepository("User");

export const getCategory = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: categoryId } = req.body;
    if (!categoryId) {
      const categories = await categoryRepo.find({ relations: ["user", "tasks"], where: { user: { id: userId } } });
      // Delete passwords
      for (const cat of categories) delete cat.user.password;
      return res.status(200).json(categories);
    }
    const category = await categoryRepo.findOne({ relations: ["user", "tasks"], where: { id: categoryId, user: { id: userId } } });
    if (!category) return res.status(404).json({ message: "Category was not found" });
    delete category.user.password;
    return res.status(200).json(category);
  } catch (error) {
    next(error.message);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { name, userId: requestedUserId } = req.body;
    if (parseInt(requestedUserId) !== parseInt(userId))
      return res.status(409).json({ message: "You can only create categories for your own account." });
    const user = await userRepo.findOne({ where: { id: userId }, relations: ["categories"] });
    if (user.categories.map((category) => category.name).includes(name.trim().toLowerCase())) {
      return res.status(409).json({ message: "Category already exists" });
    }
    const newCategory = await categoryRepo.save({ name: name.trim().toLowerCase(), user: { id: userId } });
    return res.status(201).json(newCategory);
  } catch (error) {
    next(error.message);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: categoryId, name } = req.body;
    if (name === "default") return res.status(409).json({ message: "You can't edit the category 'default'" });
    if (!categoryId) return res.status(200).json({ message: "Please provide category ID" });
    // Check if category exists
    const category = await categoryRepo.findOne({ relations: ["user"], where: { id: categoryId, user: { id: userId } } });
    if (!category) return res.status(404).json({ message: "Category was not found" });
    // Check if new name for category is already in use
    const allCategories = await categoryRepo.find({ relations: ["user"], where: { user: { id: userId } } });
    if (allCategories.map((category) => category.name).includes(name.trim().toLowerCase())) {
      return res.status(409).json({ message: "That category already exists. Provide a unique name." });
    }
    // Update category
    const update = await categoryRepo.save({ ...category, name: name.trim().toLowerCase() });
    delete update.user.password;
    return res.status(200).json(update);
  } catch (error) {
    next(error.message);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: categoryId } = req.params;
    if (!categoryId) return res.status(404).json({ message: "You should supply the category ID" });
    const category = await categoryRepo.findOne({ relations: ["user"], where: { id: categoryId, user: { id: userId } } });
    if (!category) return res.status(404).json({ message: "Category was not found" });
    if (category.name === "default") return res.status(409).json({ message: "You can't delete the category 'default'" });
    // Delete the category
    await categoryRepo.delete(categoryId);
    res.status(200).json({ message: "Category was succesfully deleted." });
  } catch (error) {
    next(error.message);
  }
};
