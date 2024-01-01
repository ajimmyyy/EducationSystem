"use client";
import { Information } from "@/components/account/information";
import { Setting } from "@/components/account/setting";
import { Collect } from "@/components/account/collect";
import { Menu } from "@/components/account/menu";
import { useState } from "react";

export default function Home() {
  const [option, setOption] = useState("info");

  const renderTableBasedOnOption = () => {
    switch (option) {
      case "info":
        return <Information />;
      case "setting":
        return <Setting />;
      case "collect":
        return <Collect />;
      default:
        return
    }
  };

  return (
    <div className="flex gap-3">
      <Menu addOption={setOption} />
      <div>
        {renderTableBasedOnOption()}
      </div>
    </div>
  )
}