import {
  Chip,
  Card,
  CardFooter,
  Typography,
  Button,
}
  from "@material-tailwind/react";
import { useState, useEffect, use } from "react";
import AddInfoButton from "./add-info-button";
import { Table } from "./table";
import apiFetcher from "@/utils/api-fetcher";

interface TableProps {
  tableName: string;
  tableHead: string[];
  addHead: string[];
}

// 資料庫資料表格
export function UserTable({ type }: { type: string }) {
  const typeMappings: { [key: string]: TableProps } = {
    student: {
      tableName: "學生列表",
      tableHead: ["id", "name", "email", "cellphone", "department", "schoolClass", ""],
      addHead: ["name", "password", "email", "cellphone", "department", "schoolClass"],
    },
    teacher: {
      tableName: "教師列表",
      tableHead: ["id", "name", "email", "cellphone", "department", "office", "web", "info", ""],
      addHead: ["name", "password", "email", "cellphone", "department", "office", "web", "info"],
    },
    manager: {
      tableName: "管理員列表",
      tableHead: ["id", "name", "email", "cellphone", "department", ""],
      addHead: ["name", "password", "email", "cellphone", "department"],
    },
  };

  const { tableName, tableHead, addHead } = typeMappings[type] || typeMappings.student;
  const [tableRows, setTableRows] = useState<[]>([]);
  const [needUpdate, setNeedUpdate] = useState(false);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await apiFetcher(`/api/ManageUser?type=${type}&page=${page}`, {});
      setTableRows(data);
      setNeedUpdate(false);
    };
    fetchUser();
  }, [page, type, needUpdate]);

  useEffect(() => {
    setPage(1);
  }, [type]);

  return (
    <div className="w-[calc(100vw-305px)] mt-2">
      <div className="flex gap-2">
        <Chip value={tableName} className="text-base flex-grow" />
        <AddInfoButton parameter={addHead} role={type} setNeedUpdate={setNeedUpdate} />
      </div>
      <Card placeholder className="overflow-scroll max-h-[calc(100vh-175px)]">
        <Table role={type} tableHead={tableHead} tableRows={tableRows} setNeedUpdate={setNeedUpdate} />
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