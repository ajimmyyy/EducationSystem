import prisma from "@/utils/prisma";

export async function GetCourseDetail(courseID: number) {
    const course = await prisma.course.findUnique({
        where: {
            courseid: courseID
        }
    });
    return course;
}