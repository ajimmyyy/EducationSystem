"use client";
import AlertWindows from "@/components/alert-windows";
import useAlertWindows from "@/hooks/useAlertWindows";
import { useCourse } from "@/hooks/useCourse";
import useUser from "@/hooks/useUser";
import { IconButton, Tooltip } from "@material-tailwind/react";
import { useQueryClient } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { FaPlus } from "react-icons/fa6";
import { MdBookmarkBorder, MdBookmark } from "react-icons/md";
import { toast } from "sonner";

const weekdayMap = ["一", "二", "三", "四", "五", "六", "日"];

export default function Home() {
  const params = useParams();
  const courseId = params.id;
  const { data: { course } = {} } = useCourse(Number(courseId as string));

  const { data: user } = useUser();
  const queryClient = useQueryClient();

  const { isAlertOpen, alertMessage, openAlert, closeAlert, handleConfirm } =
    useAlertWindows({
      message: `是否加選 ${course?.code} ${course?.name}?`,
      handleConfirm: async (closeAlert) => {
        try {
          const response = await fetch("/api/EnrollCourse", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              studentId: user?.id,
              courseId: course?.id,
              semester: course?.semester,
            }),
          });

          const data = await response.json();

          if (data.success) {
            toast.success("加選成功", data);
            queryClient.invalidateQueries({
              queryKey: ["course", course?.id],
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
    (course?.unassignedCourse.some(
      (unassignedCourse) => unassignedCourse.courseTable.studentId === user?.id,
    ) ||
      course?.participationCourse.some(
        (participationCourse) =>
          participationCourse.courseTable.studentId === user?.id,
      ));

  const handleAddCollect = async () => {
    try {
      const response = await fetch(
        `/api/collectCourse/add?studentId=${user?.id}&courseId=${course?.id}`,
      );

      const data = await response.json();

      if (data.success) {
        toast.success("收藏成功", data);
        queryClient.invalidateQueries({
          queryKey: ["course", course?.id],
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
        `/api/collectCourse/remove?studentId=${user?.id}&courseId=${course?.id}`,
      );

      const data = await response.json();

      if (data.success) {
        toast.success("取消收藏成功", data);
        queryClient.invalidateQueries({
          queryKey: ["course", course?.id],
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

  const isCollected = course?.collectCourse.some(
    (collectCourse) => collectCourse.studentId === user?.id,
  );

  if (!course) return null;
  return (
    <div className="px-4">
      <AlertWindows
        isOpen={isAlertOpen}
        message={alertMessage}
        onClose={closeAlert}
        onConfirm={handleConfirm}
      />
      <h1 className=" my-4 text-xl font-normal">{course.name}</h1>
      <div className="my-2 flex items-center justify-between">
        <div className="flex gap-2">
          <span className="text-xs">開課學期：{course.semester}</span>
          <span className="text-xs">開課班級：{course.department?.name}</span>
        </div>
        <div className="flex gap-2">
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
        </div>
      </div>
      <div className="h-fit w-full rounded bg-white p-6 shadow">
        <h2 className=" mb-2 font-semibold">基本資訊</h2>
        <div className="grid w-full grid-cols-4 gap-x-2 gap-y-8 p-2 text-sm">
          <div className="border-b px-1 pb-2">課號：{course.code || "-"}</div>
          <div className="border-b px-1 pb-2">學分：{course.credit || "-"}</div>
          <div className="border-b px-1 pb-2">
            階段：
            {course.phase ? (course.phase === 1 ? "上" : "下") : "-"}
          </div>
          <div className="border-b px-1 pb-2">
            限修人數：{course.studentQuota || "-"}
          </div>
          <div className="border-b px-1 pb-2">
            英文授課：{course.isEnglishTaught ? "是" : "否"}
          </div>
          <div className="border-b px-1 pb-2">
            教師：{course.teacher?.user.name || "-"}
          </div>
          <div className="border-b px-1 pb-2">
            開課班級：{course.department?.name || "-"}
          </div>
        </div>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-4">
        <div className="col-span-1">
          <div className="h-full min-h-fit w-full rounded bg-white p-6 shadow">
            <h2 className=" mb-2 font-semibold">上課時間</h2>
            <div className="text-sm">
              {course.schedule.map((schedule) => (
                <div key={schedule.weekday} className="flex justify-between">
                  <div>
                    <span>{weekdayMap[schedule.weekday]} /</span>
                    <span>
                      {schedule.intervals
                        .map((interval) => interval.time)
                        .join(", ")}
                    </span>
                  </div>
                  <div>{schedule.classroom?.location}</div>
                </div>
              ))}
            </div>
            <h2 className=" mb-2 mt-8 font-semibold">上課進度</h2>
            <p className=" whitespace-pre-line text-sm text-gray-800">
              {course.progress}
            </p>
          </div>
        </div>
        <div className="col-span-2">
          <div className="h-full min-h-fit w-full rounded bg-white p-6 shadow">
            <h2 className=" mb-2 font-semibold">課程大綱</h2>
            <p className=" whitespace-pre-line text-sm text-gray-800">
              {course.syllabus}
            </p>
            <h2 className=" mb-2 mt-8 font-semibold">備註</h2>
            <p className=" whitespace-pre-line text-sm text-gray-800">
              {course.note === course.note2 ? (
                <>
                  {course.note && (
                    <>
                      <span>備註:</span>
                      {course.note}
                    </>
                  )}
                </>
              ) : (
                <>
                  {course.note && (
                    <>
                      <span>備註:</span>
                      {course.note}
                    </>
                  )}
                  {course.note2 && (
                    <>
                      <span>備註:</span>
                      {course.note2}
                    </>
                  )}
                </>
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
