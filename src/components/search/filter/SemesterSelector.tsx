"use client";

import { Select, Option } from "@/components/material-tailwind";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SemesterSelector() {
  const updateSearchParams = useUpdateSearchParams();
  const searchParams = useSearchParams();
  const [value, setValue] = useState<string | undefined>("112-2");

  const handleChange = (value: string | undefined) => {
    if (!value) return;
    updateSearchParams({
      semester: value,
    });
  };

  useEffect(() => {
    setValue(searchParams.get("semester") || "112-2");
  }, [searchParams]);

  return (
    <div className="w-64">
      <Select
        label="學期"
        placeholder={undefined}
        value={value}
        onChange={handleChange}
      >
        <Option value="112-1">112-1</Option>
        <Option value="112-2">112-2</Option>
      </Select>
    </div>
  );
}
