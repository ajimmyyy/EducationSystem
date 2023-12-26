import { main } from "@/services/courseService";

export async function GET() {
  const data = await main();

  return Response.json(data);
}
