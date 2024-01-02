import apiFetcher from "@/utils/api-fetcher";
import { useEffect, useState } from "react";

export interface CourseItem {
  id: number;
  courseName: string;
  code: number;
  teacherName: string;
  classroom: string;
}

export interface CourseTable {
  [key: string]: CourseItem;
}

export default function useGetStudentCourse(
  studentId: number,
  semester: string,
) {
  const [data, setData] = useState<CourseTable>({});
  const [totalCredit, setCredit] = useState(0);
  useEffect(() => {
    async function setStudentCourseData() {
      const res = await apiFetcher(
        "/api/GetStudentCourseTable?studentId=" +
          studentId +
          "&semester=" +
          semester,
        { method: "GET" },
      );
      setCredit(0);
      const result: CourseTable = res?.course?.reduce(
        (acc: { [x: string]: any }, item: { participationCourse: any[] }) => {
          item.participationCourse.forEach((courses) => {
            setCredit((prevCredit) => {
              return prevCredit + courses.course.credit;
            });
            courses.course.schedule.forEach(
              (schedule: {
                weekday: any;
                intervals: any[];
                classroom: any;
              }) => {
                schedule.intervals.forEach((interval) => {
                  let key = `${schedule.weekday}-${interval.time}`;
                  acc[key] = {
                    courseName: courses.course.name,
                    id: courses.course.id,
                    code: courses.course.code,
                    teacherName: courses.course.teacher?.user.name,
                    classroom: schedule.classroom?.location,
                  };
                });
              },
            );
          });
          return acc;
        },
        {},
      );
      console.log(result);
      setData(result);
    }
    setStudentCourseData();
  }, [studentId, semester]);
  //console.log(totalCredit);
  return { data, totalCredit };
}
