import { JWTToken } from "@/services/userService";
import apiFetcher from "@/utils/api-fetcher";
import { useQuery } from "@tanstack/react-query";

export default function useUser() {
  const data = useQuery<JWTToken>({
    queryKey: ["me"],
    queryFn: async () => {
      const data = await apiFetcher(`/api/user/me`, {});
      return data;
    },
  });

  return data;
}
