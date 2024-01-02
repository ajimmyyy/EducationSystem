import { Select } from "@material-tailwind/react";
import prisma from "@/utils/prisma";
import sha256 from "crypto-js/sha256";
import jwt from "jsonwebtoken";
import { Prisma } from "@prisma/client";

const secretKey = process.env.JWT_SECRET || "w53ybxytdqbylwgqs1qotuuuyn3aolc3";

export interface JWTToken {
  id: number;
  name: string;
  department: string | null;
  role: "student" | "teacher" | "manager";
}

export type FullUser = Prisma.UserGetPayload<{
  include: {
    student: true;
    teacher: true;
    manager: true;
    department: true;
  };
}>;

async function login(sid: number, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: sid,
    },
    include: {
      student: true,
      teacher: true,
      manager: true,
      department: true,
    },
  });

  if (!user) {
    throw new Error("user not found");
  }

  const hashPassword = sha256(password).toString();

  if (hashPassword !== user.password) {
    throw new Error("password incorrect");
  }

  const role: "student" | "teacher" | "manager" = user.student
    ? "student"
    : user.teacher
      ? "teacher"
      : user.manager
        ? "manager"
        : "student";

  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      department: user.department?.name,
      role,
    } as JWTToken,
    secretKey,
    { expiresIn: "1h" },
  );

  return {
    token,
  };
}

async function me(token: string) {
  const decoded = jwt.verify(token, secretKey) as JWTToken;

  const user = await prisma.user.findUnique({
    where: {
      id: decoded.id,
    },
    include: {
      student: true,
      teacher: true,
      manager: true,
      department: true,
    },
  });

  if (!user) {
    throw new Error("user not found");
  }

  const role: "student" | "teacher" | "manager" = user.student
    ? "student"
    : user.teacher
      ? "teacher"
      : user.manager
        ? "manager"
        : "student";

  return {
    id: user.id,
    name: user.name,
    department: user.department?.name,
    role,
  };
}

async function getUserById(id: number) {
  const user = await prisma.user.findUnique({
    where: {
      id,
    },
    include: {
      student: true,
      teacher: true,
      manager: true,
      department: true,
    },
  });
  return {
    user,
  };
}

export default {
  login,
  me,
  getUserById,
};
