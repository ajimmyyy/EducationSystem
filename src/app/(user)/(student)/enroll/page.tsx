"use client";
import React, { useState, useEffect } from "react";
import { useSearchCourses } from "../../../../hooks/useSearchCourses";
import { DefaultTable } from "../../../../components/enroll-course/EnrollcourseTable";
import { UserInform } from "../../../../components/enroll-course/UserInform";
import { EnrollObject } from "../../../../components/enroll-course/SearchEnrollCourse";
import useUser from "@/hooks/useUser";

function EnrollPage() {
  const searchCourses = useSearchCourses();
  const [selectedCourseId] = useState<number | null>(null);
  const { data: user } = useUser();

  useEffect(() => {
    if (selectedCourseId) {
      searchCourses.refetch();
    }
  }, [selectedCourseId, searchCourses]);

  if (!user) {
    return null;
  }
  return (
    <div className="flex w-full max-w-full flex-col">
      <div className="flex flex-row justify-between">
        <UserInform studentInfo={user} />
        <EnrollObject />
      </div>
      <div className="w-full">
        <DefaultTable />
      </div>
    </div>
  );
}

export default EnrollPage;
