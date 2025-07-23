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
  
  // Get a visualization by ID
  const getVisualization = (id) => {
    return visualizations.find(viz => viz.id === id);
  };
  
  // Duplicate a visualization
  const duplicateVisualization = (id) => {
    const viz = getVisualization(id);
    if (!viz) return null;
    
    const duplicate = {
      ...viz,
      id: Date.now().toString(),
      title: `${viz.title} (Copy)`,
      position: {
        ...viz.position,
        x: viz.position.x + 1,
        y: viz.position.y + 1
      }
    };
    
    setVisualizations(prev => [...prev, duplicate]);
    return duplicate.id;
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
      getVisualization,
      duplicateVisualization
    }}>
      {children}
    </VisualizationContext.Provider>
  );
}

export const useVisualizations = () => useContext(VisualizationContext);