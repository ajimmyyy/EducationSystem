"use client";

import type { PropsWithChildren } from "react";
import { useState } from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

function ReactQueryProvider({ children }: PropsWithChildren) {
  const router = useRouter();
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error) => {
            console.error(error.message);
            toast.error("檢測到一個錯誤，請檢查控制台");
          },
        }),
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* <ReactQueryDevtools buttonPosition="bottom-left" /> */}
      <ReactQueryDevtools />
      {children}
    </QueryClientProvider>
  );
}

export default ReactQueryProvider;
