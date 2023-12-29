"use client";
import { EditUserInfo } from "@/components/manage/edit-info";
import { Search } from "@/components/manage/search";
import { Menu } from "@/components/manage/menu";
import { useState, useEffect} from "react";

// 管理員頁面
export default function Home() {
  const [option, setOption] = useState("");
  useEffect(() => {
    setOption("student");
  }, []);

  return (
    <main className="flex">
      <Menu addOption={setOption}/>
      <div>
        <Search/>
        <EditUserInfo userType={option}/>
      </div>
    </main>
  );
}