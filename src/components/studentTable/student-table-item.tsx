import { Button } from "@material-tailwind/react";

interface CourseItem {
  name: string;
}

export default function StudentTableItem({
  courseItem: courseName,
}: {
  courseItem: CourseItem;
}) {
  if (courseName) {
    return <Button placeholder={undefined}>{courseName.name}</Button>;
  }
}
