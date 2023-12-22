import { dealCourseRequestModule } from "./module";

interface Body {
    courseID: number,
    studentID: number,
    action: string,
}

export async function POST(request: Request) {
    const body: Body = await request.json();
    if (!body.courseID || !body.studentID || !body.action) {
        return Response.json({ success: false, error: "Invalid request. Missing courseID, studentID or action" });
    }
    if (await dealCourseRequestModule.IsCourseRequestExist(body.courseID, body.studentID) === false) {
        return Response.json({ success: false, error: "Course request does not exist" });
    }
    try {
        await dealCourseRequestModule.DealCourseRequest(body.courseID, body.studentID, body.action);
        return Response.json({ success: true });
    } catch(error) {
        return Response.json({ success: false, error })
    }
}