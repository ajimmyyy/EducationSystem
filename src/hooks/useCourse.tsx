import { useQuery } from "@tanstack/react-query";
import apiFetcher from "@/utils/api-fetcher";
import { FullCourse } from "@/services/courseService";

export const useCourse = (id: number) => {
  const data = useQuery<{
    course: FullCourse;
  }>({
    queryKey: ["course", id],
    queryFn: async () => {
      const data = await apiFetcher(`/api/course/getById?id=${id}`, {});
      return data;
    },
  });

  return data;
};
