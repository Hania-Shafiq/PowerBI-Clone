"use client"

import { useState } from "react"
import {
  ChevronDown,
  Search,
  Clipboard,
  Database,
  FileSpreadsheet,
  Server,
  Plus,
  RotateCcw,
  Zap,
  BarChart3,
  Type,
  Calculator,
  Lock,
  Upload,
  Bot,
  Table,
  Grid3x3,
  CreditCard,
  Slice,
  Map,
  HelpCircle,
  Key,
  TreePine,
  FileText,
  Circle,
  ImageIcon,
  Square,
  MoreHorizontal,
  Link,
  Users,
  Eye,
  Filter,
  Bookmark,
  MousePointer,
  Gauge,
  Maximize,
  FileImage,
  AlignJustify,
  Palette,
  Rocket,
  GraduationCap,
  Sparkles,
  Monitor,
  Smartphone,
  X,
} from "lucide-react"

export default function WorkspaceCanvas() {
  const [activeTab, setActiveTab] = useState("Home")
  const [selectedVisualization, setSelectedVisualization] = useState(null)
  const [activeDataSource, setActiveDataSource] = useState(null)
  const [showDataDialog, setShowDataDialog] = useState(false)
  const [keepAllFilters, setKeepAllFilters] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [zoomLevel, setZoomLevel] = useState(61)
  const [showVisualizationPanel, setShowVisualizationPanel] = useState(true)
  const [showDataPanel, setShowDataPanel] = useState(true)
  const [activeView, setActiveView] = useState("report")
  const [showShareDialog, setShowShareDialog] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [pages, setPages] = useState([{ id: 1, name: "Page 1" }])
  const [activePage, setActivePage] = useState(1)

  const [showExcelUpload, setShowExcelUpload] = useState(false)
  const [showSqlDialog, setShowSqlDialog] = useState(false)
  const [showBlankTableDialog, setShowBlankTableDialog] = useState(false)
  const [showSampleDataDialog, setShowSampleDataDialog] = useState(false)
  const [selectedFile, setSelectedFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleDataSourceClick = (source, type = null) => {
    setActiveDataSource(source)

    // Handle the type parameter from DataSourceOptions
    switch (type || source) {
      case "blank":
      case "Blank report":
        // Handle blank report
        break
      case "excel":
      case "Excel workbook":
      case "Excel":
        setShowExcelUpload(true)
        break
      case "sql":
      case "SQL Server":
        setShowSqlDialog(true)
        break
      case "sample":
      case "Learn with sample data":
      case "Sample Data":
        setShowSampleDataDialog(true)
        break
      case "onelake":
      case "OneLake catalog":
        setShowDataDialog(true)
        setTimeout(() => {
          setShowDataDialog(false)
          console.log(`Connected to OneLake`)
        }, 2000)
        break
      case "other":
      case "Get data from other sources":
        setShowDataDialog(true)
        setTimeout(() => setShowDataDialog(false), 3000)
        break
      default:
        setShowDataDialog(true)
        setTimeout(() => {
          setShowDataDialog(false)
          console.log(`Connected to ${source}`)
        }, 2000)
    }
  }

  const handleVisualizationClick = (viz) => {
    setSelectedVisualization(viz)
    console.log(`Selected ${viz.name}`)
  }

  const handleGetData = () => {
    setShowDataDialog(true)
    setTimeout(() => setShowDataDialog(false), 3000)
  }

  const addNewPage = () => {
    const newPageId = pages.length + 1
    const newPage = { id: newPageId, name: `Page ${newPageId}` }
    setPages((prev) => [...prev, newPage])
    setActivePage(newPageId)
    setCurrentPage(newPageId)
  }

  const removePage = (pageId) => {
    if (pages.length > 1) {
      setPages((prev) => prev.filter((page) => page.id !== pageId))
      if (activePage === pageId) {
        const remainingPages = pages.filter((page) => page.id !== pageId)
        const newActivePage = remainingPages[0]?.id || 1
        setActivePage(newActivePage)
        setCurrentPage(newActivePage)
      }
    }
  }

  const handleShareClick = () => {
    setShowShareDialog(true)
  }

  const handleSearch = (e) => {
    setSearchQuery(e.target.value)
    console.log("Searching for:", e.target.value)
  }

  const handlePaste = () => {
    console.log("Paste action triggered")
    // Simulate paste functionality
  }

  const handleNewVisual = () => {
    console.log("New visual action triggered")
    // Add a new visualization placeholder
  }

  const handleTextBox = () => {
    console.log("Text box action triggered")
    // Add text box functionality
  }

  const handleFileSelect = (event) => {
    const file = event.target.files[0]
    if (file) {
      setSelectedFile(file)
    }
  }

  const handleFileUpload = () => {
    if (!selectedFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          setIsUploading(false)
          setShowExcelUpload(false)
          setSelectedFile(null)
          setUploadProgress(0)
          console.log("Excel file uploaded successfully:", selectedFile.name)
          return 100
        }
        return prev + 10
      })
    }, 200)
  }

  const handleSqlConnect = (serverName, databaseName, username, password) => {
    setShowSqlDialog(false)
    setShowDataDialog(true)
    console.log("Connecting to SQL Server:", { serverName, databaseName, username })

    setTimeout(() => {
      setShowDataDialog(false)
      console.log("Connected to SQL Server successfully")
    }, 3000)
  }

  const handleCreateBlankTable = (tableName, columns) => {
    setShowBlankTableDialog(false)
    console.log("Creating blank table:", { tableName, columns })
  }

  const handleSelectSampleData = (sampleType) => {
    setShowSampleDataDialog(false)
    setShowDataDialog(true)
    console.log("Loading sample data:", sampleType)

    setTimeout(() => {
      setShowDataDialog(false)
      console.log("Sample data loaded successfully")
    }, 2000)
  }

  const visualizationTypes = [
    { id: "stacked-column", name: "Stacked column chart", color: "bg-blue-500" },
    { id: "clustered-column", name: "Clustered column chart", color: "bg-blue-400" },
    { id: "100-stacked-column", name: "100% Stacked column chart", color: "bg-blue-600" },
    { id: "line-column", name: "Line and stacked column chart", color: "bg-blue-300" },
    { id: "line-clustered", name: "Line and clustered column chart", color: "bg-blue-700" },
    { id: "ribbon", name: "Ribbon chart", color: "bg-blue-800" },
    { id: "stacked-bar", name: "Stacked bar chart", color: "bg-green-500" },
    { id: "clustered-bar", name: "Clustered bar chart", color: "bg-green-400" },
    { id: "100-stacked-bar", name: "100% Stacked bar chart", color: "bg-green-600" },
    { id: "line-bar", name: "Line and stacked bar chart", color: "bg-green-300" },
    { id: "line-clustered-bar", name: "Line and clustered bar chart", color: "bg-green-700" },
    { id: "tornado", name: "Tornado chart", color: "bg-green-800" },
    { id: "line", name: "Line chart", color: "bg-orange-500" },
    { id: "area", name: "Area chart", color: "bg-orange-400" },
    { id: "stacked-area", name: "Stacked area chart", color: "bg-orange-600" },
    { id: "line-area", name: "Line and area chart", color: "bg-orange-300" },
    { id: "stepped-line", name: "Stepped line chart", color: "bg-orange-700" },
    { id: "combo", name: "Combo chart", color: "bg-orange-800" },
    { id: "pie", name: "Pie chart", color: "bg-purple-500" },
    { id: "donut", name: "Donut chart", color: "bg-purple-400" },
    { id: "treemap", name: "Treemap", color: "bg-purple-600" },
    { id: "sunburst", name: "Sunburst", color: "bg-purple-300" },
    { id: "decomposition", name: "Decomposition tree", color: "bg-purple-700" },
    { id: "smart-narrative", name: "Smart narrative", color: "bg-purple-800" },
    { id: "map", name: "Map", color: "bg-red-500" },
    { id: "filled-map", name: "Filled map", color: "bg-red-400" },
    { id: "azure-map", name: "Azure map", color: "bg-red-600" },
    { id: "shape-map", name: "Shape map", color: "bg-red-300" },
    { id: "arcgis", name: "ArcGIS map", color: "bg-red-700" },
    { id: "esri", name: "Esri map", color: "bg-red-800" },
    { id: "funnel", name: "Funnel", color: "bg-indigo-500" },
    { id: "waterfall", name: "Waterfall", color: "bg-indigo-400" },
    { id: "scatter", name: "Scatter chart", color: "bg-indigo-600" },
    { id: "bubble", name: "Bubble chart", color: "bg-indigo-300" },
    { id: "gauge", name: "Gauge", color: "bg-indigo-700" },
    { id: "kpi", name: "KPI", color: "bg-indigo-800" },
    { id: "card", name: "Card", color: "bg-teal-500" },
    { id: "multi-row-card", name: "Multi-row card", color: "bg-teal-400" },
    { id: "table", name: "Table", color: "bg-teal-600" },
    { id: "matrix", name: "Matrix", color: "bg-teal-300" },
    { id: "slicer", name: "Slicer", color: "bg-teal-700" },
    { id: "button", name: "Button", color: "bg-teal-800" },
    { id: "python", name: "Python visual", color: "bg-yellow-500" },
    { id: "r", name: "R script visual", color: "bg-yellow-400" },
    { id: "key-influencers", name: "Key influencers", color: "bg-yellow-600" },
    { id: "q-and-a", name: "Q&A", color: "bg-yellow-300" },
    { id: "paginated", name: "Paginated report", color: "bg-yellow-700" },
    { id: "power-apps", name: "Power Apps", color: "bg-yellow-800" },
  ]

  const ribbonTabs = {
    Home: {
      sections: [
        {
          name: "Clipboard",
          items: [{ name: "Paste", icon: Clipboard }],
        },
        {
          name: "Data",
          items: [
            { name: "Get data", icon: Database, onClick: () => handleGetData() },
            {
              name: "Excel workbook",
              icon: FileSpreadsheet,
              onClick: () => handleDataSourceClick("Excel workbook", "excel"),
            },
            {
              name: "OneLake catalog",
              icon: Database,
              onClick: () => handleDataSourceClick("OneLake catalog", "onelake"),
            },
            { name: "SQL Server", icon: Server, onClick: () => handleDataSourceClick("SQL Server", "sql") },
            { name: "Enter data", icon: Plus },
            { name: "Dataverse", icon: RotateCcw },
            { name: "Recent sources", icon: RotateCcw },
          ],
        },
        {
          name: "Queries",
          items: [
            { name: "Transform data", icon: RotateCcw },
            { name: "Refresh", icon: RotateCcw },
          ],
        },
        {
          name: "Insert",
          items: [
            { name: "New visual", icon: BarChart3, onClick: handleNewVisual },
            { name: "Text box", icon: Type, onClick: handleTextBox },
            { name: "More visuals", icon: Plus },
          ],
        },
        {
          name: "Calculations",
          items: [
            { name: "New calculation", icon: Calculator },
            { name: "New measure", icon: BarChart3 },
            { name: "Quick measure", icon: Zap },
          ],
        },
        {
          name: "Sensitivity",
          items: [{ name: "Sensitivity", icon: Lock }],
        },
        {
          name: "Share",
          items: [{ name: "Publish", icon: Upload }],
        },
        {
          name: "Copilot",
          items: [{ name: "Copilot", icon: Bot }],
        },
      ],
    },
    Insert: {
      sections: [
        {
          name: "Visuals",
          items: [
            { name: "Chart", icon: BarChart3 },
            { name: "Table", icon: Table },
            { name: "Matrix", icon: Grid3x3 },
            { name: "Card", icon: CreditCard },
            { name: "Slicer", icon: Slice },
            { name: "Map", icon: Map },
          ],
        },
        {
          name: "AI Visuals",
          items: [
            { name: "Q&A", icon: HelpCircle },
            { name: "Key influencers", icon: Key },
            { name: "Decomposition tree", icon: TreePine },
            { name: "Smart narrative", icon: FileText },
          ],
        },
        {
          name: "Elements",
          items: [
            { name: "Text box", icon: Type },
            { name: "Button", icon: Circle },
            { name: "Image", icon: ImageIcon },
            { name: "Shape", icon: Square },
          ],
        },
      ],
    },
    Modeling: {
      sections: [
        {
          name: "Calculations",
          items: [
            { name: "New column", icon: Plus },
            { name: "New measure", icon: BarChart3 },
            { name: "New parameter", icon: MoreHorizontal },
            { name: "New table", icon: Table },
            { name: "Quick measure", icon: Zap },
          ],
        },
        {
          name: "Relationships",
          items: [
            { name: "Manage relationships", icon: Link },
            { name: "New relationship", icon: Plus },
            { name: "Autodetect", icon: Search },
          ],
        },
        {
          name: "Security",
          items: [
            { name: "Manage roles", icon: Users },
            { name: "View as", icon: Eye },
          ],
        },
      ],
    },
    View: {
      sections: [
        {
          name: "Show panes",
          items: [
            { name: "Filters", icon: Filter },
            { name: "Bookmarks", icon: Bookmark },
            { name: "Selection", icon: MousePointer },
            { name: "Sync slicers", icon: RotateCcw },
            { name: "Performance analyzer", icon: Gauge },
          ],
        },
        {
          name: "Page options",
          items: [
            { name: "Actual size", icon: Maximize },
            { name: "Fit to page", icon: FileImage },
            { name: "Fit to width", icon: AlignJustify },
            { name: "Gridlines", icon: Grid3x3 },
            { name: "Snap to grid", icon: Grid3x3 },
          ],
        },
        {
          name: "Themes",
          items: [
            { name: "Switch theme", icon: Palette },
            { name: "Browse themes", icon: Palette },
            { name: "Customize theme", icon: Palette },
          ],
        },
      ],
    },
    Optimize: {
      sections: [
        {
          name: "Performance",
          items: [
            { name: "Performance analyzer", icon: Gauge },
            { name: "Optimize ribbon", icon: Rocket },
          ],
        },
      ],
    },
    Help: {
      sections: [
        {
          name: "Help",
          items: [
            { name: "Help", icon: HelpCircle },
            { name: "Training", icon: GraduationCap },
            { name: "Community", icon: Users },
            { name: "What's new", icon: Sparkles },
          ],
        },
      ],
    },
  }

  return (
    <div className="w-full h-screen bg-gray-50 flex flex-col overflow-hidden">
      {/* Top Ribbon */}
      <div className="bg-white border-b border-gray-200 shadow-sm z-10">
        {/* Tab Navigation */}
        <div className="flex items-center justify-between px-4 py-1 bg-gray-50 border-b border-gray-200">
          <div className="flex space-x-1">
            {Object.keys(ribbonTabs).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  activeTab === tab
                    ? "bg-white border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={handleSearch}
                className="pl-10 pr-4 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-all duration-200"
              />
            </div>
            <button
              onClick={handleShareClick}
              className="bg-green-600 text-white px-4 py-1 rounded text-sm font-medium hover:bg-green-700 transition-colors duration-200"
            >
              Share ▼
            </button>
          </div>
        </div>

        {/* Ribbon Content */}
        <div className="px-4 py-2 bg-white overflow-hidden">
          <div className="flex items-start space-x-4 min-w-0">
            {ribbonTabs[activeTab]?.sections.map((section, sectionIndex) => (
              <div key={section.name} className="flex items-start space-x-4 flex-shrink-0">
                {sectionIndex > 0 && <div className="w-px h-16 bg-gray-300 flex-shrink-0"></div>}
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center space-x-1 mb-2 flex-wrap">
                    {section.items.map((item) => {
                      const IconComponent = item.icon
                      return (
                        <div key={item.name} className="flex flex-col items-center space-y-1 min-w-0">
                          <button
                            onClick={item.onClick}
                            className="p-1 hover:bg-gray-100 rounded transition-colors duration-200"
                          >
                            <div className="w-8 h-8 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-50 flex-shrink-0">
                              <IconComponent className="w-4 h-4 text-gray-600" />
                            </div>
                          </button>
                          <span className="text-xs text-gray-600 text-center max-w-16 leading-tight truncate">
                            {item.name}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                  <div className="text-center border-t border-gray-200 pt-1">
                    <span className="text-xs text-gray-500 truncate">{section.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-1 min-h-0">
        {/* Left Sidebar */}
        <div className="w-12 bg-white border-r border-gray-200 flex flex-col items-center py-4 space-y-2 flex-shrink-0">
          <button
            onClick={() => setActiveView("report")}
            className={`w-8 h-8 border rounded flex items-center justify-center transition-colors duration-200 ${
              activeView === "report" ? "bg-blue-100 border-blue-300" : "bg-gray-100 border-gray-300 hover:bg-gray-200"
            }`}
            title="Report view"
          >
            <BarChart3 className={`w-4 h-4 ${activeView === "report" ? "text-blue-600" : "text-gray-600"}`} />
          </button>
          <button
            onClick={() => setActiveView("table")}
            className={`w-8 h-8 border rounded flex items-center justify-center transition-colors duration-200 ${
              activeView === "table" ? "bg-blue-100 border-blue-300" : "bg-gray-100 border-gray-300 hover:bg-gray-200"
            }`}
            title="Table view"
          >
            <Table className={`w-4 h-4 ${activeView === "table" ? "text-blue-600" : "text-gray-600"}`} />
          </button>
          <button
            onClick={() => setActiveView("model")}
            className={`w-8 h-8 border rounded flex items-center justify-center transition-colors duration-200 ${
              activeView === "model" ? "bg-blue-100 border-blue-300" : "bg-gray-100 border-gray-300 hover:bg-gray-200"
            }`}
            title="Model view"
          >
            <Link className={`w-4 h-4 ${activeView === "model" ? "text-blue-600" : "text-gray-600"}`} />
          </button>
          <button
            onClick={() => setActiveView("data")}
            className={`w-8 h-8 border rounded flex items-center justify-center transition-colors duration-200 ${
              activeView === "data" ? "bg-blue-100 border-blue-300" : "bg-gray-100 border-gray-300 hover:bg-gray-200"
            }`}
            title="Data view"
          >
            <Database className={`w-4 h-4 ${activeView === "data" ? "text-blue-600" : "text-gray-600"}`} />
          </button>
          <div className="flex-1"></div>
          <div className="text-xs text-gray-600 transform -rotate-90 whitespace-nowrap">TMDL View</div>
        </div>

        {/* Canvas Area */}
        <div className="flex-1 bg-white relative">
          <div className="w-full h-full p-8">
            <div className="w-full h-full border-2 border-dashed border-gray-300 bg-gray-50 rounded-lg flex items-center justify-center">
              <div className="text-center max-w-4xl">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add data to your report</h2>
                <p className="text-gray-600 mb-8">
                  Once loaded, your data will appear in the <span className="font-semibold">Data</span> pane.
                </p>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <button
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg cursor-pointer transition-all duration-300 hover:border-green-300 hover:-translate-y-1 group"
                    onClick={() => handleDataSourceClick("Excel workbook", "excel")}
                  >
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <FileSpreadsheet className="w-6 h-6 text-green-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">Import data from Excel</p>
                  </button>

                  <button
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg cursor-pointer transition-all duration-300 hover:border-blue-300 hover:-translate-y-1 group"
                    onClick={() => handleDataSourceClick("SQL Server", "sql")}
                  >
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Server className="w-6 h-6 text-blue-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">Import data from SQL Server</p>
                  </button>

                  <button
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg cursor-pointer transition-all duration-300 hover:border-orange-300 hover:-translate-y-1 group"
                    onClick={() => handleDataSourceClick("Blank Table", "blank")}
                  >
                    <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <Table className="w-6 h-6 text-orange-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">Paste data into a blank table</p>
                  </button>

                  <button
                    className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg cursor-pointer transition-all duration-300 hover:border-purple-300 hover:-translate-y-1 group"
                    onClick={() => handleDataSourceClick("Learn with sample data", "sample")}
                  >
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform duration-300">
                      <BarChart3 className="w-6 h-6 text-purple-600" />
                    </div>
                    <p className="text-sm font-medium text-gray-800">Use sample data</p>
                  </button>
                </div>

                <button
                  onClick={handleGetData}
                  className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline"
                >
                  Get data from another source →
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex flex-col">
          {/* Visualizations Section */}
          <div className="border-b border-gray-200">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-sm">Visualizations</h3>
                <div className="flex space-x-1">
                  <button
                    onClick={() => setShowVisualizationPanel(!showVisualizationPanel)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
                  >
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${showVisualizationPanel ? "" : "-rotate-90"}`}
                    />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600 transition-colors duration-200">
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {showVisualizationPanel && (
              <div className="p-3">
                <div className="mb-4">
                  <span className="text-xs font-semibold text-gray-700 block mb-2">Build visual</span>
                  <div className="p-2 border-2 border-teal-400 rounded bg-teal-50">
                    <div className="w-8 h-4 bg-teal-500 rounded"></div>
                  </div>
                </div>

                <div className="grid grid-cols-6 gap-1 mb-4">
                  {visualizationTypes.slice(0, 48).map((viz) => (
                    <button
                      key={viz.id}
                      onClick={() => handleVisualizationClick(viz)}
                      className={`w-10 h-8 border border-gray-300 rounded cursor-pointer transition-all duration-200 flex items-center justify-center group ${
                        selectedVisualization?.id === viz.id
                          ? "bg-blue-100 border-blue-400"
                          : "bg-white hover:bg-gray-50"
                      }`}
                      title={viz.name}
                    >
                      <div className={`w-6 h-4 rounded-sm ${viz.color}`}></div>
                    </button>
                  ))}
                </div>

                <div>
                  <span className="text-xs font-semibold text-gray-700 block mb-2">Values</span>
                  <div className="border-2 border-dashed border-gray-300 rounded p-4 text-center text-gray-500 text-xs">
                    Add data fields here
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Data Section */}
          <div className="flex-1 border-b border-gray-200">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-gray-800 text-sm">Data</h3>
                <button onClick={() => setShowDataPanel(!showDataPanel)} className="text-gray-400 hover:text-gray-600">
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${showDataPanel ? "" : "-rotate-90"}`}
                  />
                </button>
              </div>
            </div>

            {showDataPanel && (
              <div className="p-3">
                <div className="text-center py-8 text-gray-500">
                  <Database className="w-8 h-8 mx-auto mb-3 text-gray-400" />
                  <p className="text-xs mb-3">No data loaded yet</p>
                  <button
                    onClick={handleGetData}
                    className="inline-flex items-center px-3 py-1 bg-blue-600 text-white text-xs font-medium rounded hover:bg-blue-700"
                  >
                    <Zap className="w-3 h-3 mr-1" />
                    Get Data
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Drill through Section */}
          <div className="p-3">
            <div className="mb-3">
              <span className="text-xs font-semibold text-gray-700 block mb-2">Drill through</span>
              <div className="text-xs text-gray-600 mb-2">Cross-report</div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-700">Keep all filters</span>
                <button
                  onClick={() => setKeepAllFilters(!keepAllFilters)}
                  className={`relative inline-flex h-4 w-8 items-center rounded-full transition-all duration-300 ${
                    keepAllFilters ? "bg-green-500" : "bg-gray-300"
                  }`}
                >
                  <span
                    className={`inline-block h-3 w-3 transform rounded-full bg-white transition-transform duration-300 ${
                      keepAllFilters ? "translate-x-4" : "translate-x-1"
                    }`}
                  />
                  <span
                    className={`absolute text-xs font-bold ${
                      keepAllFilters ? "right-1 text-white" : "left-1 text-gray-600"
                    }`}
                  >
                    {keepAllFilters ? "On" : "Off"}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Status Bar */}
      <div className="h-8 bg-gray-100 border-t border-gray-200 flex items-center justify-between px-4 text-xs text-gray-600">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <button
              className="w-8 h-6 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
              title="Desktop view"
            >
              <Monitor className="w-3 h-3 text-gray-600" />
            </button>
            <button
              className="w-8 h-6 bg-white border border-gray-300 rounded flex items-center justify-center hover:bg-gray-100 transition-colors duration-200"
              title="Mobile view"
            >
              <Smartphone className="w-3 h-3 text-gray-600" />
            </button>
          </div>

          <div className="flex items-center space-x-1">
            {pages.map((page) => (
              <div key={page.id} className="flex items-center">
                <button
                  onClick={() => {
                    setActivePage(page.id)
                    setCurrentPage(page.id)
                  }}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors duration-200 flex items-center space-x-1 ${
                    activePage === page.id ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  }`}
                >
                  <span>{page.name}</span>
                  {pages.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        removePage(page.id)
                      }}
                      className="ml-1 hover:bg-green-700 rounded-full p-0.5"
                    >
                      <X className="w-2 h-2" />
                    </button>
                  )}
                </button>
              </div>
            ))}
            <button
              onClick={addNewPage}
              className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center hover:bg-green-700 transition-colors duration-200"
              title="Add new page"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        </div>

        <div>
          Page {activePage} of {pages.length}
        </div>

        <div className="flex items-center space-x-2">
          <select
            value={`${zoomLevel}%`}
            onChange={(e) => setZoomLevel(Number.parseInt(e.target.value))}
            className="bg-transparent border-none text-xs"
          >
            <option>25%</option>
            <option>50%</option>
            <option>61%</option>
            <option>75%</option>
            <option>100%</option>
            <option>125%</option>
            <option>150%</option>
            <option>200%</option>
          </select>
        </div>
      </div>

      {/* Share Dialog */}
      {showShareDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Share Report</h3>
              <button
                onClick={() => setShowShareDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Share with</label>
                <input
                  type="email"
                  placeholder="Enter email addresses"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Permission</label>
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option>Can view</option>
                  <option>Can edit</option>
                  <option>Can reshare</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Message (optional)</label>
                <textarea
                  placeholder="Add a message..."
                  rows={3}
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="notify" className="rounded" />
                <label htmlFor="notify" className="text-sm text-gray-700">
                  Send email notification
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => {
                    setShowShareDialog(false)
                    // Simulate sharing
                    setTimeout(() => {
                      alert("Report shared successfully!")
                    }, 500)
                  }}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Share
                </button>
                <button
                  onClick={() => setShowShareDialog(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>

              <div className="border-t pt-4">
                <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
                <div className="grid grid-cols-2 gap-2">
                  <button className="p-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors duration-200">
                    📋 Copy Link
                  </button>
                  <button className="p-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors duration-200">
                    📧 Email Link
                  </button>
                  <button className="p-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors duration-200">
                    🌐 Publish to Web
                  </button>
                  <button className="p-2 border border-gray-300 rounded-md text-sm hover:bg-gray-50 transition-colors duration-200">
                    📱 Embed Code
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Data Loading Dialog */}
      {showDataDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold mb-2">Connecting to {activeDataSource}</h3>
              <p className="text-gray-600">Please wait while we establish the connection...</p>
              <div className="mt-4 bg-gray-200 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full animate-pulse" style={{ width: "60%" }}></div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Excel Upload Dialog */}
      {showExcelUpload && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Import Excel File</h3>
              <button
                onClick={() => {
                  setShowExcelUpload(false)
                  setSelectedFile(null)
                  setUploadProgress(0)
                  setIsUploading(false)
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <FileSpreadsheet className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600 mb-4">Select an Excel file to import data</p>

                <input
                  type="file"
                  accept=".xlsx,.xls,.csv"
                  onChange={handleFileSelect}
                  className="hidden"
                  id="excel-file-input"
                />
                <label
                  htmlFor="excel-file-input"
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 cursor-pointer transition-colors duration-200"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Choose File
                </label>
              </div>

              {selectedFile && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <FileSpreadsheet className="w-8 h-8 text-green-600" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                      <p className="text-xs text-gray-500">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                    </div>
                  </div>

                  {isUploading && (
                    <div className="mt-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Uploading...</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex space-x-3">
                <button
                  onClick={handleFileUpload}
                  disabled={!selectedFile || isUploading}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                >
                  {isUploading ? "Uploading..." : "Import Data"}
                </button>
                <button
                  onClick={() => {
                    setShowExcelUpload(false)
                    setSelectedFile(null)
                    setUploadProgress(0)
                    setIsUploading(false)
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SQL Server Dialog */}
      {showSqlDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Connect to SQL Server</h3>
              <button
                onClick={() => setShowSqlDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                const formData = new FormData(e.target)
                handleSqlConnect(
                  formData.get("server"),
                  formData.get("database"),
                  formData.get("username"),
                  formData.get("password"),
                )
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Server Name</label>
                <input
                  type="text"
                  name="server"
                  placeholder="localhost or server.database.windows.net"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Database Name</label>
                <input
                  type="text"
                  name="database"
                  placeholder="Database name"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Password"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex items-center space-x-2">
                <input type="checkbox" id="encrypt" className="rounded" />
                <label htmlFor="encrypt" className="text-sm text-gray-700">
                  Encrypt connection
                </label>
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Connect
                </button>
                <button
                  type="button"
                  onClick={() => setShowSqlDialog(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Blank Table Dialog */}
      {showBlankTableDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Create Blank Table</h3>
              <button
                onClick={() => setShowBlankTableDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Table Name</label>
                <input
                  type="text"
                  placeholder="Enter table name"
                  className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Number of Columns</label>
                <select className="w-full p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="3">3 columns</option>
                  <option value="5">5 columns</option>
                  <option value="10">10 columns</option>
                  <option value="custom">Custom</option>
                </select>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-2">Preview:</p>
                <div className="border border-gray-200 rounded">
                  <table className="w-full text-xs">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Column 1</th>
                        <th className="p-2 text-left">Column 2</th>
                        <th className="p-2 text-left">Column 3</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-2 border-t">Data 1</td>
                        <td className="p-2 border-t">Data 2</td>
                        <td className="p-2 border-t">Data 3</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => handleCreateBlankTable("New Table", 3)}
                  className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-orange-700 transition-colors duration-200"
                >
                  Create Table
                </button>
                <button
                  onClick={() => setShowBlankTableDialog(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sample Data Dialog */}
      {showSampleDataDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Choose Sample Data</h3>
              <button
                onClick={() => setShowSampleDataDialog(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              {[
                {
                  name: "Sales Data",
                  description: "Retail sales with products, dates, and revenue",
                  icon: "📊",
                  records: "1,000 rows",
                },
                {
                  name: "Financial Sample",
                  description: "Financial data with profit, expenses, and segments",
                  icon: "💰",
                  records: "700 rows",
                },
                {
                  name: "HR Analytics",
                  description: "Employee data with departments and performance",
                  icon: "👥",
                  records: "500 rows",
                },
                {
                  name: "Marketing Campaign",
                  description: "Campaign performance and customer data",
                  icon: "📈",
                  records: "800 rows",
                },
                {
                  name: "Inventory Management",
                  description: "Product inventory and warehouse data",
                  icon: "📦",
                  records: "1,200 rows",
                },
                {
                  name: "Customer Feedback",
                  description: "Survey responses and satisfaction scores",
                  icon: "⭐",
                  records: "600 rows",
                },
              ].map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => handleSelectSampleData(sample.name)}
                  className="p-4 border border-gray-200 rounded-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left group"
                >
                  <div className="text-2xl mb-2">{sample.icon}</div>
                  <h4 className="font-medium text-sm text-gray-900 mb-1">{sample.name}</h4>
                  <p className="text-xs text-gray-600 mb-2">{sample.description}</p>
                  <span className="text-xs text-purple-600 font-medium">{sample.records}</span>
                </button>
              ))}
            </div>

            <div className="flex justify-end">
              <button
                onClick={() => setShowSampleDataDialog(false)}
                className="bg-gray-200 text-gray-800 py-2 px-4 rounded-md text-sm font-medium hover:bg-gray-300 transition-colors duration-200"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
