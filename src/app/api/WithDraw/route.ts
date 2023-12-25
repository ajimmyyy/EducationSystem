import { WithdrawCourseCase, WithdrawCourseInput } from "./module";

const withdrawCourseCase = new WithdrawCourseCase();

export async function POST(request: Request) {
    try {
        const body = await request.json() as WithdrawCourseInput;
        const response = await withdrawCourseCase.removeCourseFromTable(body);

        return new Response(JSON.stringify({ success: true, response }), {
            headers: { 'Content-Type': 'application/json' }
        });
    } catch (error : any) {
        return new Response(JSON.stringify({ success: false, error : error.message }), {
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
