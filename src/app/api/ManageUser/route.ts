import { manageUserCase } from "./module";

interface UpdateRequest {
    userid: number
    data: any
}

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const user = await manageUserCase.CreateMember(body);
        return Response.json({ success: true, user })
    } catch (error) {
        return Response.json({ success: false, error })
    }
}

export async function DELETE(request: Request){
    const body = await request.json();

    try {
        const user = await manageUserCase.DeleteMember(body);
        return Response.json({ success: true, user })
    } catch (error) {
        return Response.json({ success: false, error })
    }
}

export async function PUT(request: Request){
    const body: UpdateRequest = await request.json();
    const { userid, data } = body;

    try {
        const user = await manageUserCase.UpdateMember(userid, data);
        return Response.json({ success: true, user })
    } catch (error) {
        return Response.json({ success: false, error })
    }
}