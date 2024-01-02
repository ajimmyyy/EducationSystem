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

async function addCollectCourse(studentId: number, courseId: number) {
  const result = await prisma.collectCourse.create({
    data: {
      studentId: studentId,
      courseId: courseId,
    },
  });
  return result;
}

async function deleteCollectCourse(studentId: number, courseId: number) {
  const result = await prisma.collectCourse.delete({
    where: {
      studentId_courseId: {
        studentId: studentId,
        courseId: courseId,
      },
    },
  });
  return result;
}

export default {
  searchCollectCourse,
  addCollectCourse,
  deleteCollectCourse,
};
