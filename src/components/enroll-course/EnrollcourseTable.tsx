import React, { useState, useEffect } from "react";
import {
  Card,
  Typography,
  Button,
  Select,
  Option,
} from "@material-tailwind/react";
import { MdCreate } from "react-icons/md";
import AlertWindows from "../alert-windows";
import useUser from "@/hooks/useUser";

const TABLE_HEAD = ["State", "Course Name", "Course ID", ""];

type Course = {
  id: number;
  name: string;
  code: string;
  status: "enrolled" | "waiting";
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
type UnassignedCourseResponse = {
  course: {
    id: number;
    name: string;
    code: string;
  };
};

export function DefaultTable() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [unassignedCourses, setUnassignedCourses] = useState<Course[]>([]);
  const [isEditAlertOpen, setIsEditAlertOpen] = useState(false);
  const [editAlertMessage, setEditAlertMessage] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [semester, setSemester] = useState("112-2");
  const { data: user } = useUser();

  useEffect(() => {
    if (!user?.id) {
      return;
    }
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `/api/GetParticipationCourse?studentId=${user.id}&semester=${semester}`,
        );
        const data = await response.json();
        console.log(data);

        if (response.ok) {
          const coursesData = data.courses.map((item: CourseResponse) => ({
            id: item.course.id,
            name: item.course.name,
            code: item.course.code,
          }));
          setCourses(coursesData);
        } else {
          console.error("獲取課程失敗：", data.error);
        }
      } catch (error) {
        console.error("請求出錯：", error);
      }
    };

    const fetchUnassignedCourses = async () => {
      try {
        const response = await fetch(
          `/api/GetUnAssignedCourse?studentId=${user.id}&semester=${semester}`,
        );
        const data = await response.json();
        if (response.ok) {
          const unassignedCoursesData = data.unassignedCourses.map(
            (item: UnassignedCourseResponse) => ({
              id: item.course.id,
              name: item.course.name,
              code: item.course.code,
              status: "waiting",
            }),
          );
          setUnassignedCourses(unassignedCoursesData);
        } else {
          console.error("獲取未分配課程失敗：", data.error);
        }
      } catch (error) {
        console.error("請求未分配課程出錯：", error);
      }
    };

    fetchCourses();
    fetchUnassignedCourses();
  }, [user?.id, semester]);

  const combinedCourses = [...courses, ...unassignedCourses];

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
    if (!user?.id) {
      return;
    }
    if (selectedCourseId) {
      try {
        const response = await fetch("/api/WithDraw", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            studentId: user?.id,
            courseId: selectedCourseId,
            semester: semester,
          }),
        });

        const data = await response.json();

        if (data.success) {
          console.log("退選成功：", data);
          window.location.href = "/enroll";
        } else {
          console.error("退選失敗：", data.error);
        }
      } catch (error) {
        console.error("退選請求錯誤：", error);
      } finally {
        closeEditAlert();
      }
    }
  };

  return (
    <Card className="h-full w-full" placeholder="">
      <div className="">
        <Select
          label="學期"
          placeholder={undefined}
          value={semester}
          onChange={(e) => {
            setSemester(e as string);
          }}
        >
          <Option value="112-2">112-2</Option>
          <Option value="112-1">112-1</Option>
        </Select>
      </div>
      <table>
        <thead>
          <tr>
            {TABLE_HEAD.map((head, index) => (
              <th
                key={index}
                className="border-b border-blue-gray-50 p-4"
                style={{ fontSize: "small", textAlign: "left" }}
              >
                {head}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {combinedCourses.map((course, index) => {
            const { name: courseName, code: courseCode } = course;
            const classes = `${
              index % 2 === 0 ? "bg-white" : "bg-gray-100"
            } p-4 border-b border-blue-gray-50`;
            const status = course.status;
            return (
              <tr key={index}>
                <td className={classes}>
                  <Button
                    size="sm"
                    color={status === "waiting" ? "orange" : "green"}
                    className="capitalize"
                    placeholder=""
                  >
                    {status === "waiting" ? "簽核中" : "已加選"}
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

                <td className={classes} style={{ width: "150px" }}>
                  <Button
                    size="sm"
                    variant="gradient"
                    color="blue-gray"
                    className="flex items-center gap-2"
                    onClick={() => {
                      console.log(course);
                      openEditAlert(course);
                    }}
                    placeholder=""
                  >
                    修改
                    <MdCreate />
                  </Button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <AlertWindows
        isOpen={isEditAlertOpen}
        message={editAlertMessage}
        onClose={closeEditAlert}
        onConfirm={handleDelete}
      />
    </Card>
  );
}
