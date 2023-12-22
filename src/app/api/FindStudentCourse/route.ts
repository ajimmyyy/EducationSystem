import { findStudentCourseTable } from "./module";

interface FindTableIdRequestBody {
  studentid: number;
  semester: string;
}

export async function POST(request: Request) {
  const body: FindTableIdRequestBody = await request.json();
  const studentId = body.studentid;
  const semester = body.semester;
  if (!studentId || !semester) {
    return Response.json({
      success: false,
      error: "Missing studentId or semester",
    });
  }
  try {
    const courseTable = await findStudentCourseTable.FindStudentTableId(
      studentId,
      semester
    );
    const courseTableId = courseTable.coursetableid;
    if (courseTableId != null) {
      const participationCourse =
        await findStudentCourseTable.FindStudentParticipationCourseId(
          courseTableId
        );
      return Response.json({ success: true, participationCourse });
    } else {
      return Response.json({ success: false, courseTable });
    }
  } catch (error) {
    return Response.json({ success: false, error });
  }
}
