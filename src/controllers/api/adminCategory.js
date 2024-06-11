import AppDataSource from "../../data/dataSource.js";

const categoryRepo = AppDataSource.getRepository("Category");
const userRepo = AppDataSource.getRepository("User");
const taskRepo = AppDataSource.getRepository("Task");

export const getCategory = async (req, res, next) => {
  try {
    const { id } = req.body;
    if (!id) {
      const categories = await categoryRepo.find({ relations: ["user", "tasks"] });
      // Delete passwords
      for (const cat of categories) delete cat.user.password;
      return res.status(200).json(categories);
    }
    const category = await categoryRepo.findOne({ where: { id }, relations: ["user", "tasks"] });
    if (!category) return res.status(404).json({ message: "Category was not found" });
    delete category.user.password;
    return res.status(200).json(category);
  } catch (error) {
    next(error.message);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, userId } = req.body;
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
    const { id, name } = req.body;
    if (name === "default") return res.status(409).json({ message: "You can't edit the category 'default'" });
    if (!id) return res.status(200).json({ message: "Please provide category ID" });
    const category = await categoryRepo.findOneBy({ id });
    if (!category) return res.status(404).json({ message: "Category was not found" });
    const update = await categoryRepo.save({ ...category, name: name.trim().toLowerCase() });
    return res.status(200).json(update);
  } catch (error) {
    next(error.message);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(401).json({ message: "You should supply the category ID" });
    const category = await categoryRepo.findOne({ where: { id } });
    if (!category) return res.status(404).json({ message: "Category was not found" });
    if (category.name === "default") return res.status(409).json({ message: "You can't delete the category 'default'" });
    // Delete all tasks in this category
    const tasks = await taskRepo.find({ where: { category: { id } } });
    for (const task of tasks) {
      await taskRepo.delete(task.id);
    }
    // Delete the category
    await categoryRepo.delete(id);
    res.status(200).json({ message: "Category was succesfully deleted" });
  } catch (error) {
    next(error.message);
  }
};
