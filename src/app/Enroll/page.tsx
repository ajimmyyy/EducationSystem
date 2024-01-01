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
    name: "王小明",
    department: "資工三"
  };

  // 每當selectedCourseId改變時，刷新課程列表
  useEffect(() => {
    if (selectedCourseId) {
      searchCourses.refetch();
    }
  }, [selectedCourseId, searchCourses]);

  // 加選課程的處理函數 
  const handleEnroll = async (courseId: number) => {
    try {
      await enrollCourse.mutateAsync(courseId); // 假設這是發送加選請求的函數
      setSelectedCourseId(courseId); // 更新選擇的課程ID以觸發列表刷新
    } catch (error) {
      console.error('加選失敗：', error);
      // 處理錯誤情況
    }
  };

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
