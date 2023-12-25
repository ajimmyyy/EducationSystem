import prisma from "@/utils/prisma";

export class FindCourseScheduleCase {
  async FindSchedule(semester: string, courseId: number) {
    const schedule = await prisma.schedule.findMany({
      where: {
        semester: semester,
        courseid: courseId,
      },
    });
    return schedule;
  }
}
export const findCourseSchedule = new FindCourseScheduleCase();
