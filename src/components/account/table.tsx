import {
    Card,
    CardFooter,
    Typography,
    Button,
  }
    from "@material-tailwind/react";
  import { useState, useEffect, use } from "react";

  interface TableRowProps {
    code: string;
    name: string;
    credt: string;
    phase: string;
    studentQuota: string;
    semester: string;
  }
  
  // 資料庫資料表格
  export function Table(setNeedUpdate: React.Dispatch<React.SetStateAction<boolean>>) {
    const tableHead = ["code", "name", "credt", "phase", "studentQuota", "semester", ""]; //表格標題
    const tableRows: TableRowProps[] = []

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
    const TableRow = (tableRow: TableRowProps) => {
      const { code } = tableRow;
      return (
        <tr key={code}>
          {Object.values(tableRow)
            .filter((value) => value !== undefined)
            .map((value, index) => (
              <td
                key={index}
                className={`p-4 border-b border-blue-gray-50 ${index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                  }`}
              >
                <Typography
                  placeholder
                  variant="small"
                  color="blue-gray"
                  className="font-normal"
                >
                  {value}
                </Typography>
              </td>
            ))}
        </tr>
      );
    };
  
    return (
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
            return <TableRow {...rowData} />;
          })}
        </tbody>
      </table>
    );
  }