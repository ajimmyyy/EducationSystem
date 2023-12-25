import {getTeacherCourseTable} from "./module";

interface Body {
    teacherID: number
}

export async function POST(request: Request){
    const body: Body = await request.json();
    if (!body.teacherID) {
        return Response.json({ success: false, error: 'Invalid request. Missing teacherID.' });
    }
    try{
        const courseTable = await getTeacherCourseTable(body.teacherID);
        return Response.json({ success: true, courseTable });
    }catch(error){
        return Response.json({ success: false, error })
    }
}