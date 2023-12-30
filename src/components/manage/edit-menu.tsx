import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
}
from "@material-tailwind/react";
import { useState, useEffect, use } from "react";
import { MdBorderColor, MdOutlineDeleteOutline } from "react-icons/md";
import apiFetcher from "@/utils/api-fetcher";

const EditMenu = ({userId, setNeedUpdate}: {userId: number, setNeedUpdate: React.Dispatch<React.SetStateAction<boolean>>}) => {
  
  const handleDeleteData = () => {
    const fetchUser = async () => {
      const response =  await apiFetcher("/api/ManageUser", {
        method: "DELETE",
        body: {
          userId: userId,
        },
      });
      setNeedUpdate(true);
      console.log(response);
    };
    fetchUser();
  }

  const handleEditData = () => {
    const fetchUser = async () => {
      const response =  await apiFetcher("/api/ManageUser", {
        method: "PUT",
        body: {
          id: userId,

        },
      });
      setNeedUpdate(true);
      console.log(response);
    };
    fetchUser();
  }

  return (
    <Menu>
      <MenuHandler>
        <Button
          placeholder
          className="rounded-full bg-gray-700"
          size="sm"
        >
          Edit
        </Button>
      </MenuHandler>
      <MenuList placeholder>
        <>
          <MenuItem placeholder className="flex">
            <MdBorderColor />
            edit
          </MenuItem>
        </>
        <MenuItem placeholder onClick={handleDeleteData} className="flex">
          <MdOutlineDeleteOutline />
          delete
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default EditMenu;