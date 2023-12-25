import prisma from "@/utils/prisma";

export interface CourseDetail {
    coursename: string,
    credit: number,
    studentquota: number,
    syllabusurl?: string,
    isenglishtaught: boolean,
    teacherid?: number,
    departmentid?: number,
}

export class UpdateCourseDetail { 
    async UpdateCourseDetail(courseID: number, courseDetail: CourseDetail) {
        const course = await prisma.course.update({
            where: {
                courseid: courseID,
            },
            data: {
                coursename: courseDetail.coursename,
                credit: courseDetail.credit,
                studentquota: courseDetail.studentquota,
                syllabusurl: courseDetail.syllabusurl,
                isenglishtaught: courseDetail.isenglishtaught,
                teacherid: courseDetail.teacherid,
                departmentid: courseDetail.departmentid,
            }
        });
        return course;
    }

    IsCourseDetailValid(courseDetail: CourseDetail) {
        const { coursename, credit, studentquota, isenglishtaught } = courseDetail;
        if (!coursename) {
            return false;
        }
        if (!credit) {
            return false;
        }
        if (!studentquota) {
            return false;
        }
        if (isenglishtaught!= true && isenglishtaught != false) {
            return false;
        }
        return true;
    }
}

export const updateCourseDetail = new UpdateCourseDetail();