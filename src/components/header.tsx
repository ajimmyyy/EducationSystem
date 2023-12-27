import {
  Navbar,
  Typography,
  Button,
  IconButton,
  MobileNav,
} from "@/components/material-tailwind";

export default function Header() {
  return (
    <Navbar
      className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4 bg-white text-black"
      placeholder={undefined}
    >
      <div className="flex items-center justify-between text-blue-gray-900">
        北科課程網
        <div className="flex items-center gap-4"></div>
      </div>
    </Navbar>
  );
}
