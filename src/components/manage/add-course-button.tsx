import {
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Button,
}
  from "@material-tailwind/react";
import apiFetcher from "@/utils/api-fetcher";
import { useState, useEffect, use } from 'react';
import AddCourseStep from "@/components/manage/add-course-step";
import React from "react";

interface HeadProps {
  value: string,
  type: string
}

interface AddInfoButtonProps {
  parameter: HeadProps[];
  role: string;
  setNeedUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}


function AddCourseButton({ parameter, role, setNeedUpdate }: AddInfoButtonProps) {

  const [dialogOpen, setDialogOpen] = useState(false);
  const [parameterHead, setParameterHead] = useState<HeadProps[]>([]);
  const [inputInfos, setInputInfos] = useState<{}>({});

  useEffect(() => {
    setParameterHead(parameter);
  }, [parameter]);

  const handleDialogOpen = () => {
    setDialogOpen(!dialogOpen);
    setInputInfos({});
  };

  const handleInputChange = (key: HeadProps ) => (event: React.ChangeEvent<HTMLInputElement>) => {
    if (key.type === "number") {
      setInputInfos((prevInputInfo) => ({
        ...prevInputInfo,
        [key.value]: parseInt(event.target.value, 10),
      }));
      return;
    }
    
    setInputInfos((prevInputInfo) => ({
      ...prevInputInfo,
      [key.value]: event.target.value,
    }));
  };

  return (
    <>
      <IconButton
        placeholder
        variant="gradient"
        className="rounded-full"
        color="amber"
        onClick={handleDialogOpen}
      >
        <img src="/images/plus-solid.svg" alt="Plus Icon" />
      </IconButton>
      <Dialog placeholder open={dialogOpen} handler={handleDialogOpen}>
        <DialogHeader placeholder>課程資訊</DialogHeader>
        <DialogBody placeholder>
          {parameterHead.map((value, index) => (
            <input
              key={value.value}
              type={value.type}
              placeholder={`Enter ${value.value}`}
              className="mt-2"
              min={0}
              onChange={handleInputChange(value)}
            />
          ))}
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
          <AddCourseStep inputInfos={inputInfos} setNeedUpdate={setNeedUpdate}/>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AddCourseButton;