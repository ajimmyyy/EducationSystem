import prisma from "@/utils/prisma";

export async function getTeacherCourseTable(teacherId: number){
    const courseTable = await prisma.teacher.findMany({
        where: {teacherid: teacherId},
            select: {
                course: true,
            }
        });
    return courseTable;
}