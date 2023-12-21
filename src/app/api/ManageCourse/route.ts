import { manageCourseCase } from "./module";

interface RequestBody {
    teacherid: number;
    departmentid: number;
    classroomid: number;
    body: any;
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();

    const isAvailable = await manageCourseCase.CheckCourseAvailability(body.teacherid, body.classroomid, body.body);
    if (!isAvailable) {
        return Response.json({ success: false, error: "Classroom or teacher is not available during the specified time." });
    }

    try {
        const course = await manageCourseCase.CreateCourse(body.teacherid, body.departmentid, body.classroomid, body.body);
        return Response.json({ success: true, course })
    } catch (error) {
        return Response.json({ success: false, error })
    }
}

export async function DELETE(request: Request) {
    const body = await request.json();

    try {
        await manageCourseCase.DeleteCourse(body);
        return Response.json({ success: true });
    } catch (error) {
        return Response.json({ success: false, error });
    }
}