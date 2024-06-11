import paths from "./paths/index.js";
import schemas from "./schemas.js";

export default {
  openapi: "3.0.0",
  info: {
    title: "Just Do IT",
    description: "API Docs",
    version: "1.0.0",
    license: {
      name: "Arteveldehogeschool",
      url: "https://arteveldehogeschool.be",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Local development server",
    },
  ],
  tags: [],
  paths,
  components: {
    schemas,
  },
};
