export default {
  200: {
    description: "Succesful response",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/Task" },
      },
    },
  },
  "200-deleted": {
    description: "Succesful response",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        example: {
          message: "Task was succesfully deleted.",
        },
      },
    },
  },
  201: {
    description: "Succesful response",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/Task" },
      },
    },
  },
  404: {
    description: "Task was not found",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        example: {
          message: "Task was not found.",
        },
      },
    },
  },
  401: {
    description: "Unauthorized",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        example: {
          message: "You can only create tasks for your own account.",
        },
      },
    },
  },
};
