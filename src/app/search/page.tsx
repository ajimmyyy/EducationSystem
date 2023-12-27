"use client";
import CourseList from "@/components/search/course-list";
import ParsedParamsProvider from "@/hooks/useQueryParams";

export default function Home() {
  return (
    <ParsedParamsProvider>
      <CourseList />
    </ParsedParamsProvider>
  );
}
