import prisma from "@/utils/prisma";

export class FindCourseClassroomCase {
  async FindClassroom(courseId: number) {
    const classroom = await prisma.courseclassroom.findFirst({
      where: {
        courseid: courseId,
      },
      select: {
        classroom: {},
      },
    });
    return classroom;
  }
}
export const findCourseClassroom = new FindCourseClassroomCase();
