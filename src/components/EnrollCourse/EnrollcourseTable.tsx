import { Card, Typography, Button } from "@material-tailwind/react";
import { MdCreate } from "react-icons/md";

const TABLE_HEAD = ["State", "Course Name", "Course Time", "Course ID", ""];

const TABLE_ROWS = [
  {
    state: "已加選",
    courseName: "Web Development",
    courseTime: "1-1",
    courseId: "WD101",
  },
  {
    state: "簽核中",
    courseName: "Data Science",
    courseTime: "2-3、4-2",
    courseId: "DS102",
  },
  {
    state: "已撤銷",
    courseName: "Machine Learning",
    courseTime: "3-2",
    courseId: "ML103",
  },
  {
    state: "已加選",
    courseName: "Digital Marketing",
    courseTime: "4-4",
    courseId: "DM104",
  },
  {
    state: "簽核中",
    courseName: "Graphic Design",
    courseTime: "5-1",
    courseId: "GD105",
  },
];

export function DefaultTable() {
  return (
    <Card className="h-full w-full overflow-scroll" placeholder="">
      <table className="w-full min-w-max table-auto text-left">
        <thead>
          <tr>
            {TABLE_HEAD.map((head) => (
              <th
                key={head}
                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
              >
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="font-normal leading-none opacity-70"
                  placeholder={head}
                >
                  {head}
                </Typography>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {TABLE_ROWS.map(({ state, courseName, courseTime, courseId }, index) => {
            const classes = `${index % 2 === 0 ? "bg-white" : "bg-gray-100"} p-4 border-b border-blue-gray-50`;
            let stateButtonColor = state === "已加選" ? "green" : state === "簽核中" ? "orange" : "gray";

            return (
              <tr key={index}>
                <td className={classes}>
                  <Button
                    size="sm"
                    color={stateButtonColor === "green" ? "green" : stateButtonColor === "orange" ? "orange" : "blue-gray"}
                    className="capitalize"
                    placeholder={state}
                  >
                    {state}
                  </Button>
                </td>

                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                    placeholder={courseName}
                  >
                    {courseName}
                  </Typography>
                </td>

                <td className={classes}>
                  <div className="bg-blue-gray-100 rounded-full px-2 py-1 inline-block">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="font-normal"
                      placeholder={courseTime}
                    >
                      {courseTime}
                    </Typography>
                  </div>
                </td>

                <td className={classes}>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="font-normal"
                    placeholder={courseId}
                  >
                    {courseId}
                  </Typography>
                </td>

                <td className={classes} style={{ width: '150px' }}>
                  <Button size="sm" variant="gradient" color="blue-gray" className="flex items-center gap-2" placeholder= "">修改<MdCreate /></Button>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
