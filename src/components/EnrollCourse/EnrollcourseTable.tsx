import React, { useState, useEffect } from 'react';
import { Card, Typography, Button } from "@material-tailwind/react";
import { MdCreate } from "react-icons/md";

const TABLE_HEAD = ["State", "Course Name", "Course Time", "Course ID", ""];
const studentId = 8901000; // 固定的學生ID
const semester = "110-1"; // 固定的學期

export function DefaultTable() {
  const [courses, setCourses] = useState([]);

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
        <tbody>
          {courses.map((course, index) => {
            const { state, courseName, courseTime, courseId } = course;
            const classes = `${index % 2 === 0 ? "bg-white" : "bg-gray-100"} p-4 border-b border-blue-gray-50`;
            let stateButtonColor = state === "已加選" ? "green" : state === "簽核中" ? "orange" : "gray";

            return (
              <tr key={index}>
                <td className={classes}>
                  <Button
                    size="sm"
                    color={stateButtonColor === "green" ? "green" : stateButtonColor === "orange" ? "orange" : "blue-gray"}
                    className="capitalize"
                    placeholder={state}
                  >
                    {state}
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
                  <div className="bg-blue-gray-100 rounded-full px-2 py-1 inline-block">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                      placeholder={courseTime}
                    >
                      {courseTime}
                    </Typography>
                  </div>
                </td>

                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                    placeholder={courseId}
                  >
                    {courseId}
                  </Typography>
                </td>

                <td className={classes} style={{ width: '150px' }}>
                  <Button size="sm" variant="gradient" color="blue-gray" className="flex items-center gap-2" placeholder= "">修改<MdCreate /></Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}