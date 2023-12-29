import { Course } from "@prisma/client";

export type RawCourse = Omit<Course, "id" | "teacherId" | "departmentId"> & {
  schedule: string[][];
  teacherName: string;
  classroom: string;
  departmentName: string;
};
