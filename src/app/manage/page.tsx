"use client";
import { UserTable } from "@/components/manage/user-table";
import { DepartmentTable } from "@/components/manage/department-table";
import { ClassroomTable } from "@/components/manage/classroom-table";
import { CourseTable } from "@/components/manage/course-table";
import { Search } from "@/components/manage/search";
import { Menu } from "@/components/manage/menu";
import { useState, useEffect} from "react";

// 管理員頁面
export default function Home() {
  const [option, setOption] = useState("student");

  const renderTableBasedOnOption = () => {
    switch (option) {
      case "department":
        return <DepartmentTable userType={option} />;
      case "classroom":
        return <ClassroomTable userType={option}/>;
      case "course":
        return <CourseTable userType={option}/>;
      default:
        return <UserTable userType={option}/>;
    }
  };

  return (
    <main className="flex">
      <Menu addOption={setOption}/>
      <div>
        <Search/>
        {renderTableBasedOnOption()}
      </div>
    </main>
  );
}