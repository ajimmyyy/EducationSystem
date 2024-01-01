import { Button } from "@material-tailwind/react";

// 單一格子的課程該有的資料
interface CourseItem {
  name: string;
}

// 老師課表的格子
export default function TeacherTableItem({ courseItem: courseName }: { courseItem: CourseItem }) {
  if (courseName) {
    return (
      <Button placeholder={undefined}>
        {courseName.name}
      </Button>
    );
  }
  return null;
}