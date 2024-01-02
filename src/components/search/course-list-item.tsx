//quote from search/course-list-item.tsx
import type { SearchCourseResult } from "@/services/courseService";
import {
  Button,
  Chip,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
} from "../material-tailwind";
import { MdOutlinePerson, MdAccessTime } from "react-icons/md";
import { useRouter } from "next/navigation";
import AlertWindows from "../alert-windows";
import useAlertWindows from "@/hooks/useAlertWindows";
import useUser from "@/hooks/useUser";
import { toast } from "sonner";

interface CourseListItemProps {
  course: SearchCourseResult["courses"][0];
  index: number;
}

const weekdayMap = ["一", "二", "三", "四", "五", "六", "日"];

export default function CourseListItem({ course, index }: CourseListItemProps) {
  const { data: user } = useUser();
  const router = useRouter();

  const { isAlertOpen, alertMessage, openAlert, closeAlert, handleConfirm } =
    useAlertWindows({
      message: `是否加選 ${course.code} ${course.name}?`,
      handleConfirm: async (closeAlert) => {
        try {
          const response = await fetch("/api/EnrollCourse", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studentId: user?.id,
              courseId: course.id,
              semester: course.semester,
            }),
          });

          const data = await response.json();

          if (data.success) {
            toast.success("加選成功", data);
          } else {
            console.error("加選失敗：", data);
            toast.error("加選失敗", data);
          }
        } catch (error) {
          console.error("加選請求錯誤：", error);
          toast.error("加選請求錯誤，請見開發者介面");
        } finally {
          closeAlert();
        }
      },
    });

  return (
    <>
      <ListItem
        placeholder="null"
        key={course.id}
        className={index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}
        onClick={(e) => {
          router.push(`/course/${course.id}`);
        }}
      >
        <ListItemPrefix placeholder="null" className="text-sm text-gray-500">
          {course.code}
        </ListItemPrefix>
        <div className="flex w-full items-center">
          <div className="relative flex w-[60%] flex-col gap-2">
            <h3 className=" font-bold text-blue-800">{course.name}</h3>
            <div className="flex gap-2">
              {course.department && (
                <Chip
                  value={course.department.name}
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-2 py-1 text-xs group-hover:bg-white/20 group-hover:text-white"
                />
              )}
              {course.credit ? (
                <Chip
                  value={`學分: ${course.credit}`}
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-2 py-1 text-xs group-hover:bg-white/20 group-hover:text-white"
                />
              ) : null}
              {course.phase && course.phase === 1 ? (
                <Chip
                  value={`階段: 上`}
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-2 py-1 text-xs group-hover:bg-white/20 group-hover:text-white"
                />
              ) : (
                <Chip
                  value={`階段: 下`}
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-2 py-1 text-xs group-hover:bg-white/20 group-hover:text-white"
                />
              )}
              {course.studentQuota ? (
                <Chip
                  value={`人數: ${course.studentQuota}`}
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-2 py-1 text-xs group-hover:bg-white/20 group-hover:text-white"
                />
              ) : null}
              {course.isEnglishTaught ? (
                <Chip
                  value={`英文授課`}
                  variant="ghost"
                  size="sm"
                  className="rounded-full px-2 py-1 text-xs group-hover:bg-white/20 group-hover:text-white"
                />
              ) : null}
            </div>
          </div>
          <div className="relative flex w-[20%] gap-4">
            {course.teacher && (
              <Chip
                value={course.teacher.user.name}
                variant="ghost"
                icon={
                  <span>
                    <MdOutlinePerson />
                  </span>
                }
                size="sm"
                className="w-fit rounded-full px-2 py-1 text-xs group-hover:bg-white/20 group-hover:text-white"
              />
            )}
            {course.schedule.length > 0 && (
              <Chip
                value={course.schedule
                  .map(
                    (schedule) =>
                      `${weekdayMap[schedule.weekday]} ${schedule.intervals
                        .map((interval) => interval.time)
                        .join(",")} `,
                  )
                  .join(" / ")}
                variant="ghost"
                icon={
                  <span>
                    <MdAccessTime />
                  </span>
                }
                size="sm"
                className="w-fit rounded-full px-2 py-1 text-xs group-hover:bg-white/20 group-hover:text-white"
              />
            )}
          </div>
          <div className="relative w-[20%]">
            {course.note === course.note2 ? (
              <>
                {course.note && (
                  <p className="text-xs text-gray-500">
                    <span>備註:</span>
                    {course.note}
                  </p>
                )}
              </>
            ) : (
              <>
                {course.note && (
                  <p className="text-xs text-gray-500">
                    <span>備註:</span>
                    {course.note}
                  </p>
                )}
                {course.note2 && (
                  <p className="text-xs text-gray-500">
                    <span>備註:</span>
                    {course.note2}
                  </p>
                )}
              </>
            )}
          </div>
        </div>
        <ListItemSuffix placeholder="null">
          {user?.id && (
            <Button
              size="sm"
              variant="gradient"
              color="blue-gray"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                openAlert();
              }}
              placeholder=""
            >
              加選
            </Button>
          )}
        </ListItemSuffix>
      </ListItem>
      <AlertWindows
        isOpen={isAlertOpen}
        message={alertMessage}
        onClose={closeAlert}
        onConfirm={handleConfirm}
      />
    </>
  );
}
