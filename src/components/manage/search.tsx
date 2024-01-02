import {
  Input,
  Button,
} from "@material-tailwind/react";
import React, { useState } from "react";

// 搜尋欄
export function Search({ addOption }: { addOption: React.Dispatch<React.SetStateAction<string>> }) {
  const [keyWord, setKeyWord] = useState('');

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyWord(event.target.value);
  };

  const handleSearch = () => {
    if (keyWord) {
      addOption(keyWord);
    }
    else {
      addOption('');
    }
  };

  return (
    <div className="relative flex w-full">
      <Input
        crossOrigin
        type="text"
        label="Search"
        value={keyWord}
        onChange={onChange}
        className="pr-20"
        containerProps={{
          className: "min-w-0",
        }}
      />
      <Button
        placeholder
        size="sm"
        color={keyWord ? "blue-gray" : "blue-gray"}
        className="!absolute right-1 top-1 rounded"
        onClick={handleSearch}
      >
        收尋
      </Button>
    </div>
  );
}