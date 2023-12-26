import prisma from "@/utils/prisma";

export class AddNewCourseCase {
    async addCourseToTable(input: CreateCourseInput) {

        //Check if the course exists
        const course = await prisma.course.findUnique({
            where: { courseid: input.courseid }
        });
        if (!course) {
            throw new Error("Course not found");
        }
    
        //check the enrollment count
        const enrollmentCount = await prisma.participationcourse.count({
            where: { courseid: input.courseid }
        });
    
        //check if the student already selected the course
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
        }

        //check if the course is full or not
        if (enrollmentCount >= course.studentquota) {
            await prisma.unassignedcourse.create({
                data: {
                    courseid: input.courseid,
                    studentid: input.coursetableid
                }
            });
            throw new Error("Course is full");
        } else {
            const addedCourse = await prisma.participationcourse.create({
                data: {
                    coursetableid: input.coursetableid,
                    courseid: input.courseid
                }
            });
            return addedCourse;
        }
    }    
}

export interface CreateCourseInput {
    coursetableid: number;
    courseid: number;
}

export const addNewCourseCase = new AddNewCourseCase();