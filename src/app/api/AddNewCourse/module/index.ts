import prisma from "@/utils/prisma";

interface CourseType {
    courseid: number
    coursename: string
    credit: number
    studentquota: number
    syllabusurl?: string
    isenglishtaught: boolean
    teacherid?: number
    departmentid?: number
}

interface ScheduleType {
    weekday: string
    starttime: Date
    endtime: Date
}

interface CreateCourseType {
    course: CourseType
    schedule: ScheduleType[]
}

export class AddNewCourseCase {
    private async CreateSchedule(course: CourseType, schedule: ScheduleType[]){
        const createdSchedule = await prisma.schedule.createMany({
            data: schedule.map((s) => ({
                ...s,
                course: {
                    connect: {
                        courseid: course.courseid
                    }
                }
            }))
        });

        return createdSchedule;
    }

    async CreateCourse(teacherId: number, departmentId: number, classroomid: number, courseData: CreateCourseType) {
        const { course, schedule } = courseData;
        
        const createdSchedule = await this.CreateSchedule(course, schedule);
    
        const newCourse = await prisma.course.create({
            data: {
                ...course,
                schedule: {
                    connect: createdSchedule.map((s: ScheduleType) => ({
                        courseid: course.courseid,
                        weekday: s.weekday,
                        starttime: s.starttime
                    }))
                }
            }
        });
        
        return newCourse;
    }
}

export const addNewCourseCase = new AddNewCourseCase();