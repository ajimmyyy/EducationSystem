"use client";
import CourseList from "@/components/search/course-list";
import ParsedParamsProvider from "@/hooks/useQueryParams";
import FilterContainer from "@/components/search/filter";
import LlmAssistant from "@/components/llm-assistant";

export default function Home() {
  return (
    <ParsedParamsProvider>
      <LlmAssistant />
      <FilterContainer />
      <CourseList />
    </ParsedParamsProvider>
  );
}
