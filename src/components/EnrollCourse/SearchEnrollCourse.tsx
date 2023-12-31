import { Input, Button } from "@material-tailwind/react";
import { useRouter } from 'next/navigation';

export function EnrollObject() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.push('/searchEnrollCourse');
  };

  return (
    <div className="flex justify-center items-center gap-2">
        <Input label="請輸入課程名字" crossOrigin=""/>
        <div className="flex justify-center items-center gap-2">
            <Input label="請輸入課號" crossOrigin=""/>
            <Button color="blue" className="w-32" onClick={handleButtonClick} placeholder={Button}>
                搜尋課程
            </Button>
        </div>
  </div>
  );
};