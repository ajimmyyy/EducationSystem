import Header from "@/components/header";
import Main from "@/components/main";
import React from "react";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <Main>{children}</Main>
    </>
  );
}
