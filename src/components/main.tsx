export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex w-full justify-center bg-[#f5f5f5]">
      <div className="container">{children}</div>
    </main>
  );
}
