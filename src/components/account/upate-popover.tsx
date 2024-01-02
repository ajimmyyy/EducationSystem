import apiFetcher from "@/utils/api-fetcher";
import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";
import { useState, ChangeEvent } from "react";
import { toast } from "sonner";

export function UpdatePopover({ type, id }: { type: string, id: number }) {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleButtonClick = () => {
    let requestBody: Record<string, any> = {
      id: id,
    };

    if (type === 'password') {
      requestBody.password = inputValue;
    } 
    else if (type === 'email') {
      requestBody.email = inputValue;
    }
    else if (type === 'cellphone') {
      requestBody.cellphone = inputValue;
    }

    const fetchTable = async () => {
      console.log(requestBody);
      const response = await apiFetcher("/api/ManageUser", {
        method: "PUT",
        body: requestBody
      });
      console.log(response);
      if (response.success === true) {
        toast.success("Successfully updated user");
      }
      else {
        toast.error("Failed to update user");
      }
    };
    fetchTable();
    setInputValue('');
  }

  return (
    <Popover placement="bottom-start" >
      <PopoverHandler>
        <Button placeholder>{type}</Button>
      </PopoverHandler>
      <PopoverContent placeholder className="w-96">
        <Typography placeholder variant="h6" color="blue-gray" className="mb-6">
          Update {type}
        </Typography>
        <Typography
          placeholder
          variant="small"
          color="blue-gray"
          className="mb-1 font-bold"
        >
          Your New {type}
        </Typography>
        <div className="flex gap-2">
          <Input
            crossOrigin
            size="lg"
            placeholder={`New ${type}`}  
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
            value={inputValue}
            onChange={handleInputChange}
          />
          <Button placeholder variant="gradient" className="flex-shrink-0" onClick={handleButtonClick}>
            Update
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}