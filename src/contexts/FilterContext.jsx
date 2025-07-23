import { createContext, useState, useContext, useCallback } from 'react';

const FilterContext = createContext();

export function FilterProvider({ children }) {
  // Global filters apply to all visualizations
  const [globalFilters, setGlobalFilters] = useState([]);
  
  // Visualization filters apply to specific visualizations
  const [visualizationFilters, setVisualizationFilters] = useState({});
  
  // Cross-filters are created by interactions between visualizations
  const [crossFilters, setCrossFilters] = useState({});
  
  // Add a global filter
  const addGlobalFilter = useCallback((filter) => {
    setGlobalFilters(prev => [...prev, { ...filter, id: Date.now().toString() }]);
  }, []);
  
  // Update a global filter
  const updateGlobalFilter = useCallback((filterId, updates) => {
    setGlobalFilters(prev => 
      prev.map(filter => filter.id === filterId ? { ...filter, ...updates } : filter)
    );
  }, []);
  
  // Remove a global filter
  const removeGlobalFilter = useCallback((filterId) => {
    setGlobalFilters(prev => prev.filter(filter => filter.id !== filterId));
  }, []);
  
  // Add a visualization filter
  const addVisualizationFilter = useCallback((visualizationId, filter) => {
    setVisualizationFilters(prev => ({
      ...prev,
      [visualizationId]: [
        ...(prev[visualizationId] || []),
        { ...filter, id: Date.now().toString() }
      ]
    }));
  }, []);
  
  // Update a visualization filter
  const updateVisualizationFilter = useCallback((visualizationId, filterId, updates) => {
    setVisualizationFilters(prev => ({
      ...prev,
      [visualizationId]: (prev[visualizationId] || []).map(filter => 
        filter.id === filterId ? { ...filter, ...updates } : filter
      )
    }));
  }, []);
  
  // Remove a visualization filter
  const removeVisualizationFilter = useCallback((visualizationId, filterId) => {
    setVisualizationFilters(prev => ({
      ...prev,
      [visualizationId]: (prev[visualizationId] || []).filter(filter => filter.id !== filterId)
    }));
  }, []);
  
  // Set cross-filter from a visualization
  const setCrossFilter = useCallback((sourceVisualizationId, filter) => {
    setCrossFilters(prev => ({
      ...prev,
      [sourceVisualizationId]: filter
    }));
  }, []);
  
  // Clear cross-filter from a visualization
  const clearCrossFilter = useCallback((sourceVisualizationId) => {
    setCrossFilters(prev => {
      const newFilters = { ...prev };
      delete newFilters[sourceVisualizationId];
      return newFilters;
    });
  }, []);
  
  // Get all applicable filters for a visualization
  const getFiltersForVisualization = useCallback((visualizationId, datasetName) => {
    // Start with global filters
    let filters = [...globalFilters];
    
    // Add visualization-specific filters
    if (visualizationFilters[visualizationId]) {
      filters = [...filters, ...visualizationFilters[visualizationId]];
    }
    
    // Add cross-filters (excluding those from this visualization)
    Object.entries(crossFilters).forEach(([sourceId, filter]) => {
      if (sourceId !== visualizationId && filter.datasetName === datasetName) {
        filters.push(filter);
      }
    });
    
    return filters;
  }, [globalFilters, visualizationFilters, crossFilters]);
  
  // Apply filters to a dataset
  const applyFilters = useCallback((data, filters) => {
    if (!filters || filters.length === 0) return data;
    
    return data.filter(item => {
      // Item must pass all filters
      return filters.every(filter => {
        const { field, operator, value } = filter;
        
        // Skip if field doesn't exist in item
        if (!(field in item)) return true;
        
        const itemValue = item[field];
        
        switch (operator) {
          case 'equals':
            return itemValue === value;
          case 'notEquals':
            return itemValue !== value;
          case 'contains':
            return String(itemValue).toLowerCase().includes(String(value).toLowerCase());
          case 'notContains':
            return !String(itemValue).toLowerCase().includes(String(value).toLowerCase());
          case 'greaterThan':
            return itemValue > value;
          case 'greaterThanOrEqual':
            return itemValue >= value;
          case 'lessThan':
            return itemValue < value;
          case 'lessThanOrEqual':
            return itemValue <= value;
          case 'between':
            return itemValue >= value[0] && itemValue <= value[1];
          case 'in':
            return Array.isArray(value) && value.includes(itemValue);
          case 'notIn':
            return Array.isArray(value) && !value.includes(itemValue);
          default:
            return true;
        }
      });
    });
  }, []);
  
  return (
    <FilterContext.Provider value={{
      globalFilters,
      visualizationFilters,
      crossFilters,
      addGlobalFilter,
      updateGlobalFilter,
      removeGlobalFilter,
      addVisualizationFilter,
      updateVisualizationFilter,
      removeVisualizationFilter,
      setCrossFilter,
      clearCrossFilter,
      getFiltersForVisualization,
      applyFilters
    }}>
      {children}
    </FilterContext.Provider>
  );
}

export const useFilters = () => useContext(FilterContext);