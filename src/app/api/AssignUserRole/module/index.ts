import prisma from "@/utils/prisma";

interface CourseTableType{
    semester: string
}

interface StudentType{
    class?: string
}

interface CreateStudentType{
    student: StudentType
    coursetable: CourseTableType
}

interface CreateTeacherType{
    office?: string
    web?: string
    info?: string
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
            data: {
                studentid: userId,
                ...student
            }
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
                student: { connect: { studentid:  menber.studentid } },
            },
        });

        return user
    }

    async AssignTeacherRole(userId: number, role: CreateTeacherType) {
        const teacher = await prisma.teacher.create({
            data: {
                teacherid: userId,
                ...role
            }
        })

        const user = await prisma.User.updata({
            where: {userid: userId},
            data: {
                teacher: { connect: { teacherid: teacher.teacherid } },
            },
        });

        return user
    }

    async AssignManagerRole(userId: number) {
        const manager = await prisma.manager.create({
            data: {
                managerid: userId,
            }
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