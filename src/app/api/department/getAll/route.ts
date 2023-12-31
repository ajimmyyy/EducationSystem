import departmentService from "@/services/departmentService";

export async function GET() {
  const result = await departmentService.getDepartments().catch((e) => {
    Response.error();
    return Response.json({
      success: false,
      message: e.message,
    });
  });

  return Response.json({
    success: true,
    ...result,
  });
}
