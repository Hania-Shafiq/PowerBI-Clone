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