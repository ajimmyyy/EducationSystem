"use client";
import React, { useState, useEffect } from "react";
import { useSearchCourses } from "../../hooks/useSearchCourses";
import { DefaultTable } from "../../components/EnrollCourse/EnrollcourseTable";
import { UserInform } from "../../components/EnrollCourse/UserInform";
import { EnrollObject } from "../../components/EnrollCourse/SearchEnrollCourse";
import useUser from "@/hooks/useUser";
import { useSearchUser } from "@/hooks/useSearchUser";

interface StudentInfoProps {
  studentId: number;
  name: string;
  department: string;
}

const EnrollPage = () => {
  const { data } = useUser();
  const searchCourses = useSearchCourses();
  const [selectedCourseId] = useState<number | null>(null);
  const [studentInfo, setStudentInfo] = useState<StudentInfoProps>({} as StudentInfoProps);

  //刷新學生資料
  const user = useSearchUser(data?.id ?? 0).data?.user;
  useEffect(() => {
    if (user) {
      const { id, name, department } = user;
      setStudentInfo({
        studentId: id,
        name: name,
        department: department?.name ?? "Not Find",
      });
    }
  }, [user]);

  // 每當selectedCourseId改變時，刷新課程列表
  useEffect(() => {
    if (selectedCourseId) {
      searchCourses.refetch();
    }
  }, [selectedCourseId, searchCourses]);

  return (
    <div className="flex w-full max-w-full flex-col">
      <div className="flex flex-row justify-between">
        <UserInform studentInfo={studentInfo} />
        <EnrollObject />
      </div>
      <div className="w-full">
        <DefaultTable />
      </div>
    </div>
  );
};

export default EnrollPage;
