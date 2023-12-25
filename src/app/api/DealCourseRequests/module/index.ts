import prisma from "@/utils/prisma";

export class DealCourseRequest{
    async IsCourseRequestExist(courseid: number, studentid: number): Promise<boolean> {
        const courseRequest = await prisma.unassignedcourse.findFirst({
            where: {
                courseid: courseid,
                studentid: studentid,
                state: {
                    notIn: ['allow', 'deny']
                }
            }
        });
    
        if (!courseRequest) {
            return false;
        }
        return true;
    }

    async DealCourseRequest(courseid: number, studentid: number, action: string) {
        if (action == 'deny' || action == 'allow') {
            if (action == 'allow') {
                const table = await prisma.coursetable.findFirst({
                    where: { studentid: studentid }
                });
            
                const participation = await prisma.participationcourse.findFirst({
                    where: { courseid: courseid, coursetableid: table.coursetableid }
                });
            
                if (!participation) {
                    await prisma.participationcourse.create({
                        data: {
                            courseid: courseid,
                            coursetableid: table.coursetableid,
                        }
                    })
                }else
                    throw new Error("The Participation relation is exist");
                }
                
            await prisma.unassignedcourse.updateMany({
                where: {courseid: courseid, studentid: studentid},
                data: {state: action}
            })
        }else
            throw new Error("Invalid action");
    }
}

export const dealCourseRequestModule = new DealCourseRequest();
