// rebuilt-workers.the-woodlands-robotics.workers.dev
import { generate } from "openapi-typescript-codegen";

await generate({
  input: "https://rebuilt-workers.the-woodlands-robotics.workers.dev/openapi.json",
  output: "./api/"
})
