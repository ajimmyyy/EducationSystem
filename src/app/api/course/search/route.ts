import { z } from "zod";
import courseService from "@/services/courseService";

const CourseSearchRequestBody = z.object({
  keyword: z.string(),
  semester: z.string().regex(/^\d{3}-\d$/),
  page: z.number().int().default(0),
  perPage: z.number().int().positive().default(10),
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = CourseSearchRequestBody.safeParse(body);
  if (!parsed.success) {
    return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request body",
    });
  }

  const { keyword, semester, page, perPage } = parsed.data;
  const result = await courseService
    .searchCourse({
      keyword,
      semester,
      page,
      perPage,
    })
    .catch((e) => {
      console.log(e);
      return [];
    });

  return Response.json(result);
}
