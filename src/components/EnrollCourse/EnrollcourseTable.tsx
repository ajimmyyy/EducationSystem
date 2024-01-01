import React, { useState, useEffect } from 'react';
import { Card, Typography, Button } from "@material-tailwind/react";
import { MdCreate } from "react-icons/md";
import AlertWindows from './AlertWindowsWithDraw';

const TABLE_HEAD = ["State", "Course Name", "Course ID", ""];
const studentId = 748; 
const semester = "112-1"; 

type Course = {
  id: number;
  name: string;
  code: string;
};
type CourseResponse = {
  course: {
    id: number;
    code: string;
    name: string;
  };
  courseTable: {
    id: number;
    semester: string;
    studentId: number;
  };
};

export function DefaultTable() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isEditAlertOpen, setIsEditAlertOpen] = useState(false);
  const [editAlertMessage, setEditAlertMessage] = useState('');
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`/api/GetParticipationCourse?studentId=${studentId}&semester=${semester}`);
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          const coursesData = data.courses.map((item: CourseResponse) => ({
            id: item.course.id,
            name: item.course.name,
            code: item.course.code
          }));
          setCourses(coursesData);
        } else {
          console.error('獲取課程失敗：', data.error);
        }
      } catch (error) {
        console.error('請求出錯：', error);
      }
    };

    fetchCourses();
  }, []); 

  const openEditAlert = (course: Course) => {
    const message = `是否要退選課程 [${course.code}]${course.name}？`;
    setSelectedCourseId(course.id);
    setIsEditAlertOpen(true);
    setEditAlertMessage(message);
  };

  const closeEditAlert = () => {
    setIsEditAlertOpen(false);
  };

  const handleDelete = async () => {
    if (selectedCourseId) {
      try {
        const response = await fetch('/api/WithDraw', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                studentId: studentId,
                courseId: selectedCourseId,
                semester: semester
            })
        });
    
        const data = await response.json();
    
        if (data.success) {
            console.log('退選成功：', data);
            window.location.href = '/Enroll';
        } else {
            console.error('退選失敗：', data.error);
        }
      } catch (error) {
          console.error('退選請求錯誤：', error);
      } finally {
          closeEditAlert();
      }
    }
  };

  return (
    <Card className="h-full w-full overflow-scroll" placeholder="">
      <table>
        <thead>
            <tr>
              {TABLE_HEAD.map((head, index) => (
                <th key={index} className="p-4 border-b border-blue-gray-50" style={{ fontSize: 'small', textAlign: 'left' }}>
                  {head}
                </th>
              ))}
            </tr>
          </thead>
        <tbody>
          {courses.map((course, index) => {
            const { name: courseName, code: courseCode } = course;
            const classes = `${index % 2 === 0 ? "bg-white" : "bg-gray-100"} p-4 border-b border-blue-gray-50`;

            return (
              <tr key={index}>
                <td className={classes}>
                  <Button
                    size="sm"
                    color="green" 
                    className="capitalize"
                    placeholder=""
                  >
                    已加選
                  </Button>
                </td>

                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                    placeholder=""
                  >
                    {courseName}
                  </Typography>
                </td>

                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                    placeholder=""
                  >
                    {courseCode}
                  </Typography>
                </td>

                <td className={classes} style={{ width: '150px' }}>
                  <Button 
                  size="sm" 
                  variant="gradient" 
                  color="blue-gray" 
                  className="flex items-center gap-2" 
                  onClick={() => {
                    console.log(course); 
                    openEditAlert(course)
                  }} 
                  placeholder=""
                >
                  修改<MdCreate />
                </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <AlertWindows isOpen={isEditAlertOpen} message={editAlertMessage} onClose={closeEditAlert} onConfirm={handleDelete} />
    </Card>
  );
}
