"use client";
import { useCourse } from "@/hooks/useCourse";
import { useParams } from "next/navigation";
import TeacherCourseRequestItem from "@/components/teacher/teacher-course-request-item";

const weekdayMap = ["一", "二", "三", "四", "五", "六", "日"];

export default function Home() {
  const params = useParams();
  const courseId = params.id;
  console.log("courseId", courseId);
  const { data: { course } = {} } = useCourse(Number(courseId as string));
  if (!course) return null;

  return (
    <div className="px-4">
      <h1 className=" my-4 text-xl font-normal">{course.name}</h1>
      <div className="my-2 flex gap-2">
        <span className="text-xs">開課學期：{course.semester}</span>
        <span className="text-xs">開課班級：{course.department?.name}</span>
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
      <div className="p-2">
        {/* <TeacherCourseRequestItem studentProperty={data} /> */}
      </div>
    </div>
  );
}
