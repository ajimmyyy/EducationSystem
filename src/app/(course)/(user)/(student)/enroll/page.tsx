"use client";
import React, { useState, useEffect } from "react";
import { useSearchCourses } from "../../../../hooks/useSearchCourses";
import { DefaultTable } from "../../../../components/enroll-course/EnrollcourseTable";
import { UserInform } from "../../../../components/enroll-course/UserInform";
import useUser from "@/hooks/useUser";
import { Button } from "@/components/material-tailwind";
import { useRouter } from "next/navigation";

function EnrollPage() {
  const searchCourses = useSearchCourses();
  const [selectedCourseId] = useState<number | null>(null);
  const router = useRouter();
  const { data: user } = useUser();

  useEffect(() => {
    if (selectedCourseId) {
      searchCourses.refetch();
    }
  }, [selectedCourseId, searchCourses]);

  if (!user) {
    return <>沒登入</>;
  }
  return (
    <div className="flex w-full max-w-full flex-col gap-4">
      <div className="flex flex-row justify-between">
        <UserInform studentInfo={user} />{" "}
        <Button
          color="blue"
          className="w-32"
          onClick={() => {
            router.push("/search");
          }}
          placeholder={Button}
        >
          前往加選課程
        </Button>
      </div>
      <div className="w-full">
        <DefaultTable />
      </div>
    </div>
  );
}

export default EnrollPage;
