import { Button } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

export function EnrollObject() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push("/searchEnrollCourse");
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <Button
        color="blue"
        className="w-32"
        onClick={handleButtonClick}
        placeholder={Button}
      >
        前往加選課程
      </Button>
    </div>
  );
}
