import prisma from "@/utils/prisma";
import { Prisma } from "@prisma/client";

export type FullCollectCourse = Prisma.CollectCourseGetPayload<{
  include: {
    course: true;
  };
}>; 

async function searchCollectCourse(id: number) {
  const result = await prisma.collectCourse.findMany({
    where: {
      studentId: id,
    },
    include: {
      course: true,
    },
  });
  return result;
}

export default {
  searchCollectCourse,
};