//quote from search/course-list-item.tsx
import type { SearchCourseResult } from "@/services/courseService";
import {
  IconButton,
  Chip,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Tooltip,
} from "../material-tailwind";
import { MdOutlinePerson, MdAccessTime } from "react-icons/md";
import { useRouter, useSearchParams } from "next/navigation";
import AlertWindows from "../alert-windows";
import useAlertWindows from "@/hooks/useAlertWindows";
import useUser from "@/hooks/useUser";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";
import { MdBookmarkBorder } from "react-icons/md";
import { MdBookmark } from "react-icons/md";
import { FaPlus } from "react-icons/fa6";

interface CourseListItemProps {
  course: SearchCourseResult["courses"][0];
  index: number;
}

const weekdayMap = ["一", "二", "三", "四", "五", "六", "日"];

export default function CourseListItem({ course, index }: CourseListItemProps) {
  const { data: user } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryClient = useQueryClient();

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
            queryClient.invalidateQueries({
              queryKey: ["search", searchParams.toString()],
            });
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

  const isAlreadyEnroll =
    user?.id &&
    (course.unassignedCourse.some(
      (unassignedCourse) => unassignedCourse.courseTable.studentId === user?.id,
    ) ||
      course.participationCourse.some(
        (participationCourse) =>
          participationCourse.courseTable.studentId === user?.id,
      ));

  const handleAddCollect = async () => {
    try {
      const response = await fetch(
        `/api/collectCourse/add?studentId=${user?.id}&courseId=${course.id}`,
      );

      const data = await response.json();

      if (data.success) {
        toast.success("收藏成功", data);
        queryClient.invalidateQueries({
          queryKey: ["search", searchParams.toString()],
        });
      } else {
        console.error("收藏失敗：", data);
        toast.error("收藏失敗", data);
      }
    } catch (error) {
      console.error("收藏請求錯誤：", error);
      toast.error("收藏請求錯誤，請見開發者介面");
    }
  };

  const handleRemoveCollect = async () => {
    try {
      const response = await fetch(
        `/api/collectCourse/remove?studentId=${user?.id}&courseId=${course.id}`,
      );

      const data = await response.json();

      if (data.success) {
        toast.success("取消收藏成功", data);
        queryClient.invalidateQueries({
          queryKey: ["search", searchParams.toString()],
        });
      } else {
        console.error("取消收藏失敗：", data);
        toast.error("取消收藏失敗", data);
      }
    } catch (error) {
      console.error("取消收藏請求錯誤：", error);
      toast.error("取消收藏請求錯誤，請見開發者介面");
    }
  };

  const isCollected = course.collectCourse.some(
    (collectCourse) => collectCourse.studentId === user?.id,
  );

  return (
    <>
      <ListItem
        placeholder="null"
        key={course.id}
        className={index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}
        onClick={() => {
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
        <ListItemSuffix placeholder="null" className="flex gap-2">
          {user?.id && !isAlreadyEnroll && (
            <Tooltip content="加選課程" placement="top">
              <IconButton
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
                <FaPlus />
              </IconButton>
            </Tooltip>
          )}
          {user?.id ? (
            isCollected ? (
              <Tooltip content="取消收藏課程" placement="top">
                <IconButton
                  size="sm"
                  variant="gradient"
                  color="blue-gray"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleRemoveCollect();
                  }}
                  placeholder=""
                >
                  <MdBookmarkBorder />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip content="收藏課程" placement="top">
                <IconButton
                  size="sm"
                  variant="gradient"
                  color="blue-gray"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleAddCollect();
                  }}
                  placeholder=""
                >
                  <MdBookmark />
                </IconButton>
              </Tooltip>
            )
          ) : null}
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
