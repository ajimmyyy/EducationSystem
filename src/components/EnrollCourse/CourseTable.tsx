import { Card, Typography, Button } from "@material-tailwind/react";

const TABLE_HEAD = ["Course Name", "Course Time", "Course ID", "Personal Ceiling",""];

const TABLE_ROWS = [
  {
    courseName: "Web Development",
    courseTime: "1-1",
    courseId: "WD101",
    personalCeiling: "20",
  },
  {
    courseName: "Data Science",
    courseTime: "2-3、4-2",
    courseId: "DS102",
    personalCeiling: "20",
  },
  {
    courseName: "Digital Marketing",
    courseTime: "4-4",
    courseId: "DM104",
    personalCeiling: "20",
  },
  {
    courseName: "Graphic Design",
    courseTime: "5-1",
    courseId: "GD105",
    personalCeiling: "100",
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
          {TABLE_ROWS.map(({ courseName, courseTime, courseId, personalCeiling }, index) => {
            const classes = `${index % 2 === 0 ? "bg-white" : "bg-gray-100"} p-4 border-b border-blue-gray-50`;

            return (
              <tr key={index}>
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

                <td className={classes}>
                    <Typography
                        variant="small"
                        color="blue-gray"
                        className="font-normal"
                        placeholder={personalCeiling}
                    >
                        {personalCeiling}
                    </Typography>
                </td>

                <td className={classes} style={{ width: '150px' }}>
                  <Button size="sm" variant="gradient" color="blue-gray" className="flex items-center gap-2" placeholder= "">加選</Button>
                </td>

              </tr>
            );
          })}
        </tbody>
      </table>
    </Card>
  );
}
