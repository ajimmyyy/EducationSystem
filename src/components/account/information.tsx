import React from "react";
import {
  Avatar,
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import useUser from "@/hooks/useUser";
import { useSearchUser } from "@/hooks/useSearchUser";
 
const CUSTOM_ANIMATION = {
  mount: { scale: 1 },
  unmount: { scale: 0.9 },
};
 
export function Information() {
  const { data } = useUser();
  const [open, setOpen] = React.useState(0);
 
  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);
  const userInfo  = useSearchUser(data?.id ?? 0).data?.user;
 
  return (
    <>
      <div className="flex items-center gap-4">
        <Avatar placeholder src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar" />
        <div>
          <Typography placeholder variant="h6">{data?.name}</Typography>
          <Typography placeholder variant="small" color="gray" className="font-normal">
            {data?.role}
          </Typography>
        </div>
      </div>
      <Accordion placeholder open={open === 1} animate={CUSTOM_ANIMATION}>
        <AccordionHeader placeholder onClick={() => handleOpen(1)}>
          使用者資料
        </AccordionHeader>
        <AccordionBody>
          <div>
            <p className="mb-2"><span className="font-semibold">Id:</span> {userInfo?.id}</p>
            <p className="mb-2"><span className="font-semibold">Name:</span> {userInfo?.name}</p>
            <p className="mb-2"><span className="font-semibold">Email:</span> {userInfo?.email}</p>
            <p className="mb-2"><span className="font-semibold">Cellphone:</span> {userInfo?.cellphone}</p>
            <p className="mb-2"><span className="font-semibold">Department:</span> {userInfo?.department?.name}</p>
          </div>
        </AccordionBody>
      </Accordion>
      <Accordion placeholder open={open === 2} animate={CUSTOM_ANIMATION}>
        <AccordionHeader placeholder onClick={() => handleOpen(2)}>
          校務資料
        </AccordionHeader>
        <AccordionBody>
          {userInfo?.student && (
            <div>
              <p className="text-xl font-bold mb-2">學生資料</p>
              <p className="mb-2"><span className="font-semibold">Class:</span> {userInfo?.student.class}</p>
            </div>
          )}
          {userInfo?.teacher && (
            <div>
              <p className="text-xl font-bold mb-2">教師資料</p>
              <p className="mb-2"><span className="font-semibold">Info:</span> {userInfo?.teacher.info}</p>
              <p className="mb-2"><span className="font-semibold">Web:</span> {userInfo?.teacher.web}</p>
              <p className="mb-2"><span className="font-semibold">Office:</span> {userInfo?.teacher.office}</p>
            </div>
          )}
        </AccordionBody>
      </Accordion>
      <Accordion placeholder open={open === 3} animate={CUSTOM_ANIMATION}>
        <AccordionHeader placeholder onClick={() => handleOpen(3)}>
          其他資料
        </AccordionHeader>
        <AccordionBody> 
        </AccordionBody>
      </Accordion>
    </>
  );
}