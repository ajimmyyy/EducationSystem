import { Input } from "@/components/material-tailwind";
import SearchBar from "./SearchBar";

export default function FilterContainer() {
  return (
    <div className="sticky top-14 z-10 h-fit w-full bg-gray-100 px-2 pt-4">
      <SearchBar />
    </div>
  );
}
