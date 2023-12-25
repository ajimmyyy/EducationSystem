import { manageClassroomCase } from "./module";

export async function POST(request: Request) {
    const body = await request.json();

    if(await manageClassroomCase.IsClassroomExist(body)) {
        return Response.json({ success: false, error: "Classroom already exist" })
    }

    try {
        const classroom = await manageClassroomCase.CreateClassroom(body);
        return Response.json({ success: true, classroom })
    } catch (error) {
        return Response.json({ success: false, error })
    }
}

export async function DELETE(request: Request) {
    const body = await request.json();

    try {
        const classroom = await manageClassroomCase.DeleteClassroom(body);
        return Response.json({ success: true, classroom })
    } catch (error) {
        return Response.json({ success: false, error })
    }
}