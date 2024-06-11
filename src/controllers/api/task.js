import AppDataSource from "../../data/dataSource.js";

const taskRepo = AppDataSource.getRepository("Task");
const categoryRepo = AppDataSource.getRepository("Category");

export const getTask = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: taskId } = req.body;
    if (!taskId) {
      const tasks = await taskRepo.find({ relations: ["user", "category"], where: { user: { id: userId } } });
      // Delete passwords
      for (const task of tasks) delete task.user.password;
      return res.status(200).json(tasks);
    }
    const task = await taskRepo.findOne({ relations: ["user", "category"], where: { id: taskId, user: { id: userId } } });
    if (!task) return res.status(404).json({ message: "Task was not found" });
    delete task.user.password;
    return res.status(200).json(task);
  } catch (error) {
    next(error.message);
  }
};

export const createTask = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { task, userId: requestedUserId } = req.body;
    if (parseInt(requestedUserId) !== parseInt(userId)) return res.status(401).json({ message: "You can only create tasks for your own account." });
    const categoryInRepo = await categoryRepo.findOneBy({ user: { id: userId }, name: task.category.name.trim().toLowerCase() });
    if (!categoryInRepo) {
      const newCategory = await categoryRepo.save({
        name: task.category.name.trim().toLowerCase(),
        user: { id: userId },
      });
      task.category.id = newCategory.id;
      delete task.category.name;
    } else {
      task.category.id = categoryInRepo.id;
      delete task.category.name;
    }
    const newTask = await taskRepo.save({ ...task, user: { id: userId } });
    return res.status(201).json(newTask);
  } catch (error) {
    next(error.message);
  }
};

export const updateTask = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: taskId } = req.params;
    const task = await taskRepo.findOne({ relations: ["user"], where: { id: taskId, user: { id: userId } } });
    if (!task) return res.status(404).json({ message: "Task was not found" });
    const update = await taskRepo.save({ ...task, ...req.body });
    delete update.user.password;
    return res.status(200).json(update);
  } catch (error) {
    next(error.message);
  }
};

export const deleteTask = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id: taskId } = req.params;
    if (!taskId) return res.status(401).json({ message: "Please provide the task ID." });
    const task = await taskRepo.findOne({ relations: ["user"], where: { id: taskId, user: { id: userId } } });
    if (!task) return res.status(404).json({ message: "Task was not found" });
    await taskRepo.delete(taskId);
    res.status(200).json({ message: "Task was succesfully deleted" });
  } catch (error) {
    next(error.message);
  }
};

export const saveSortOrder = async (req, res, next) => {
  const { id: userId } = req.user;
  const sortOrderObj = req.body;
  for (const item of sortOrderObj) {
    const task = await taskRepo.findOne({ relations: ["user"], where: { id: item.taskId, user: { id: userId } } });
    if (task) await taskRepo.save({ ...task, sortOrder: item.sortOrder });
  }
  return res.status(200).json({ message: "Sort order was succesfully saved" });
};
