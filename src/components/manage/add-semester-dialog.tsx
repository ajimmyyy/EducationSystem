import {
  Button,
  ListItem,
  Input,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
}
from "@material-tailwind/react";
import { useState, useEffect, use } from 'react';
import apiFetcher from "@/utils/api-fetcher";

const AddSemesterListItem = () => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [inputSemester, setInputSemester] = useState("");

  const handleDialogOpen = () => {
    setDialogOpen(!dialogOpen);
    setInputSemester("");
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputSemester(event.target.value);
  };

  const handleAddData = () => {
    const fetchTable = async () => {
      const response =  await apiFetcher("/api/courseTable/add", {
        method: "POST",
        body: {
          semester: inputSemester,
        },
      });

      console.log(response);
    };
    fetchTable();
    setDialogOpen(false);
  };

  return (
    <>
      <ListItem placeholder onClick={handleDialogOpen}>
        學期管理
      </ListItem>
      <Dialog placeholder open={dialogOpen} handler={handleDialogOpen}>
        <DialogHeader placeholder>新增新學期</DialogHeader>
        <DialogBody placeholder>
          <Input crossOrigin label="semester name" value={inputSemester} onChange={handleInputChange} />
        </DialogBody>
        <DialogFooter placeholder>
          <Button
            placeholder
            variant="text"
            color="red"
            onClick={handleDialogOpen}
            className="mr-1"
          >
            <span>Cancel</span>
          </Button>
          <Button placeholder variant="gradient" color="green" onClick={handleAddData}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AddSemesterListItem;