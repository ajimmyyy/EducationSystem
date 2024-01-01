import { NextResponse } from "next/server";
import { OpenAIChatApi, OpenAIChatModel } from "./openai";
import { ChatResponse } from "./api";
import { z } from "zod";

export type ChatOption = {
  context: string;
  model: OpenAIChatModel;
  message: string;
};

const ChatOptionRequestBody = z.object({
  context: z.string(),
  model: z.string(),
  message: z.string(),
});

// eslint-disable-next-line no-unused-vars
type Work_Function = (context: ChatOption) => Promise<ChatResponse>;

const workWithOpenAI =
  (next: Work_Function) => async (chatOption: ChatOption) => {
    const { context, model, message } = chatOption;
    if (model !== "chat-bison-001") {
      const llm = new OpenAIChatApi({
        apiKey: process.env.OPENAI_API_KEY,
        model: model,
        context: context,
      });
      const response = await llm.chat(message);

      if (!response)
        return {
          success: false,
        };

      return response;
    }
    return next(chatOption);
  };

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = ChatOptionRequestBody.safeParse(body);
  if (!parsed.success) {
    return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request body",
    });
  }

  const { context, model, message } = parsed.data;
  const work = [workWithOpenAI].reduceRight(
    (next, fn) => fn(next),
    // eslint-disable-next-line no-unused-vars
    async (chatOption: ChatOption) => {
      return {
        success: false,
      };
    },
  );
  const response = await work({
    context: context ?? "",
    model: model as OpenAIChatModel,
    message: message ?? "",
  });

  return NextResponse.json(response);
}
