import { JWTToken } from "@/services/userService";
import { Card } from "@material-tailwind/react";

export function UserInform({ studentInfo }: { studentInfo: JWTToken }) {
  return (
    <Card className="rounded-lg" placeholder="">
      <div className="inline-block max-w-sm rounded-sm bg-blue-gray-100 px-2 py-1">
        <div>學生學號：{studentInfo.id}</div>
        <div>學生姓名：{studentInfo.name}</div>
        <div>學生系級：{studentInfo.department}</div>
      </div>
    </Card>
  );
}
