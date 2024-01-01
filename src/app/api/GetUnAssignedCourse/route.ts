// api/GetUnAssignedCourse/route.ts
import { NextApiResponse } from "next";
import { NextRequest } from "next/server";
import { unassignedCourseService } from "./module";

export async function GET(request: NextRequest) {
    try {
        const url = new URL(request.url);
        const studentIdParam = url.searchParams.get("studentId");
        const semester = url.searchParams.get("semester") || "";

        if (!studentIdParam || !semester) {
            throw new Error("Student ID and semester are required");
        }

        const studentId = parseInt(studentIdParam);
        if (isNaN(studentId)) {
            throw new Error("Invalid student ID");
        }

        const unassignedCourses = await unassignedCourseService.getUnassignedCourses(studentId, semester);
        return new Response(JSON.stringify({ success: true, unassignedCourses }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
