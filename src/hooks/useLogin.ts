"use client";
import { JWTToken } from "@/services/userService";
import apiFetcher from "@/utils/api-fetcher";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setCookie } from "cookies-next";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export interface LoginForm {
  sid: string;
  password: string;
}

const fetchLogin = async (body: LoginForm) => {
  const data = await apiFetcher(`/api/user/login`, {
    method: "POST",
    body,
  });
  return data;
};

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const login = useMutation({
    mutationKey: ["login"],
    mutationFn: fetchLogin,
    onSuccess: (data: { token: string } & JWTToken) => {
      toast.success("登入成功");
      setCookie("token", data.token);
      
      queryClient.invalidateQueries({ queryKey: ["me"] });
      
      if (data.role === "teacher") {
        return router.push("/teacher");
      }
      router.push("/search");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  return {
    login,
  };
};
