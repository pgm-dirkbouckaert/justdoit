import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    firstname: {
      type: "varchar",
      nullable: true,
    },
    lastname: {
      type: "varchar",
      nullable: true,
    },
    email: {
      type: "varchar",
    },
    password: {
      type: "varchar",
    },
    theme: {
      type: "varchar",
      nullable: true,
    },
  },
  relations: {
    tasks: {
      target: "Task",
      type: "one-to-many",
      inverseSide: "user",
      cascade: true,
    },
    categories: {
      target: "Category",
      type: "one-to-many",
      inverseSide: "user",
      cascade: true,
    },
  },
});
