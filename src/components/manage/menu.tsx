import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import { set } from "zod";
 
// 管理員控制項目的選單
export function Menu({addOption}:{addOption: React.Dispatch<React.SetStateAction<string>>}) {
  //選單選項名稱
  const STUDENT_OPTION = "student";
  const TEACHER_OPTION = "teacher";
  const MANAGER_OPTION = "manager";
  const COURSE_OPTION = "course";
  const CLASSROOM_OPTION = "classroom";
  const DEPARTMENT_OPTION = "department";

  //分支選單開關
  const [open, setOpen] = React.useState(0);
  //分支選單開關控制
  const handleOpen = (value: React.SetStateAction<number>) => {
    setOpen(open === value ? 0 : value);
  };

  //選單選項點擊控制
  const handleMenuOption = (value: string) => {
    addOption(value);
  };
 
  return (
    <Card placeholder className=" h-[calc(100vh-4rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography placeholder variant="h5" color="blue-gray">
          Manage
        </Typography>
      </div>
      <List placeholder>
        <Accordion
          placeholder
          open={open === 1}
          icon={<span>{open === 1 ? '▲' : '▼'}</span>}
        >
          <ListItem placeholder className="p-0" selected={open === 1}>
            <AccordionHeader placeholder onClick={() => handleOpen(1)} className="border-b-0 p-3">
              <Typography placeholder color="blue-gray" className="mr-auto font-normal">
                使用者管理
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List placeholder className="p-0">
              <ListItem placeholder onClick={() => handleMenuOption(STUDENT_OPTION)}>
                學生管理
              </ListItem>
              <ListItem placeholder onClick={() => handleMenuOption(TEACHER_OPTION)}>
                教師管理
              </ListItem>
              <ListItem placeholder onClick={() => handleMenuOption(MANAGER_OPTION)}>
                管理員管理
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <ListItem placeholder onClick={() => handleMenuOption(COURSE_OPTION)}>
          課程管理
        </ListItem>
        <ListItem placeholder onClick={() => handleMenuOption(CLASSROOM_OPTION)}>
          教室管理
        </ListItem>
        <ListItem placeholder onClick={() => handleMenuOption(DEPARTMENT_OPTION)}>
          系所管理
        </ListItem>
      </List>
    </Card>
  );
}
