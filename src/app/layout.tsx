import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/material-tailwind";
import ReactQueryProvider from "@/providers/react-query";
import React from "react";

export const metadata: Metadata = {
  title: "北科課程網",
  description: "北科課程網，一個充滿貓貓的網站",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className=" bg-[#f5f5f5]">
        <ThemeProvider>
          <ReactQueryProvider>
            {children}
            <Toaster position="top-right" richColors closeButton />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
