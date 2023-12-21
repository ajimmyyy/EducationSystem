import prisma from "@/utils/prisma";

interface CourseTableType{
    semester: string
}

interface StudentType{
    studentid: number
    class?: string
}

interface CreateStudentType{
    student: StudentType
    coursetable: CourseTableType
}

interface CreateTeacherType{
    teacherid: number
    office?: string
    web?: string
    info?: string
}

interface CreateManagerType{
    managerid: number
}

export class AssignUserRoleCase {
    async IsAssignable(userId: number): Promise<boolean>{
        const user = await prisma.user.findUnique({
            where: { userid: userId },
            include: {
            manager: true,
            student: true,
            teacher: true,
            },
        });

        const isAssignable =
            user.manager === null && user.student === null && user.teacher === null;
    
        return isAssignable;
    }

    async AssignStudentRole(userId: number, role: CreateStudentType) {
        const { coursetable, student } = role;
        const menber = await prisma.student.create({
            data: student
        })

        await prisma.coursetable.create({
            data: {
                semester: coursetable.semester,
                student: { connect: { studentid: menber.studentid } },
            }
        })

        const user = await prisma.User.updata({
            where: {userid: userId},
            data: {
                student: { connect: { studentid: student.studentid } },
            },
        });

        return user
    }

    async AssignTeacherRole(userId: number, role: CreateTeacherType) {
        const teacher = await prisma.teacher.create({
            data: role
        })

        const user = await prisma.User.updata({
            where: {userid: userId},
            data: {
                teacher: { connect: { teacherid: teacher.teacherid } },
            },
        });

        return user
    }

    async AssignManagerRole(userId: number, role: CreateManagerType) {
        const manager = await prisma.manager.create({
            data: role
        })
        
        const user = await prisma.User.update({
            where: {userid: userId},
            data: {
                manager: { connect: { managerid: manager.managerid } },
            },
        });

        return user
    }
}

export const assignUserRoleCase = new AssignUserRoleCase();