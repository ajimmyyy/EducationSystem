import { Card } from "@material-tailwind/react";

export function UserInform({ studentInfo }: { studentInfo: any }) {
    return (
      <Card className="rounded-lg" placeholder="">
          <div className="bg-blue-gray-100 rounded-sm px-2 py-1 inline-block max-w-sm">
              <div>學生學號：{studentInfo.studentId}</div>
              <div>學生姓名：{studentInfo.name}</div>
              <div>學生系級：{studentInfo.department}</div>
          </div>
      </Card>
    );
  }
  
