import { z } from "zod";
import { manageUserCase } from "./module";
import { NextRequest } from "next/server";

const MenberCreateRequestBody = z.object({
    name: z.string(),
    password: z.string(),
    email: z.string().email(),
    cellphone: z.string().refine((value) => value.length === 10 && value.startsWith('09'), {
        message: 'Cellphone must be 10 characters long and start with "09"',
    }).optional(),
    department: z.string().optional(),
});

const MenberSearchRequestBody = z.string().refine((value) =>
  ['student', 'teacher', 'manager'].includes(value),
  {
    message: 'userType must be "student", "teacher", or "manager"',
  }
);

// interface UpdateRequest {
//     userid: number
//     data: any
// }


export async function POST(request: Request) {
    const body = await request.json();
    const parsed = MenberCreateRequestBody.safeParse(body);
    if (!parsed.success) {
        return Response.json(parsed.error, {
        status: 400,
        statusText: "invalid request body",
        });
    }

    const { name, password, email, cellphone, department } = parsed.data;
    const result = await manageUserCase
    .CreateMember({
        name,
        password,
        email,
        cellphone,
        department,
    })
    .catch((e) => {
      console.log(e);
      return Response.json({ success: false, e });
    });

  return Response.json({ success: true, result });
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

  return Response.json({ success: true, result });
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