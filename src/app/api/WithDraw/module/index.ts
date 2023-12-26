import prisma from "@/utils/prisma";

export class WithdrawCourseCase {
    async removeCourseFromTable(input: WithdrawCourseInput) {
        // check if the course is chosen by the student
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
    
        // remove the course from the participationcourse table
        await prisma.participationcourse.delete({
            where: {
                coursetableid_courseid: {
                    coursetableid: input.coursetableid,
                    courseid: input.courseid
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
