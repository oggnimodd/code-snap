import { z } from "zod";

// Define the schema for the "apiKeys" object.
export const apiKeysSchema = z.object({
  GEMINI_API_KEY: z.string(),
  MISTRAL_API_KEY: z.string(),
  GROQ_API_KEY: z.string(),
});

// Export the type of the "apiKeys" object.
export type ApiKeyIdentifier = keyof z.infer<typeof apiKeysSchema>;
