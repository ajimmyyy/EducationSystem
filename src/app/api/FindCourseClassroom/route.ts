import { findCourseClassroom } from "./module";

interface CourseClassroomRequest {
  courseid: number;
}

export async function POST(request: Request) {
  const body: CourseClassroomRequest = await request.json();
  const courseId = body.courseid;
  if (!courseId) {
    return Response.json({
      success: false,
      error: "Missing courseId",
    });
  }
  try {
    const classroom = await findCourseClassroom.FindClassroom(courseId);
    if (classroom != null) {
      return Response.json({
        success: true,
        classroom,
      });
    }
    return Response.json({
      success: false,
      error: "Not found",
    });
  } catch (error) {
    return Response.json({
      success: false,
      error,
    });
  }
}
