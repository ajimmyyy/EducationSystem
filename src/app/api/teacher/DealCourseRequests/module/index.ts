import prisma from "@/utils/prisma";

export class DealCourseRequest{
    async IsCourseRequestExist(courseId: number, courseTableId: number): Promise<boolean> {
        const courseRequest = await prisma.unassignedCourse.findFirst({
            where: {
                courseId: courseId,
                courseTableId: courseTableId,
                state: {
                    notIn: ["success", 'fail']
                }
            }
        });
    
        if (!courseRequest) {
            return false;
        }
        return true;
    }

    async DealCourseRequest(courseid: number, courseTableId: number, action: string) {
        if (action == 'fail' || action == 'success') {
            if (action == 'success') {
                const participation = await prisma.participationCourse.findFirst({
                    where: { courseId: courseid, courseTableId: courseTableId }
                });
            
                if (!participation) {
                    await prisma.participationCourse.create({
                        data: {
                            courseId: courseid,
                            courseTableId: courseTableId,
                        }
                    })
                }else
                    throw new Error("The Participation relation is exist");
                }
                
            await prisma.unassignedCourse.updateMany({
                where: {courseId: courseid, courseTableId: courseTableId},
                data: {state: action}
            })
        }else
            throw new Error("Invalid action");
    }
}

export const dealCourseRequestModule = new DealCourseRequest();
