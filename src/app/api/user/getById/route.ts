import { z } from "zod";
import userService from "@/services/userService";
import { NextRequest } from "next/server";

const UserSearchRequestParams = z.object({
  id: z.string(),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parsed = UserSearchRequestParams.safeParse(
    Object.fromEntries(searchParams),
  );
  if (!parsed.success) {
    return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request params",
    });
  }

  try {
    const result = await userService.getUserById(Number(parsed.data.id));
    return Response.json({
      success: true,
      ...result,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
