import { updateCourseDetail, CourseDetail } from "./module";

interface Body extends CourseDetail{
    courseID: number,
}

export async function POST(request: Request) {
    const body: Body = await request.json();
    const courseID = body.courseID;
    const courseDetail: CourseDetail = body;

    if (!courseID) {
        return Response.json({ success: false, error: "Invalid request. Missing courseID" });
    }
    if (!updateCourseDetail.IsCourseDetailValid(courseDetail)) {
        return Response.json({ success: false, error: "Invalid request. Missing courseDetail" });
    }
    try {
        await updateCourseDetail.UpdateCourseDetail(courseID, courseDetail);
        return Response.json({ success: true });
    } catch(error) {
        return Response.json({ success: false, error })
    }
}