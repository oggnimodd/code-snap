export const TOKENIZE_SERVER_PORT = 8080;
export const TOKENIZE_SERVER_URL =
  import.meta.env.VITE_TOKENIZE_SERVER_URL ||
  `http://localhost:${TOKENIZE_SERVER_PORT}`;

export const providers = [
  { value: "gemini", label: "Gemini" },
  { value: "groq", label: "Groq" },
  { value: "mistral", label: "Mistral" },
];

export const geminiModels = [
  { value: "gemini-2.0-flash-exp", label: "Gemini 2.0 Flash Exp" },
  { value: "gemini-exp-1206", label: "Gemini Exp 1206" },
  { value: "gemini-1.5-flash-002", label: "Gemini 1.5 Flash 002" },
  { value: "gemini-1.5-flash-exp-0827", label: "Gemini 1.5 Flash Exp 0827" },
  {
    value: "gemini-1.5-flash-8b-exp-0827",
    label: "Gemini 1.5 Flash 8b Exp 0827",
  },
  { value: "gemini-1.5-pro-002", label: "Gemini 1.5 Pro 002" },
  { value: "gemini-1.5-pro-exp-0827", label: "Gemini 1.5 Pro Exp 0827" },
];

export const groqModels = [
  { value: "llama-3.1-70b-versatile", label: "Llama 3.1 70b Versatile" },
  { value: "llama-3.3-70b-specdec", label: "Llama 3.3 70b Specdec" },
  { value: "llama-3.3-70b-versatile", label: "Llama 3.3 70b Versatile" },
];

export const mistralModels = [
  { value: "mistral-small-latest", label: "Mistral Small" },
  { value: "mistral-medium", label: "Mistral Medium" },
  { value: "mistral-large-latest", label: "Mistral Large" },
];
