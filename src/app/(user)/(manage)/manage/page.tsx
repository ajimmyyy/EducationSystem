"use client";
import { UserTable } from "@/components/manage/user-table";
import { DepartmentTable } from "@/components/manage/department-table";
import { ClassroomTable } from "@/components/manage/classroom-table";
import { CourseTable } from "@/components/manage/course-table";
import { Search } from "@/components/manage/search";
import { Menu } from "@/components/manage/menu";
import { useState } from "react";

// 管理員頁面
export default function Home() {
  const [keyWord, setKeyWord] = useState("");
  const [option, setOption] = useState("student");

  const renderTableBasedOnOption = () => {
    switch (option) {
      case "department":
        return <DepartmentTable type={option} keyWord={keyWord}/>;
      case "classroom":
        return <ClassroomTable type={option} keyWord={keyWord} />;
      case "course":
        return <CourseTable type={option} keyWord={keyWord} />;
      default:
        return <UserTable type={option} keyWord={keyWord} />;
    }
  };

  return (
    <main className="flex gap-1">
      <Menu addOption={setOption} />
      <div>
        <Search addOption={setKeyWord} />
        {renderTableBasedOnOption()}
      </div>
    </main>
  );
}
