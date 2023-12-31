import prisma from "@/utils/prisma";

// 用老師的ID找到他的課分布在哪些學期
export async function getTeacherSemester(teacherId: number) {
  const courseSemester = await prisma.course.findMany({
    where: { teacherId: teacherId },
    distinct: ["semester"],
    select: { semester: true },
  });

  return courseSemester;
}