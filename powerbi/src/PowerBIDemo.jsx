"use client"

import { useState } from "react"
import DataSourceOptions from "./components/DataSourceOptions"

export default function PowerBIDemo() {
  const [selectedDataSource, setSelectedDataSource] = useState(null)
  const [connectionDetails, setConnectionDetails] = useState(null)

  const handleDataSourceSelection = (sourceType, details = null) => {
    setSelectedDataSource(sourceType)
    setConnectionDetails(details)
    console.log("Data source selected:", sourceType, details)
  }

  const renderSelectedView = () => {
    switch (selectedDataSource) {
      case "blank-report":
        return (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Blank Report Canvas</h3>
            <div className="h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <p className="text-lg font-medium">Start building your report</p>
                <p className="text-sm">Drag and drop visualizations here</p>
              </div>
            </div>
          </div>
        )

      case "excel-workbook":
        return (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Excel Import</h3>
            <div className="space-y-4">
              <p>Excel file selected: {connectionDetails?.file?.name}</p>
              <div className="h-32 bg-green-50 border border-green-200 rounded p-4">
                <p className="text-green-800">✓ Ready to import Excel data</p>
                <p className="text-sm text-green-600">Preview and configure your data import</p>
              </div>
            </div>
          </div>
        )

      case "sql-server":
        return (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">SQL Server Connection</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Server</label>
                  <input type="text" placeholder="localhost" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Database</label>
                  <input type="text" placeholder="Database name" className="w-full p-2 border rounded" />
                </div>
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Connect</button>
            </div>
          </div>
        )

      case "sample-data":
        return (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Sample Data</h3>
            <div className="space-y-4">
              <p>Choose from our sample datasets:</p>
              <div className="grid grid-cols-2 gap-4">
                {["Sales Data", "Financial Sample", "HR Analytics", "Marketing Campaign"].map((sample) => (
                  <div key={sample} className="p-3 border rounded hover:bg-gray-50 cursor-pointer">
                    <p className="font-medium">{sample}</p>
                    <p className="text-sm text-gray-600">Sample dataset for learning</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "onelake-catalog":
        return (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">OneLake Catalog</h3>
            <div className="h-32 bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-blue-800">🔗 Connecting to OneLake...</p>
              <p className="text-sm text-blue-600">Browse your organization's data catalog</p>
            </div>
          </div>
        )

      case "data-connectors":
        return (
          <div className="bg-white border rounded-lg p-6">
            <h3 className="text-xl font-semibold mb-4">Data Connectors</h3>
            <div className="grid grid-cols-3 gap-4">
              {["Azure SQL", "SharePoint", "Salesforce", "Google Analytics", "REST API", "MongoDB"].map((connector) => (
                <div key={connector} className="p-3 border rounded hover:bg-gray-50 cursor-pointer text-center">
                  <p className="font-medium text-sm">{connector}</p>
                </div>
              ))}
            </div>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Power BI Clone</h1>
        <p className="text-gray-600">Create reports and dashboards from your data</p>
      </div>

      <DataSourceOptions onSelectSource={handleDataSourceSelection} />

      {selectedDataSource && <div className="mt-8">{renderSelectedView()}</div>}
    </div>
  )
}
