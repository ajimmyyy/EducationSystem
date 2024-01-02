import React from "react";
import {
  Avatar,
  Typography,
} from "@material-tailwind/react";
import useUser from "@/hooks/useUser";
import { useSearchUser } from "@/hooks/useSearchUser";
import { Table } from "@/components/account/table";

export function Collect() {
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
      <Table id={data?.id ?? 0}/>
    </>
  )
}