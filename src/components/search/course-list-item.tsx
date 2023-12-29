import type { SearchCourseResult } from "@/services/courseService";
import {
  Chip,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
} from "../material-tailwind";

interface CourseListItemProps {
  course: SearchCourseResult["courses"][0];
  index: number;
}

export default function CourseListItem({ course, index }: CourseListItemProps) {
  return (
    <ListItem
      placeholder="null"
      key={course.id}
      className={index % 2 === 0 ? "bg-white" : "bg-[#f7f7f7]"}
    >
      <ListItemPrefix placeholder="null" className="text-sm text-gray-500">
        {course.code}
      </ListItemPrefix>
      <div className="flex flex-col gap-2">
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
          {course.hours ? (
            <Chip
              value={`時數: ${course.hours}`}
              variant="ghost"
              size="sm"
              className="rounded-full px-2 py-1 text-xs group-hover:bg-white/20 group-hover:text-white"
            />
          ) : null}
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
      <ListItemSuffix placeholder="null">
        <Chip
          value="+99"
          variant="ghost"
          size="sm"
          className="rounded-full px-2 py-1 text-xs group-hover:bg-white/20 group-hover:text-white"
        />
      </ListItemSuffix>
    </ListItem>
  );
}
