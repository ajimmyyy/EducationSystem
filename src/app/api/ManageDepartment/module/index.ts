import prisma from "@/utils/prisma";

interface CreateDepartmentType {
  name: string
  email: string
  phone?: string
}

export class ManageDepartmentCase {
  async CreateDepartment(department: CreateDepartmentType) {
    const newDepartment = await prisma.department.create({
      data: department
    });

    return newDepartment;
  }

  async SearchDepartment(page: number, keyword: string, perPage: number) {
    let whereClause = {};

    if (keyword) {
      whereClause = {
        OR: [
          {
            id: {
              equals: parseInt(keyword) || 0,
            },
          },
          {
            name: {
              contains: keyword,
            },
          },
          {
            email:{
              contains: keyword,
            },
          },
          {
            phone: keyword,
          },
        ],
      }
    }

    const department = await prisma.department.findMany({
      where: whereClause,
      skip: (page - 1) * perPage,
      take: perPage,
      orderBy: {
        id: "asc"
      }
    });

    return department
  }

  async DeleteDepartment(departmentId: number) {
    const department = await prisma.department.delete({
      where: {
        id: departmentId
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

    if (department !== null) {
      return true;
    }
    return false;
  }
}

export const manageDepartmentCase = new ManageDepartmentCase();