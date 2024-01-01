import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/index.mjs";
import type { ChatCompletionCreateParamsBase } from "openai/resources/chat/completions.js";
import type { ChatApi, ChatApiOptions, ChatResponse } from "./api.js";

export type OpenAIChatModel = ChatCompletionCreateParamsBase["model"];
export type OpenAIChatMessage = ChatCompletionMessageParam;
export const OpenAIChatPrice = {
  "gpt-3.5-turbo": {
    prompt_tokens: 0.001,
    completion_tokens: 0.002,
  },
  "gpt-4-1106-preview": {
    prompt_tokens: 0.01,
    completion_tokens: 0.03,
  },
};

type OpenAiChatApiOptions = ChatApiOptions & {
  model?: OpenAIChatModel;
};

export class OpenAIChatApi implements ChatApi {
  model: OpenAIChatModel = "gpt-4-1106-preview";
  private _instance: OpenAI;
  private _messages: OpenAIChatMessage[] = [];
  private _context: string | null = null;

  get messages() {
    return this._messages
      .filter((message) => message.role !== "system")
      .map((message) => message.content as string);
  }

  get context(): string | null {
    return this._context;
  }

  set context(value: string) {
    this._context = value;
    if (this._messages[0]?.role === "system") {
      this._messages[0].content = value;
      return;
    }
    this._messages.unshift({ role: "system", content: value });
  }

  getCost(response: OpenAI.Chat.Completions.ChatCompletion) {
    const model = this.model;
    const { prompt_tokens, completion_tokens } =
      OpenAIChatPrice[model as keyof typeof OpenAIChatPrice];
    const cost =
      (response.usage?.prompt_tokens ?? 0) * prompt_tokens * 0.001 +
      (response.usage?.completion_tokens ?? 0) * completion_tokens * 0.001;

    return cost;
  }

  constructor(options?: OpenAiChatApiOptions) {
    if (options?.context) this.context = options.context;
    if (options?.model) this.model = options.model;
    this._instance = new OpenAI({ apiKey: options?.apiKey });
  }

  async chat(message: string): Promise<ChatResponse> {
    this._messages.push({ role: "user", content: message });

    const response = await this._instance.chat.completions.create({
      model: this.model,
      messages: this._messages,
      top_p: 0,
    });

    const responseMessage = response.choices[0].message.content;
    if (!responseMessage) throw new Error("No response message");

    this._messages.push({ role: "assistant", content: responseMessage });
    return {
      response: responseMessage,
      cost: this.getCost(response),
      success: true,
    };
  }
}
