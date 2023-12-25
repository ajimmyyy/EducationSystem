import prisma from "@/utils/prisma";

export class WithdrawCourseCase {
    async removeCourseFromTable(input: WithdrawCourseInput) {
        // 檢查學生是否已經選過該課程
        const existingEntry = await prisma.participationcourse.findUnique({
            where: {
                coursetableid_courseid: {
                    coursetableid: input.coursetableid,
                    courseid: input.courseid
                }
            }
        });

        if (!existingEntry) {
            throw new Error("Course not found in student's coursetable");
        }

        // 從 participationcourse 移除課程
        await prisma.participationcourse.delete({
            where: {
                coursetableid_courseid: {
                    coursetableid: input.coursetableid,
                    courseid: input.courseid
                }
            }
        });

        await prisma.participationcourse.delete({
            where: {
                coursetableid_courseid: {
                    coursetableid: input.coursetableid,
                    courseid: input.courseid
                }
            }
        });

        // 更新課程的選課人數
        await prisma.course.update({
            where: {
                courseid: input.courseid
            },
            data: {
                enrollmentnum: {
                    decrement: 1
                }
            }
        });

        return { message: "Course successfully withdrawn" };
    }
}

export interface WithdrawCourseInput {
    coursetableid: number;
    courseid: number;
}

export const withdrawCourseCase = new WithdrawCourseCase();
