import { Mastra } from "@mastra/core/mastra";
import { createLogger } from "@mastra/core/logger";
import { weatherWorkflow } from "./workflows";
import { assistant } from "./agents";

export const mastra = new Mastra({
  workflows: { weatherWorkflow },
  agents: { assistant },
  logger: createLogger({
    name: "Mastra",
    level: "debug",
  }),
});
