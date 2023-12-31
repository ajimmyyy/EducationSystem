import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

interface CourseItem {
  id: number;
  name: string;
}

export default function StudentTableItem({
  courseItem: courseItem,
}: {
  courseItem: CourseItem;
}) {
  const router = useRouter();
  if (courseItem) {
    return (
      <Button
        placeholder={undefined}
        onClick={() => {
          router.push(`/course/${courseItem.id}`);
        }}
      >
        {courseItem.name}
      </Button>
    );
  }
}
