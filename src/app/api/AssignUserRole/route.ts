import { assignUserRoleCase} from "./module";
import { CreateStudentType } from "./module";
import { CreateTeacherType } from "./module";
import { CreateManagerType } from "./module";

interface RequestBody {
    role: string;
    userid: number;
    body: Record<string, any>;
}

export async function POST(request: Request) {
    const body: RequestBody = await request.json();
    if (!body.role || !body.userid || !body.body) {
        throw new Error('Invalid request. Missing required fields.');
    }
    
    switch (body.role) {
        case 'student':
            let studentBody: CreateStudentType;

            try {
                studentBody = body.body as CreateStudentType;
            }
            catch (error) {
                return Response.json({ success: false, error })
            }

            await assignUserRoleCase.AssignStudentRole(body.userid, studentBody);
            break;
        case 'teacher':
            let teacherBody: CreateTeacherType;

            try {
                teacherBody = body.body as CreateTeacherType;
            }
            catch (error) {
                return Response.json({ success: false, error })
            }

            await assignUserRoleCase.AssignTeacherRole(body.userid, teacherBody);
            break;
        case 'manager':
            let managerBody: CreateManagerType;

            try {
                managerBody = body.body as CreateManagerType;
            }
            catch (error) {
                return Response.json({ success: false, error })
            }

            await assignUserRoleCase.AssignManagerRole(body.userid, managerBody);
            break;
        default:
            throw new Error('Unsupported request type.');
      }
}