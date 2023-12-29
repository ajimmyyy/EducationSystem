export default function Main({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full flex justify-center">
      <div className="container">{children}</div>
    </main>
  );
}
