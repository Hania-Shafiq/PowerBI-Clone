import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

import excelIcon from '../assets/excel.png';
import onelakeIcon from '../assets/onelake.png';
import reportIcon from '../assets/report.png';
import sampleIcon from '../assets/sampledata.png';
import sqlIcon from '../assets/sql.png';
import addIcon from '../assets/add.png';

const dataSources = [
  { name: "Blank report", icon: reportIcon },
  { name: "OneLake catalog", icon: onelakeIcon },
  { name: "Excel workbook", icon: excelIcon },
  { name: "SQL Server", icon: sqlIcon },
  { name: "Learn with sample data", icon: sampleIcon },
  { name: "Get data from other sources", icon: addIcon },
];

export default function DataSourceOptions({ onSelectSource }) {
  const [showSources, setShowSources] = useState(true);

  return (
    <div className="mb-6">
      {/* DROPDOWN HEADER */}
      <div
        className="font-semibold text-lg mb-3 cursor-pointer select-none flex items-center gap-2"
        onClick={() => setShowSources(!showSources)}
      >
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            showSources ? "rotate-0" : "-rotate-90"
          }`}
        />
        <span>Select a data source or start with a blank report</span>
      </div>

      {/* DATA SOURCE BOXES */}
      {showSources && (
        <div className="flex space-x-4 overflow-x-auto">
          {dataSources.map((item) => (
            <div
              key={item.name}
              className="w-32 h-32 min-w-[8rem] border border-gray-300 rounded-md p-3 flex flex-col items-center justify-center shadow-sm hover:bg-gray-100 transition cursor-pointer"
              onClick={() => onSelectSource?.(item.name)}
            >
              <img
                src={item.icon}
                alt={item.name}
                className="w-10 h-10 mb-2 object-contain"
              />
              <div className="text-center text-xs font-medium">{item.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
