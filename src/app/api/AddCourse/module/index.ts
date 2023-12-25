import prisma from "@/utils/prisma";

export class AddNewCourseCase {
    async addCourseToTable(input: CreateCourseInput) {
        // 檢查課程是否存在
        const course = await prisma.course.findUnique({
            where: { courseid: input.courseid }
        });
        if (!course) {
            throw new Error("Course not found");
        }

        // 檢查課程是否已滿
        if (course.enrollmentnum >= course.studentquota) {
            // 將課程加入 unassignedcourse
            await prisma.unassignedcourse.create({
                data: {
                    courseid: input.courseid,
                    studentid: input.coursetableid
                }
            });
            throw new Error("Course is full");
        }

       
        const existingEntry = await prisma.participationcourse.findUnique({
            where: {
                coursetableid_courseid: {
                    coursetableid: input.coursetableid,
                    courseid: input.courseid
                }
            }
        });
        if (existingEntry) {
            throw new Error("Course already selected by the student");
        } // 檢查學生是否已經選過該課程

        
        const addedCourse = await prisma.participationcourse.create({
            data: {
                coursetableid: input.coursetableid,
                courseid: input.courseid
            }
        });// 將課程加入 participationcourse

        return addedCourse;
    }
}

export interface CreateCourseInput {
    coursetableid: number;
    courseid: number;
}

export const addNewCourseCase = new AddNewCourseCase();