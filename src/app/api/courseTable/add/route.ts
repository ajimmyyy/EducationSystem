import { z } from "zod";
import courseTableService from "@/services/courseTableService";

export const CourseTableCreateRequestBody = z.object({
  semester: z.string().refine((value) => /^\d{3}-\d$/.test(value), {
    message: "Invalid semester format.",
  }),
}); 

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = CourseTableCreateRequestBody.safeParse(body);
  if (!parsed.success) {
      return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request body",
      });
  }

  const {semester} = parsed.data;
  const result = await courseTableService
    .createCourseTable({semester})
    .catch((e) => {
      Response.json({ success: false, e })
    });

  return Response.json({success: true, result});
}