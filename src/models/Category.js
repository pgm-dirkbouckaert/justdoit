import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Category",
  tableName: "categories",
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true,
    },
    name: {
      type: "varchar",
      nullable: false,
    },
  },
  relations: {
    user: {
      target: "User",
      type: "many-to-one",
      joinColumn: {
        name: "userId",
      },
      inverseSide: "categories",
      onDelete: "CASCADE",
    },
    tasks: {
      target: "Task",
      type: "one-to-many",
      inverseSide: "category",
      cascade: true,
    },
  },
});
