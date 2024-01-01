import prisma from "@/utils/prisma";

export async function GetCourseRequest(courseID: number) {
  const courseRequests = await prisma.unassignedCourse.findMany({
    where: {
      course: {
        id: courseID
      },
      state: {
        notIn: ["success", "fail"],
      },
    },
    select: {
      courseTable: {
        select: {
          id: true,
          student: {
            select: {
              class: true,
              user: {
                select: {
                  name: true,
                },
              }
            }
          },
        },
      },
      state: true,
    },
    orderBy: {
      requestTime: 'desc'
    },
  });
  return courseRequests;
}