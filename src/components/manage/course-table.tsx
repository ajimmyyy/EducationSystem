import {
  Chip,
  Card,
  CardFooter,
  Typography,
  Button,
}
  from "@material-tailwind/react";
import { useState, useEffect, use } from "react";
import AddCourseButton from "@/components/manage/add-course-button";
import { Table } from "./table";
import apiFetcher from "@/utils/api-fetcher";

interface TableProps {
  tableName: string;
  tableHead: string[];
  addHead: string[];
}

export interface HeadProps {
  value: string,
  type: string
}

// 資料庫資料表格
export function CourseTable({ userType }: { userType: string }) {
  const tableName = "課程列表";
  const tableHead = ["id", "code", "name", "credt", "phase", "studentQuota", ""];
  const addHead:HeadProps[] = [
    {value: "code", type: "text"},
    {value: "name", type: "text"},
    {value: "credit", type: "number"},
    {value: "phase", type: "number"},
    {value: "studentQuota", type: "number"},
    {value: "syllabus", type: "text"},
    {value: "progress", type: "text"},
    {value: "grading", type: "text"},
    {value: "textbook", type: "text"},
    {value: "note1", type: "text"},
    {value: "note2", type: "text"},
    {value: "semester", type: "text"},
    {value: "teacherId", type: "number"},
    {value: "departmentId", type: "number"},
  ];

  const [tableRows, setTableRows] = useState<[]>([]);
  const [needUpdate, setNeedUpdate] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchDeparment = async () => {
      const { data } = await apiFetcher(`/api/ManageCourse?page=${page}`, {});
      setTableRows(data);
      setNeedUpdate(false);
    };
    fetchDeparment();
  }, [page, userType, needUpdate]);

  useEffect(() => {
    setPage(1);
  }, [userType]);

  return (
    <div className="w-[calc(100vw-305px)] mt-2">
      <div className="flex gap-2">
        <Chip value={tableName} className="text-base flex-grow" />
        <AddCourseButton parameter={addHead} role={userType} setNeedUpdate={setNeedUpdate} />
      </div>
      <Card placeholder className="overflow-scroll max-h-[calc(100vh-175px)]">
        <Table tableHead={tableHead} tableRows={tableRows} setNeedUpdate={setNeedUpdate} />
        <CardFooter
          placeholder
          className="flex items-center justify-between border-t border-blue-gray-50 p-4"
        >
          <div className="flex gap-2">
            <Typography placeholder variant="small" color="blue-gray" className="font-normal w-[calc(60vw)]">
              Page {page}
            </Typography>
            <Button placeholder variant="outlined" size="sm" onClick={() => { page > 1 && setPage(page - 1) }}>
              Previous
            </Button>
            <Button placeholder variant="outlined" size="sm" onClick={() => { setPage(page + 1) }}>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}