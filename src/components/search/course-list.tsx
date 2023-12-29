import {
  Chip,
  List,
  ListItem,
  ListItemPrefix,
} from "@/components/material-tailwind";
import { useSearchCourses } from "@/hooks/useSearchCourses";
import { Fragment, useEffect, useRef } from "react";
import { useIntersection } from "react-use";
import CourseListItem from "./course-list-item";

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

  console.log("pages", pages);

  // when the button is visible, fetch more courses
  useEffect(() => {
    console.log("intersection?.isIntersecting", intersection?.isIntersecting);
    if (intersection?.isIntersecting) fetchNextPage();
  }, [intersection?.isIntersecting, fetchNextPage]);

  return (
    <main>
      <List placeholder="null">
        <ListItem placeholder="null">
          <ListItemPrefix placeholder="null">
            <Chip
              value={
                isLoading ? "載入中" : `共 ${pages[0]?.courseCount ?? 0} 堂課程`
              }
              variant="ghost"
              size="sm"
              className="rounded-full px-2 py-1 text-xs group-hover:bg-white/20 group-hover:text-white"
            />
          </ListItemPrefix>
        </ListItem>
        {pages.map((page, i) => (
          <Fragment key={i}>
            {page.courses.map((course, index) => (
              <CourseListItem key={course.id} course={course} index={index} />
            ))}
          </Fragment>
        ))}
      </List>

      <button
        ref={loadMoreRef}
        onClick={() => fetchNextPage()}
        disabled={!hasNextPage || isFetchingNextPage}
      >
        {isLoading
          ? ""
          : isFetchingNextPage
            ? "loading"
            : hasNextPage
              ? "load-more"
              : "no-more"}
      </button>
    </main>
  );
}
