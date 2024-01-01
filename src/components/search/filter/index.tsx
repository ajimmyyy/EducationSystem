import DepartmentSelector from "./DepartmentSelector";
import ScheduleSelector from "./ScheduleSelector";
import SearchBar from "./SearchBar";
import SemesterSelector from "./SemesterSelector";

export default function FilterContainer() {
  return (
    <div className="sticky top-20 z-20 h-fit w-full bg-gray-100 px-2 pt-2">
      <div className="flex gap-2">
        <SemesterSelector />
        <SearchBar />
      </div>
      <div className="my-2 flex gap-2">
        <ScheduleSelector />
        <DepartmentSelector />
      </div>
    </div>
  );
}
