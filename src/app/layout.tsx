import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Main from "@/components/main";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/material-tailwind";
import ReactQueryProvider from "@/providers/react-query";
import React from "react";

export const metadata: Metadata = {
  title: "北科課程網",
  description: "神奇貓貓",
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
            <Header />
            <Main>{children}</Main>
            <Toaster position="top-right" richColors closeButton />
          </ReactQueryProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
