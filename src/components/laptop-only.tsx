"use client";

import { useEffect } from "react";

export default function LaptopOnly() {
  useEffect(() => {
    const test = () => {
      if (!window) return;
      if (window.matchMedia("(max-width: 767px)").matches) {
        alert("請使用電腦瀏覽器以獲得最佳體驗");
      }
    };

    test();
  }, []);

  return null;
}
