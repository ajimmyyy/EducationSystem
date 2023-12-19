import prisma from "@/utils/prisma";

interface CreateMenberType {
    name: string
    password: string
    email: string
    cellphone?: string
    departmentid?: number
}

export class AddNewUserCase {
    async CreateMember(menber: CreateMenberType) {
        const member = await prisma.User.create({
            data: menber
        });
        
        return member;
    }
}

export const addNewUserCase = new AddNewUserCase();