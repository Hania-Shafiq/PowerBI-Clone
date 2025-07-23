import {
  ClipboardPaste,
  Paintbrush2,
  Database,
  FileSpreadsheet,
  Server,
  Table2,
  Sparkles,
  Clock3,
  Pencil,
  RefreshCw,
  BarChart,
  Text,
  Shapes,
  FunctionSquare,
  Sigma,
  Zap,
  ShieldCheck,
  Share,
} from "lucide-react";

const sections = [
  {
    title: "Clipboard",
    items: [
      { icon: ClipboardPaste, label: "Paste" },
      { icon: Paintbrush2, label: "Format painter" },
    ],
    layout: "vertical",
  },
  {
    title: "Data",
    items: [
      { icon: Database, label: "Get data" },
      { icon: FileSpreadsheet, label: "Excel workbook" },
      { icon: Server, label: "SQL Server" },
      { icon: Table2, label: "Enter data" },
      { icon: Sparkles, label: "Dataverse" },
      { icon: Clock3, label: "Recent sources" },
    ],
    layout: "horizontal",
  },
  {
    title: "Queries",
    items: [
      { icon: Pencil, label: "Transform data" },
      { icon: RefreshCw, label: "Refresh" },
    ],
    layout: "horizontal",
  },
  {
    title: "Insert",
    items: [
      { icon: BarChart, label: "New visual" },
      { icon: Text, label: "Text box" },
      { icon: Shapes, label: "More visuals" },
    ],
    layout: "horizontal",
  },
  {
    title: "Calculations",
    items: [
      { icon: FunctionSquare, label: "New calculation" },
      { icon: Sigma, label: "New measure" },
      { icon: Zap, label: "Quick measure" },
    ],
    layout: "horizontal",
  },
  {
    title: "Share",
    items: [
      { icon: ShieldCheck, label: "Sensitivity" },
      { icon: Share, label: "Publish" },
    ],
    layout: "horizontal",
  },
  {
    title: "Copilot",
    items: [{ icon: Sparkles, label: "Copilot" }],
    layout: "horizontal",
  },
];

export default function TopRibbon() {
  return (
    <div className="m-2 rounded-md border border-white bg-white shadow-sm">
      <div className="px-4 py-2">
        {/* Tabs */}
        <div className="flex space-x-6 mb-2 text-sm font-medium bg-white">
          {["File", "Home", "Insert", "Modeling", "View", "Optimize", "Help"].map((tab) => (
            <span
              key={tab}
              className={tab === "Home" ? "text-green-700 border-b-2 border-green-600" : "text-gray-700"}
            >
              {tab}
            </span>
          ))}
        </div>

        {/* Ribbon Sections (tight layout) */}
        <div className="flex overflow-x-auto pb-2 bg-white">
          {sections.map((section, index) => (
            <div
              key={section.title}
              className={`min-w-[130px] h-20 px-2 py-1 flex flex-col items-center justify-between ${
                index !== 0 ? "border-l border-gray-300" : ""
              }`}
            >
              {/* Scrollable Content */}
              <div className="overflow-y-auto w-full flex-1">
                {section.layout === "vertical" ? (
                  // 📎 Clipboard: vertical + extra compact
                  <div className="flex flex-col items-center space-y-1">
                    {section.items.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div key={idx} className="flex flex-col items-center">
                          <Icon className="w-3 h-3 text-gray-600" />
                          <span className="text-[7px] mt-0.5 leading-tight text-center">
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  // 🔁 Others: horizontal layout
                  <div className="flex space-x-3">
                    {section.items.map((item, idx) => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={idx}
                          className="flex flex-col items-center text-center w-14"
                        >
                          <Icon className="w-5 h-5 text-gray-700" />
                          <span className="text-[9px] mt-0.5 leading-tight">
                            {item.label}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Section Label */}
              <div className="text-[9px] text-gray-500 text-center border-t w-full pt-1">
                {section.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
