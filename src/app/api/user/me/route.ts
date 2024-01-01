import userService from "@/services/userService";
import { getCookie } from "cookies-next";

export async function GET(request: Request) {
  const token = getCookie("token", {
    req: request,
  });

  if (!token) {
    return Response.json({
      isLogin: false,
      id: null,
      name: null,
      role: null,
    });
  }

  try {
    const user = await userService.me(token);
    return Response.json({
      isLogin: true,
      id: user.id,
      name: user.name,
      role: user.role,
    });
  } catch (error: any) {
    return Response.json(
      {
        isLogin: false,
        id: null,
        name: null,
        role: null,
      },
      { status: 500 },
    );
  }
}
