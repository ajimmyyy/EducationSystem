import prisma from "@/utils/prisma";

interface CreateDepartmentType {
    departmentname: string
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
                departmentid: departmentData.departmentid
            }
        });

        return department;
    }

    async IsDepartmentExist(departmentData: CreateDepartmentType): Promise<boolean> {
        const department = await prisma.department.findFirst({
            where: {
                departmentname: departmentData.departmentname,
            }
        });

        if(department !== null) {
            return true;
        }
        return false;
    }
}

export const manageDepartmentCase = new ManageDepartmentCase();