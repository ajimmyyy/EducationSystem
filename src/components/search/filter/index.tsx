import DepartmentSelector from "./DepartmentSelector";
import ScheduleSelector from "./ScheduleSelector";
import SearchBar from "./SearchBar";

export default function FilterContainer() {
  return (
    <div className="sticky top-14 z-20 h-fit w-full bg-gray-100 px-2 pt-2">
      <SearchBar />
      <div className="my-2 flex gap-2">
        <ScheduleSelector />
        <DepartmentSelector />
      </div>
    </div>
  );
}
