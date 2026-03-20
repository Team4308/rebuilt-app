import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input:
    "https://rebuilt-workers.the-woodlands-robotics.workers.dev/openapi.json",
  output: "api/",
});
