import { AddNewCourseCase, CreateCourseInput } from "./module";

const addNewCourseCase = new AddNewCourseCase();

export async function POST(request: Request) {
    try {
        const body = await request.json() as CreateCourseInput;
        const addedCourse = await addNewCourseCase.addCourseToTable(body);

        return new Response(JSON.stringify({ success: true, addedCourse }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error: any) {
        return new Response(JSON.stringify({ success: false, error: error.message}), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}