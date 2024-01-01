import { getTeacherSemester } from "@/services/teacherSemester";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const params = await request.nextUrl.searchParams;
  const teacherID = params.get("teacherID") || {};

  if (!teacherID) {
    return Response.json(
      {
        success: false,
        error: "Invalid request. Missing teacherID. " + teacherID,
      },
      {
        status: 400,
      },
    );
  }
  try {
    const courseSemester = await getTeacherSemester(Number(teacherID));
    return Response.json({ success: true, courseSemesters: courseSemester });
  } catch (error) {
    return Response.json(
      { success: false, error },
      {
        status: 500,
      },
    );
  }
}
