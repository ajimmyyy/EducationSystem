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
import EditMenu from "./edit-menu";
import apiFetcher from "@/utils/api-fetcher";

interface TableRowProps {
  id: number;
  name: string;
  email: string;
  cellphone: string;
  department: string;
  schoolClass?: string;
  office?: string;
  web?: string;
  info?: string;
}

// 資料庫資料表格
export function EditUserInfo({ userType }: { userType: string }) {  
  const userTypeMappings: { [key: string]: { tableName: string; tableHead: string[] } } = {
    student: { 
      tableName: "學生列表", 
      tableHead: ["id", "name", "email", "cellphone", "department", "schoolClass", ""] 
    },
    teacher: { 
      tableName: "教師列表", 
      tableHead: ["id", "name", "email", "cellphone", "department", "office", "web", "info", ""] 
    },
    manager: { 
      tableName: "管理員列表", 
      tableHead: ["id", "name", "email", "cellphone", "department", ""] },
  };

  //表格名稱, 表格頭
  const { tableName, tableHead } = userTypeMappings[userType] || userTypeMappings.student;
  //新增資料項目
  const inputHead = [...tableHead.slice(1, 2), "password", ...tableHead.slice(2, -1),];
  //表格行資料(使用者資料)
  const [tableRows, setTableRows] = useState<TableRowProps[]>([]);
  //分頁
  const[page, setPage] = useState(1);
  const [needUpdate, setNeedUpdate] = useState(false);

  //表格列元素
  const TableHeader = ({ head, width }: { head: string, width: number }) => (
    <th
      className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
      style={{ width: `${width}%` }}
    >
      <Typography
        placeholder
        variant="small"
        color="blue-gray"
        className="font-normal leading-none opacity-70"
      >
        {head}
      </Typography>
    </th>
  );

  //表格行
  const TableRow = (props: TableRowProps & {classes: string}) => {
    const { id, name, email, cellphone, department, schoolClass, office, web, info, classes } = props;
    return (
      <tr key={id}>
        {Object.values({ id, name, email, cellphone, department, schoolClass, office, web, info })
          .filter((value) => value !== undefined)
          .map((value, index) => (
            <td className={classes}>
              <Typography placeholder variant="small" color="blue-gray" className="font-normal">
                {value}
              </Typography>
            </td>
          ))}
        <td className={classes}>
          <EditMenu userId={id} setNeedUpdate={setNeedUpdate}/>
        </td>
      </tr>
    );
  };
  
  useEffect(() => {
    const fetchUser = async () => {
      const { data } = await apiFetcher(`/api/ManageUser?type=${userType}&page=${page}`, {});
      setTableRows(data);
      setNeedUpdate(false);
    };
    fetchUser();
  }, [page, userType, needUpdate]);

  return (
    <div className="w-[calc(100vw-305px)] mt-2">
      <div className="flex gap-2">
        <Chip value={tableName} className="text-base flex-grow" />
        <AddInfoButton parameter={inputHead} role={userType} setNeedUpdate={setNeedUpdate} />
      </div>
      <Card placeholder className="overflow-scroll max-h-[calc(100vh-175px)]">
        <table className="table-auto text-left">
          <thead>
            <tr>
              {tableHead.map((head) => (
                <TableHeader head={head} width={100 / (tableHead.length - 1)} />
              ))}
            </tr>
          </thead>
          <tbody>
          {tableRows.map((rowData, index) => {
            const isLast = index === tableRows.length - 1;
            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
            return <TableRow key={rowData.id} {...rowData} classes={classes} />;
          })}
          </tbody>
        </table>
        <CardFooter 
          placeholder 
          className="flex items-center justify-between border-t border-blue-gray-50 p-4"
        >
          <div className="flex gap-2">
            <Typography placeholder variant="small" color="blue-gray" className="font-normal w-[calc(60vw)]">
              Page {page}
            </Typography>
            <Button placeholder variant="outlined" size="sm" onClick={()=>{page > 1 && setPage(page - 1)}}>
              Previous
            </Button>
            <Button placeholder variant="outlined" size="sm" onClick={()=>{setPage(page + 1)}}>
              Next
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}