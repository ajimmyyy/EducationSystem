import {
  Card,
  Typography,
  List,
  ListItem,
} from "@material-tailwind/react";

export function Menu({ addOption }: { addOption: React.Dispatch<React.SetStateAction<string>> }) {
  const INFO = "info";
  const SETTING = "setting";
  const COLLECT = "collect";

  //選單選項點擊控制
  const handleMenuOption = (value: string) => {
    addOption(value);
  };

  return (
    <Card placeholder className=" h-[calc(100vh-4rem)] w-full max-w-[16rem] p-4 shadow-xl shadow-blue-gray-900/5">
      <div className="mb-2 p-4">
        <Typography placeholder variant="h5" color="blue-gray">
          Account
        </Typography>
      </div>
      <List placeholder>
        <ListItem placeholder onClick={() => handleMenuOption(INFO)}>
          個人資料
        </ListItem>
        <ListItem placeholder onClick={() => handleMenuOption(SETTING)}>
          設定
        </ListItem>
        <ListItem placeholder onClick={() => handleMenuOption(COLLECT)}>
          收藏
        </ListItem>
      </List>
    </Card>
  );
}