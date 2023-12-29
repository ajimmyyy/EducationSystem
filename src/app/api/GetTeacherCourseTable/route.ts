import {getTeacherCourseTable} from "./module";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest){
    const params = await request.nextUrl.searchParams;
    const teacherID = params.get("teacherID") || {};

    if (!teacherID) {
        return Response.json({ success: false, error: 'Invalid request. Missing teacherID. ' + teacherID });
    }
    try{
        const courseTable = await getTeacherCourseTable(Number(teacherID as string));
        return Response.json({ success: true, courseTable });
    }catch(error){
        return Response.json({ success: false, error })
    }
}