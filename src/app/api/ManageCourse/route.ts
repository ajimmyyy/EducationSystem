import { z } from "zod";
import { manageCourseCase } from "./module";
import { NextRequest } from "next/server";

const CourseCreateRequestBody = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  credit: z.number(),
  phase: z.number(),
  studentQuota: z.number(),
  syllabus: z.string().optional(),
  progress: z.string().optional(),
  grading: z.string().optional(),
  textbook: z.string().optional(),
  note1: z.string().optional(),
  note2: z.string().optional(),
  semester: z.string().optional(),
  isEnglishTaught: z.boolean().default(false),
  teacherId: z.number(),
  departmentId: z.number(),
  schedules: z.array(
    z.object({
      weekday: z.number(),
      classroomId: z.number(),
      intervals: z.array(z.string()),
    })
  ),
});

const CourseSearchRequest = z.object({
  page: z.number().refine(value => value > 0, {
    message: "Value must be a non-zero positive integer"
  }),
});

export async function GET(request: NextRequest) {
  const PER_PAGE = 10;
  const params = request.nextUrl.searchParams;
  const page = params.get("page") || "1";
  const parsed = CourseSearchRequest.safeParse({ page: parseInt(page) });
  if (!parsed.success) {
    return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request",
    });
  }

  const result = await manageCourseCase
    .SearchCourse(parsed.data.page, PER_PAGE)
    .catch((e) => {
      console.log(e);
      return Response.json({ success: false, e });
    });

  return Response.json({ success: true, data: result });
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = CourseCreateRequestBody.safeParse(body);
  if (!parsed.success) {
    return Response.json(parsed.error, {
      status: 400,
      statusText: "invalid request body",
    });
  }

  const {
    code,
    name,
    credit,
    phase,
    studentQuota,
    syllabus,
    progress,
    grading,
    textbook,
    note1,
    note2,
    semester,
    isEnglishTaught,
    teacherId,
    departmentId,
    schedules,
  } = parsed.data;

  const isAvailable = await manageCourseCase.CheckCourseAvailability(teacherId, schedules);
  if (!isAvailable) {
    return Response.json({ success: false, error: "Classroom or teacher is not available during the specified time." });
  }

  const result = await manageCourseCase
    .CreateCourse(
      {
        code,
        name,
        credit,
        phase,
        studentQuota,
        syllabus,
        progress,
        grading,
        textbook,
        note1,
        note2,
        semester,
        isEnglishTaught,
      },
      teacherId,
      departmentId,
      schedules
    )
    .catch((e) => {
      console.log(e);
      return Response.json({ success: false, e });
    });
  return Response.json({ success: true, result });
}

// export async function DELETE(request: Request) {
//   const body = await request.json();

//   try {
//     await manageCourseCase.DeleteCourse(body);
//     return Response.json({ success: true });
//   } catch (error) {
//     return Response.json({ success: false, error });
//   }
// }