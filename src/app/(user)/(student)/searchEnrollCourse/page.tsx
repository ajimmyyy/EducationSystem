"use client";
import ParsedParamsProvider from "@/hooks/useQueryParams";
import FilterContainer from "@/components/search/filter";
import CourseList from "@/components/search/course-list";

export default function Home() {
  return (
    <ParsedParamsProvider>
      <FilterContainer />
      <CourseList />
    </ParsedParamsProvider>
  );
}
