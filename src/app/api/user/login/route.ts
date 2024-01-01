import { z } from "zod";
import userService from "@/services/userService";

const LoginBodySchema = z.object({
  sid: z.string(),
  password: z.string(),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = LoginBodySchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request body",
    });
  }

  const { sid, password } = parsed.data;

  try {
    const data = await userService.login(Number(sid), password);
    return Response.json({
      ...data,
      success: true,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 },
    );
  }
}
