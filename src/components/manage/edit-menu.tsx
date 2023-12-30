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

const EditMenu = ({userId}: {userId: number}) => {
  const handleDeleteData = () => {
    const fetchUser = async () => {
      const response =  await apiFetcher("/api/ManageUser", {
        method: "DELETE",
        body: {
          userId: userId,
        },
      });

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
        <MenuItem placeholder>
          <MdBorderColor />
        </MenuItem>
        <MenuItem placeholder onClick={handleDeleteData}>
          <MdOutlineDeleteOutline />
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default EditMenu;