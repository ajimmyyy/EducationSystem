import { useRouter } from "next/navigation";
import {
  Button,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
} from "@material-tailwind/react";
import { useState } from "react";
import { CourseItem } from "@/hooks/useGetStudentCourse";

export default function StudentTableItem({
  courseItem: courseItem,
}: {
  courseItem: CourseItem;
}) {
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(!open);
  const router = useRouter();

  if (courseItem) {
    return (
      <>
        <Button placeholder={undefined} onClick={handleOpen}>
          {courseItem.courseName}
        </Button>
        <Dialog open={open} handler={handleOpen} placeholder={undefined}>
          <DialogHeader placeholder={undefined}>
            {courseItem.courseName}
          </DialogHeader>
          <DialogBody placeholder={undefined}>
            課號:{courseItem.code}
            <br></br> 地點:{courseItem.classroom}
            <br></br> 授課老師:{courseItem.teacherName}
          </DialogBody>
          <DialogFooter placeholder={undefined}>
            <Button
              placeholder={undefined}
              color="green"
              onClick={() => {
                setOpen(!open);
                router.push(`/course/${courseItem.id}`);
              }}
            >
              +詳細資料
            </Button>
          </DialogFooter>
        </Dialog>
      </>
    );
  }
}
//router.push(`/course/${courseItem.id}`);
