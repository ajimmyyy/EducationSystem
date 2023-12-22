import prisma from "@/utils/prisma";

interface CourseIdRequestBody {
  courseid: number;
}

export class FindStudentCourseCase {
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
  async FindStudentParticipationCourseId(coursetableId: number) {
    const member = await prisma.participationcourse.findMany({
      where: {
        coursetableid: coursetableId,
      },
      select: {
        courseid: true,
      },
    });
    return await this.FindAllStudentParticipationCourse(member);
  }
  async FindAllStudentParticipationCourse(courseList: CourseIdRequestBody[]) {
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
