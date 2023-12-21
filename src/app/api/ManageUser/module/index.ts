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
}

export const manageUserCase = new ManageUserCase();