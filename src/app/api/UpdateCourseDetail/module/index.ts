import prisma from "@/utils/prisma";

export interface CourseDetail {
  syllabus: string;
}

export class UpdateCourseDetail {
  async UpdateCourseDetail(courseID: number, courseDetail: CourseDetail) {
    const course = await prisma.course.update({
      where: {
        id: courseID,
      },
      data: {
        syllabus: courseDetail.syllabus,
      },
    });
    return course;
  }

  IsCourseDetailValid(courseDetail: CourseDetail) {
    courseDetail;
    //const { syllabusURL } = courseDetail;
    // if (!syllabusURL) {
    //     return false;
    // }
    return true;
  }
}

export const updateCourseDetail = new UpdateCourseDetail();
