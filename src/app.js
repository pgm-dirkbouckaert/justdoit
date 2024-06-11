import * as dotenv from "dotenv";
dotenv.config();
import express from "express";
import path from "path";
import { create } from "express-handlebars";
import hbsHelpers from "./lib/hbsHelpers.js";
import AppDataSource from "./data/dataSource.js";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import validateAuth from "./middleware/validation/auth.js";
import validateProfile from "./middleware/validation/profile.js";
import validatePassword from "./middleware/validation/password.js";
import { isLoggedOut, jwtAuth } from "./middleware/jwtAuth.js";
import { home } from "./controllers/home.js";
import { authenticate } from "./controllers/api/authenticate.js";
import { getTask, createTask, updateTask, deleteTask, saveSortOrder } from "./controllers/api/task.js";
import { createCategory, deleteCategory, getCategory, updateCategory } from "./controllers/api/category.js";
import { handleLogin, handleLogout, handleRegister, showLogin, showRegister } from "./controllers/auth.js";
// import { createUser, deleteUser, getUser, updateUser } from "./controllers/api/adminUser.js";
import { savePassword, saveProfile, showEditPassword, showEditProfile, showProfile } from "./controllers/profile.js";
import { saveTheme } from "./controllers/api/theme.js";
import swaggerUI from "swagger-ui-express";
import swaggerDefinition from "./docs/swagger.js";

/**
 * Create express app
 */
const app = express();
const PORT = process.env.PORT || 3000;
const SOURCE_PATH = path.resolve(process.env.SOURCE_FOLDER);

// Serve static assets
app.use(express.static("public"));

// Use body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Use cookie parser
app.use(cookieParser());

// Use swagger UI
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(swaggerDefinition));

/**
 * Create handlebars instance
 */
const hbs = create({
  helpers: hbsHelpers,
  extname: "hbs",
});
app.engine("hbs", hbs.engine);
app.set("view engine", "hbs");
app.set("views", path.join(SOURCE_PATH, "views"));

/**
 * Init TypeORM
 */
const connection = await AppDataSource.initialize();
if (!connection.isInitialized) console.error("Error during Data Source initialization", err);

/**
 * App routes
 */
// Authentication
app.get("/login", isLoggedOut, showLogin);
app.post("/login", ...validateAuth, handleLogin, showLogin);
app.get("/register", isLoggedOut, showRegister);
app.post("/register", ...validateAuth, handleRegister, showRegister);
app.post("/logout", jwtAuth, handleLogout);

// Home
app.get("/", jwtAuth, home);
app.get("/:category", jwtAuth, home);

// Profile
app.get("/profile/:id", jwtAuth, showProfile);
app.get("/profile/:id/edit", jwtAuth, showEditProfile);
app.post("/profile/:id/edit", jwtAuth, ...validateProfile, saveProfile, showEditProfile);
app.get("/profile/:id/password", jwtAuth, showEditPassword);
app.post("/profile/:id/password", jwtAuth, ...validatePassword, savePassword, showEditPassword);

/**
 * API routes
 */
// Authentication
app.post("/api/authenticate", authenticate);

// Tasks
app.get("/api/task", jwtAuth, getTask);
app.post("/api/task", jwtAuth, createTask);
app.put("/api/task/:id", jwtAuth, updateTask);
app.delete("/api/task/:id", jwtAuth, deleteTask);
app.post("/api/task/sortorder", jwtAuth, saveSortOrder);

// Categories
app.get("/api/category", jwtAuth, getCategory);
app.post("/api/category", jwtAuth, createCategory);
app.put("/api/category/", jwtAuth, updateCategory);
app.delete("/api/category/:id", jwtAuth, deleteCategory);

// Theme
app.post("/api/theme", jwtAuth, saveTheme);

// Admin: Users
// app.get("/api/admin/user", jwtAuth, getUser);
// app.post("/api/admin/user", jwtAuth, createUser);
// app.put("/api/admin/user/:id", jwtAuth, updateUser);
// app.delete("/api/admin/user/:id", jwtAuth, deleteUser);

/**
 * Serve express app
 */
app.listen(PORT, () => {
  console.log(`Listening on http://localhost:${PORT}`);
});
