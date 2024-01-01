import prisma from "@/utils/prisma";
import sha256 from "crypto-js/sha256";

const fakeStudentUserData = [
  {
    name: "Mock Student 1",
    password: sha256("A000000001").toString(),
    email: "t1@ntut.org.tw",
    cellphone: "0912345678",
  },
  {
    name: "Mock Student 2",
    password: sha256("A000000002").toString(),
    email: "t2@ntut.org.tw",
    cellphone: "0912345678",
  },
  {
    name: "Mock Student 3",
    password: sha256("A000000003").toString(),
    email: "t3@ntut.org.tw",
    cellphone: "0912345678",
  },
];

export async function injectUsersData() {
  await prisma.student.deleteMany();
  await prisma.courseTable.deleteMany();
  await prisma.collectCourse.deleteMany();
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: fakeStudentUserData,
  });
  const users = await prisma.user.findMany();

  await prisma.$transaction(
    users.map((user) => {
      return prisma.student.create({
        data: {
          id: user.id,
        },
      });
    }),
  );
}
