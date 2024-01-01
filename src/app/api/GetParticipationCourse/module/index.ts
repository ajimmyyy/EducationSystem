// GetParticipationCourse/index.ts
import prisma from "@/utils/prisma";

export class GetParticipationCourseService {
    async getCourses(studentId: number, semester: string) {
        const courses = await prisma.participationCourse.findMany({
            where: {
                courseTable: {
                    studentId: studentId,
                    semester: semester
                }
            },
            include: {
                course: true
            }
        });

        console.log(courses); 
        return courses;
    }
}

export const getParticipationCourseService = new GetParticipationCourseService();

