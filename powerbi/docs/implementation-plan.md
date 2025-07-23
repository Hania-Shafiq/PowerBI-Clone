# Power BI Clone Implementation Plan

This document outlines the step-by-step implementation plan for the Power BI clone, focusing on data loading and visualization capabilities.

## Phase 1: Foundation Setup

### Step 1: Install Required Libraries

```bash
# Navigate to your project directory
cd powerbi

# Install data processing libraries
npm install xlsx papaparse sql.js

# Install visualization libraries
npm install recharts

# Install layout and utility libraries
npm install react-grid-layout lodash date-fns

# Install additional UI libraries
npm install @mui/material @emotion/react @emotion/styled
```

### Step 2: Set Up State Management

Create the following context providers for state management:

1. **Create Data Context**

```jsx
// src/contexts/DataContext.jsx
import { createContext, useState, useContext } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [datasets, setDatasets] = useState({});
  const [activeDataset, setActiveDataset] = useState(null);
  
  // Add a new dataset
  const addDataset = (name, data, schema) => {
    setDatasets(prev => ({
      ...prev,
      [name]: { data, schema, createdAt: new Date() }
    }));
    setActiveDataset(name);
  };
  
  // Remove a dataset
  const removeDataset = (name) => {
    const newDatasets = { ...datasets };
    delete newDatasets[name];
    setDatasets(newDatasets);
    
    if (activeDataset === name) {
      setActiveDataset(Object.keys(newDatasets)[0] || null);
    }
  };
  
  // Get active dataset
  const getActiveData = () => {
    return activeDataset ? datasets[activeDataset] : null;
  };
  
  return (
    <DataContext.Provider value={{
      datasets,
      activeDataset,
      setActiveDataset,
      addDataset,
      removeDataset,
      getActiveData
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
```

2. **Create Visualization Context**

```jsx
// src/contexts/VisualizationContext.jsx
import { createContext, useState, useContext } from 'react';

const VisualizationContext = createContext();

export function VisualizationProvider({ children }) {
  const [visualizations, setVisualizations] = useState([]);
  const [activeVisualization, setActiveVisualization] = useState(null);
  
  // Add a new visualization
  const addVisualization = (config) => {
    const newViz = {
      id: Date.now().toString(),
      type: config.type,
      datasetName: config.datasetName,
      fields: config.fields,
      options: config.options,
      position: config.position || { x: 0, y: 0, w: 4, h: 4 }
    };
    
    setVisualizations(prev => [...prev, newViz]);
    return newViz.id;
  };
  
  // Update a visualization
  const updateVisualization = (id, updates) => {
    setVisualizations(prev => 
      prev.map(viz => viz.id === id ? { ...viz, ...updates } : viz)
    );
  };
  
  // Remove a visualization
  const removeVisualization = (id) => {
    setVisualizations(prev => prev.filter(viz => viz.id !== id));
    if (activeVisualization === id) {
      setActiveVisualization(null);
    }
  };
  
  return (
    <VisualizationContext.Provider value={{
      visualizations,
      activeVisualization,
      setActiveVisualization,
      addVisualization,
      updateVisualization,
      removeVisualization
    }}>
      {children}
    </VisualizationContext.Provider>
  );
}

export const useVisualizations = () => useContext(VisualizationContext);
```

3. **Create UI Context**

```jsx
// src/contexts/UIContext.jsx
import { createContext, useState, useContext } from 'react';

const UIContext = createContext();

export function UIProvider({ children }) {
  const [activeView, setActiveView] = useState('home'); // 'home', 'canvas', 'data'
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activePanels, setActivePanels] = useState({
    dataFields: true,
    visualizations: true,
    filters: true,
    properties: false
  });
  
  // Toggle a panel
  const togglePanel = (panelName) => {
    setActivePanels(prev => ({
      ...prev,
      [panelName]: !prev[panelName]
    }));
  };
  
  return (
    <UIContext.Provider value={{
      activeView,
      setActiveView,
      sidebarOpen,
      setSidebarOpen,
      activePanels,
      togglePanel
    }}>
      {children}
    </UIContext.Provider>
  );
}

export const useUI = () => useContext(UIContext);
```

4. **Update App.jsx to Use Contexts**

```jsx
// src/App.jsx
import { useState } from "react";
import TopNavbar from "./components/TopNavbar";
import TopRibbon from "./components/TopRibbon";
import RightNavbar from "./components/RightNavbar";
import DataSourceOptions from "./components/DataSourceOptions";
import RecommendedSection from "./components/RecommendedSection";
import WorkspaceCanvas from "./components/WorkspaceCanvas";

import { DataProvider } from "./contexts/DataContext";
import { VisualizationProvider } from "./contexts/VisualizationContext";
import { UIProvider } from "./contexts/UIContext";

import "./App.css";

function App() {
  const [showCanvas, setShowCanvas] = useState(false);

  return (
    <DataProvider>
      <VisualizationProvider>
        <UIProvider>
          <TopNavbar />

          {/* Show TopRibbon only when Blank Report is active */}
          {showCanvas && <TopRibbon />}

          <div className="flex">
            {/* Show RightNavbar only if canvas is not shown */}
            {!showCanvas && (
              <div>
                <RightNavbar />
              </div>
            )}

            <div className="pt-10 pl-8">
              {!showCanvas ? (
                <>
                  <DataSourceOptions
                    onSelectSource={(name) => {
                      if (name === "Blank report") {
                        setShowCanvas(true);
                      }
                    }}
                  />
                  <RecommendedSection />
                </>
              ) : (
                <WorkspaceCanvas />
              )}
            </div>
          </div>
        </UIProvider>
      </VisualizationProvider>
    </DataProvider>
  );
}

export default App;
```

### Step 3: Implement Excel File Loading

1. **Create FileUploader Component**

```jsx
// src/components/data/FileUploader.jsx
import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import * as XLSX from 'xlsx';

export default function FileUploader() {
  const { addDataset } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);

      // Check if it's an Excel file
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        throw new Error('Please upload an Excel file (.xlsx or .xls)');
      }

      // Read the file
      const data = await readExcelFile(file);
      
      // Generate a schema from the data
      const schema = generateSchema(data);
      
      // Add to datasets
      const fileName = file.name.split('.')[0];
      addDataset(fileName, data, schema);
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Function to read Excel file
  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Extract headers and rows
          const headers = jsonData[0];
          const rows = jsonData.slice(1);
          
          // Convert to array of objects
          const formattedData = rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });
          
          resolve(formattedData);
        } catch (err) {
          reject(new Error('Failed to parse Excel file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  // Function to generate schema from data
  const generateSchema = (data) => {
    if (!data || data.length === 0) return {};
    
    const sample = data[0];
    const schema = {};
    
    Object.keys(sample).forEach(key => {
      const values = data.map(row => row[key]).filter(val => val !== undefined && val !== null);
      
      // Determine type
      let type = 'string';
      if (values.length > 0) {
        const firstValue = values[0];
        if (typeof firstValue === 'number') {
          type = 'number';
        } else if (firstValue instanceof Date) {
          type = 'date';
        } else if (typeof firstValue === 'boolean') {
          type = 'boolean';
        }
      }
      
      schema[key] = { type };
    });
    
    return schema;
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h3 className="text-lg font-medium mb-2">Upload Excel File</h3>
      
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-green-50 file:text-green-700
          hover:file:bg-green-100"
      />
      
      {loading && <p className="mt-2 text-gray-600">Loading file...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
    </div>
  );
}
```

2. **Create DataPreview Component**

```jsx
// src/components/data/DataPreview.jsx
import { useState } from 'react';
import { useData } from '../../contexts/DataContext';

export default function DataPreview() {
  const { getActiveData } = useData();
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  
  const activeData = getActiveData();
  
  if (!activeData || !activeData.data || activeData.data.length === 0) {
    return (
      <div className="p-4 border border-gray-300 rounded-md">
        <p className="text-gray-500">No data available. Please load a dataset.</p>
      </div>
    );
  }
  
  const { data, schema } = activeData;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const visibleData = data.slice(startIndex, startIndex + rowsPerPage);
  
  const columns = Object.keys(schema);
  
  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h3 className="text-lg font-medium mb-2">Data Preview</h3>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th 
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                  <span className="ml-1 text-gray-400">({schema[column].type})</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visibleData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map(column => (
                  <td 
                    key={`${rowIndex}-${column}`}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {row[column]?.toString() || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
          >
            Previous
          </button>
          
          <span className="text-sm text-gray-600">
            Page {page} of {totalPages}
          </span>
          
          <button
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-1 border border-gray-300 rounded-md disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
```

### Step 4: Update WorkspaceCanvas Component

```jsx
// src/components/WorkspaceCanvas.jsx
import { useUI } from '../contexts/UIContext';
import { useData } from '../contexts/DataContext';
import FileUploader from './data/FileUploader';
import DataPreview from './data/DataPreview';

export default function WorkspaceCanvas() {
  const { activeView } = useUI();
  const { getActiveData } = useData();
  const activeData = getActiveData();
  
  return (
    <div className="flex flex-col w-full">
      {!activeData ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 h-[500px] w-[900px] mt-6 text-center mx-auto">
          <h2 className="font-medium text-gray-600 mb-2">Add data to your report</h2>
          <p className="text-sm text-gray-500 mb-4">
            Once loaded, your data will appear in the <strong>Data</strong> pane.
          </p>
          
          <FileUploader />
          
          <div className="flex gap-4 flex-wrap justify-center mt-4">
            {[
              { name: "Import data from Excel", color: "bg-green-100" },
              { name: "Import data from SQL Server", color: "bg-blue-100" },
              { name: "Paste data into a blank table", color: "bg-yellow-100" },
              { name: "Use sample data", color: "bg-gray-100" },
            ].map((item) => (
              <div
                key={item.name}
                className={`${item.color} px-4 py-2 rounded border border-gray-300 text-sm cursor-pointer hover:bg-opacity-75 transition`}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <div className="mb-4">
            <DataPreview />
          </div>
          
          <div className="border-2 border-dashed border-gray-300 h-[400px] w-full p-4">
            <p className="text-center text-gray-500">
              Select visualization type from the ribbon to create a chart
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Phase 2: Basic Visualization Components

After implementing the data loading functionality, the next step is to create basic visualization components. Here's a plan for implementing a simple bar chart component:

### Step 1: Create BarChart Component

```jsx
// src/components/visualizations/BarChart.jsx
import { useEffect, useState } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useData } from '../../contexts/DataContext';

export default function BarChart({ config }) {
  const { datasets } = useData();
  const [chartData, setChartData] = useState([]);
  
  const { datasetName, xField, yField, color = '#8884d8' } = config;
  
  useEffect(() => {
    if (!datasets[datasetName] || !xField || !yField) {
      setChartData([]);
      return;
    }
    
    const { data } = datasets[datasetName];
    
    // Transform data for the chart
    const transformedData = data.map(item => ({
      name: item[xField],
      value: item[yField]
    }));
    
    setChartData(transformedData);
  }, [datasets, datasetName, xField, yField]);
  
  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full border border-gray-300 rounded-md p-4">
        <p className="text-gray-500">No data available for this chart</p>
      </div>
    );
  }
  
  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RechartsBarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill={color} />
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### Step 2: Create VisualizationCreator Component

```jsx
// src/components/visualizations/VisualizationCreator.jsx
import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import { useVisualizations } from '../../contexts/VisualizationContext';
import BarChart from './BarChart';

export default function VisualizationCreator() {
  const { datasets, activeDataset } = useData();
  const { addVisualization } = useVisualizations();
  
  const [vizType, setVizType] = useState('bar');
  const [xField, setXField] = useState('');
  const [yField, setYField] = useState('');
  
  if (!activeDataset || !datasets[activeDataset]) {
    return (
      <div className="p-4 border border-gray-300 rounded-md">
        <p className="text-gray-500">Please select a dataset first</p>
      </div>
    );
  }
  
  const { schema } = datasets[activeDataset];
  const fields = Object.keys(schema);
  
  const handleCreateVisualization = () => {
    if (!xField || !yField) return;
    
    const config = {
      type: vizType,
      datasetName: activeDataset,
      fields: { xField, yField },
      options: { color: '#8884d8' }
    };
    
    addVisualization(config);
  };
  
  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h3 className="text-lg font-medium mb-4">Create Visualization</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Visualization Type
          </label>
          <select
            value={vizType}
            onChange={(e) => setVizType(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="bar">Bar Chart</option>
            <option value="line" disabled>Line Chart (Coming Soon)</option>
            <option value="pie" disabled>Pie Chart (Coming Soon)</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            X-Axis Field
          </label>
          <select
            value={xField}
            onChange={(e) => setXField(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a field</option>
            {fields.map(field => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Y-Axis Field
          </label>
          <select
            value={yField}
            onChange={(e) => setYField(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a field</option>
            {fields.map(field => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
        </div>
        
        <button
          onClick={handleCreateVisualization}
          disabled={!xField || !yField}
          className="w-full py-2 px-4 bg-green-600 text-white rounded-md disabled:bg-gray-400"
        >
          Create Visualization
        </button>
      </div>
    </div>
  );
}
```

### Step 3: Update WorkspaceCanvas to Display Visualizations

```jsx
// src/components/WorkspaceCanvas.jsx (updated)
import { useUI } from '../contexts/UIContext';
import { useData } from '../contexts/DataContext';
import { useVisualizations } from '../contexts/VisualizationContext';
import FileUploader from './data/FileUploader';
import DataPreview from './data/DataPreview';
import VisualizationCreator from './visualizations/VisualizationCreator';
import BarChart from './visualizations/BarChart';

export default function WorkspaceCanvas() {
  const { activeView } = useUI();
  const { getActiveData } = useData();
  const { visualizations } = useVisualizations();
  
  const activeData = getActiveData();
  
  return (
    <div className="flex flex-col w-full">
      {!activeData ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 h-[500px] w-[900px] mt-6 text-center mx-auto">
          <h2 className="font-medium text-gray-600 mb-2">Add data to your report</h2>
          <p className="text-sm text-gray-500 mb-4">
            Once loaded, your data will appear in the <strong>Data</strong> pane.
          </p>
          
          <FileUploader />
          
          <div className="flex gap-4 flex-wrap justify-center mt-4">
            {[
              { name: "Import data from Excel", color: "bg-green-100" },
              { name: "Import data from SQL Server", color: "bg-blue-100" },
              { name: "Paste data into a blank table", color: "bg-yellow-100" },
              { name: "Use sample data", color: "bg-gray-100" },
            ].map((item) => (
              <div
                key={item.name}
                className={`${item.color} px-4 py-2 rounded border border-gray-300 text-sm cursor-pointer hover:bg-opacity-75 transition`}
              >
                {item.name}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="flex flex-col w-full">
          <div className="mb-4">
            <DataPreview />
          </div>
          
          <div className="flex gap-4">
            <div className="w-1/3">
              <VisualizationCreator />
            </div>
            
            <div className="w-2/3 border border-gray-300 rounded-md p-4">
              {visualizations.length === 0 ? (
                <p className="text-center text-gray-500">
                  No visualizations yet. Create one using the form on the left.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {visualizations.map(viz => (
                    <div 
                      key={viz.id}
                      className="h-64 border border-gray-200 rounded-md p-2"
                    >
                      {viz.type === 'bar' && (
                        <BarChart config={{
                          datasetName: viz.datasetName,
                          xField: viz.fields.xField,
                          yField: viz.fields.yField,
                          color: viz.options?.color
                        }} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
```

## Next Steps

After implementing these components, you'll have a basic foundation for your Power BI clone with:

1. Data loading from Excel files
2. Data preview functionality
3. Basic visualization creation (bar charts)

The next phases would involve:

1. Adding more visualization types (line, pie, etc.)
2. Implementing SQL database connectivity
3. Adding filtering capabilities
4. Enhancing the workspace canvas with drag-and-drop functionality

Would you like me to provide implementation details for any of these next steps?