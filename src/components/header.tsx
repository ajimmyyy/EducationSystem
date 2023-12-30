export default function Header() {
  return (
    <header className="sticky top-0 z-20 flex h-14 w-screen justify-center bg-white text-black shadow-md">
      <div className="container flex h-full items-center">
        <div className="flex items-center justify-between text-blue-gray-900">
          <h1 className=" font-bold">北科課程網</h1>
          <div className="flex items-center gap-4"></div>
        </div>
      </div>
    </header>
  );
}
