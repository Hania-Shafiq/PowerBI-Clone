import excelIcon from "../assets/excel.png"
import onelakeIcon from "../assets/onelake.png"
import reportIcon from "../assets/report.png"
import sampleIcon from "../assets/sampledata.png"
import sqlIcon from "../assets/sql.png"
import addIcon from "../assets/add.png"

const dataSources = [
  {
    name: "Blank report",
    icon: reportIcon,
    action: "blank",
  },
  {
    name: "OneLake catalog",
    icon: onelakeIcon,
    action: "onelake",
  },
  {
    name: "Excel workbook",
    icon: excelIcon,
    action: "excel",
  },
  {
    name: "SQL Server",
    icon: sqlIcon,
    action: "sql",
  },
  {
    name: "Learn with sample data",
    icon: sampleIcon,
    action: "sample",
  },
  {
    name: "Get data from other sources",
    icon: addIcon,
    action: "other",
  },
]

// Rest of the component remains the same as above...
export default function DataSourceOptions({ onSelectSource }) {
  // ... same implementation as above
}
