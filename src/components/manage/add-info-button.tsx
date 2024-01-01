import {
  Button,
  IconButton,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
}
  from "@material-tailwind/react";
import apiFetcher from "@/utils/api-fetcher";
import { useState, useEffect, use } from 'react';

interface AddInfoButtonProps {
  parameter: string[];
  role: string;
  setNeedUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}

function AddInfoButton({ parameter, role, setNeedUpdate }: AddInfoButtonProps) {
  const userTypeMappings: { [key: string]: string } = {
    student: "/api/ManageUser",
    teacher: "/api/ManageUser",
    manager: "/api/ManageUser",
    course: "/api/ManageCourse",
    classroom: "/api/ManageClassroom",
    department: "/api/ManageDepartment",
  };
  const apiUrl = userTypeMappings[role];

  const [dialogOpen, setDialogOpen] = useState(false);
  const [parameterHead, setParameterHead] = useState<string[]>([]);
  const [inputInfos, setInputInfos] = useState<{}>({});

  useEffect(() => {
    setParameterHead(parameter);
  }, [parameter]);

  const handleDialogOpen = () => {
    setDialogOpen(!dialogOpen);
    setInputInfos({});
  };

  const handleInputChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputInfos((prevInputInfo) => ({
      ...prevInputInfo,
      [key]: event.target.value,
    }));
  };

  const handleAddData = () => {
    const fetch = async () => {
      const filteredInputInfos = Object.fromEntries(
        Object.entries(inputInfos).filter(([key, value]) => value !== "")
      );
      const response = await apiFetcher(apiUrl, {
        method: "POST",
        body: {
          role: role,
          ...filteredInputInfos
        },
      });

      console.log(response);
      setNeedUpdate(true);
    };
    fetch();
    setDialogOpen(false);
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
        <DialogHeader placeholder>新增資料</DialogHeader>
        <DialogBody placeholder>
          {parameterHead.map((value, index) => (
            <input
              key={value}
              type="text"
              placeholder={`Enter ${value}`}
              className="mt-2"
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
          <Button placeholder variant="gradient" color="green" onClick={handleAddData}>
            <span>Confirm</span>
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
};

export default AddInfoButton;