"use client"
import React, { useState } from 'react';

import { useSearchCourses } from '../../hooks/useSearchCourses';
import { useEnrollCourse } from '../../hooks/useEnrollCourse';
import { DefaultTable } from '../../components/EnrollCourse/CourseTable';


const EnrollPage = () => {
  const searchCourses = useSearchCourses();
  const enrollCourse = useEnrollCourse();
  const [selectedCourseId, setSelectedCourseId] = useState(null);
  const studentInfo = {
    studentId: "B08901000",
    name: "王小明",
    department: "資工三"
  };

  const handleEnroll = (courseId: number) => {
    enrollCourse.mutate(courseId, {
      onSuccess: () => {
        // 加選成功的操作，例如刷新列表或顯示提示
      },
      onError: () => {
        // 加選失敗的操作，例如顯示錯誤信息
      }
    });
  };

  return (
    <div className="w-full max-w-full flex flex-col">
      <div className="w-full">
        <DefaultTable />
      </div>
    </div>
   );   
};

export default EnrollPage;
