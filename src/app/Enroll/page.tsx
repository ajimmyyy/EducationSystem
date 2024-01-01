"use client";
import React, { useState, useEffect } from 'react';
import { useSearchCourses } from '../../hooks/useSearchCourses';
import { useEnrollCourse } from '../../hooks/useEnrollCourse';
import { DefaultTable } from '../../components/EnrollCourse/EnrollcourseTable';
import { UserInform } from '../../components/EnrollCourse/UserInform';
import { EnrollObject } from '../../components/EnrollCourse/SearchEnrollCourse';

const EnrollPage = () => {
  const searchCourses = useSearchCourses();
  const enrollCourse = useEnrollCourse();
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const studentInfo = {
    studentId: 8901000,
    name: "賴清德",
    department: "資工三"
  };

  // 每當selectedCourseId改變時，刷新課程列表
  useEffect(() => {
    if (selectedCourseId) {
      searchCourses.refetch();
    }
  }, [selectedCourseId, searchCourses]);

  return (
    <div className="w-full max-w-full flex flex-col">
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
