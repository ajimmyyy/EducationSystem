"use client";
import {
  Card,
  Input,
  Button,
  Typography,
} from "@/components/material-tailwind";
import { useLogin, LoginForm } from "@/hooks/useLogin";
import { useForm } from "react-hook-form";

export default function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>();
  const { login: authLogin } = useLogin();
  const onSubmit = handleSubmit((data) => {
    authLogin.mutate({
      sid: data.sid,
      password: data.password,
    });
  });

  return (
    <main className="flex w-full justify-center pt-16">
      <Card color="transparent" shadow={false} placeholder={undefined}>
        <Typography variant="h4" color="blue-gray" placeholder={undefined}>
          登入帳號
        </Typography>
        <Typography
          color="gray"
          className="mt-1 font-normal"
          placeholder={undefined}
        >
          北科課程網登入介面
        </Typography>
        <form
          className="mb-2 mt-8 w-80 max-w-screen-lg sm:w-96"
          onSubmit={onSubmit}
        >
          <div className="gap- mb-1 flex flex-col">
            <Typography variant="h6" color="blue-gray" placeholder={undefined}>
              學號
            </Typography>
            <Input
              size="lg"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              type="text"
              crossOrigin={undefined}
              {...register("sid", {
                required: "請輸入學號",
              })}
            />
            <Typography
              color="red"
              className="mb-2 font-normal"
              placeholder={undefined}
            >
              {errors.sid?.message}
            </Typography>
            <Typography variant="h6" color="blue-gray" placeholder={undefined}>
              密碼
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
              crossOrigin={undefined}
              {...register("password", {
                required: "請輸入密碼",
                minLength: {
                  value: 8,
                  message: "密碼長度至少為8個字元",
                },
              })}
            />
          </div>
          <Typography
            color="red"
            className="mb2 font-normal"
            placeholder={undefined}
          >
            {errors.password?.message}
          </Typography>
          <Button
            className="mt-6"
            fullWidth
            type="submit"
            placeholder={undefined}
          >
            登入
          </Button>
        </form>
      </Card>
    </main>
  );
}
