import prisma from "@/utils/prisma";

export interface CourseDetail {
  name: string;
  credit: number;
  studentQuota: number;
  syllabus?: string;
  isEnglishTaught: boolean;
  teacherid?: number;
  departmentid?: number;
}

export class UpdateCourseDetail {
  async UpdateCourseDetail(courseID: number, courseDetail: CourseDetail) {
    const course = await prisma.course.update({
      where: {
        id: courseID,
      },
      data: {
        name: courseDetail.name,
        credit: courseDetail.credit,
        studentQuota: courseDetail.studentQuota,
        syllabus: courseDetail.syllabus,
        isEnglishTaught: courseDetail.isEnglishTaught,
        teacherId: courseDetail.teacherid,
        departmentId: courseDetail.departmentid,
      },
    });
    return course;
  }

  IsCourseDetailValid(courseDetail: CourseDetail) {
    const { name, credit, studentQuota, isEnglishTaught } = courseDetail;
    if (!name) {
      return false;
    }
    if (!credit) {
      return false;
    }
    if (!studentQuota) {
      return false;
    }
    if (typeof isEnglishTaught !== "boolean") {
      return false;
    }
    return true;
  }
}

export const updateCourseDetail = new UpdateCourseDetail();
