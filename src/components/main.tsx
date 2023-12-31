import React from "react";

export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen w-screen justify-center">
      <div className="container">{children}</div>
    </main>
  );
}
