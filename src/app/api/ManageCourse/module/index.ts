import prisma from "@/utils/prisma";

interface CourseType {
    coursename: string
    credit: number
    studentquota: number
    syllabusurl?: string
    isenglishtaught?: boolean
}

interface ScheduleType {
    semester: string
    weekday: string
    starttime: string
    endtime: string
}

interface CreateCourseType {
    course: CourseType
    schedule: ScheduleType[]
}

interface DeleteCourseType {
    courseid: number
}

export class ManageCourseCase {
    async CreateCourse(teacherId: number, departmentId: number, classroomId: number, courseData: CreateCourseType) {
        const { course, schedule } = courseData;
        
        const newCourse = await prisma.course.create({
            data: {
                ...course,
                teacher: {
                    connect: {
                        teacherid: teacherId
                    }
                },
                department: {
                    connect: {
                        departmentid: departmentId
                    }
                },
                courseclassroom: {
                    create: {
                        classroom: {
                            connect: {
                                classroomid: classroomId
                            }
                        }
                    }
                }
            }
        });

        await this.CreateSchedule(newCourse, schedule);

        return newCourse;
    }

    async DeleteCourse(courseData: DeleteCourseType) {
        const course = await prisma.course.delete({
            where: {
                courseid: courseData.courseid
            }
        });

        return course;
    }

    async CheckCourseAvailability(teacherId: number, classroomId: number, courseData: CreateCourseType): Promise<boolean> {
        const { schedule } = courseData;
        const isClassroomAvailableResult = await this.isClassroomAvailable(classroomId, schedule);
        const isTeacherAvailableResult = await this.isTeacherAvailable(teacherId, schedule);
    
        return isClassroomAvailableResult && isTeacherAvailableResult;
    }

    private buildDateObject(timeData: string) {
        const time = new Date();
        const [hour, minute] = timeData.split(':');
        time.setHours(Number(hour), Number(minute));
        
        return time;
    }

    private async CreateSchedule(course: any, scheduleData: ScheduleType[]) {
        await Promise.all(scheduleData.map(schedule => {
            return prisma.schedule.create({
                data:{
                    semester: schedule.semester,
                    weekday: schedule.weekday,
                    starttime: this.buildDateObject(schedule.starttime),
                    endtime: this.buildDateObject(schedule.endtime),
                    course: {
                        connect: {
                            courseid: course.courseid
                        }
                    }
                }
            });
        }));
    }

    private async isClassroomAvailable(classroomId: number, scheduleList: ScheduleType[]): Promise<boolean> {
        const course = await prisma.course.findFirst({
            where: {
                courseclassroom: {
                    every: {
                        classroomid: classroomId,
                    },
                },
                schedule: {
                    every: {
                        OR: scheduleList.map(scheduleData => ({
                            AND: [
                                { weekday: scheduleData.weekday },
                                { starttime: { lt: this.buildDateObject(scheduleData.endtime) } },
                                { endtime: { gt: this.buildDateObject(scheduleData.starttime) } }
                            ]
                        }))
                    },
                },
            },
              include: {
                courseclassroom: true,
                schedule: true,
            }
        });

        return !course;
    }
    
    private async isTeacherAvailable(teacherId: number, scheduleList: ScheduleType[]): Promise<boolean> {
        const course = await prisma.course.findFirst({
            where: {
                teacher: {
                    teacherid: teacherId,
                },
                schedule: {
                    every: {
                        OR: scheduleList.map(scheduleData => ({
                            AND: [
                                { weekday: scheduleData.weekday },
                                { starttime: { lt: this.buildDateObject(scheduleData.endtime) } },
                                { endtime: { gt: this.buildDateObject(scheduleData.starttime) } }
                            ]
                        }))
                    },
                },
            },
              include: {
                teacher: true,
                schedule: true,
            }
        });

        return !course;
    }
}

export const manageCourseCase = new ManageCourseCase();