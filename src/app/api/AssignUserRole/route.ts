import { assignUserRoleCase} from "./module";

interface RequestBody {
    role: string;
    userid: number;
    body: any;
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();
    if (!body.role || !body.userid || !body.body) {
        throw new Error('Invalid request. Missing required fields.');
    }

    try{
        if(!await assignUserRoleCase.IsAssignable(body.userid)){
            return Response.json({ success: false, error: "had role" })
        }
    }
    catch (error) {
        return Response.json({ success: false, error })
    }

    switch (body.role) {
        case 'student':
            try {
                const user = await assignUserRoleCase.AssignStudentRole(body.userid, body.body);
                return Response.json({ success: true, user })
            }
            catch (error) {
                return Response.json({ success: false, error })
            }
        case 'teacher':
            try {
                const user = await assignUserRoleCase.AssignTeacherRole(body.userid, body.body);
                return Response.json({ success: true, user })
            }
            catch (error) {
                return Response.json({ success: false, error })
            }
        case 'manager':
            try {
                const user = await assignUserRoleCase.AssignManagerRole(body.userid);
                return Response.json({ success: true, user })
            }
            catch (error) {
                return Response.json({ success: false, error })
            }
        default:
            return Response.json({ success: false, error: "role doesn't exist"})
      }
}