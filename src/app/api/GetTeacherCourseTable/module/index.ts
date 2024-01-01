import prisma from "@/utils/prisma";

// 用老師的ID找到他的課
export async function getTeacherCourseTable(teacherId: number, semester: string) {
  const courseTable = await prisma.teacher.findMany({
    where: { id: teacherId },
    select: {
      course: {
        where: {
          semester: semester
        },
        select: {
          code: true,
          name: true,
          schedule: {
            select: {
              weekday: true,
              intervals: {
                select: {
                  time: true,
                }
              }
            }
          }
        }
      }
    }
  });
  return courseTable;
}