import prisma from "@/utils/prisma";

interface CreateMenberType {
    name: string
    password: string
    email: string
    cellphone?: string
    departmentid?: number
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

export class ManageUserCase {
    async CreateMember(memberData: CreateMenberType) {
        const member = await prisma.User.create({
            data: memberData
        });
        
        return member;
    }

    async DeleteMember(memberData: DeleteMenberType) {
        const member = await prisma.User.delete({
            where: {
                userid: memberData.userid
            }
        });

        return member;
    }

    async UpdateMember(memberId: number, memberData: UpdateMenberType) {
        let user = await prisma.User.findUnique({
            where: {
                userid: memberId
            },
            include: {
                student: true,
                teacher: true,
                manager: true,
            }
        });

        const updateData: any = {
            email: memberData.email,
            cellphone: memberData.cellphone,
            department: {
                connect: {
                    departmentid: memberData.departmentid,
                },
            }
        };
        
        if (user.student) {
            updateData.student = {
                update: {
                    class: memberData.class,
                },
            };
        }
        else if (user.teacher) {
            updateData.teacher = {
                update: {
                    office: memberData.office,
                    web: memberData.web,
                    info: memberData.info,
                },
            };
        }

        return await prisma.user.update({
            where: { userid: memberId },
            data: updateData,
            include: {
                student: Boolean(user.student),
                teacher: Boolean(user.teacher),
                manager: Boolean(user.manager),
            },
        });
    }
}

export const manageUserCase = new ManageUserCase();