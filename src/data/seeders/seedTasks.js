import AppDataSource from "../dataSource.js";
import Task from "../../models/Task.js";

const seedTasks = async () => {
  try {
    // Connect to database
    // -------------------
    const connection = await AppDataSource.initialize();
    if (connection.isInitialized) {
      console.log("Data Source has been initialized!");
    } else {
      throw Error("Error during Data Source initialization");
    }

    // Add new items
    // ------------
    const taskRepo = AppDataSource.getRepository(Task);
    const newItems = [
      { id: 1, category: "default", description: "Working for programming 3", done: false },
      { id: 2, category: "default", description: "Exploring ExpressJS", done: false },
      { id: 3, category: "default", description: "Finish CSS for Todo App", done: true },
      { id: 4, category: "household", description: "Do the dishes", done: true },
      { id: 5, category: "household", description: "Take out the garbage", done: true },
      { id: 6, category: "household", description: "Vacuum the living room", done: false },
    ];
    for (const item of newItems) {
      const itemExistsInDB = await taskRepo.findOne({ where: { id: item.id } });
      // console.log("itemExistsInDB:", itemExistsInDB);
      if (!itemExistsInDB) await taskRepo.save(item);
    }

    // Get and log all items from database
    // -----------------------------------
    const allItemsInDB = await taskRepo.find();
    console.log("All items in db: ", allItemsInDB);
  } catch (error) {
    console.error(error);
  }
};

seedTasks();
