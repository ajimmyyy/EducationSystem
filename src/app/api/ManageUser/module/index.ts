import prisma from "@/utils/prisma";

interface CreateMenberParams {
    name: string
    password: string
    email: string
    cellphone?: string
    department?: string
}

interface DeleteMenberType {
    userid: number
}

interface UpdateMenberType {
    email?: string
    cellphone?: string
    departmentid?: number
    class?: string
    office?: string
    web?: string
    info?: string
}

export interface SearchMemberResult {
}

export class ManageUserCase {
    async CreateMember({
        name,
        password,
        email,
        cellphone,
        department
    }: CreateMenberParams) {
        const departmentData = await prisma.department.findFirst({
            where: {
                name: department,
            },
            select: {
                id: true,
            },
        });
        const departmentId = departmentData?.id || null;

        if (!departmentId) throw new Error('Department not found');

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

    async SearchMember(userType: string) {
        if (userType === 'manager') {
            return prisma.manager.findMany({
                include: {
                    user: true,
                },
            });
        } else if (userType === 'teacher') {
            return prisma.teacher.findMany({
                include: {
                    user: true,
                },
            });
        } else if (userType === 'student') {
            return prisma.student.findMany({
                include: {
                    user: true,
                },
            });
        }
        else {
            throw new Error('userType must be "student", "teacher", or "manager"');
        }
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