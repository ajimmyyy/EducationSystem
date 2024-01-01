import React from "react";
import {
  Avatar,
  Typography,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
 
const CUSTOM_ANIMATION = {
  mount: { scale: 1 },
  unmount: { scale: 0.9 },
};
 
export function Information() {
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
          使用者資料
        </AccordionHeader>
        <AccordionBody>
          We&apos;re not always in the position that we want to be at. We&apos;re constantly
          growing. We&apos;re constantly making mistakes. We&apos;re constantly trying to express
          ourselves and actualize our dreams.
        </AccordionBody>
      </Accordion>
      <Accordion placeholder open={open === 2} animate={CUSTOM_ANIMATION}>
        <AccordionHeader placeholder onClick={() => handleOpen(2)}>
          校務資料
        </AccordionHeader>
        <AccordionBody>
          We&apos;re not always in the position that we want to be at. We&apos;re constantly
          growing. We&apos;re constantly making mistakes. We&apos;re constantly trying to express
          ourselves and actualize our dreams.
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