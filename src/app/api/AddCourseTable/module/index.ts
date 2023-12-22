import prisma from "@/utils/prisma";

interface CreateCourseTable {
  coursetableid: number;
  semester: string;
  studentid: number;
}

export class AddCourseCase {
  async CreateCourseTable(courseTable: CreateCourseTable) {
    const member = await prisma.coursetable.create({
      data: courseTable,
    });
    return member;
  }
}

export const addCourseTable = new AddCourseCase();
