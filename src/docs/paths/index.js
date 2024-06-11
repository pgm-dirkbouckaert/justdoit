import authenticate from "./authenticate.js";
import categories from "./categories.js";
import tasks from "./tasks.js";

export default {
  ...authenticate,
  ...categories,
  ...tasks,
};
