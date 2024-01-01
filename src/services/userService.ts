import prisma from "@/utils/prisma";
import sha256 from "crypto-js/sha256";
import jwt from "jsonwebtoken";

const secretKey = process.env.JWT_SECRET || "w53ybxytdqbylwgqs1qotuuuyn3aolc3";

export interface JWTToken {
  id: number;
  name: string;
  role: "student" | "teacher" | "manager";
}

async function login(sid: number, password: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: sid,
    },
    include: {
      student: true,
      teacher: true,
      manager: true,
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
    role,
  };
}

export default {
  login,
  me,
};
