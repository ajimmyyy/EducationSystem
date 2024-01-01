import React from "react";
import {
  Avatar,
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
  Input,
} from "@material-tailwind/react";
import { UpdatePopover } from "./upate-popover";

const CUSTOM_ANIMATION = {
  mount: { scale: 1 },
  unmount: { scale: 0.9 },
};

export function Setting() {
  const [open, setOpen] = React.useState(0);

  const handleOpen = (value: number) => setOpen(open === value ? 0 : value);

  return (
    <>
      <div className="flex items-center gap-4">
        <Avatar placeholder src="https://docs.material-tailwind.com/img/face-2.jpg" alt="avatar" />
        <div>
          <Typography placeholder variant="h6">Tania Andrew</Typography>
          <Typography placeholder variant="small" color="gray" className="font-normal">
            Web Developer
          </Typography>
        </div>
      </div>
      <Accordion placeholder open={open === 1} animate={CUSTOM_ANIMATION}>
        <AccordionHeader placeholder onClick={() => handleOpen(1)}>
          設定密碼
        </AccordionHeader>
        <AccordionBody>
          <UpdatePopover type={"password"}/>
        </AccordionBody>
      </Accordion>
      <Accordion placeholder open={open === 2} animate={CUSTOM_ANIMATION}>
        <AccordionHeader placeholder onClick={() => handleOpen(2)}>
          設定信箱
        </AccordionHeader>
        <AccordionBody>
          <UpdatePopover type={"email"}/>
        </AccordionBody>
      </Accordion>
      <Accordion placeholder open={open === 3} animate={CUSTOM_ANIMATION}>
        <AccordionHeader placeholder onClick={() => handleOpen(3)}>
          設定電話
        </AccordionHeader>
        <AccordionBody>
         <UpdatePopover type={"cellphone"}/>
        </AccordionBody>
      </Accordion>
    </>
  );
}