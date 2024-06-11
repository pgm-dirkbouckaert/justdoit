import responses from "../responsesCategory.js";

export default {
  "/category": {
    get: {
      tags: ["Category"],
      summary: "Get categories",
      description: `One category will be returned if a category ID is provided in the request body.
      If not, all categories will be returned.`,
      parameters: [
        {
          name: "Authorization",
          in: "header",
          descripton: "An authorization header.",
          required: true,
          type: "string",
          example: "Bearer {{token}}",
        },
      ],
      requestBody: {
        required: false,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: { type: "integer" },
              },
            },
            example: {
              id: 45,
            },
          },
        },
      },
      responses: { 200: responses["200"], 404: responses["404"] },
    },
    post: {
      tags: ["Category"],
      summary: "Create a category",
      parameters: [
        {
          name: "Authorization",
          in: "header",
          descripton: "An authorization header.",
          required: true,
          type: "string",
          example: "Bearer {{token}}",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/CategoryInput" },
            example: {
              name: "Programming",
              userId: 7,
            },
          },
        },
      },
      responses: { 201: responses["201"], 409: responses["409"] },
    },
    put: {
      tags: ["Category"],
      summary: "Update a category",
      parameters: [
        {
          name: "Authorization",
          in: "header",
          descripton: "An authorization header.",
          required: true,
          type: "string",
          example: "Bearer {{token}}",
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                id: { type: "integer" },
                name: { type: "string" },
              },
            },
            example: {
              id: 7,
              name: "Programming Javascript",
            },
          },
        },
      },
      responses: { 200: responses["200"], 404: responses["404"], 409: responses["409"] },
    },
  },
  "/category/{id}": {
    delete: {
      tags: ["Category"],
      summary: "Delete a category",
      parameters: [
        {
          name: "Authorization",
          in: "header",
          descripton: "An authorization header.",
          required: true,
          type: "string",
          example: "Bearer {{token}}",
        },
        {
          name: "Category ID",
          in: "path",
          descripton: "The ID of the category that needs to be deleted.",
          required: true,
          type: "integer",
          example: 45,
        },
      ],
      responses: { 200: responses["200-deleted"], 404: responses["404"], 409: responses["409"] },
    },
  },
};
