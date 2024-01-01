import { useQueryClient } from "@tanstack/react-query";
import { deleteCookie } from "cookies-next";

export default function useLogout() {
  const queryClient = useQueryClient();

  const logout = () => {
    deleteCookie("token");
    queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  return { logout };
}
