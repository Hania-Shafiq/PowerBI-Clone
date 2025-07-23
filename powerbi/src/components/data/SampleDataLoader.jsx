import { useState } from 'react';
import { useData } from '../../../../src/contexts/DataContext';
import { getAvailableSampleDatasets, loadSampleData } from '../../utils/sampleData';

export default function SampleDataLoader() {
  const { addDataset } = useData();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState('');
  
  const availableDatasets = getAvailableSampleDatasets();
  
  const handleLoadSampleData = () => {
    if (!selectedDataset) return;
    
    setLoading(true);
    setSuccess(false);
    
    try {
      // Load the sample data
      const { data, schema, name } = loadSampleData(selectedDataset);
      
      // Add to datasets
      addDataset(name, data, schema);
      
      setSuccess(true);
    } catch (error) {
      console.error('Error loading sample data:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h3 className="text-lg font-medium mb-2">Load Sample Data</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Select a sample dataset
        </label>
        <select
          value={selectedDataset}
          onChange={(e) => setSelectedDataset(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        >
          <option value="">Select a dataset</option>
          {availableDatasets.map(dataset => (
            <option key={dataset.id} value={dataset.id}>
              {dataset.name}
            </option>
          ))}
        </select>
      </div>
      
      {selectedDataset && (
        <div className="mb-4 p-3 bg-gray-50 rounded-md">
          <h4 className="text-sm font-medium mb-1">
            {availableDatasets.find(d => d.id === selectedDataset)?.name}
          </h4>
          <p className="text-xs text-gray-600">
            {availableDatasets.find(d => d.id === selectedDataset)?.description}
          </p>
        </div>
      )}
      
      <button
        onClick={handleLoadSampleData}
        disabled={!selectedDataset || loading}
        className="w-full py-2 px-4 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
      >
        {loading ? 'Loading...' : 'Load Sample Data'}
      </button>
      
      {success && (
        <p className="mt-2 text-green-500">Sample data loaded successfully!</p>
      )}
    </div>
  );
}