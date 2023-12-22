import { addCourseTable } from "./module";

export async function POST(request: Request) {
  const body = await request.json();
  try {
    const courseTable = await addCourseTable.CreateCourseTable(body);
    return Response.json({ success: true, courseTable });
  } catch (e) {
    return Response.json({ success: false, e });
  }
}
