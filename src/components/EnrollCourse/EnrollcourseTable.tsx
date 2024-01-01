import React, { useState, useEffect } from 'react';
import { Card, Typography, Button } from "@material-tailwind/react";
import { MdCreate } from "react-icons/md";
import AlertWindows from './AlertWindowsWithDraw';
import { ZodNumberCheck } from 'zod';

const TABLE_HEAD = ["State", "Course Name", "Course ID", ""];
const studentId = 748; // 固定的學生ID
const semester = "112-1"; // 固定的學期

export function DefaultTable() {
  const [courses, setCourses] = useState([]);
  const [isEditAlertOpen, setIsEditAlertOpen] = useState(false);
  const [editAlertMessage, setEditAlertMessage] = useState('');

  const openEditAlert = (courseCode: string, courseName: string) => {
    const message = `是否要退選課程 [${courseCode}]${courseName}？`;
    setIsEditAlertOpen(true);
    setEditAlertMessage(message);
  };

  const closeEditAlert = () => {
    setIsEditAlertOpen(false);
  };

  const handleDelete = async (courseCode : string) => {
    // 實現刪除課程的邏輯
    closeEditAlert();
  };
  
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(`/api/GetParticipationCourse?studentId=${studentId}&semester=${semester}`);
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          setCourses(data.courses); 
        } else {
          console.error('獲取課程失敗：', data.error);
        }
      } catch (error) {
        console.error('請求出錯：', error);
      }
    };

    fetchCourses();
  }, []); // 空依賴數組確保僅在組件加載時執行

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
            const { course: { name: courseName }, course: { code: courseCode }} = course;
            const classes = `${index % 2 === 0 ? "bg-white" : "bg-gray-100"} p-4 border-b border-blue-gray-50`;
            const stateButtonColor = "green";

            return (
              <tr key={index}>
                <td className={classes}>
                  <Button
                    size="sm"
                    color={stateButtonColor} 
                    className="capitalize"
                    placeholder="已加選"
                  >
                    已加選
                  </Button>
                </td>

                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                    placeholder={courseName}
                  >
                    {courseName}
                  </Typography>
                </td>

                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                    placeholder={courseCode}
                  >
                    {courseCode}
                  </Typography>
                </td>

                <td className={classes} style={{ width: '150px' }}>
                  <Button size="sm" variant="gradient" color="blue-gray" className="flex items-center gap-2" onClick={() => openEditAlert(courseCode, courseName)} placeholder="">
                    修改<MdCreate />
                  </Button>
                </td>
              </tr>
              
            );
          })}
        </tbody>
      </table>
      <AlertWindows isOpen={isEditAlertOpen} message={editAlertMessage} onClose={closeEditAlert} onConfirm={() => handleDelete(editAlertMessage.split(' ')[3])} />
    </Card>
  );
}