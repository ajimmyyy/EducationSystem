import apiFetcher from "@/utils/api-fetcher";
import { useEffect, useState } from "react";

//老師課表的物件，key為"weekday-interval"，value為課程名稱
export interface CourseTable {
  [key: string]: { name: string };
}

//回傳老師課表的物件，key為"weekday-interval"，value為課程名稱
export default function useGetTeacherCourse(
  teacherID: number,
  semester: string,
) {
  const [data, setData] = useState<CourseTable>({});

  useEffect(() => {
    async function setTeacherCourseData() {
      const res = await apiFetcher(
        "/api/GetTeacherCourseTable?teacherID=" +
          teacherID +
          "&semester=" +
          semester,
        { method: "GET" },
      );
      const result: CourseTable =
        res?.courseTable?.reduce(
          (acc: { [x: string]: any }, item: { course: any[] }) => {
            item.course.forEach((course) => {
              course.schedule.forEach(
                (schedule: { intervals: any[]; weekday: any }) => {
                  schedule.intervals.forEach((interval) => {
                    let key = `${schedule.weekday}-${interval.time}`;
                    acc[key] = {
                      name: course.name,
                    };
                  });
                },
              );
            });
            return acc;
          },
          {},
        ) || {};
      setData(result);
    }
    setTeacherCourseData();
  }, [teacherID, semester]);
  return { data };
}
