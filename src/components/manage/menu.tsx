import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
 
export function Menu() {
  const [open, setOpen] = React.useState(0);
 
  const handleOpen = (value: React.SetStateAction<number>) => {
    setOpen(open === value ? 0 : value);
  };
 
  return (
    <Card placeholder className=" h-[calc(100vh-4rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography placeholder variant="h5" color="blue-gray">
          Manage
        </Typography>
      </div>
      <List placeholder>
        <Accordion
          placeholder
          open={open === 1}
          icon={<span>{open === 1 ? '▲' : '▼'}</span>}
        >
          <ListItem placeholder className="p-0" selected={open === 1}>
            <AccordionHeader placeholder onClick={() => handleOpen(1)} className="border-b-0 p-3">
              <Typography placeholder color="blue-gray" className="mr-auto font-normal">
                使用者管理
              </Typography>
            </AccordionHeader>
          </ListItem>
          <AccordionBody className="py-1">
            <List placeholder className="p-0">
              <ListItem placeholder>
                學生管理
              </ListItem>
              <ListItem placeholder>
                教師管理
              </ListItem>
              <ListItem placeholder>
                管理員管理
              </ListItem>
            </List>
          </AccordionBody>
        </Accordion>
        <ListItem placeholder>
          課程管理
        </ListItem>
        <ListItem placeholder>
          教室管理
        </ListItem>
        <ListItem placeholder>
          系所管理
        </ListItem>
      </List>
    </Card>
  );
}
