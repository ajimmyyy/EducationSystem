import { z } from "zod";
import searchCollectCourse from "@/services/collectCourseService";
import { NextRequest } from "next/server";

const CellotCourseSearchRequestParams = z.object({
  id: z.string(),
});

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const parsed = CellotCourseSearchRequestParams.safeParse(
    Object.fromEntries(searchParams),
  );
  if (!parsed.success) {
    return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request params",
    });
  }

  try {
    const result = await searchCollectCourse.searchCollectCourse(Number(parsed.data.id));
    console.log(result);
    return Response.json({
      success: true,
      courses: result,
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
