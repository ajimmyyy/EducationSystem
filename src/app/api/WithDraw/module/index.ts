// app/api/WithDraw/index.ts
import prisma from "@/utils/prisma";

export class WithDrawCourseService {
    async withdrawCourse(studentId: number, courseId: number, semester: string) {
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

        // 檢查是否選過這門課
        const enrollment = await prisma.participationCourse.findFirst({
            where: {
                courseTableId: courseTable.id,
                courseId: courseId
            }
        });

        if (!enrollment) {
            throw new Error("Course not enrolled");
        }

        // 從 ParticipationCourse 刪除該選課記錄
        await prisma.participationCourse.delete({
            where: {
                courseTableId_courseId: {
                    courseTableId: courseTable.id,
                    courseId: courseId
                }
            }
        });

        return { status: 'withdrawn' };
    }
}

export const withDrawCourseService = new WithDrawCourseService();
