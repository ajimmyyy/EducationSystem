import { Button, List, ListItem } from "@/components/material-tailwind";
import ParsedParamsProvider from "@/hooks/useQueryParams";
import { useSearchCourses } from "@/hooks/useSearchCourses";
import { Fragment, useEffect, useRef } from "react";
import { useIntersection } from "react-use";

export default function CourseList() {
  const loadMoreRef = useRef<HTMLButtonElement>(null);
  const intersection = useIntersection(loadMoreRef, {
    root: null,
    rootMargin: "1024px",
    threshold: 1,
  });

  const {
    data: { pages = [] } = {},
    isFetching,
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

  return (
    <main>
      <List placeholder>
        {pages.map((page, i) => (
          <Fragment key={i}>
            {page.courses.map((course) => (
              <ListItem placeholder key={course.id}>
                {course.name}
              </ListItem>
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
