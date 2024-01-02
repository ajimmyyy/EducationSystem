import { z } from "zod";
import { manageUserCase } from "./module";
import { NextRequest } from "next/server";

const MenberCreateRequestBody = z.object({
  role: z.string(),
  name: z.string(),
  password: z.string().min(8),
  email: z.string().email(),
  cellphone: z
    .string()
    .refine((value) => value.length === 10 && value.startsWith("09"), {
      message: 'Cellphone must be 10 characters long and start with "09"',
    })
    .optional(),
  department: z.string().optional(),
  schoolClass: z.string().optional(),
  office: z.string().optional(),
  web: z.string().optional(),
  info: z.string().optional(),
});

const MemberSearchRequest = z.object({
  type: z
    .string()
    .refine((value) => ["student", "teacher", "manager"].includes(value), {
      message: 'userType must be "student", "teacher", or "manager"',
    }),
  page: z.number().refine((value) => value > 0, {
    message: "Value must be a non-zero positive integer",
  }),
});

const MenberDeleteRequestBody = z.object({
  id: z.number().refine((value) => value > 0, {
    message: "Value must be a non-zero positive integer",
  }),
});

const MenberUpdateRequestBody = z.object({
  id: z.number().refine((value) => value > 0, {
    message: "Value must be a non-zero positive integer",
  }),
  password: z.string().min(8).optional(),
  email: z.string().email().optional(),
  cellphone: z.string().refine((value) => value.length === 10 && value.startsWith('09'), {
    message: 'Cellphone must be 10 characters long and start with "09"',
  }).optional(),
  schoolClass: z.string().optional(),
  office: z.string().optional(),
  web: z.string().optional(),
  info: z.string().optional(),
});

// interface UpdateRequest {
//   userid: number
//   data: any
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

  const {
    role,
    name,
    password,
    email,
    cellphone,
    department,
    schoolClass,
    office,
    web,
    info,
  } = parsed.data;
  const response = await manageUserCase
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

  const { id } = response as {
    id: number;
    name: string;
    password: string;
    email: string;
    cellphone: string | null;
    departmentId: number | null;
  };

  switch (role) {
    case "student":
      try {
        const user = await manageUserCase.AssignStudentRole(id, schoolClass);
        return Response.json({ success: true, user });
      } catch (error) {
        return Response.json({ success: false, error });
      }
    case "teacher":
      try {
        const user = await manageUserCase.AssignTeacherRole(id, {
          office: office,
          web: web,
          info: info,
        });
        return Response.json({ success: true, user });
      } catch (error) {
        return Response.json({ success: false, error });
      }
    case "manager":
      try {
        const user = await manageUserCase.AssignManagerRole(id);
        return Response.json({ success: true, user });
      } catch (error) {
        return Response.json({ success: false, error });
      }
    default:
      return Response.json({ success: false, error: "role doesn't exist" });
  }
}

export async function GET(request: NextRequest) {
  const PER_PAGE = 10;
  const params = request.nextUrl.searchParams;
  const usertype = params.get("type") || "student";
  const page = params.get("page") || "1";
  const parsed = MemberSearchRequest.safeParse({
    type: usertype,
    page: parseInt(page),
  });
  if (!parsed.success) {
    return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request",
    });
  }

  const result = await manageUserCase
    .SearchMember(parsed.data.type, parsed.data.page, PER_PAGE)
    .catch((e) => {
      console.log(e);
      return Response.json({ success: false, e });
    });

  return Response.json({ success: true, data: result });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const parsed = MenberDeleteRequestBody.safeParse(body);
  if (!parsed.success) {
    return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request body",
    });
  }

  try {
    const response = await manageUserCase.DeleteMember(parsed.data.id);
    return Response.json({ success: true, response });
  } catch (error) {
    return Response.json({ success: false, error });
  }
}

export async function PUT(request: Request) {
  const body = await request.json();
  const parsed = MenberUpdateRequestBody.safeParse(body);
  if (!parsed.success) {
    return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request body",
    });
  }
  
  const { id, password , email, cellphone, schoolClass, office, web, info } = parsed.data;

  const response = await manageUserCase
    .UpdateMember({
      id,
      password,
      email,
      cellphone,
      schoolClass,
      office,
      web,
      info,
    })
    .catch((e) => {
      console.log(e);
      return Response.json({ success: false, e });
    });

  return Response.json({ success: true, response });
}
