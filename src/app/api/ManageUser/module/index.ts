import prisma from "@/utils/prisma";
import { PrismaClient, User as PrismaUser, Manager, Student, Teacher } from "@prisma/client";

interface CreateMenberParams {
    name: string
    password: string
    email: string
    cellphone?: string
    departmentId?: number
    schoolClass?: string
    office?: string
    web?: string
    info?: string
}

interface DeleteMenberType {
    userid: number
}

interface UpdateMenberType {
    email?: string
    cellphone?: string
    departmentId?: number
    class?: string
    office?: string
    web?: string
    info?: string
}

interface SearchMemberResult {
    userid: number
    name: string
    email: string
    cellphone: string
    departmentId: number
    schoolClass?: string
    office?: string
    web?: string
    info?: string
}

interface CreateStudentType{
    schoolClass?: string
    semester: string
}

interface CreateTeacherType{
    office?: string
    web?: string
    info?: string
}

export class ManageUserCase {
    async CreateMember({
        name,
        password,
        email,
        cellphone,
        departmentId
    }: CreateMenberParams): Promise<PrismaUser> {
        const departmentData = await prisma.department.findFirst({
            where: {
                id: departmentId,
            },
            select: {
                id: true,
            },
        });

        if (!departmentData) throw new Error('Department not found');

        const member = await prisma.user.create({
            data: {
                name,
                password,
                email,
                cellphone,
                department: {
                    connect: {
                        id: departmentId,
                    },
                },
            }
        });

        return member;
    }
    async AssignStudentRole(userId: number, role: CreateStudentType) {
        const { schoolClass, semester } = role;
        const menber = await prisma.student.create({
            data: {
                id: userId,
                class: schoolClass,
            }
        })

        await prisma.courseTable.create({
            data: {
                semester: semester,
                student: { connect: { id: menber.id } },
            }
        })

        const user = await prisma.user.update({
            where: {id: userId},
            data: {
                student: { connect: { id: menber.id } },
            },
        });

        return user
    }

    async AssignTeacherRole(userId: number, role: CreateTeacherType) {
        const teacher = await prisma.teacher.create({
            data: {
                id: userId,
                ...role,
            }
        })

        const user = await prisma.user.update({
            where: {id: userId},
            data: {
                teacher: { connect: { id: teacher.id } },
            },
        });

        return user
    }

    async AssignManagerRole(userId: number) {
        const manager = await prisma.manager.create({
            data: {
                id: userId,
            }
        })
        
        const user = await prisma.user.update({
            where: {id: userId},
            data: {
                manager: { connect: { id: manager.id } },
            },
        });

        return user
    }

    async SearchMember(userType: string): Promise<SearchMemberResult[]>{
        let result: SearchMemberResult[] = [];

        if (userType === 'manager') {
            const managers = await prisma.manager.findMany({
                include: {
                    user: true,
                },
            });
            result = managers.map((manager) => this.mapManagerToSearchMemberResult(manager));
        } 
        else if (userType === 'teacher') {
            const teachers = await prisma.teacher.findMany({
                include: {
                    user: true,
                },
            });
            result = teachers.map((teacher) => this.mapTeacherToSearchMemberResult(teacher));
        } 
        else if (userType === 'student') {
            const students = await prisma.student.findMany({
                include: {
                    user: true,
                },
            });
            result = students.map((student) => this.mapStudentToSearchMemberResult(student));
        } 
        else {
            throw new Error('userType must be "student", "teacher", or "manager"');
        }

        return result;
    }

    private mapManagerToSearchMemberResult(manager: Manager & { user: PrismaUser }): SearchMemberResult {
        return {
            userid: manager.user.id,
            name: manager.user.name,
            email: manager.user.email,
            cellphone: manager.user.cellphone || '',
            departmentId: manager.user.departmentId || 0,
        };
    }
    
    private mapTeacherToSearchMemberResult(teacher: Teacher & { user: PrismaUser }): SearchMemberResult {
        return {
            userid: teacher.user.id,
            name: teacher.user.name,
            email: teacher.user.email,
            cellphone: teacher.user.cellphone || '',
            departmentId: teacher.user.departmentId || 0,
            office: teacher.office || '',
            web: teacher.web || '',
            info: teacher.info || '',
        };
    }
    
    private mapStudentToSearchMemberResult(student: Student & { user: PrismaUser }): SearchMemberResult {
        return {
            userid: student.user.id,
            name: student.user.name,
            email: student.user.email,
            cellphone: student.user.cellphone || '',
            departmentId: student.user.departmentId || 0,
            schoolClass: student.class || '',
        };
    }

    // async DeleteMember(memberData: DeleteMenberType) {
    //     const member = await prisma.User.delete({
    //         where: {
    //             userid: memberData.userid
    //         }
    //     });

    //     return member;
    // }

    // async UpdateMember(memberId: number, memberData: UpdateMenberType) {
    //     let user = await prisma.User.findUnique({
    //         where: {
    //             userid: memberId
    //         },
    //         include: {
    //             student: true,
    //             teacher: true,
    //             manager: true,
    //         }
    //     });

    //     const updateData: any = {
    //         email: memberData.email,
    //         cellphone: memberData.cellphone,
    //         department: {
    //             connect: {
    //                 departmentid: memberData.departmentid,
    //             },
    //         }
    //     };

    //     if (user.student) {
    //         updateData.student = {
    //             update: {
    //                 class: memberData.class,
    //             },
    //         };
    //     }
    //     else if (user.teacher) {
    //         updateData.teacher = {
    //             update: {
    //                 office: memberData.office,
    //                 web: memberData.web,
    //                 info: memberData.info,
    //             },
    //         };
    //     }

    //     return await prisma.user.update({
    //         where: { userid: memberId },
    //         data: updateData,
    //         include: {
    //             student: Boolean(user.student),
    //             teacher: Boolean(user.teacher),
    //             manager: Boolean(user.manager),
    //         },
    //     });
    // }
}

export const manageUserCase = new ManageUserCase();