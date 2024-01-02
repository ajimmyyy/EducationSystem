"use client";
import CourseList from "@/components/enroll-course/CourseTable";
import ParsedParamsProvider from "@/hooks/useQueryParams";
import FilterContainer from "@/components/search/filter";

export default function Home() {
  return (
    <ParsedParamsProvider>
      <FilterContainer />
      <CourseList />
    </ParsedParamsProvider>
  );
}
