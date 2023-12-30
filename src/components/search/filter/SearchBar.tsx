"use client";
import { Button, Input } from "@/components/material-tailwind";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useParams, usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export default function SearchBar() {
  const inputRef = useRef<HTMLInputElement>(null);
  const updateSearchParams = useUpdateSearchParams();
  const params = useParams() as { type: string };
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
    const keyword = event.target.value || null;
    const params = new URLSearchParams(searchParams);
    if (keyword) params.set("keyword", keyword);
    else params.delete(searchParams.get("keyword") ?? "");
    const url = `${params.toString().replace(/%2C/g, ",")}`;
    history.replaceState(null, "", url ? `?${url}` : pathname);
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.nativeEvent.isComposing || event.key !== "Enter") return;
    const keyword = (event.target as HTMLInputElement).value || null;
    updateSearchParams({ keyword: keyword });
    inputRef.current?.blur();
  };

  const handleClick = () => {
    if (!inputRef.current) return;
    const keyword = inputRef.current.value || null;
    updateSearchParams({ keyword: keyword });
    inputRef.current?.blur();
  };

  // If the keyword changes, update the input value.
  useEffect(() => {
    if (!inputRef.current) return;
    inputRef.current.value = searchParams.get("keyword") || "";
  }, [searchParams]);

  return (
    <div className="flex gap-2">
      <div className="flex-grow">
        <Input
          label="搜尋課程名稱 / 教師名稱 / code"
          crossOrigin={undefined}
          defaultValue={searchParams.get("keyword") || ""}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
        />
      </div>
      <Button
        className="h-fit w-fit"
        onClick={handleClick}
        variant="filled"
        placeholder={undefined}
        color="blue"
      >
        搜尋
      </Button>
    </div>
  );
}
