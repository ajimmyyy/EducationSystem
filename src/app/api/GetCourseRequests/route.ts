import { GetCourseRequest } from "./module";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const teacherID = params.get("teacherID") || {};
  if (!teacherID) {
    return Response.json({
      success: false,
      error: "Invalid request. Missing teacherID",
    });
  }
  try {
    const courseRequests = await GetCourseRequest(Number(teacherID));
    return Response.json({ success: true, courseRequests });
  } catch (error) {
    return Response.json({ success: false, error });
  }
}
