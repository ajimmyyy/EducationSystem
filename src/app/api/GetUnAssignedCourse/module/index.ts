import prisma from "@/utils/prisma";

export class UnassignedCourseService {
    async getUnassignedCourses(studentId: number, semester: string) {
        const unassignedCourses = await prisma.unassignedCourse.findMany({
            where: {
                courseTable: {
                    studentId: studentId,
                    semester: semester
                }
            },
            include: {
                course: true, // 包含課程詳情
                courseTable: {
                    include: {
                        student: true 
                    }
                }
            }
        });

        console.log(unassignedCourses);
        return unassignedCourses;
    }
}

export const unassignedCourseService = new UnassignedCourseService();
