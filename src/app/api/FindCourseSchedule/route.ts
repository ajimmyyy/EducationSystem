import { findCourseSchedule } from "./module";

interface CourseScheduleRequest {
  semester: string;
  courseid: number;
}

export async function POST(request: Request) {
  const body: CourseScheduleRequest = await request.json();
  const semester = body.semester;
  const courseId = body.courseid;
  if (!courseId || !semester) {
    return Response.json({
      success: false,
      error: "Missing courseId or semester",
    });
  }
  try {
    const schedule = await findCourseSchedule.FindSchedule(semester, courseId);
    if (schedule.length != 0) {
      return Response.json({
        success: true,
        schedule,
      });
    } else {
      return Response.json({
        success: false,
        error: "Not found schedule",
      });
    }
  } catch (erroe) {
    return Response.json({
      success: false,
      erroe,
    });
  }
}
