import TeacherTableItem from "./teacher-table-item";
import useGetTeacherCourse from "@/hooks/useGetTeacherCourse";
import { useState } from "react";
import { Select, Option } from "@material-tailwind/react";

// 放在最左側的時間表，同時也是用來從CourseTable取得課
const intervals: Record<string, { start: string; end: string }> = {
  "1": { start: "08:10", end: "09:00" },
  "2": { start: "09:10", end: "10:00" },
  "3": { start: "10:10", end: "11:00" },
  "4": { start: "11:10", end: "12:00" },
  N: { start: "12:10", end: "13:00" },
  "5": { start: "13:10", end: "14:00" },
  "6": { start: "14:10", end: "15:00" },
  "7": { start: "15:10", end: "16:00" },
  "8": { start: "16:10", end: "17:00" },
  "9": { start: "17:10", end: "18:00" },
  A: { start: "18:30", end: "19:20" },
  B: { start: "19:30", end: "20:20" },
  C: { start: "20:30", end: "21:20" },
  D: { start: "21:30", end: "22:20" },
};

// 在等登入功能完成前，先寫死老師ID
const teacherID = 4;
const defaultSemester = "112-2";

// 產生老師課表的畫面
export default function TeacherTable() {
  const [semester, setSemester] = useState(defaultSemester);
  const { data } = useGetTeacherCourse(teacherID, semester);

  return (
    <>
      <div className="mt-4">
        <Select
          label="學期"
          placeholder={undefined}
          onChange={(e) => {
            setSemester(e as string);
          }}
          value={defaultSemester}
        >
          <Option value="111-1">111-1</Option>
          <Option value="111-2">111-2</Option>
          <Option value="112-1">112-1</Option>
          <Option value="112-2">112-2</Option>
        </Select>
      </div>
      <table
        style={{
          width: "100%",
          height: "100%",
          borderCollapse: "separate",
          borderSpacing: 0,
          tableLayout: "fixed",
        }}
      >
        <thead>
          <tr>
            <th></th>
            {"日一二三四五六".split("").map((day) => (
              <th key={day}>{day}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {"123456789ABCD".split("").map((interval) => (
            <tr key={interval}>
              <td>
                <div className=" d-flex flex-col justify-center">
                  <span style={{ fontSize: "14px", color: "#888888" }}>
                    {intervals[interval].start}
                  </span>
                  <span style={{ fontWeight: 500 }}>{interval}</span>
                  <span style={{ fontSize: "14px", color: "#888888" }}>
                    {intervals[interval].end}
                  </span>
                </div>
              </td>
              {"0123456".split("").map((day) => (
                <td key={day + interval}>
                  <TeacherTableItem
                    courseItem={data[`${day}-${interval}` as string]}
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
