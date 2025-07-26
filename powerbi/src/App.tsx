"use client"

import { useState } from "react"
import TopNavbar from "./components/TopNavbar"
import RightNavbar from "./components/RightNavbar"
import DataSourceOptions from "./components/DataSourceOptions"
import RecommendedSection from "./components/RecommendedSection"
import WorkspaceCanvas from "./components/WorkspaceCanvas"
import "./App.css"

function App() {
  const [activeView, setActiveView] = useState<string>("home")

  // Map the old showCanvas state to the new activeView state
  const showCanvas = activeView === "canvas"

  const handleSelectSource = (name: string, type?: string, details?: any) => {
    console.log("Data source selected:", name, type, details)

    // Handle different data source selections
    switch (type) {
      case "blank":
        setActiveView("canvas")
        break
      case "excel":
        // Handle Excel file upload
        if (details?.file) {
          console.log("Excel file selected:", details.file.name)
          // Process the Excel file here
        }
        setActiveView("canvas")
        break
      case "sql":
        // Handle SQL Server connection
        console.log("SQL Server connection initiated")
        setActiveView("canvas")
        break
      case "sample":
        // Handle sample data selection
        console.log("Sample data selected")
        setActiveView("canvas")
        break
      case "onelake":
        // Handle OneLake connection
        console.log("OneLake connection initiated")
        setActiveView("canvas")
        break
      case "other":
        // Handle other data sources
        console.log("Other data sources requested")
        setActiveView("canvas")
        break
      default:
        // Fallback for backward compatibility
        if (name === "Blank report") {
          setActiveView("canvas")
        }
    }
  }

  return (
    <>
      {/* Only show TopNavbar when not in canvas mode */}
      {!showCanvas && <TopNavbar />}

      <div className="flex">
        {/* Show RightNavbar only if canvas is not shown */}
        {!showCanvas && (
          <div>
            <RightNavbar />
          </div>
        )}

        {!showCanvas ? (
          <div className="pt-10 pl-8">
            <DataSourceOptions onSelectSource={handleSelectSource} />
            <RecommendedSection />
          </div>
        ) : (
          // WorkspaceCanvas includes its own complete interface with ribbon
          <WorkspaceCanvas />
        )}
      </div>
    </>
  )
}

export default App
