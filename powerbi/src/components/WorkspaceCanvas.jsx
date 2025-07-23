import { useState } from 'react';
import { useData } from '../../../src/contexts/DataContext';
import { useUI } from '../../../src/contexts/UIContext';
import FileUploader from './data/FileUploader';
import DataPreview from './data/DataPreview';
import SampleDataLoader from './data/SampleDataLoader';
import VisualizationCreator from './visualizations/VisualizationCreator';

export default function WorkspaceCanvas() {
  const { getActiveData } = useData();
  const { activeView, setActiveView } = useUI();
  const [activeTab, setActiveTab] = useState('data'); // 'data', 'visualizations', 'dashboard'
  const [activeDataSource, setActiveDataSource] = useState('excel'); // 'excel', 'sql', 'sample', 'paste'
  
  const activeData = getActiveData();
  
  // Handle click on data source options
  const handleDataSourceClick = (name) => {
    if (name === "Import data from Excel") {
      setActiveDataSource('excel');
    } else if (name === "Import data from SQL Server") {
      setActiveDataSource('sql');
      // Will be implemented later
      alert("SQL Server import will be implemented in a future update");
    } else if (name === "Paste data into a blank table") {
      setActiveDataSource('paste');
      // Will be implemented later
      alert("Paste data feature will be implemented in a future update");
    } else if (name === "Use sample data") {
      setActiveDataSource('sample');
    }
  };
  
  // Render the appropriate data source component
  const renderDataSourceComponent = () => {
    switch (activeDataSource) {
      case 'excel':
        return <FileUploader />;
      case 'sample':
        return <SampleDataLoader />;
      case 'sql':
        return (
          <div className="p-4 border border-gray-300 rounded-md">
            <h3 className="text-lg font-medium mb-2">SQL Server Import</h3>
            <p className="text-gray-500">SQL Server import will be implemented in a future update.</p>
          </div>
        );
      case 'paste':
        return (
          <div className="p-4 border border-gray-300 rounded-md">
            <h3 className="text-lg font-medium mb-2">Paste Data</h3>
            <p className="text-gray-500">Paste data feature will be implemented in a future update.</p>
          </div>
        );
      default:
        return <FileUploader />;
    }
  };
  
  return (
    <div className="flex flex-col w-full">
      {!activeData ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 h-[500px] w-[900px] mt-6 text-center mx-auto">
          <h2 className="font-medium text-gray-600 mb-2">Add data to your report</h2>
          <p className="text-sm text-gray-500 mb-4">
            Once loaded, your data will appear in the <strong>Data</strong> pane.
          </p>
          
          {renderDataSourceComponent()}
          
          <div className="flex gap-4 flex-wrap justify-center mt-4">
            {[
              { name: "Import data from Excel", color: "bg-green-100" },
              { name: "Import data from SQL Server", color: "bg-blue-100" },
              { name: "Paste data into a blank table", color: "bg-yellow-100" },
              { name: "Use sample data", color: "bg-gray-100" },
            ].map((item) => (
              <div
                key={item.name}
                className={`${item.color} px-4 py-2 rounded border border-gray-300 text-sm cursor-pointer hover:bg-opacity-75 transition ${
                  activeDataSource === item.name.toLowerCase().includes('excel') ? 'excel' :
                  item.name.toLowerCase().includes('sql') ? 'sql' :
                  item.name.toLowerCase().includes('paste') ? 'paste' :
                  item.name.toLowerCase().includes('sample') ? 'sample' : ''
                } === activeDataSource ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => handleDataSourceClick(item.name)}
              >
                {item.name}
              </div>
            ))}
          </div>
          <p className="mt-4 text-blue-500 text-sm cursor-pointer hover:underline">
            Get data from another source →
          </p>
        </div>
      ) : (
        <div className="w-full">
          {/* Tabs */}
          <div className="flex border-b border-gray-300 mb-4">
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
          </div>
          
          {/* Tab Content */}
          <div className="p-4">
            {activeTab === 'data' && (
              <div>
                <h2 className="text-xl font-medium mb-4">Data Preview</h2>
                <DataPreview fullSize />
              </div>
            )}
            
            {activeTab === 'visualizations' && (
              <div>
                <h2 className="text-xl font-medium mb-4">Visualizations</h2>
                <div className="flex gap-4">
                  <div className="w-1/3">
                    <VisualizationCreator />
                  </div>
                  <div className="w-2/3">
                    <div className="p-4 border border-gray-300 rounded-md h-full">
                      <p className="text-gray-500">
                        Select fields on the left to create a visualization.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'dashboard' && (
              <div>
                <h2 className="text-xl font-medium mb-4">Dashboard</h2>
                <p className="text-gray-500">
                  Dashboard layout will be implemented in a future update.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
