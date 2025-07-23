import { Home, Folder } from "lucide-react";

export default function RightNavbar() {
  return (
    <div className="hidden md:flex flex-col justify-between w-48 h-screen bg-white border-r border-gray-200 p-4">
      {/* TOP SECTION */}
      <div className="space-y-2">
        {/* HOME */}
        <div className="group flex items-center space-x-2 font-medium text-gray-700 px-2 py-1 rounded-r-md hover:text-green-600 hover:bg-gray-100 border-l-2 border-transparent hover:border-green-600 cursor-pointer">
          <Home size={18} />
          <span>Home</span>
        </div>

        {/* OPEN */}
        <div className="group flex items-center space-x-2 text-gray-700 px-2 py-1 rounded-r-md hover:text-green-600 hover:bg-gray-100 border-l-2 border-transparent hover:border-green-600 cursor-pointer">
          <Folder size={18} />
          <span>Open</span>
        </div>

        <hr className="my-2 border-gray-300" />
      </div>

      {/* BOTTOM SECTION */}
      <div className="space-y-2 text-sm">
         <hr className="my-2 border-gray-300" />
        <div className="group px-2 py-1 rounded-r-md hover:text-green-600 hover:bg-gray-100 border-l-2 border-transparent hover:border-green-600 cursor-pointer">
          Sign in
        </div>
        <div className="group px-2 py-1 rounded-r-md hover:text-green-600 hover:bg-gray-100 border-l-2 border-transparent hover:border-green-600 cursor-pointer">
          Options and settings
        </div>
        <div className="group px-2 py-1 rounded-r-md hover:text-green-600 hover:bg-gray-100 border-l-2 border-transparent hover:border-green-600 cursor-pointer">
          About
        </div>
      </div>
    </div>
  );
}
