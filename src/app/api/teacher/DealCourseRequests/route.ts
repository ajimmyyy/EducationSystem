import { dealCourseRequestModule } from "./module";

interface Body {
    courseID: number,
    courseTableID: number,
    action: string,
}

export async function POST(request: Request) {
    const body: Body = await request.json();
    if (!body.courseID || !body.courseTableID || !body.action) {
        return Response.json({ success: false, error: "Invalid request. Missing courseID, courseTableID or action" });
    }
    if (await dealCourseRequestModule.IsCourseRequestExist(body.courseID, body.courseTableID) === false) {
        return Response.json({ success: false, error: "Course request does not exist" });
    }
    try {
        await dealCourseRequestModule.DealCourseRequest(body.courseID, body.courseTableID, body.action);
        return Response.json({ success: true });
    } catch(error) {
        return Response.json({ success: false, error })
    }
}