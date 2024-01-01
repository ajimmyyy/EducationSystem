//import { injectUsersData } from "@/utils/inject-users";

export async function GET() {
  return Response.json({ error: "Dev Only" });
  // await injectUsersData();

  // return Response.json({
  //   success: true,
  //   message: "users data injected",
  // });
}
