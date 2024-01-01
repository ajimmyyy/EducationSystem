import {
  Popover,
  PopoverHandler,
  PopoverContent,
  Button,
  Input,
  Typography,
} from "@material-tailwind/react";

export function UpdatePopover({ type }: { type: string }) {
  return (
    <Popover placement="bottom-start">
      <PopoverHandler>
        <Button placeholder>{type}</Button>
      </PopoverHandler>
      <PopoverContent placeholder className="w-96">
        <Typography placeholder variant="h6" color="blue-gray" className="mb-6">
          Update {type}
        </Typography>
        <Typography
          placeholder
          variant="small"
          color="blue-gray"
          className="mb-1 font-bold"
        >
          Your New {type}
        </Typography>
        <div className="flex gap-2">
          <Input
            crossOrigin
            size="lg"
            placeholder="name@mail.com"
            className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
            labelProps={{
              className: "before:content-none after:content-none",
            }}
          />
          <Button placeholder variant="gradient" className="flex-shrink-0">
            Update
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}