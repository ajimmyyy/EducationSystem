import React from "react";
import {
  Avatar,
  Typography,
} from "@material-tailwind/react";

export function Collect() {
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
      
    </>
  )
}