import { z } from "zod";
import { manageClassroomCase } from "./module";
import { NextRequest } from "next/server";

const ClassroomCreateRequestBody = z.object({
  location: z.string(),
  buildingid: z.number().optional(),
});

const ClassroomSearchRequest = z.object({
  page: z.number().refine(value => value > 0, {
    message: "Value must be a non-zero positive integer"
  }),
  keyword: z.string().optional(),
});

const ClassroomDeleteRequestBody = z.object({
  id: z.number().refine(value =>
    value > 0,
    {
      message: "Value must be a non-zero positive integer"
    }
  )
});


export async function POST(request: Request) {
  const body = await request.json();
  if (typeof body.buildingid === 'string') {
    body.buildingid = parseInt(body.buildingid, 10);
  }
  const parsed = ClassroomCreateRequestBody.safeParse(body);
  if (!parsed.success) {
    return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request body",
    });
  }

  const { location, buildingid } = parsed.data;
  const response = await manageClassroomCase
    .CreateClassroom({
      location,
      buildingid,
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
  const parsed = ClassroomSearchRequest.safeParse({ page: parseInt(page), keyword: keyword});
  if (!parsed.success) {
    return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request",
    });
  }

  const result = await manageClassroomCase
    .SearchClassroom(parsed.data.page, parsed.data.keyword ?? "", PER_PAGE)
    .catch((e) => {
      console.log(e);
      return Response.json({ success: false, e });
    });

  return Response.json({ success: true, data: result });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const parsed = ClassroomDeleteRequestBody.safeParse(body);
  if (!parsed.success) {
    return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request body",
    });
  }

  try {
    const response = await manageClassroomCase.DeleteClassroom(parsed.data.id);
    return Response.json({ success: true, response })
  } catch (error) {
    return Response.json({ success: false, error });
  }
}