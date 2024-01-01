import prisma from "@/utils/prisma";
import { User as PrismaUser } from "@prisma/client";

interface CreateMenberParams {
  name: string;
  password: string;
  email: string;
  cellphone?: string;
  department?: string;
  schoolClass?: string;
  office?: string;
  web?: string;
  info?: string;
}

interface UpdateMenberType {
  id: number;
  email?: string;
  cellphone?: string;
  schoolClass?: string;
  office?: string;
  web?: string;
  info?: string;
}

interface SearchMemberResult {
  id: number;
  name: string;
  email: string;
  cellphone: string;
  department: string;
  schoolClass?: string;
  office?: string;
  web?: string;
  info?: string;
}

interface CreateTeacherType {
  office?: string;
  web?: string;
  info?: string;
}

export class ManageUserCase {
  async CreateMember({
    name,
    password,
    email,
    cellphone,
    department,
  }: CreateMenberParams): Promise<PrismaUser> {
    const departmentData = await prisma.department.findFirst({
      where: {
        name: department,
      },
      select: {
        id: true,
      },
    });
    const departmentId = departmentData?.id;
    if (!departmentId) throw new Error("Department not found");

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
      },
    });

    return member;
  }
  async AssignStudentRole(userId: number, schoolClass?: string) {
    const menber = await prisma.student.create({
      data: {
        id: userId,
        class: schoolClass,
      },
    });

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        student: { connect: { id: menber.id } },
      },
    });

    return user;
  }

  async AssignTeacherRole(userId: number, role: CreateTeacherType) {
    const teacher = await prisma.teacher.create({
      data: {
        id: userId,
        ...role,
      },
    });

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        teacher: { connect: { id: teacher.id } },
      },
    });

    return user;
  }

  async AssignManagerRole(userId: number) {
    const manager = await prisma.manager.create({
      data: {
        id: userId,
      },
    });

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        manager: { connect: { id: manager.id } },
      },
    });

    return user;
  }

  async SearchMember(
    userType: string,
    page: number,
    perPage: number,
  ): Promise<SearchMemberResult[]> {
    let result: SearchMemberResult[] = [];

    if (userType === "manager") {
      const managers = await prisma.manager.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          user: {
            include: {
              department: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      result = managers.map(
        (manager) =>
          ({
            id: manager.id,
            name: manager.user.name,
            email: manager.user.email,
            cellphone: manager.user.cellphone || "",
            department: manager.user.department
              ? manager.user.department.name
              : "",
          }) as SearchMemberResult,
      );
    } else if (userType === "teacher") {
      const teachers = await prisma.teacher.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          user: {
            include: {
              department: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      result = teachers.map(
        (teacher) =>
          ({
            id: teacher.id,
            name: teacher.user.name,
            email: teacher.user.email,
            cellphone: teacher.user.cellphone || "",
            department: teacher.user.department
              ? teacher.user.department.name
              : "",
            office: teacher.office || "",
            web: teacher.web || "",
            info: teacher.info || "",
          }) as SearchMemberResult,
      );
    } else if (userType === "student") {
      const students = await prisma.student.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        include: {
          user: {
            include: {
              department: {
                select: {
                  name: true,
                },
              },
            },
          },
        },
      });
      result = students.map(
        (student) =>
          ({
            id: student.id,
            name: student.user.name,
            email: student.user.email,
            cellphone: student.user.cellphone || "",
            department: student.user.department
              ? student.user.department.name
              : "",
            schoolClass: student.class || "",
          }) as SearchMemberResult,
      );
    } else {
      throw new Error('userType must be "student", "teacher", or "manager"');
    }

    return result;
  }

  async DeleteMember(userId: number) {
    const member = await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    return member;
  }

  async UpdateMember({
    id,
    email,
    cellphone,
    schoolClass,
    office,
    web,
    info,
  }: UpdateMenberType) {
    let member = await prisma.user.findUnique({
      where: {
        id: id,
      },
      include: {
        student: true,
        teacher: true,
        manager: true,
      },
    });

    if (!member) throw new Error("Member not found");

    const updateData: any = {
      email: email,
      cellphone: cellphone,
    };

    if (member.student) {
      updateData.student = {
        update: {
          class: schoolClass,
        },
      };
    } else if (member && member.teacher) {
      updateData.teacher = {
        update: {
          office: office,
          web: web,
          info: info,
        },
      };
    }

    return await prisma.user.update({
      where: { id: id },
      data: updateData,
      include: {
        student: Boolean(member.student),
        teacher: Boolean(member.teacher),
        manager: Boolean(member.manager),
      },
    });
  }
}

export const manageUserCase = new ManageUserCase();
