export default {
  "/authenticate": {
    post: {
      tags: ["Authentication"],
      summary: "Use this endpoint to authenticate yourself.",
      description: `You will receive a JSON Webtoken. When calling the other endpoints,  
         add this token to the headers as 'Authorization: Bearer {{token}}'`,
      requestBody: {
        required: true,
        content: {
          "application/json": {
            schema: {
              type: "object",
              required: ["email", "password"],
              properties: {
                email: { type: "string", required: true },
                password: { type: "string", required: true },
              },
            },
          },
        },
      },
      responses: {
        200: {
          description: "Succesful response",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  token: { type: "string" },
                },
              },
              example: {
                token:
                  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
              },
            },
          },
        },
        404: {
          description: "User was not found",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                },
              },
              example: {
                message: "User was not found.",
              },
            },
          },
        },
        401: {
          description: "Unauthenticated",
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  message: { type: "string" },
                },
              },
              example: {
                message: "Unauthenticated.",
              },
            },
          },
        },
      },
    },
  },
};
