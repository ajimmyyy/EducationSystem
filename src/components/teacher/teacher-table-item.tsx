import { Button } from "@material-tailwind/react";

export default function TeacherTableItem({day, interval}:{day: string, interval: string}) {
    return (
        <Button placeholder>
            {day + interval}
        </Button>
    );
}