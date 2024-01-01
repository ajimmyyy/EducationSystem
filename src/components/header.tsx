"use client";
import { useSelectedLayoutSegments } from "next/navigation";
import { Breadcrumbs } from "./material-tailwind";
import { GuideBar } from "./guide";

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
      <GuideBar />
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
