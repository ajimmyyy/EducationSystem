//quote from search/course-list.tsx
import {
  Chip,
  List,
  ListItem,
  ListItemPrefix,
} from "@/components/material-tailwind";
import { useSearchCourses } from "@/hooks/useSearchCourses";
import { Fragment, useEffect, useRef } from "react";
import { useIntersection } from "react-use";
import CourseListItem from "./CourseItem";

export default function CourseList() {
  const loadMoreRef = useRef<HTMLButtonElement>(null);
  const intersection = useIntersection(loadMoreRef, {
    root: null,
    rootMargin: "0px",
    threshold: 1,
  });

  const {
    data: { pages = [] } = {},
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSearchCourses();

  // when the button is visible, fetch more courses
  useEffect(() => {
    console.log("intersection?.isIntersecting", intersection?.isIntersecting);
    if (intersection?.isIntersecting) fetchNextPage();
  }, [intersection?.isIntersecting, fetchNextPage]);

  console.log("pages", pages);

  return (
    <main className="">
      <div
        className="sticky top-[148px] z-10 flex h-fit w-full rounded-t bg-blue-500 px-4 py-1
        before:absolute before:left-0 before:right-0 before:top-[-16px] before:z-[-1] before:h-[16px] before:bg-gray-100 before:content-['']
      "
      >
        <span className="text-sm text-white">
          {isLoading ? "載入中" : `共 ${pages[0]?.courseCount ?? 0} 堂課程`}
        </span>
      </div>
      <List placeholder="null">
      {Array.isArray(pages) ? pages.map((page, i) => (
        <Fragment key={i}>
          {Array.isArray(page.courses) ? page.courses.map((course, index) => (
            <CourseListItem key={course.id} course={course} index={index} />
          )) : null}
        </Fragment>
      )) : null}
      </List>

      <div className="w-full">
        <button
          ref={loadMoreRef}
          onClick={() => fetchNextPage()}
          disabled={!hasNextPage || isFetchingNextPage}
          className="h-4 w-full  "
        >
          {isLoading
            ? ""
            : isFetchingNextPage
              ? "loading"
              : hasNextPage
                ? "load-more"
                : "no-more"}
        </button>
      </div>
    </main>
  );
}
