import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
} from "@material-tailwind/react";

export function GuideBar() {
  const [openNav, setOpenNav] = React.useState(false);

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      <Typography
        placeholder
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="search" className="flex items-center">
          Search
        </a>
      </Typography>
      <Typography
        placeholder
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Schedule
        </a>
      </Typography>
      <Typography
        placeholder
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="#" className="flex items-center">
          Manage
        </a>
      </Typography>
      <Typography
        placeholder
        as="li"
        variant="small"
        color="blue-gray"
        className="p-1 font-normal"
      >
        <a href="account" className="flex items-center">
          Account
        </a>
      </Typography>
    </ul>
  );

  return (
    <Navbar placeholder className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
      <div className="flex items-center justify-between text-blue-gray-900">
        <Typography
          placeholder
          as="a"
          href="search"
          className="mr-4 cursor-pointer font-bold"
          style={{ fontSize: '1.5rem', marginLeft: '40px' }}
        >
          北科課程網
        </Typography>
        <div className="flex items-center gap-4">
          <div className="mr-4 hidden lg:block">{navList}</div>
          <div className="flex items-center gap-x-1">
            <Button
              placeholder
              variant="gradient"
              size="sm"
              className="hidden lg:inline-block"
            >
              <span>Log In</span>
            </Button>
          </div>
        </div>
      </div>
      <MobileNav open={openNav}>
        {navList}
        <div className="flex items-center gap-x-1">
          <Button placeholder fullWidth variant="gradient" size="sm" className="">
            <span>Log In</span>
          </Button>
        </div>
      </MobileNav>
    </Navbar>
  );
}