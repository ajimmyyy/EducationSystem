import apiFetcher from "@/utils/api-fetcher";
import { useQuery } from "@tanstack/react-query";
import { FullUser } from "@/services/userService";
import { useState, useEffect } from "react";

export const useSearchUser = (id: number) => {
  const data = useQuery<{
    user: FullUser;
  }>({
    queryKey: ["id", id],
    queryFn: async () => {
      const data = await apiFetcher(`/api/user/getById?id=${id}`, {});
      return data;
    },
  });

  return data;
}