import { injectCoursesData } from "@/utils/injectCourse";
import * as data from "@/data/courses-112-2.json" assert { type: "json" };

export async function GET() {
  await injectCoursesData("112-2", Array.from(data as any));

  return Response.json(data);
}
