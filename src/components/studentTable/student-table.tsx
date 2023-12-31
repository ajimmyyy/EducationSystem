"use client";

import { Paper, Stack } from "@mui/material";
import { TimetableRow } from "./timetable-row";
import { useState } from "react";
import useGetStudentCourse from "@/hooks/useGetStudentCourse";
import StudentTableItem from "./student-table-item";
import { Select, Option } from "@material-tailwind/react";

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
  B: { start: "19:20", end: "20:10" },
  C: { start: "20:20", end: "21:10" },
  D: { start: "21:10", end: "22:00" },
};

const studentId = 736;

export default function StudentTable() {
  const [semester, setSemester] = useState("112-2");
  const { data, totalCredit } = useGetStudentCourse(studentId, semester);

  return (
    <>
      <div className="pb-4 pt-2 md:px-4">
        <div>
          <Select
            label="學期"
            placeholder={undefined}
            value={semester}
            onChange={(e) => {
              setSemester(e as string);
            }}
          >
            <Option value="112-2">112-2</Option>
            <Option value="112-1">112-1</Option>
          </Select>
        </div>
        <h1>總學分: {totalCredit}</h1>
        <table
          style={{
            marginTop: "2rem",
            width: "100%",
            height: "100%",
            borderCollapse: "separate",
            // borderSpacing: "0 2px",
            borderSpacing: 0,
            tableLayout: "fixed",
          }}
        >
          <thead>
            <tr>
              <th></th>
              {"一二三四五六".split("").map((day) => (
                <th key={day}>{day}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {"1234N56789ABCD".split("").map((interval) => (
              <TimetableRow key={interval}>
                <td>
                  <Stack sx={{ height: "100%" }} justifyContent="space-between">
                    <span style={{ fontSize: "14px", color: "#888888" }}>
                      {intervals[interval].start}
                    </span>
                    <span style={{ fontWeight: 500 }}>{interval}</span>
                    <span style={{ fontSize: "14px", color: "#888888" }}>
                      {intervals[interval].end}
                    </span>
                  </Stack>
                </td>
                {"012345".split("").map((day) => (
                  <td key={day + interval}>
                    <StudentTableItem
                      courseItem={data[`${day}-${interval}` as string]}
                    ></StudentTableItem>
                  </td>
                ))}
              </TimetableRow>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
