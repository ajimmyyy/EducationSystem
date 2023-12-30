import {
  Chip,
  Card,
  Typography,
}
from "@material-tailwind/react";
import { useState, useEffect, use } from "react";
import { useSearchUser } from "@/hooks/useSearchUser";
import AddInfoButton from "./add-info-dialog";
import EditMenu from "./edit-menu";

//表格元素
const TableCell = ({ classes, value }: { classes: string; value: string }) => (
  <td className={classes}>
    <Typography placeholder variant="small" color="blue-gray" className="font-normal">
      {value}
    </Typography>
  </td>
);

//表格行
const TableRow = ({ classes, id, name, email, cellphone, departmentId, schoolClass, office, web, info }: {
  classes: string;
  id: number;
  name: string;
  email: string;
  cellphone: string;
  departmentId: number;
  schoolClass?: string;
  office?: string;
  web?: string;
  info?: string;
}) => {
  return (
    <tr key={id}>
      {Object.values({ id, name, email, cellphone, departmentId, schoolClass, office, web, info })
        .filter((value) => value !== undefined)
        .map((value, index) => (
          <TableCell key={index} classes={classes} value={String(value)} />
        ))}
      <td className={classes}>
        <EditMenu userId={id}/>
      </td>
    </tr>
  );
};

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

// 資料庫資料表格
export function EditUserInfo({ userType }: { userType: string }) {  
  const userTypeMappings: { [key: string]: { tableName: string; tableHead: string[] } } = {
    student: { tableName: "學生列表", tableHead: ["id", "name", "email", "cellphone", "department", "schoolClass", ""] },
    teacher: { tableName: "教師列表", tableHead: ["id", "name", "email", "cellphone", "department", "office", "web", "info", ""] },
    manager: { tableName: "管理員列表", tableHead: ["id", "name", "email", "cellphone", "department", ""] },
  };

  //表格名稱, 表格頭
  const { tableName, tableHead } = userTypeMappings[userType] || userTypeMappings.student;
  //新增資料項目
  const inputHead = [...tableHead.slice(1, 2), "password", ...tableHead.slice(2, -1),];
  //表格行
  const [tableRows, setTableRows] = useState([]);
  //搜尋資料(使用者資料)
  const { users } = useSearchUser(userType);

  useEffect(() => {
    setTableRows(users);
  }, [users]);

  return (
    <div className="w-[calc(100vw-305px)] mt-2">
      <div className="flex gap-2">
        <Chip value={tableName} className="text-base flex-grow" />
        <AddInfoButton parameter={inputHead} role={userType} />
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
            {tableRows.map(({ id, name, email, cellphone, departmentId, schoolClass, office, web, info }, index) => {
              const isLast = index === tableRows.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";
              return (
                <TableRow
                  classes={classes}
                  id={id}
                  name={name}
                  email={email}
                  cellphone={cellphone}
                  departmentId={departmentId}
                  schoolClass={schoolClass}
                  office={office}
                  web={web}
                  info={info}
                />
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}