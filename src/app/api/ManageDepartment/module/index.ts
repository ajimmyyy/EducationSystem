import prisma from "@/utils/prisma";

interface CreateDepartmentType {
    name: string
    email?: string
    phone?: string
}

interface DeleteDepartmentType {
    departmentid: number
}

export class ManageDepartmentCase {
    async CreateDepartment(department: CreateDepartmentType) {
        const newDepartment = await prisma.department.create({
            data: department
        });
        
        return newDepartment;
    }

    async DeleteDepartment(departmentData: DeleteDepartmentType) {
        const department = await prisma.department.delete({
            where: {
                id: departmentData.departmentid
            }
        });

        return department;
    }

    async IsDepartmentExist(departmentData: CreateDepartmentType): Promise<boolean> {
        const department = await prisma.department.findFirst({
            where: {
                name: departmentData.name,
            }
        });

        if(department !== null) {
            return true;
        }
        return false;
    }
}

export const manageDepartmentCase = new ManageDepartmentCase();