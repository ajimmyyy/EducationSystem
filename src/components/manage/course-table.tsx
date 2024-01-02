import {
  Chip,
  Card,
  CardFooter,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useState, useEffect } from "react";
import AddCourseButton from "@/components/manage/add-course-button";
import { Table } from "./table";
import apiFetcher from "@/utils/api-fetcher";

// interface TableProps {
//   tableName: string;
//   tableHead: string[];
//   addHead: string[];
// }

export interface HeadProps {
  value: string;
  type: string;
}

// 資料庫資料表格
export function CourseTable({ type, keyWord }: { type: string, keyWord: string }) {
  const tableName = "課程列表";
  const tableHead = [
    "id",
    "code",
    "name",
    "credt",
    "phase",
    "studentQuota",
    "semester",
    "",
  ];
  const addHead: HeadProps[] = [
    { value: "code", type: "text" },
    { value: "name", type: "text" },
    { value: "credit", type: "number" },
    { value: "phase", type: "number" },
    { value: "studentQuota", type: "number" },
    { value: "syllabus", type: "text" },
    { value: "progress", type: "text" },
    { value: "grading", type: "text" },
    { value: "textbook", type: "text" },
    { value: "note1", type: "text" },
    { value: "note2", type: "text" },
    { value: "semester", type: "text" },
    { value: "teacherId", type: "number" },
    { value: "departmentId", type: "number" },
  ];

  const [tableRows, setTableRows] = useState<[]>([]);
  const [needUpdate, setNeedUpdate] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchDeparment = async () => {
      const { data } = await apiFetcher(`/api/ManageCourse?page=${page}&keyword=${keyWord}`, {});
      setTableRows(data);
      setNeedUpdate(false);
    };
    fetchDeparment();
  }, [page, keyWord, type, needUpdate]);

  useEffect(() => {
    setPage(1);
  }, [type]);

  return (
    <div className="mt-2 w-[55rem]">
      <div className="flex gap-2">
        <Chip value={tableName} className="flex-grow text-base" />
        <AddCourseButton
          parameter={addHead}
          role={type}
          setNeedUpdate={setNeedUpdate}
        />
      </div>
      <Card placeholder className="max-h-[calc(100vh-175px)] overflow-scroll">
        <Table
          role={type}
          tableHead={tableHead}
          tableRows={tableRows}
          setNeedUpdate={setNeedUpdate}
        />
        <CardFooter
          placeholder
          className="flex items-center justify-between border-t border-blue-gray-50 p-4"
        >
          <div className="flex items-center gap-2">
            <Chip
              variant="ghost"
              value={
                <Typography
                  placeholder
                  variant="small"
                  color="black"
                  className="font-medium capitalize leading-none"
                >
                  Page {page}
                </Typography>
              }
              className="rounded-full py-1.5"
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              placeholder
              variant="outlined"
              color="light-blue"
              size="sm"
              onClick={() => {
                page > 1 && setPage(page - 1);
              }}
            >
              Previous
            </Button>
            <Button
              placeholder
              variant="outlined"
              color="light-blue"
              size="sm"
              onClick={() => {
                setPage(page + 1);
              }}
            >
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
