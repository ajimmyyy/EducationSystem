"use client";
import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { Breadcrumbs } from "./material-tailwind";
import useUser from "@/hooks/useUser";
import { Button } from "@/components/material-tailwind";
import useLogout from "@/hooks/useLogout";

function LoginButton() {
  const { data } = useUser();
  const router = useRouter();
  const { logout } = useLogout();

  console.log(data?.id);
  console.log(data?.role);
  console.log(data?.name);

  if (!data?.id) {
    return (
      <Button placeholder={undefined} onClick={() => router.push("/login")}>
        登入
      </Button>
    );
  }
  return (
    <Button placeholder={undefined} onClick={() => logout()}>
      登出
    </Button>
  );
}

export default function Header() {
  const segments = useSelectedLayoutSegments().filter(
    (segment) => !segment.startsWith("("),
  );

  const breadcrumbs: {
    label: string;
    path: string;
  }[] = [
    { label: "首頁", path: "/search" },
    ...segments.map((segment) => {
      const pathSegments = segments.slice(0, segments.indexOf(segment) + 1);
      const label = (() => {
        // Remove `/courses/[id]` from breadcrumbs
        if (segments.at(0) === "course" && segment !== "course") return "";
        return pathSegments.join(".");
      })();
      const path = `/${pathSegments.join("/")}`;
      return { label, path };
    }),
  ].filter((breadcrumb) => breadcrumb.label !== "");

  return (
    <>
      <header className="sticky top-0 z-40 flex h-14 w-screen justify-center bg-white text-black shadow-md">
        <div className="container flex h-full items-center">
          <div className="flex w-full items-center justify-between text-blue-gray-900">
            <h1 className=" font-bold">北科課程網</h1>
            <div className="flex items-center gap-4">
              <LoginButton />
            </div>
          </div>
        </div>
      </header>
      <div className="flex w-full justify-center">
        <div className="container">
          <Breadcrumbs placeholder={undefined}>
            {breadcrumbs.map((breadcrumb, index) => (
              <a key={index} href={breadcrumb.path} className="opacity-60">
                {breadcrumb.label}
              </a>
            ))}
          </Breadcrumbs>
        </div>
      </div>
    </>
  );
}
