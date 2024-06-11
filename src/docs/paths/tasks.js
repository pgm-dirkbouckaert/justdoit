import responses from "../responsesTask.js";

export default {
  "/task": {
    get: {
      tags: ["Task"],
      summary: "Get tasks",
      description: `One task will be returned if a task ID is provided in the request body.
      If not, all tasks will be returned.`,
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
              id: 44,
            },
          },
        },
      },
      responses: { 200: responses["200"], 404: responses["404"] },
    },
    post: {
      tags: ["Task"],
      summary: "Create a task",
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
              required: ["userId", "task"],
              properties: {
                userId: { type: "integer", required: true },
                task: {
                  type: "object",
                  required: ["description"],
                  properties: {
                    description: { type: "string", required: true },
                    done: { type: "boolean" },
                    sortOrder: { type: "integer" },
                    category: {
                      type: "object",
                      properties: {
                        name: { type: "string" },
                      },
                    },
                  },
                },
              },
            },
            example: {
              userId: 1,
              task: {
                description: "Do some cleaning 3",
                category: { name: "Household" },
              },
            },
          },
        },
      },
      responses: { 201: responses["201"], 401: responses["401"] },
    },
  },
  "/task/{id}": {
    put: {
      tags: ["Task"],
      summary: "Update a task",
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
          name: "Task ID",
          in: "path",
          descripton: "The ID of the task that needs to be deleted.",
          required: true,
          type: "integer",
          example: 45,
        },
      ],
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              properties: {
                description: { type: "string" },
                done: { type: "boolean" },
              },
            },
            example: {
              done: true,
            },
          },
        },
      },
      responses: { 200: responses["200"], 404: responses["404"] },
    },
    delete: {
      tags: ["Task"],
      summary: "Delete a task",
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
          name: "Task ID",
          in: "path",
          descripton: "The ID of the task that needs to be deleted.",
          required: true,
          type: "integer",
          example: 45,
        },
      ],
      responses: { 200: responses["200-deleted"], 401: responses["401"] },
    },
  },
};
