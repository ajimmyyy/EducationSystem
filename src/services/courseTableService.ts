import prisma from "@/utils/prisma";

async function createCourseTable({ semester }: { semester: string }) {
  const students = await prisma.student.findMany();
  
  for (const student of students) {
    const existingStudent = await prisma.student.findUnique({
      where: {
        id: student.id,
      },
      include: {
        courseTable: {
          where: {
            semester,
          },
        },
      },
    });

    if (!existingStudent || !existingStudent.courseTable.length) {
      await prisma.courseTable.create({
        data: {
          semester,
          student: {
            connect: {
              id: student.id,
            },
          },
        },
      });
    }
  }
}

export default {
  createCourseTable,
};