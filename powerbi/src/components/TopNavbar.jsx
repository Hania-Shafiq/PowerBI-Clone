// components/TopNavbar.jsx
import { Save, Undo2, Redo2, Search, User, Minus, Square, X } from 'lucide-react';

export default function TopNavbar() {
  return (
    <div className="w-full h-10 flex items-center justify-between px-2 bg-gradient-to-b from-gray-100 to-white border-b border-gray-200 text-sm">
      
      {/* LEFT SIDE ICONS */}
      <div className="flex items-center space-x-2">
        <Save className="w-4 h-4 text-gray-700" />
        <Undo2 className="w-4 h-4 text-gray-400 opacity-50" />
        <Redo2 className="w-4 h-4 text-gray-400 opacity-50" />
        <span className="ml-2 text-gray-700">Untitled - Power BI Desktop</span>
      </div>

      {/* CENTER SEARCH BAR */}
      <div className="flex items-center bg-white border border-gray-300 rounded shadow-sm px-2 py-1">
        <Search className="w-4 h-4 text-gray-600 mr-1" />
        <input
          type="text"
          placeholder="Search"
          className="outline-none text-xs bg-transparent"
        />
      </div>

      {/* RIGHT SIDE ICONS */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          <User className="w-4 h-4 text-gray-700" />
          <span className="text-gray-700">Sign in</span>
        </div>
        <Minus className="w-4 h-4 text-gray-700" />
        <Square className="w-4 h-4 text-gray-700" />
        <div className="w-6 h-6 bg-red-600 text-white flex items-center justify-center rounded-sm">
          <X className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}
