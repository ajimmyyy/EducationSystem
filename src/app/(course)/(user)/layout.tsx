import type { PropsWithChildren } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
const UserLayout = (props: PropsWithChildren) => {
  const cookie = cookies();
  const token = cookie.get("token")?.value;
  if (!token) redirect("/login");

  return props.children;
};

export default UserLayout;
