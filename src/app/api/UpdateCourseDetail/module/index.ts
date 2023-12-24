import prisma from "@/utils/prisma";

export interface CourseDetail {
    syllabusURL: string,
}

export class UpdateCourseDetail { 
    async UpdateCourseDetail(courseID: number, courseDetail: CourseDetail) {
        const course = await prisma.course.update({
            where: {
                courseid: courseID,
            },
            data: {
                syllabusurl: courseDetail.syllabusURL,
            }
        });
        return course;
    }

    IsCourseDetailValid(courseDetail: CourseDetail) {
        const { syllabusURL } = courseDetail;
        // if (!syllabusURL) {
        //     return false;
        // }
        return true;
    }
}

export const updateCourseDetail = new UpdateCourseDetail();