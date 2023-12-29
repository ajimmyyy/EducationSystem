import {
  Select,
  Option, 
  Button,
  IconButton,
}
from "@material-tailwind/react";
import { useState, useEffect, use } from 'react';
import apiFetcher from "@/utils/api-fetcher";

interface InputInfoProps {
  email?: string;
  cellphone?: string;
  departmentId?: number;
  schoolClass?: string;
  office?: string;
  web?: string;
  info?: string;
  semester?: string;
}

const AddInfoButton = ({ parameter, role }: { parameter: string[], role: string }) => {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [parameterHead, setParameterHead] = useState<string[]>([]);
  const [inputInfos, setinputInfos] = useState<InputInfoProps>({});

  useEffect(() => {
    setParameterHead(parameter);
  }, [parameter]);

  const handleOpenDialog = () => {
    setDialogOpen(!isDialogOpen);
    setinputInfos({});
  };

  const handleInputChange = (key: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setinputInfos((prevInputInfo) => ({
      ...prevInputInfo,
      [key]: event.target.value,
    }));
  };

  const handleSemesterChange = (e: string) => {
    setinputInfos((prevInputInfo) => ({
      ...prevInputInfo,
      semester: e,
    }));
  };

  const handleAddData = () => {
    const fetchUsers = async () => {
      await apiFetcher("/api/ManageUser", {
        method: "POST",
        body: {
          role: role,
          ...inputInfos
        },
      });
    }
    setDialogOpen(false);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
      {isDialogOpen && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <div className="dialog-content gap-2 w-[calc(60vw)]">
            {parameterHead.map((value, index) => (
              <input
                key={value}
                type="text"
                placeholder={`Enter ${value}`}
                onChange={handleInputChange(value)}
              />
            ))}
          <Select 
            placeholder 
            variant="standard" 
            color="blue" 
            size="md" 
            label="Select semester"
            onChange={e => handleSemesterChange(e || "110-2")}
          >
            <Option value="110-1">110-1</Option>
            <Option value="110-2">110-2</Option>  
          </Select>
          </div>
          <Button
            placeholder
            size="sm"
            onClick={handleAddData}
          >
            Add Data
          </Button>
        </div>
      )}
      <IconButton
        placeholder
        variant="gradient"
        className="rounded-full"
        color="amber"
        onClick={handleOpenDialog}
      >
        <img src="/images/plus-solid.svg" alt="Plus Icon" />
      </IconButton>
    </div>
  );
};

export default AddInfoButton;