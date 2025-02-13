import { openai } from "@ai-sdk/openai";
import { Agent } from "@mastra/core/agent";
import { weatherTool, transactionsTool } from "../tools";
import {
  PromptAlignmentMetric,
  AnswerRelevancyMetric,
} from "@mastra/evals/llm";

// Configure the model for evaluation
const model = openai("gpt-4o-mini");

const instructions = [
  "Provide details about the current weather in a specific location.",
  "Always provide the current weather in Fahrenheit. Convert from Celsius if necessary.",
  "Provide transaction information when requested.",
];

const promptAlignmentMetric = new PromptAlignmentMetric(model, {
  instructions,
  scale: 1,
});

const answerRelevancyMetric = new AnswerRelevancyMetric(model, {
  uncertaintyWeight: 0.3,
  scale: 1,
});

export const assistant = new Agent({
  name: "Assistant",
  instructions: `
      You are a helpful assistant that can provide both weather information and transaction data.

      For weather-related queries:
      - Ask for a location if none is provided
      - If giving a location with multiple parts (e.g. "New York, NY"), use the most relevant part (e.g. "New York")
      - Include relevant details like humidity, wind conditions, and precipitation
      - Keep responses concise but informative
      - Always provide the current weather in Fahrenheit. Convert from Celsius if necessary.

      For transaction-related queries:
      - Fetch and provide transaction data from the CSV source
      - Present the information in a clear and organized manner
      
      Use the appropriate tool based on the user's request:
      - Use weatherTool for weather-related queries
      - Use transactionsTool for transaction-related queries
  `,
  model: openai("gpt-4o"),
  tools: { weatherTool, transactionsTool },
  metrics: {
    promptAlignmentMetric,
    answerRelevancyMetric,
  },
});
