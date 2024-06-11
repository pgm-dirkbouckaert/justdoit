import * as dotenv from "dotenv";
dotenv.config();
import { DataSource } from "typeorm";
import entities from "../models/index.js";

const AppDataSource = new DataSource({
  type: process.env.DATABASE_TYPE,
  database: process.env.DATABASE_NAME,
  synchronize: true,
  host: "localhost",
  port: 3306,
  entities,
  // username: "test",
  // password: "test",
});

export default AppDataSource;
