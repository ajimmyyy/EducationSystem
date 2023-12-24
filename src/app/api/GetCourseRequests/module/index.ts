import prisma from "@/utils/prisma";

export async function GetCourseRequest(teacherID: number) {
    const courseRequests = await prisma.unassignedcourse.findMany({
        where: {
            course:{
                teacherid: teacherID
            },
            state: {
                notIn: ["allow", "deny"],
            },
        },  
        orderBy: {
            requesttime: 'desc'
        },
    });
    return courseRequests;
}