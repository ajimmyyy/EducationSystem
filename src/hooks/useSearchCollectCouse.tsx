import { useQuery } from "@tanstack/react-query";
import apiFetcher from "@/utils/api-fetcher";
import { FullCollectCourse } from "@/services/collectCourseService";

export const useSearchCollectCourse = (id: number) => {
  const data = useQuery<{
    courses: FullCollectCourse[];
  }>({
    queryKey: ["id", id],
    queryFn: async () => {
      const data = await apiFetcher(`/api/collectCourse/search?id=${id}`, {});
      return data;
    },
  });

  return data;
};