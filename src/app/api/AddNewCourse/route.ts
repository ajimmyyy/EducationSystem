import { addNewCourseCase } from "./module";

interface RequestBody {
    teacherid: number;
    departmentid: number;
    classroomid: number;
    body: any;
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();
    try {
        const course = await addNewCourseCase.CreateCourse(body.teacherid, body.departmentid, body.classroomid, body.body);
        return Response.json({ success: true, course })
    } catch (error) {
        return Response.json({ success: false, error })
    }
}