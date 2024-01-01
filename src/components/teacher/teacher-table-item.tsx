import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

// 單一格子的課程該有的資料
interface CourseItem {
  name: string;
  id: number;
}

// 老師課表的格子
export default function TeacherTableItem({ courseItem: courseItem }: { courseItem: CourseItem }) {
  const router = useRouter();
  if (courseItem) {
    return (
      <Button placeholder={undefined} onClick={() => {
        router.push(`/teacher/${courseItem.id}`);
      }}>
        {courseItem.name}
      </Button>
    );
  }
  return null;
}