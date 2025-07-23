import { useState } from 'react';
import { useData } from '../../../../src/contexts/DataContext';
import BarChart from './BarChart';

export default function VisualizationCreator() {
  const { datasets, activeDataset } = useData();
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
  
  // Get numeric fields for y-axis
  const numericFields = fields.filter(field => 
    schema[field].type === 'number'
  );
  
  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h3 className="text-lg font-medium mb-4">Create Visualization</h3>
      
      <div className="space-y-4">
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
            Y-Axis Field (Numeric)
          </label>
          <select
            value={yField}
            onChange={(e) => setYField(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Select a field</option>
            {numericFields.map(field => (
              <option key={field} value={field}>{field}</option>
            ))}
          </select>
        </div>
      </div>
      
      {xField && yField && (
        <div className="mt-4 border border-gray-200 rounded-md p-2">
          <h4 className="text-sm font-medium mb-2">Preview</h4>
          <div className="h-64">
            <BarChart 
              datasetName={activeDataset}
              xField={xField}
              yField={yField}
            />
          </div>
        </div>
      )}
    </div>
  );
}