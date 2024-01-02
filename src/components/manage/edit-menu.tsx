import {
  Button,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
} from "@material-tailwind/react";
import React from "react";
import {
  MdSettings,
  MdBorderColor,
  MdOutlineDeleteOutline,
} from "react-icons/md";
import apiFetcher from "@/utils/api-fetcher";

export function EditMenu({
  role,
  id,
  setNeedUpdate,
}: {
  role: string;
  id: number;
  setNeedUpdate: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const userTypeMappings: { [key: string]: string } = {
    student: "/api/ManageUser",
    teacher: "/api/ManageUser",
    manager: "/api/ManageUser",
    course: "/api/ManageCourse",
    classroom: "/api/ManageClassroom",
    department: "/api/ManageDepartment",
  };
  const apiUrl = userTypeMappings[role];

  const handleDeleteData = () => {
    const fetchUser = async () => {
      const response = await apiFetcher(apiUrl, {
        method: "DELETE",
        body: {
          id: id,
        },
      });
      setNeedUpdate(true);
      console.log(response);
    };
    fetchUser();
  };

  // const handleEditData = () => {
  //   const fetchUser = async () => {
  //     const response = await apiFetcher(apiUrl, {
  //       method: "PUT",
  //       body: {
  //         id: id,
  //       },
  //     });
  //     setNeedUpdate(true);
  //     console.log(response);
  //   };
  //   fetchUser();
  // };

  return (
    <Menu>
      <MenuHandler>
        <Button placeholder className="rounded-full bg-gray-700" size="sm">
          <MdSettings size={20} />
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
