import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import verifyJWT from "@/utils/verify-jwt";
import { JWTToken } from "@/services/userService";

export default async function Course() {
  const cookie = cookies();
  const token = cookie.get("token")?.value;
  if (!token) 
    return redirect("/search");
  const decoded = verifyJWT(token) as JWTToken;
  console.log(decoded);
  if (decoded?.role == "teacher")
    return redirect("/teacher");
  redirect("/search");
}
