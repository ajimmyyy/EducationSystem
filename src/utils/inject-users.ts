import prisma from "@/utils/prisma";
import sha256 from "crypto-js/sha256";

const mockStudentUserData = [
  {
    name: "Mock Student 1",
    password: sha256("A000000001").toString(),
    email: "s1@ntut.org.tw",
    cellphone: "0912345678",
  },
  {
    name: "Mock Student 2",
    password: sha256("A000000002").toString(),
    email: "s2@ntut.org.tw",
    cellphone: "0912345678",
  },
  {
    name: "Mock Student 3",
    password: sha256("A000000003").toString(),
    email: "s3@ntut.org.tw",
    cellphone: "0912345678",
  },
];

const mockTeacherUserData = [
  {
    name: "Mock Teacher 1",
    password: sha256("T000000001").toString(),
    email: "t1@ntut.org.tw",
    cellphone: "0912345678",
  },
  {
    name: "Mock Teacher 2",
    password: sha256("T000000002").toString(),
    email: "t2@ntut.org.tw",
    cellphone: "0912345678",
  },
  {
    name: "Mock Teacher 3",
    password: sha256("T000000003").toString(),
    email: "t3@ntut.org.tw",
    cellphone: "0912345678",
  },
];

const mockManagerUserData = [
  {
    name: "Mock Manager 1",
    password: sha256("00000000").toString(),
    email: "m1@ntut.org.tw",
    cellphone: "0912345678",
  },
];

export async function injectUsersData() {
  await prisma.student.deleteMany();
  await prisma.courseTable.deleteMany();
  await prisma.collectCourse.deleteMany();
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: mockStudentUserData,
  });
  const studentUsers = await prisma.user.findMany();

  await prisma.$transaction(
    studentUsers.map((user) => {
      return prisma.student.create({
        data: {
          id: user.id,
        },
      });
    }),
  );

  await prisma.user.createMany({
    data: mockTeacherUserData,
  });
  const teacherUsers = await prisma.user.findMany({
    where: {
      student: null,
    },
  });

  await prisma.$transaction(
    teacherUsers.map((user) => {
      return prisma.teacher.create({
        data: {
          id: user.id,
        },
      });
    }),
  );

  await prisma.user.createMany({
    data: mockManagerUserData,
  });

  const managerUsers = await prisma.user.findMany({
    where: {
      student: null,
      teacher: null,
    },
  });

  await prisma.$transaction(
    managerUsers.map((user) => {
      return prisma.manager.create({
        data: {
          id: user.id,
        },
      });
    }),
  );
}
