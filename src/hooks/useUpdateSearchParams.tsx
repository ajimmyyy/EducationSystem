import { useSearchParams, useRouter } from "next/navigation";
import { QueryParamsType } from "./useQueryParams";

export type SearchParamsEntries = {
  // eslint-disable-next-line no-unused-vars
  [key in keyof QueryParamsType["queryParams"]]:
    | string
    | number
    | boolean
    | (string | number | boolean)[]
    | null;
};

export const useUpdateSearchParams = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const updateSearchParams = (
    searchParamsEntries: Partial<SearchParamsEntries>,
  ) => {
    const newSearchParams = new URLSearchParams(searchParams);
    Object.entries(searchParamsEntries).forEach(([key, value]) => {
      if (value === null || value === undefined) newSearchParams.delete(key);
      else if (Array.isArray(value) && value.length === 0)
        newSearchParams.delete(key);
      else newSearchParams.set(key, value.toString());
    });
    router.push(`?${newSearchParams.toString().replace(/%2C/g, ",")}`, {
      scroll: false,
    });
  };

  return updateSearchParams;
};
