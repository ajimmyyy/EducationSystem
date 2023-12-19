import prisma from "@/utils/prisma";

export interface CreateStudentType{
    studentid: number
    class?: string
}

export interface CreateTeacherType{
    teacherid: number
    office?: string
    web?: string
    info?: string
}

export interface CreateManagerType{
    managerid: number
}

export class AssignUserRoleCase {
    async AssignStudentRole(userId: number, role: CreateStudentType) {
        const student = await prisma.student.create({
            data: role
        })

        await prisma.User.updata({
            where: {userid: userId},
            data: {
                student: { connect: { studentid: student.studentid } },
            },
        });
    }

    async AssignTeacherRole(userId: number, role: CreateTeacherType) {
        const teacher = await prisma.teacher.create({
            data: role
        })

        await prisma.User.updata({
            where: {userid: userId},
            data: {
                teacher: { connect: { teacherid: teacher.teacherid } },
            },
        });
    }

    async AssignManagerRole(userId: number, role: CreateManagerType) {
        const manager = await prisma.manager.create({
            data: role
        })
 
        await prisma.User.updata({
            where: {userid: userId},
            data: {
                manager: { connect: { managerid: manager.managerid } },
            },
        });
    }
}

export const assignUserRoleCase = new AssignUserRoleCase();