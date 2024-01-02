import { Button } from "@material-tailwind/react";
import { CourseRequest } from "@/hooks/teacher/useGetTeacherRequest";

export default function TeacherCourseRequestItem({ studentProperty: student }: { studentProperty: CourseRequest }) {

  return (
    <div className="bg-white p-4 rounded-xl">
      <div className="flex justify-between items-center gap-1 w-full">
        <div>
          <span>{student.name}</span>
          <span>{student.class}</span>
        </div>
        <div className=" flex gap-2">
          <Button color="blue" size="sm" placeholder={undefined}>
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