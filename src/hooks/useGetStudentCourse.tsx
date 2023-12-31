import apiFetcher from "@/utils/api-fetcher";
import { use, useEffect, useState } from "react";

interface CourseItem {
  id: number;
  name: string;
}

export interface CourseTable {
  [key: string]: CourseItem;
}

export default function useGetStudentCourse(
  studentId: number,
  semester: string,
) {
  const [data, setData] = useState<CourseTable>({});
  useEffect(() => {
    async function setStudentCourseData() {
      const res = await apiFetcher(
        "/api/GetStudentCourseTable?studentId=" +
          studentId +
          "&semester=" +
          semester,
        { method: "GET" },
      );
      const result: CourseTable = res?.course?.reduce(
        (acc: { [x: string]: any }, item: { participationCourse: any[] }) => {
          item.participationCourse.forEach((courses) => {
            courses.course.schedule.forEach(
              (schedule: { weekday: any; intervals: any[] }) => {
                schedule.intervals.forEach((interval) => {
                  let key = `${schedule.weekday}-${interval.time}`;
                  acc[key] = {
                    name: courses.course.name,
                    id: courses.course.id,
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
  return { data };
}
