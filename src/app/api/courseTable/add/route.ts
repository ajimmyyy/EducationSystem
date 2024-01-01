import { z } from "zod";
import courseTableService from "@/services/courseTableService";

const CourseTableCreateRequestBody = z.object({
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

  const { semester } = parsed.data;
  try {
    const result = await courseTableService.createCourseTable({ semester });
    return Response.json({ success: true, result });
  } catch (error) {
    return Response.json(
      { success: false, error },
      {
        status: 500,
        statusText: "Internal Server Error",
      },
    );
  }
}
