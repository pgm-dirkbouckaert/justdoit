export default {
  Task: {
    type: "object",
    required: ["description"],
    properties: {
      id: { type: "integer" },
      description: { type: "string", required: true },
      done: { type: "boolean" },
      sortOrder: { type: "integer" },
      category: { $ref: "#/components/schemas/Category" },
      user: { $ref: "#/components/schemas/User" },
    },
  },
  TaskInput: {
    type: "object",
    required: ["description", "done", "userId"],
    properties: {
      description: { type: "string", required: true },
      done: { type: "boolean", required: true },
      sortOrder: { type: "integer" },
      userId: { type: "integer", required: true },
    },
  },
  Category: {
    type: "object",
    required: ["name"],
    properties: {
      id: { type: "integer" },
      name: { type: "string", required: true },
      user: { $ref: "#/components/schemas/User" },
      tasks: {
        type: "array",
        items: {
          properties: {
            id: { type: "integer" },
            description: { type: "string", required: true },
            done: { type: "boolean", required: true },
            sortOrder: { type: "integer" },
          },
        },
      },
    },
  },
  CategoryInput: {
    type: "object",
    required: ["name", "userId"],
    properties: {
      name: { type: "string", required: true },
      userId: { type: "integer", required: true },
    },
  },
  ArrayOfCategories: {
    type: "array",
    items: {
      $ref: "#/components/schemas/Category",
    },
  },
  User: {
    type: "object",
    required: ["email", "password"],
    properties: {
      id: { type: "integer" },
      firstname: { type: "string" },
      lastname: { type: "string" },
      email: { type: "string", required: true },
      password: { type: "string", required: true },
    },
  },
  UserInput: {
    type: "object",
    required: ["email", "password"],
    properties: {
      firstname: { type: "string" },
      lastname: { type: "string" },
      email: { type: "string", required: true },
      password: { type: "string", required: true },
    },
  },
};
