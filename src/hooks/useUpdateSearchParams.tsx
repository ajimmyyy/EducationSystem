import { useSearchParams, useRouter } from "next/navigation";

export type SearchParamsEntries = {
  [key: string]:
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
