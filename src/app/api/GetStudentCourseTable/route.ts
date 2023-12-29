import { GetStudentCourse } from "./module";
import { NextRequest } from "next/server";

interface FindTableIdRequestBody {
  studentid: number;
  semester: string;
}

export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const studentId = params.get("studentId") || {};
  const semester = params.get("semester") || {};
  if (!studentId || !semester) {
    return Response.json({
      success: false,
      error: "Missid studentID or semester",
    });
  }
  try {
    const course = await GetStudentCourse(Number(studentId), String(semester));
    return Response.json({ success: true, course });
  } catch (error) {
    return Response.json({ success: false, error });
  }
}

// export async function GET(request: Request) {
//   const body: FindTableIdRequestBody = await request.json();
//   const studentId = body.studentid;
//   const semester = body.semester;
//   if (!studentId || !semester) {
//     return Response.json({
//       success: false,
//       error: "Missing studentId or semester",
//     });
//   }
//   try {
//     // 找到courseTable資料
//     const courseTable = await findStudentCourseTable.FindStudentTableId(
//       studentId,
//       semester
//     );
//     const courseTableId = courseTable.coursetableid;
//     if (courseTableId != null) {
//       // 找到學生參與課程的ID
//       const participationCourseIdList =
//         await findStudentCourseTable.FindStudentParticipationCourseId(
//           courseTableId
//         );
//       // 從課程ID去找詳細資料
//       const courseDetails =
//         await findStudentCourseTable.FindAllStudentParticipationCourse(
//           participationCourseIdList,
//           semester
//         );
//       return Response.json({ success: true, courseDetails });
//     }
//     return Response.json({
//       success: false,
//       error: "Not found participation table",
//     });
//   } catch (error) {
//     return Response.json({ success: false, error });
//   }
// }
