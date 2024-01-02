import React from "react";
import {
  Avatar,
  Typography,
} from "@material-tailwind/react";
import useUser from "@/hooks/useUser";
import { Table } from "@/components/account/table";

export function Collect() {
  const { data } = useUser();

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