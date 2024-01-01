import { WithDrawCourseService } from "./module";

export async function POST(request: Request) {
    const withDrawCourseService = new WithDrawCourseService();
    try {
        const body = await request.json();
        const { studentId, courseId, semester } = body;
        
        const result = await withDrawCourseService.withdrawCourse(studentId, courseId, semester);
        return new Response(JSON.stringify({ success: true, result }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ success: false, error: error.message }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}