import AppDataSource from "../data/dataSource.js";

const userRepo = AppDataSource.getRepository("User");
const categoryRepo = AppDataSource.getRepository("Category");

export const home = async (req, res) => {
  // Get user
  const userId = req.user.id;
  const user = await userRepo.findOne({
    where: { id: userId },
    relations: {
      tasks: { category: true },
      categories: true,
    },
    order: {
      tasks: { sortOrder: "ASC" },
      categories: { id: "ASC" },
    },
  });

  // Check if category 'default' exists
  const categories = user.categories;
  if (categories.length == 0) {
    const newCategory = await categoryRepo.save({ name: "default", user: { id: userId } });
    categories.push(newCategory);
  }

  // Get current category name
  let { category: currentCategoryName = "default" } = req.params;

  // Redirect to home page and default category if user adds a non existing category to url
  if (!categories.map((category) => category.name).includes(currentCategoryName)) {
    return res.redirect("/");
  }

  // Filter tasks
  const filteredTasks = user.tasks.filter((task) => task.category.name === currentCategoryName);

  // Get current category ID
  const currentCategoryId = categories.find((cat) => cat.name === currentCategoryName).id;

  // Render
  res.render("home", {
    user,
    categories,
    tasks: filteredTasks,
    currentCategoryName,
    currentCategoryId,
  });
};
