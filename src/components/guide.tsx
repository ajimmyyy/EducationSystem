import React from "react";
import {
  Navbar,
  MobileNav,
  Typography,
  Button,
} from "@material-tailwind/react";
import { useRouter } from "next/navigation";
import useUser from "@/hooks/useUser";
import useLogout from "@/hooks/useLogout";

function LoginButton() {
  const { data } = useUser();
  const router = useRouter();
  const { logout } = useLogout();

  console.log(data?.id);
  console.log(data?.role);
  console.log(data?.name);

  if (!data?.id) {
    return (
      <Button placeholder={undefined} onClick={() => router.push("/login")}>
        登入
      </Button>
    );
  }
  return (
    <Button placeholder={undefined} onClick={() => logout()}>
      登出
    </Button>
  );
}

interface NavLink {
  title: string;
  href: string;
}

export function GuideBar() {
  const [openNav, setOpenNav] = React.useState(false);
  const { data: user } = useUser();

  React.useEffect(() => {
    window.addEventListener(
      "resize",
      () => window.innerWidth >= 960 && setOpenNav(false),
    );
  }, []);

  const navLinks: NavLink[] = [
    { title: "Search", href: "/search" },
    { title: "Schedule", href: "/studentSchedule" },
    { title: "Enroll", href: "/enroll" },
    { title: "Class Schedule", href: "/teacher" },
    { title: "Manage", href: "/manage" },
    { title: "Account", href: "/account" },
  ];

  // 過濾出特定角色的連結
  const allowedLinks: NavLink[] = navLinks.filter(link => {
    if (["Search"].includes(link.title)) {
      return true;
    } else if (user?.role === "student" && ["Schedule", "Enroll", "Account"].includes(link.title)) {
      return true;
    } else if (user?.role === "teacher" && ["Class Schedule", "Account"].includes(link.title)) {
      return true; 
    } else if (user?.role === "manager" && ["Manage", "Account"].includes(link.title)) {
      return true;
    }
    return false;
  });
  
  const navList = (
    <ul className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6">
      {allowedLinks.map((link, index) => (
        <Typography
          key={index}
          placeholder
          as="li"
          variant="small"
          color="blue-gray"
          className="p-1 font-normal"
        >
          <a href={link.href} className="flex items-center">
            {link.title}
          </a>
        </Typography>
      ))}
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
            <LoginButton />
          </div>
        </div>
      </div>
      <MobileNav open={openNav}>
        {navList}
        <div className="flex items-center gap-x-1">
          <LoginButton />
        </div>
      </MobileNav>
    </Navbar>
  );
}