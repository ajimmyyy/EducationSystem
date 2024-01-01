import { injectUsersData } from "@/utils/inject-users";

export async function GET() {
  await injectUsersData();

  return Response.json({
    success: true,
    message: "users data injected",
  });
}
