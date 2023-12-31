import { useQuery } from "@tanstack/react-query";
import apiFetcher from "@/utils/api-fetcher";
import { Department } from "@prisma/client";

export const useDepartments = () => {
  const data = useQuery<{
    departments: Department[];
  }>({
    queryKey: ["departments"],
    queryFn: async () => {
      const data = await apiFetcher(`/api/department/getAll`, {});
      return data;
    },
  });

  return data;
};
