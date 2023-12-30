import prisma from "@/utils/prisma";

async function createCourseTable({ semester }: { semester: string }) {
  const students = await prisma.student.findMany();
  
  for (const student of students) {
    await prisma.courseTable.create({
      data: {
        semester,
        student: {
          connect: {
            id: student.id
          }
        }
      }
    });
  }
}

export default {
  createCourseTable,
};