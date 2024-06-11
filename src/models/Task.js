import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Task",
  tableName: "tasks",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    description: {
      type: "varchar",
      nullable: false,
    },
    done: {
      type: "boolean",
      nullable: false,
      default: false,
    },
    sortOrder: {
      type: "int",
      nullable: true,
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "userId",
      },
      inverseSide: "tasks",
      onDelete: "CASCADE",
    },
    category: {
      target: "Category",
      type: "many-to-one",
      joinColumn: {
        name: "categoryId",
      },
      inverseSide: "tasks",
      onDelete: "CASCADE",
    },
  },
});
