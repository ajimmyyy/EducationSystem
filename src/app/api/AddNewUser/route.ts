import { addNewUserCase } from "./module";

export async function POST(request: Request) {
    const body = await request.json();
    try {
        const user = await addNewUserCase.CreateMember(body);
        return Response.json({ success: true, user })
    } catch (error) {
        return Response.json({ success: false, error })
    }
}