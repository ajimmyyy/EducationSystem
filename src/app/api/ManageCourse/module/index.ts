import prisma from "@/utils/prisma";

// interface CourseType {
//   coursename: string
//   credit: number
//   studentquota: number
//   syllabusurl?: string
//   isenglishtaught?: boolean
// }

interface ScheduleType {
  weekday: number;
  classroomId: number;
  intervals: string[];
}

interface CreateCourseType {
  code: string;
  name: string;
  credit: number;
  phase: number;
  studentQuota: number;
  syllabus?: string;
  progress?: string;
  grading?: string;
  textbook?: string;
  note?: string;
  note2?: string;
  semester?: string;
  isEnglishTaught: boolean;
}

export class ManageCourseCase {
  async SearchCourse(page: number, perPage: number) {
    const course = await prisma.course.findMany({
      select: {
        id: true,
        code: true,
        name: true,
        credit: true,
        phase: true,
        studentQuota: true,
        semester: true,
      },
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        id: "asc",
      },
    });

    return course;
  }

  async CreateCourse(
    courseData: CreateCourseType,
    teacherId: number,
    departmentId: number,
    schedules: ScheduleType[],
  ) {
    const newCourse = await prisma.course.create({
      data: {
        ...courseData,
        semester: courseData.semester || "",
        teacher: {
          connect: {
            id: teacherId,
          },
        },
        department: {
          connect: {
            id: departmentId,
          },
        },
      },
    });

    await this.CreateSchedule(schedules, newCourse.id);

    return newCourse;
  }

  async DeleteCourse(courseId: number) {
    const course = await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    return course;
  }

  async CheckCourseAvailability(
    teacherId: number,
    schedules: ScheduleType[],
  ): Promise<boolean> {
    const isClassroomAvailableResult =
      await this.isClassroomAvailable(schedules);
    const isTeacherAvailableResult = await this.isTeacherAvailable(
      teacherId,
      schedules,
    );

    return isClassroomAvailableResult && isTeacherAvailableResult;
  }

  private async CreateSchedule(schedules: ScheduleType[], courseId: number) {
    for (let i = 0; i < schedules.length; i++) {
      const currentSchedule = schedules[i];
      await prisma.schedule.create({
        data: {
          weekday: currentSchedule.weekday,
          classroom: {
            connect: {
              id: currentSchedule.classroomId,
            },
          },
          intervals: {
            create: currentSchedule.intervals.map((interval) => ({
              time: interval,
            })),
          },
          course: {
            connect: {
              id: courseId,
            },
          },
        },
      });
    }
  }

  private async isClassroomAvailable(
    schedules: ScheduleType[],
  ): Promise<boolean> {
    for (let i = 0; i < schedules.length; i++) {
      const currentSchedule = schedules[i];
      const interval = await prisma.classroom.findFirst({
        where: {
          id: currentSchedule.classroomId,
        },
        select: {
          schedule: {
            select: {
              intervals: {
                select: {
                  time: true,
                },
              },
            },
            where: {
              weekday: currentSchedule.weekday,
            },
          },
        },
      });

      if (interval === null) {
        return false;
      }

      if (interval.schedule.length > 0) {
        const timeList: string[] = interval.schedule.flatMap((schedule) =>
          schedule.intervals.map((interval) => interval.time),
        );
        const isOverlapping = this.areIntervalsOverlapping(
          timeList,
          currentSchedule.intervals,
        );
        if (isOverlapping) {
          return false;
        }
      }
    }

    return true;
  }

  private async isTeacherAvailable(
    teacherId: number,
    scheduleList: ScheduleType[],
  ): Promise<boolean> {
    for (let i = 0; i < scheduleList.length; i++) {
      const currentSchedule = scheduleList[i];
      const interval = await prisma.teacher.findFirst({
        where: {
          id: teacherId,
        },
        select: {
          course: {
            select: {
              schedule: {
                select: {
                  intervals: {
                    select: {
                      time: true,
                    },
                  },
                },
                where: {
                  weekday: currentSchedule.weekday,
                },
              },
            },
          },
        },
      });

      if (interval === null) {
        return false;
      }

      if (interval !== null) {
        const timeList: string[] = interval.course.flatMap((course) =>
          course.schedule.flatMap((schedule) =>
            schedule.intervals.map((interval) => interval.time),
          ),
        );
        const isOverlapping = this.areIntervalsOverlapping(
          timeList,
          currentSchedule.intervals,
        );
        if (isOverlapping) {
          return false;
        }
      }
    }

    return true;
  }

  private areIntervalsOverlapping(
    intervalsA: string[],
    intervalsB: string[],
  ): boolean {
    const setA = new Set(intervalsA);
    const setB = new Set(intervalsB);

    for (const interval of setA) {
      if (setB.has(interval)) {
        return true;
      }
    }

    return false;
  }
}

export const manageCourseCase = new ManageCourseCase();
