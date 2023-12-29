"use client";
import ParsedParamsProvider from "@/hooks/useQueryParams";
import { EditStudentInfo } from "@/components/manage/edit-info";
import { Search } from "@/components/manage/search";
import { Menu } from "@/components/manage/menu";

export default function Home() {
    return (
      <main className="flex">
        <Menu/>
        <div>
          <Search/>
          <EditStudentInfo/>
        </div>
      </main>
    );
  }