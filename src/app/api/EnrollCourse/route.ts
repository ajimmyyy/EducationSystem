import { EnrollCourseCase, CreateCourseInput } from "./module";

const addNewCourseCase = new EnrollCourseCase();

export async function POST(request: Request) {
    try {
        const body = await request.json() as CreateCourseInput;
        const addedCourse = await addNewCourseCase.enrollCourseToTable(body);

        return new Response(JSON.stringify({ success: true, addedCourse }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ success: false, error: error.message}), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}