// import { injectCoursesData } from "@/utils/inject-course";
// import * as data2 from "@/data/courses-112-2.json" assert { type: "json" };
// import * as data1 from "@/data/courses-112-1.json" assert { type: "json" };

export async function GET() {
  return Response.json({ error: "Dev Only" });

  // await injectCoursesData("112-2", Array.from(data2 as any));
  // await injectCoursesData("112-1", Array.from(data1 as any));

  // return Response.json({
  //   success: true,
  //   message: "Courses data injected",
  // });
}
