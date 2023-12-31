"use client";

import {
  Button,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Dialog,
  Chip,
} from "@/components/material-tailwind";
import { useEffect, useState } from "react";
import { useUpdateSearchParams } from "@/hooks/useUpdateSearchParams";
import { useSearchParams } from "next/navigation";
import { useDepartments } from "@/hooks/useDepartments";
import { Department } from "@prisma/client";
import { useQueryParams } from "@/hooks/useQueryParams";

export default function DepartmentSelector() {
  const [open, setOpen] = useState(false);
  const queryParams = useQueryParams();

  const handleOpen = () => setOpen(!open);

  return (
    <>
      <Button
        onClick={handleOpen}
        size="sm"
        variant="gradient"
        placeholder={undefined}
      >
        開課系所篩選{" "}
        {queryParams.departments
          ? `已選：${queryParams.departments.split(",").length} 個系所`
          : null}
      </Button>
      <Dialog open={open} handler={handleOpen} placeholder={undefined}>
        <DialogHeader placeholder={undefined}>
          <h4 className="text-xl font-bold">開課系所篩選</h4>
        </DialogHeader>
        <DialogBody placeholder={undefined}>
          <DepartmentSelectorInput />
        </DialogBody>
        <DialogFooter placeholder={undefined}>
          <Button
            variant="gradient"
            color="green"
            onClick={handleOpen}
            placeholder={undefined}
          >
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

function DepartmentSelectorInput() {
  const { data: { departments } = {} } = useDepartments();
  const [selectedDepartments, setSelectedDepartments] = useState<Department[]>(
    [],
  );
  const [keyword, setKeyword] = useState("");
  const updateSearchParams = useUpdateSearchParams();
  const searchParams = useSearchParams();

  const selectDepartments = (departments: Department[]) => {
    setSelectedDepartments(departments);
    updateSearchParams({
      departments: departments.map((department) => department.id).join(","),
    });
  };

  useEffect(() => {
    if (!searchParams.get("departments")) return;
    const departmentIds = searchParams
      .get("departments")
      ?.split(",")
      .map(Number);
    if (!departments) return;
    const selectedDepartments = departments.filter(
      (department) => departmentIds?.includes(department.id),
    );
    setSelectedDepartments(selectedDepartments);
  }, [departments]);

  return (
    <div className="flex h-fit w-full flex-col rounded border">
      <div className=" flex min-h-[32px] flex-wrap gap-2 rounded border">
        {selectedDepartments.map((department) => (
          <Chip
            key={department.id}
            value={department.name}
            onClose={() => {
              selectDepartments(
                selectedDepartments.filter(
                  (selectedDepartment) => selectedDepartment !== department,
                ),
              );
            }}
          />
        ))}
        <input
          placeholder="輸入系所 / 班級名稱"
          className="flex-grow"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
        />
      </div>
      <div className="flex max-h-64 flex-col overflow-y-auto">
        {departments
          ?.filter((department) => !selectedDepartments.includes(department))
          .filter((department) => department.name.includes(keyword))
          .map((department) => (
            <div
              key={department.id}
              className="cursor-pointer p-2 hover:bg-gray-200"
              onClick={() => {
                selectDepartments([...selectedDepartments, department]);
              }}
            >
              {department.name}
            </div>
          ))}
      </div>
    </div>
  );
}
