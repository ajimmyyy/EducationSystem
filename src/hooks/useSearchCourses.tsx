import { useSearchParams } from "next/navigation";
import { useInfiniteQuery } from "@tanstack/react-query";
import apiFetcher from "@/utils/api-fetcher";
import { useQueryParams } from "./useQueryParams";
import type { SearchCourseResult } from "@/services/courseService";

const BATCH_SIZE = 20;

export const useSearchCourses = () => {
  const searchParams = useSearchParams();
  const queryParams = useQueryParams();

  const infiniteQuery = useInfiniteQuery<SearchCourseResult>({
    queryKey: ["search", searchParams.toString()],
    queryFn: async ({ pageParam = 0 }) => {
      const data = await apiFetcher(`/api/course/search`, {
        method: "POST",
        body: {
          ...queryParams,
          page: pageParam,
          perPage: BATCH_SIZE,
        },
      });
      return data;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      const { courseCount } = lastPage;
      const isLastPage = allPages.length * BATCH_SIZE >= courseCount;
      if (isLastPage) return undefined;
      return allPages.length;
    },

    staleTime: 1000 * 60 * 60 * 24,
  });

  return infiniteQuery;
};
