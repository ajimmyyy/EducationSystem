import prisma from "@/utils/prisma";

interface CourseIdRequestBody {
  courseid: number;
}

export class FindStudentCourseCase {
  // 找到tableID
  async FindStudentTableId(studentId: number, semester: string) {
    const member = await prisma.coursetable.findFirst({
      where: {
        studentid: studentId,
        semester: semester,
      },
      select: {
        coursetableid: true,
      },
    });
    return member;
  }
  //只有找到課程ID
  async FindStudentParticipationCourseId(coursetableId: number) {
    const member = await prisma.participationcourse.findMany({
      where: {
        coursetableid: coursetableId,
      },
      select: {
        courseid: true,
      },
    });
    return member;
  }
  // 從參與的課程ID找到課程資料
  async FindAllStudentParticipationCourse(
    courseList: CourseIdRequestBody[],
    semester: string
  ) {
    const participationCourseDetails = await Promise.all(
      courseList.map(async (course) => {
        const courseInfo = await prisma.course.findUnique({
          where: {
            courseid: course.courseid,
          },
        });
        return courseInfo;
      })
    );
    return participationCourseDetails;
  }
}

export const findStudentCourseTable = new FindStudentCourseCase();
