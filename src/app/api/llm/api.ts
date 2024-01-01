import type { OpenAIChatModel } from "./openai.js";

export interface ChatApiOptions {
  apiKey?: string;
  model?: string;
  context?: string;
}

export interface ChatResponse {
  success: boolean;
  response?: string;
  cost?: number;
}

export interface ChatApi {
  model: OpenAIChatModel;
  context: string | null;
  messages: string[];
  // eslint-disable-next-line no-unused-vars
  chat(message: string): Promise<ChatResponse>;
}
