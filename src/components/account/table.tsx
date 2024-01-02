import {
    Card,
    CardFooter,
    Typography,
    Button,
    Chip,
  }
    from "@material-tailwind/react";
  import { useState, useEffect } from "react";
  import { useSearchCollectCourse } from "@/hooks/useSearchCollectCouse"

  interface TableRowProps {
    code: string;
    name: string;
    credt: number;
    phase: number;
    studentQuota: number;
    semester: string;
  }

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
  
  // 資料庫資料表格
  export function Table({id}:{id:number}) {
    const tableHead = ["code", "name", "credt", "phase", "studentQuota", "semester", ""]; //表格標題
    const [tableRows, setTableRows] = useState<TableRowProps[]>([]);
    const [page, setPage] = useState(1);

    const courses = useSearchCollectCourse(id).data?.courses;

    useEffect(() => {
      setPage(1);
    }, []);

    useEffect(() => {
      if (courses) {
        const convertedRows = courses.map(courseData => ({
          code: courseData.course.code,
          name: courseData.course.name,
          credt: courseData.course.credit,
          phase: courseData.course.phase,
          studentQuota: courseData.course.studentQuota,
          semester: courseData.course.semester,
        }));
        console.log(convertedRows);
        setTableRows(convertedRows);
      }
    }, [courses]);
    
    return (
      <>
        <Card placeholder className=" max-h-[calc(100vh-175px)] w-[calc(70vw)]">
          <table className="table-auto text-left">
            <thead>
              <tr>
                {tableHead.map((head) => (
                  <TableHeader key={head} head={head} width={100 / (tableHead.length - 1)} />
                ))}
              </tr>
            </thead>
            <tbody>
              {tableRows.map((rowData, index) => {
                return <TableRow key={index} {...rowData} />;
              })}
            </tbody>
          </table>
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
                onClick={() => { page > 1 && setPage(page - 1) }}
              >
                Previous
              </Button>
              <Button
                placeholder
                variant="outlined"
                color="light-blue"
                size="sm"
                onClick={() => { setPage(page + 1) }}
              >
                Next
              </Button>
            </div>
          </CardFooter>
        </Card>
      </>
      
    );
  }