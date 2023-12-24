import { manageDepartmentCase } from "./module";

export async function POST(request: Request) {
    const body = await request.json();

    if(await manageDepartmentCase.IsDepartmentExist(body)) {
        return Response.json({ success: false, error: "Department already exist" })
    }

    try {
        const department = await manageDepartmentCase.CreateDepartment(body);
        return Response.json({ success: true, department })
    } catch (error) {
        return Response.json({ success: false, error })
    }
}

export async function DELETE(request: Request) {
    const body = await request.json();
    try {
        const department = await manageDepartmentCase.DeleteDepartment(body);
        return Response.json({ success: true, department })
    } catch (error) {
        return Response.json({ success: false, error })
    }
}