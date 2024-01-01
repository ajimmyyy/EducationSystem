import apiFetcher from "@/utils/api-fetcher";
import { useEffect, useState } from "react";

export interface CourseRequest{
  name: string,
  class: string,
  courseTableId: number,
}

export default function useGetTeacherRequest(courseID: number) {
  const [data, setData] = useState<CourseRequest[]>([]);

  useEffect(() => {
    async function setTeacherRequestData(){
      const res = await apiFetcher('/api/GetCourseRequests?courseID=' + courseID, { method: 'GET' });
      const result: CourseRequest[] = res?.courseRequests.map(
        (item: any) => {
          return {
            courseTableId: item.courseTable.id,
            class: item.courseTable.student.class,
            name: item.courseTable.student.user.name,
          };
        }
      ) || [];
      setData(result);
    }
    setTeacherRequestData();
  }, [courseID]);
  return {data};
}