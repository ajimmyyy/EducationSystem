import { injectUsersData } from "@/utils/inject-users";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const registerword = searchParams.get("registerword");

  if (!registerword || registerword !== "dkelgowsmn") {
    return Response.json({
      success: false,
      message: "registerword is required",
    });
  }
  await injectUsersData();

  return Response.json({
    success: true,
    message: "users data injected",
  });
}
