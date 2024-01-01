import type { PropsWithChildren } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import verifyJWT from "@/utils/verify-jwt";
import { JWTToken } from "@/services/userService";

const UserLayout = (props: PropsWithChildren) => {
  const cookie = cookies();
  const token = cookie.get("token")?.value;
  if (!token) redirect("/login");
  const decoded = verifyJWT(token) as JWTToken;
  if (decoded?.role !== "manager") redirect("/login");

  return props.children;
};

export default UserLayout;
