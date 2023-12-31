"use client";

import type { PropsWithChildren } from "react";
import { createContext, useContext } from "react";
import { useSearchParams } from "next/navigation";
import { z } from "zod";

export const SearchParams = z.object({
  keyword: z.string().default(""),
  semester: z.string().default("112-2"),
  schedule: z.string().default(""),
  departments: z.string().default(""),
});

export type QueryParamsType = {
  queryParams: z.infer<typeof SearchParams>;
};

const QueryParamsContext = createContext<QueryParamsType | null>(null);

export default function QueryParamsProvider({ children }: PropsWithChildren) {
  const searchParams = useSearchParams();
  const queryParams = SearchParams.parse(Object.fromEntries(searchParams));

  return (
    <QueryParamsContext.Provider value={{ queryParams }}>
      {children}
    </QueryParamsContext.Provider>
  );
}

export const useQueryParams = () => {
  const queryParamsContext = useContext(QueryParamsContext);

  if (queryParamsContext === null)
    return {
      keyword: "",
      semester: "112-2",
      schedule: "",
      departments: "",
    };
  return queryParamsContext.queryParams;
};
