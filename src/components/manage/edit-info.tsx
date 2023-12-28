import { 
  Chip,
  Card, 
  Typography 
} 
from "@material-tailwind/react";

const TABLE_HEAD = ["uuid", "name", "email", "cellphone", "department", "class", ""];

const TABLE_ROWS = [
  {
    uuid: 1,
    name: "John Michael",
    email: "tmp@gmail.com",
    cellphone: "0912345678",
    department: "資工系",
    schoolClass: "資工三",
  },
];

const TableCell = ({ classes, value }: { classes: string; value: string }) => (
  <td className={classes}>
    <Typography placeholder variant="small" color="blue-gray" className="font-normal">
      {value}
    </Typography>
  </td>
);

const TableRow = ({ classes, uuid, name, email, cellphone, department, schoolClass }:{
  classes: string;
  uuid: number;
  name: string;
  email: string;
  cellphone: string;
  department: string;
  schoolClass: string;
}) => {
  return (
    <tr key={uuid}>
      {Object.values({ uuid, name, email, cellphone, department, schoolClass }).map((value, index) => (
      <TableCell key={index} classes={classes} value={String(value)} />
      ))}
      <td className={classes}>
        <Typography
          placeholder
          as="a"
          href="#"
          variant="small"
          color="blue-gray"
          className="font-medium"
        >
          Edit
        </Typography>
      </td>
    </tr>
  );
};

export function EditStudentInfo() {
  return (
    <div className="w-[calc(100vw-18rem)] mt-2">
      <Chip value="學生列表" className="text-base"/>
      <Card placeholder className="overflow-scroll">
        <table className="table-auto text-left">
          <thead>
            <tr>
              {TABLE_HEAD.map((head) => (
                <th
                  key={head}
                  className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
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
              ))}
            </tr>
          </thead>
          <tbody>
            {TABLE_ROWS.map(({ uuid, name, email, cellphone, department, schoolClass }, index) => {
              const isLast = index === TABLE_ROWS.length - 1;
              const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

              return (
                <TableRow
                  classes={classes}
                  uuid={uuid}
                  name={name}
                  email={email}
                  cellphone={cellphone}
                  department={department}
                  schoolClass={schoolClass}
                />
              );
            })}
          </tbody>
        </table>
      </Card>
    </div>
  );
}