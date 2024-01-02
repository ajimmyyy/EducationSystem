import { z } from "zod";
import { manageDepartmentCase } from "./module";
import { NextRequest } from "next/server";

const DeparmentCreateRequestBody = z.object({
  name: z.string(),
  email: z.string().email(),
  phone: z.string().refine((value) => value.length === 10 && value.startsWith('09'), {
    message: 'Cellphone must be 10 characters long and start with "09"',
  }).optional(),
});

const DepartmentSearchRequest = z.object({
  page: z.number().refine(value => value > 0, {
    message: "Value must be a non-zero positive integer"
  }),
  keyword: z.string().optional(),
});

const DepartmentDeleteRequestBody = z.object({
  id: z.number().refine(value =>
    value > 0,
    {
      message: "Value must be a non-zero positive integer"
    }
  )
});

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = DeparmentCreateRequestBody.safeParse(body);
  if (!parsed.success) {
    return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request body",
    });
  }

  const { name, email, phone } = parsed.data;
  const response = await manageDepartmentCase
    .CreateDepartment({
      name,
      email,
      phone,
    })
    .catch((e) => {
      console.log(e);
      return Response.json({ success: false, e });
    });
  return Response.json({ success: true, data: response });
}

export async function GET(request: NextRequest) {
  const PER_PAGE = 10;
  const params = request.nextUrl.searchParams;
  const page = params.get("page") || "1";
  const keyword = params.get("keyword") || "";
  const parsed = DepartmentSearchRequest.safeParse({ page: parseInt(page), keyword: keyword});
  if (!parsed.success) {
    return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request",
    });
  }

  const result = await manageDepartmentCase
    .SearchDepartment(parsed.data.page, parsed.data.keyword ?? "", PER_PAGE)
    .catch((e) => {
      console.log(e);
      return Response.json({ success: false, e });
    });

  return Response.json({ success: true, data: result });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const parsed = DepartmentDeleteRequestBody.safeParse(body);
  if (!parsed.success) {
    return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request body",
    });
  }

  try {
    const response = await manageDepartmentCase.DeleteDepartment(parsed.data.id);
    return Response.json({ success: true, response })
  } catch (error) {
    return Response.json({ success: false, error });
  }
}