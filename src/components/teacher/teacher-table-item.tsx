import { Button } from "@material-tailwind/react";
import getTeacherCourse from "@/hooks/useGetTeacherCourse";

export default function TeacherTableItem({ name: courseName }: { name: string }) {
  if (courseName) {
    return (
      <Button placeholder={undefined}>
        {courseName}
      </Button>
    );
  }
  return null;
}