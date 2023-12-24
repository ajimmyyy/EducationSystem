import { manageUserCase } from "./module";

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