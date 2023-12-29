import { z } from "zod";
import { manageUserCase } from "./module";
import { NextRequest } from "next/server";

const MenberCreateRequestBody = z.object({
  role: z.string(),
  name: z.string(),
  password: z.string(),
  email: z.string().email(),
  cellphone: z.string().refine((value) => value.length === 10 && value.startsWith('09'), {
      message: 'Cellphone must be 10 characters long and start with "09"',
  }).optional(),
  departmentId: z.number().optional(),
  schoolClass: z.string().optional(),
  office: z.string().optional(),
  web: z.string().optional(),
  info: z.string().optional(),
  semester: z.string().refine((value) => /^\d{3}-\d$/.test(value), {
    message: "Invalid semester format.",
  }),
});

const MenberSearchRequestBody = z.string().refine((value) =>
  ['student', 'teacher', 'manager'].includes(value),
  {
    message: 'userType must be "student", "teacher", or "manager"',
  }
);

interface UpdateRequest {
    userid: number
    data: any
}


export async function POST(request: Request) {
    const body = await request.json();
    const parsed = MenberCreateRequestBody.safeParse(body);
    if (!parsed.success) {
        return Response.json(parsed.error, {
        status: 400,
        statusText: "invalid request body",
        });
    }

    const {role, name, password, email, cellphone, departmentId, schoolClass, office, web, info, semester } = parsed.data;
    const response = await manageUserCase
    .CreateMember({
      name,
      password,
      email,
      cellphone,
      departmentId,
    })
    .catch((e) => {
      console.log(e);
      return Response.json({ success: false, e });
    });

    const { id } = response as { id: number; name: string; password: string; email: string; cellphone: string | null; departmentId: number | null; };

    switch (role) {
      case 'student':
          try {
              const user = await manageUserCase.AssignStudentRole(id, {schoolClass: schoolClass, semester: semester});
              return Response.json({ success: true, user })
          }
          catch (error) {
              return Response.json({ success: false, error })
          }
      case 'teacher':
          try {
              const user = await manageUserCase.AssignTeacherRole(id, {office: office, web: web, info: info});
              return Response.json({ success: true, user })
          }
          catch (error) {
              return Response.json({ success: false, error })
          }
      case 'manager':
          try {
              const user = await manageUserCase.AssignManagerRole(id);
              return Response.json({ success: true, user })
          }
          catch (error) {
              return Response.json({ success: false, error })
          }
      default:
          return Response.json({ success: false, error: "role doesn't exist"})
    }
}

export async function GET(request: NextRequest) {
    const params = request.nextUrl.searchParams;
    const usertype = params.get("type") || "student";
    const parsed = MenberSearchRequestBody.safeParse(usertype);
    if (!parsed.success) {
        return Response.json(parsed.error, {
        status: 400,
        statusText: "invalid request",
        });
    }

    const result = await manageUserCase
    .SearchMember(parsed.data)
    .catch((e) => {
      console.log(e);
      return Response.json({ success: false, e });
    });

  return Response.json({ success: true, data: result });
}
// export async function DELETE(request: Request){
//     const body = await request.json();

//     try {
//         const user = await manageUserCase.DeleteMember(body);
//         return Response.json({ success: true, user })
//     } catch (error) {
//         return Response.json({ success: false, error })
//     }
// }

// export async function PUT(request: Request){
//     const body: UpdateRequest = await request.json();
//     const { userid, data } = body;

//     try {
//         const user = await manageUserCase.UpdateMember(userid, data);
//         return Response.json({ success: true, user })
//     } catch (error) {
//         return Response.json({ success: false, error })
//     }
// }