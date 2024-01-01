import { GetCourseRequest } from "./module";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const courseID = params.get("courseID") || {};
  if (!courseID) {
    return Response.json({
      success: false,
      error: "Invalid request. Missing courseID",
    });
  }
  try {
    const courseRequests = await GetCourseRequest(Number(courseID));
    return Response.json({ success: true, courseRequests });
  } catch (error) {
    return Response.json({ success: false, error });
  }
}
