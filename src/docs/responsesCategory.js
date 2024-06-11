export default {
  200: {
    description: "Succesful response",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/Category" },
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
          message: "Category was succesfully deleted.",
        },
      },
    },
  },
  201: {
    description: "Succesful response",
    content: {
      "application/json": {
        schema: { $ref: "#/components/schemas/Category" },
      },
    },
  },
  404: {
    description: "Category was not found",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        example: {
          message: "Category was not found.",
        },
      },
    },
  },
  409: {
    description: "Conflict",
    content: {
      "application/json": {
        schema: {
          type: "object",
          properties: {
            message: { type: "string" },
          },
        },
        example: {
          message: "Category already exists.",
        },
      },
    },
  },
};
