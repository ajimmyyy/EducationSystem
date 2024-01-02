import { Button } from "@material-tailwind/react";
import { CourseRequest } from "@/hooks/teacher/useGetTeacherRequest";
// import { useState, useEffect } from "react";
import apiFetcher from "@/utils/api-fetcher";

async function clickOption(courseID: number, courseTableID: number, action: string): Promise<void> {
  apiFetcher("/api/teacher/DealCourseRequests", {
    method: "POST",
    body: {
      courseID: courseID,
      courseTableID: courseTableID,
      action: action,
    }});
}
  

export default function TeacherCourseRequestItem({ studentProperty: student, courseID: id}: { studentProperty: CourseRequest, courseID: number }) {

  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex justify-between items-center gap-1 w-full">
        <div>
          <span>{student.name}</span>
          <span>{student.class}</span>
        </div>
        <div className=" flex gap-2">
          <Button onClick={()=>clickOption(id, student.courseTableId, "success")} color="blue" size="sm" placeholder={undefined}>
            同意
          </Button>
          <Button color="red" size="sm" placeholder={undefined}>
            拒絕
          </Button>
        </div>
      </div>
    </div>
  );
}