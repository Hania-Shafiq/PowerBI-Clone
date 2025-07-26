"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"

// Import your original assets
import excelIcon from "../assets/excel.png"
import onelakeIcon from "../assets/onelake.png"
import reportIcon from "../assets/report.png"
import sampleIcon from "../assets/sampledata.png"
import sqlIcon from "../assets/sql.png"
import addIcon from "../assets/add.png"

const dataSources = [
  { name: "Blank report", icon: reportIcon },
  { name: "OneLake catalog", icon: onelakeIcon },
  { name: "Excel workbook", icon: excelIcon },
  { name: "SQL Server", icon: sqlIcon },
  { name: "Learn with sample data", icon: sampleIcon },
  { name: "Get data from other sources", icon: addIcon },
]

interface DataSourceOptionsProps {
  onSelectSource: (name: string, type?: string, details?: any) => void
}

export default function DataSourceOptions({ onSelectSource }: DataSourceOptionsProps) {
  const [showSources, setShowSources] = useState(true)
  const [selectedSource, setSelectedSource] = useState<string | null>(null)

  const handleSourceClick = (item: (typeof dataSources)[0]) => {
    setSelectedSource(item.name)

    switch (item.name) {
      case "Blank report":
        onSelectSource(item.name, "blank")
        break

      case "OneLake catalog":
        console.log("Connecting to OneLake...")
        onSelectSource(item.name, "onelake")
        break

      case "Excel workbook":
        const fileInput = document.createElement("input")
        fileInput.type = "file"
        fileInput.accept = ".xlsx,.xls,.csv"
        fileInput.onchange = (e) => {
          const target = e.target as HTMLInputElement
          if (target && target.files && target.files.length > 0) {
            const file = target.files[0]
            console.log("Selected Excel file:", file.name)
            onSelectSource(item.name, "excel", { file })
          }
        }
        fileInput.click()
        break

      case "SQL Server":
        console.log("Opening SQL Server connection dialog...")
        onSelectSource(item.name, "sql")
        break

      case "Learn with sample data":
        console.log("Loading sample data...")
        onSelectSource(item.name, "sample")
        break

      case "Get data from other sources":
        console.log("Showing data connectors...")
        onSelectSource(item.name, "other")
        break

      default:
        onSelectSource(item.name)
    }
  }

  return (
    <div className="mb-6">
      <div
        className="font-semibold text-lg mb-3 cursor-pointer select-none flex items-center gap-2"
        onClick={() => setShowSources(!showSources)}
      >
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${showSources ? "rotate-0" : "-rotate-90"}`}
        />
        <span>Select a data source or start with a blank report</span>
      </div>

      {showSources && (
        <div className="flex space-x-4 overflow-x-auto">
          {dataSources.map((item) => {
            const isSelected = selectedSource === item.name

            return (
              <div
                key={item.name}
                className={`w-32 h-32 min-w-[8rem] border rounded-md p-3 flex flex-col items-center justify-center shadow-sm transition cursor-pointer ${
                  isSelected ? "border-blue-500 bg-blue-50" : "border-gray-300 hover:bg-gray-100"
                }`}
                onClick={() => handleSourceClick(item)}
              >
                <img src={item.icon || "/placeholder.svg"} alt={item.name} className="w-10 h-10 mb-2 object-contain" />
                <div className={`text-center text-xs font-medium ${isSelected ? "text-blue-600" : "text-gray-700"}`}>
                  {item.name}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedSource && (
        <div className="mt-3 text-sm text-gray-600 bg-gray-50 p-2 rounded">
          Selected: <span className="font-medium">{selectedSource}</span>
        </div>
      )}
    </div>
  )
}
