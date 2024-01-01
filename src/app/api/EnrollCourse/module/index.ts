import prisma from "@/utils/prisma";

export class EnrollCourseService {
    async enrollCourse(studentId: number, courseId: number, semester: string) {
        // 查找對應的課程
        const course = await prisma.course.findUnique({
            where: { id: courseId }
        });

        if (!course) {
            throw new Error("Course not found");
        }

        // 查找學生的課表
        const courseTable = await prisma.courseTable.findFirst({
            where: {
                studentId: studentId,
                semester: semester
            }
        });

        if (!courseTable) {
            throw new Error("Course table not found");
        }

        // 檢查課程是否已滿
        const enrollmentCount = await prisma.participationCourse.count({
            where: { courseId: courseId }
        });

        if (enrollmentCount >= course.studentQuota) {
            // 將請求加入 UnassignedCourse
            const unassignedCourse = await prisma.unassignedCourse.create({
                data: {
                    courseTableId: courseTable.id,
                    courseId: courseId,
                    state: 'wait'
                }
            });
            return { status: 'waiting', course: unassignedCourse };
        } else {
            // 將學生加入 ParticipationCourse
            const participationCourse = await prisma.participationCourse.create({
                data: {
                    courseTableId: courseTable.id,
                    courseId: courseId
                }
            });
            return { status: 'enrolled', course: participationCourse };
        }
    }
}

export const enrollCourseService = new EnrollCourseService();
