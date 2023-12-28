import { GetCourseDetail } from "./module";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const courseID = params.get("courseID") || {};
    if (!courseID) {
        return Response.json({ success: false, error: 'Invalid request. Missing courseID' });
    }
    try {
        const course = await GetCourseDetail(Number(courseID));
        return Response.json({ success: true, course });
    } catch (error) {
        return Response.json({ success: false, error })
    }
}