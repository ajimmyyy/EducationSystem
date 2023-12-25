import { GetCourseDetail } from "./module";

interface Body {
    courseID: number;
}

export async function POST(request: Request) {
    const body: Body = await request.json();
    if (!body.courseID) {
        return Response.json({ success: false, error: 'Invalid request. Missing courseID' });
    }
    try {
        const course = await GetCourseDetail(body.courseID);
        return Response.json({ success: true, course });
    } catch (error) {
        return Response.json({ success: false, error })
    }
}