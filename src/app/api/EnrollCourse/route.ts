//api/EnrollCourse/route.ts
import { EnrollCourseService } from "./module";
const enrollCourseService = new EnrollCourseService();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, courseId, semester } = body;

    const result = await enrollCourseService.enrollCourse(
      studentId,
      courseId,
      semester,
    );
    return new Response(JSON.stringify({ success: true, result }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error: any) {
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
