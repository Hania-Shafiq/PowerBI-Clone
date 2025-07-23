# Dashboard Layout Implementation

This document outlines the approach for implementing a flexible dashboard layout system in the Power BI clone.

## Overview

The dashboard layout system will allow users to:
1. Create a responsive grid layout for visualizations
2. Drag and drop visualizations to rearrange them
3. Resize visualizations to customize the dashboard
4. Save and load dashboard layouts
5. Create multiple dashboards/reports

## Implementation Approach

We'll use `react-grid-layout` for implementing the dashboard layout system. This library provides a flexible grid layout with draggable and resizable items, which is perfect for our dashboard requirements.

## Components

### 1. Dashboard Canvas Component

```jsx
// src/components/dashboard/DashboardCanvas.jsx
import { useState, useEffect } from 'react';
import { Responsive, WidthProvider } from 'react-grid-layout';
import { useVisualizations } from '../../contexts/VisualizationContext';
import VisualizationFactory from '../visualizations/VisualizationFactory';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Create a responsive grid layout
const ResponsiveGridLayout = WidthProvider(Responsive);

export default function DashboardCanvas() {
  const { visualizations, updateVisualization, removeVisualization } = useVisualizations();
  const [layouts, setLayouts] = useState({ lg: [] });
  
  // Generate layouts from visualizations
  useEffect(() => {
    const newLayouts = {
      lg: visualizations.map(viz => ({
        i: viz.id,
        x: viz.position?.x || 0,
        y: viz.position?.y || 0,
        w: viz.position?.w || 4,
        h: viz.position?.h || 4,
        minW: 2,
        minH: 2
      }))
    };
    
    setLayouts(newLayouts);
  }, [visualizations]);
  
  // Handle layout change
  const handleLayoutChange = (currentLayout, allLayouts) => {
    // Update layouts
    setLayouts(allLayouts);
    
    // Update visualization positions
    currentLayout.forEach(item => {
      const { i, x, y, w, h } = item;
      updateVisualization(i, {
        position: { x, y, w, h }
      });
    });
  };
  
  // Handle visualization removal
  const handleRemoveVisualization = (id) => {
    removeVisualization(id);
  };
  
  return (
    <div className="w-full h-full p-4 bg-gray-100 overflow-auto">
      {visualizations.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <p className="text-gray-500 mb-4">
            No visualizations added yet. Use the visualization creator to add charts and tables.
          </p>
        </div>
      ) : (
        <ResponsiveGridLayout
          className="layout"
          layouts={layouts}
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
          rowHeight={60}
          onLayoutChange={handleLayoutChange}
          isDraggable
          isResizable
          compactType="vertical"
          margin={[16, 16]}
        >
          {visualizations.map(viz => (
            <div key={viz.id} className="bg-white rounded-md shadow-sm overflow-hidden">
              <div className="p-2 border-b border-gray-200 flex items-center justify-between">
                <h3 className="text-sm font-medium truncate">{viz.title || 'Untitled'}</h3>
                
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleRemoveVisualization(viz.id)}
                    className="p-1 text-gray-500 hover:text-red-600 rounded"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              </div>
              
              <div className="p-2 h-[calc(100%-36px)]">
                <VisualizationFactory
                  id={viz.id}
                  type={viz.type}
                  datasetName={viz.datasetName}
                  fields={viz.fields}
                  options={viz.options}
                />
              </div>
            </div>
          ))}
        </ResponsiveGridLayout>
      )}
    </div>
  );
}
```

### 2. Dashboard Controls Component

```jsx
// src/components/dashboard/DashboardControls.jsx
import { useState } from 'react';
import { useVisualizations } from '../../contexts/VisualizationContext';
import { Save, Download, Upload, Plus, Trash } from 'lucide-react';

export default function DashboardControls() {
  const { visualizations, setVisualizations } = useVisualizations();
  const [dashboardName, setDashboardName] = useState('My Dashboard');
  
  // Save dashboard
  const saveDashboard = () => {
    const dashboard = {
      name: dashboardName,
      visualizations,
      createdAt: new Date().toISOString()
    };
    
    // Save to localStorage
    const savedDashboards = JSON.parse(localStorage.getItem('dashboards') || '[]');
    const existingIndex = savedDashboards.findIndex(d => d.name === dashboardName);
    
    if (existingIndex >= 0) {
      // Update existing
      savedDashboards[existingIndex] = dashboard;
    } else {
      // Add new
      savedDashboards.push(dashboard);
    }
    
    localStorage.setItem('dashboards', JSON.stringify(savedDashboards));
    
    alert(`Dashboard "${dashboardName}" saved successfully!`);
  };
  
  // Export dashboard
  const exportDashboard = () => {
    const dashboard = {
      name: dashboardName,
      visualizations,
      exportedAt: new Date().toISOString()
    };
    
    // Create a blob and download it
    const blob = new Blob([JSON.stringify(dashboard, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = `${dashboardName.replace(/\s+/g, '-').toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  // Import dashboard
  const importDashboard = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const dashboard = JSON.parse(e.target.result);
        
        if (!dashboard.visualizations || !Array.isArray(dashboard.visualizations)) {
          throw new Error('Invalid dashboard file');
        }
        
        setDashboardName(dashboard.name || 'Imported Dashboard');
        setVisualizations(dashboard.visualizations);
        
        alert('Dashboard imported successfully!');
      } catch (err) {
        alert(`Error importing dashboard: ${err.message}`);
      }
    };
    
    reader.readAsText(file);
  };
  
  // Clear dashboard
  const clearDashboard = () => {
    if (window.confirm('Are you sure you want to clear the dashboard? This will remove all visualizations.')) {
      setVisualizations([]);
    }
  };
  
  return (
    <div className="flex items-center justify-between p-4 bg-white border-b border-gray-200">
      <div className="flex items-center">
        <input
          type="text"
          value={dashboardName}
          onChange={(e) => setDashboardName(e.target.value)}
          className="mr-4 p-2 border border-gray-300 rounded-md"
          placeholder="Dashboard Name"
        />
        
        <button
          onClick={saveDashboard}
          className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md mr-2"
        >
          <Save className="w-4 h-4 mr-1" />
          Save
        </button>
        
        <button
          onClick={exportDashboard}
          className="flex items-center px-3 py-2 bg-gray-200 text-gray-800 rounded-md mr-2"
        >
          <Download className="w-4 h-4 mr-1" />
          Export
        </button>
        
        <label className="flex items-center px-3 py-2 bg-gray-200 text-gray-800 rounded-md mr-2 cursor-pointer">
          <Upload className="w-4 h-4 mr-1" />
          Import
          <input
            type="file"
            accept=".json"
            onChange={importDashboard}
            className="hidden"
          />
        </label>
        
        <button
          onClick={clearDashboard}
          className="flex items-center px-3 py-2 bg-red-100 text-red-700 rounded-md"
        >
          <Trash className="w-4 h-4 mr-1" />
          Clear
        </button>
      </div>
      
      <div className="text-sm text-gray-500">
        {visualizations.length} visualization{visualizations.length !== 1 ? 's' : ''}
      </div>
    </div>
  );
}
```

### 3. Dashboard Manager Component

```jsx
// src/components/dashboard/DashboardManager.jsx
import { useState, useEffect } from 'react';
import { useVisualizations } from '../../contexts/VisualizationContext';
import { Folder, Clock, Star, Trash } from 'lucide-react';

export default function DashboardManager() {
  const { setVisualizations } = useVisualizations();
  const [savedDashboards, setSavedDashboards] = useState([]);
  const [selectedDashboard, setSelectedDashboard] = useState(null);
  
  // Load saved dashboards from localStorage
  useEffect(() => {
    const dashboards = JSON.parse(localStorage.getItem('dashboards') || '[]');
    setSavedDashboards(dashboards);
  }, []);
  
  // Load dashboard
  const loadDashboard = (dashboard) => {
    setVisualizations(dashboard.visualizations);
    setSelectedDashboard(dashboard.name);
  };
  
  // Delete dashboard
  const deleteDashboard = (name, event) => {
    event.stopPropagation();
    
    if (window.confirm(`Are you sure you want to delete the dashboard "${name}"?`)) {
      const dashboards = savedDashboards.filter(d => d.name !== name);
      setSavedDashboards(dashboards);
      localStorage.setItem('dashboards', JSON.stringify(dashboards));
      
      if (selectedDashboard === name) {
        setSelectedDashboard(null);
      }
    }
  };
  
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      <div className="bg-gray-100 p-3 border-b border-gray-300">
        <h3 className="font-medium">Saved Dashboards</h3>
      </div>
      
      <div className="p-3">
        {savedDashboards.length === 0 ? (
          <p className="text-sm text-gray-500">No saved dashboards</p>
        ) : (
          <ul className="space-y-2">
            {savedDashboards.map(dashboard => (
              <li 
                key={dashboard.name}
                className={`flex items-center justify-between p-2 rounded-md cursor-pointer ${
                  selectedDashboard === dashboard.name ? 'bg-blue-100' : 'hover:bg-gray-100'
                }`}
                onClick={() => loadDashboard(dashboard)}
              >
                <div className="flex items-center">
                  {selectedDashboard === dashboard.name ? (
                    <Star className="w-4 h-4 text-blue-600 mr-2" />
                  ) : (
                    <Folder className="w-4 h-4 text-gray-600 mr-2" />
                  )}
                  <div>
                    <div className="font-medium text-sm">{dashboard.name}</div>
                    <div className="text-xs text-gray-500 flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {new Date(dashboard.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                
                <button
                  onClick={(e) => deleteDashboard(dashboard.name, e)}
                  className="p-1 text-gray-500 hover:text-red-600 rounded"
                >
                  <Trash className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
```

### 4. Enhanced WorkspaceCanvas Component

Now, let's update the WorkspaceCanvas component to incorporate our dashboard layout system:

```jsx
// src/components/WorkspaceCanvas.jsx (updated)
import { useState } from 'react';
import { useUI } from '../contexts/UIContext';
import { useData } from '../contexts/DataContext';
import { useVisualizations } from '../contexts/VisualizationContext';
import FileUploader from './data/FileUploader';
import DataPreview from './data/DataPreview';
import VisualizationCreator from './visualizations/VisualizationCreator';
import DashboardCanvas from './dashboard/DashboardCanvas';
import DashboardControls from './dashboard/DashboardControls';
import FilterPanel from './filters/FilterPanel';
import DateRangeFilter from './filters/DateRangeFilter';
import DashboardManager from './dashboard/DashboardManager';

export default function WorkspaceCanvas() {
  const { activeView, activePanels, togglePanel } = useUI();
  const { getActiveData } = useData();
  const { visualizations } = useVisualizations();
  
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'data', 'visualizations'
  
  const activeData = getActiveData();
  
  if (!activeData) {
    return (
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
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      {/* Tabs */}
      <div className="flex border-b border-gray-300">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'dashboard' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('dashboard')}
        >
          Dashboard
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'data' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('data')}
        >
          Data
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'visualizations' 
              ? 'text-blue-600 border-b-2 border-blue-600' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
          onClick={() => setActiveTab('visualizations')}
        >
          Visualizations
        </button>
      </div>
      
      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-64 border-r border-gray-300 p-4 overflow-y-auto">
          {activeTab === 'dashboard' && (
            <div className="space-y-4">
              <DashboardManager />
              <FilterPanel />
              <DateRangeFilter />
            </div>
          )}
          
          {activeTab === 'data' && (
            <div>
              <h3 className="font-medium mb-2">Data Fields</h3>
              <DataPreview />
            </div>
          )}
          
          {activeTab === 'visualizations' && (
            <div>
              <h3 className="font-medium mb-2">Create Visualization</h3>
              <VisualizationCreator />
            </div>
          )}
        </div>
        
        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {activeTab === 'dashboard' && (
            <>
              <DashboardControls />
              <div className="flex-1 overflow-hidden">
                <DashboardCanvas />
              </div>
            </>
          )}
          
          {activeTab === 'data' && (
            <div className="p-4 overflow-auto">
              <h2 className="text-lg font-medium mb-4">Data Preview</h2>
              <DataPreview fullSize />
            </div>
          )}
          
          {activeTab === 'visualizations' && (
            <div className="p-4 overflow-auto">
              <h2 className="text-lg font-medium mb-4">Visualization Gallery</h2>
              
              {visualizations.length === 0 ? (
                <p className="text-gray-500">
                  No visualizations created yet. Use the form on the left to create visualizations.
                </p>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {visualizations.map(viz => (
                    <div key={viz.id} className="border border-gray-300 rounded-md overflow-hidden">
                      <div className="p-2 border-b border-gray-200">
                        <h3 className="font-medium">{viz.title || 'Untitled'}</h3>
                      </div>
                      <div className="h-64 p-2">
                        <VisualizationFactory
                          id={viz.id}
                          type={viz.type}
                          datasetName={viz.datasetName}
                          fields={viz.fields}
                          options={viz.options}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
```

## Dashboard Layout Persistence

To ensure that dashboard layouts are preserved, we need to update our VisualizationContext to include methods for saving and loading dashboards:

```jsx
// src/contexts/VisualizationContext.jsx (updated)
import { createContext, useState, useContext } from 'react';

const VisualizationContext = createContext();

export function VisualizationProvider({ children }) {
  const [visualizations, setVisualizations] = useState([]);
  const [activeVisualization, setActiveVisualization] = useState(null);
  const [dashboards, setDashboards] = useState([]);
  const [activeDashboard, setActiveDashboard] = useState(null);
  
  // Add a new visualization
  const addVisualization = (config) => {
    const newViz = {
      id: Date.now().toString(),
      type: config.type,
      title: config.title || 'Untitled',
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
  
  // Save current dashboard
  const saveDashboard = (name) => {
    const dashboard = {
      id: Date.now().toString(),
      name,
      visualizations,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    setDashboards(prev => {
      const existingIndex = prev.findIndex(d => d.name === name);
      if (existingIndex >= 0) {
        // Update existing
        const updated = [...prev];
        updated[existingIndex] = dashboard;
        return updated;
      } else {
        // Add new
        return [...prev, dashboard];
      }
    });
    
    setActiveDashboard(dashboard.id);
    return dashboard.id;
  };
  
  // Load a dashboard
  const loadDashboard = (id) => {
    const dashboard = dashboards.find(d => d.id === id);
    if (dashboard) {
      setVisualizations(dashboard.visualizations);
      setActiveDashboard(id);
      return true;
    }
    return false;
  };
  
  // Delete a dashboard
  const deleteDashboard = (id) => {
    setDashboards(prev => prev.filter(d => d.id !== id));
    if (activeDashboard === id) {
      setActiveDashboard(null);
    }
  };
  
  // Export dashboard to JSON
  const exportDashboard = (id) => {
    const dashboard = dashboards.find(d => d.id === id) || {
      name: 'Untitled Dashboard',
      visualizations,
      createdAt: new Date().toISOString(),
      exportedAt: new Date().toISOString()
    };
    
    return JSON.stringify(dashboard);
  };
  
  // Import dashboard from JSON
  const importDashboard = (json) => {
    try {
      const dashboard = JSON.parse(json);
      
      if (!dashboard.visualizations || !Array.isArray(dashboard.visualizations)) {
        throw new Error('Invalid dashboard format');
      }
      
      const newDashboard = {
        id: Date.now().toString(),
        name: dashboard.name || 'Imported Dashboard',
        visualizations: dashboard.visualizations,
        createdAt: dashboard.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        importedAt: new Date().toISOString()
      };
      
      setDashboards(prev => [...prev, newDashboard]);
      setVisualizations(dashboard.visualizations);
      setActiveDashboard(newDashboard.id);
      
      return newDashboard.id;
    } catch (err) {
      console.error('Error importing dashboard:', err);
      return null;
    }
  };
  
  return (
    <VisualizationContext.Provider value={{
      visualizations,
      setVisualizations,
      activeVisualization,
      setActiveVisualization,
      addVisualization,
      updateVisualization,
      removeVisualization,
      dashboards,
      activeDashboard,
      saveDashboard,
      loadDashboard,
      deleteDashboard,
      exportDashboard,
      importDashboard
    }}>
      {children}
    </VisualizationContext.Provider>
  );
}

export const useVisualizations = () => useContext(VisualizationContext);
```

## Conclusion

This implementation provides a comprehensive dashboard layout system for the Power BI clone. Users can:

1. Create a responsive grid layout for visualizations
2. Drag and drop visualizations to rearrange them
3. Resize visualizations to customize the dashboard
4. Save and load dashboard layouts
5. Export and import dashboards
6. Create multiple dashboards/reports

The implementation uses react-grid-layout for the layout system, which provides a flexible and responsive grid with draggable and resizable items. The dashboard state is managed through the VisualizationContext, which provides methods for adding, updating, and removing visualizations, as well as saving, loading, and exporting dashboards.