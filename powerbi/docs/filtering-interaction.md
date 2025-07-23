# Filtering and Interaction Capabilities

This document outlines the approach for implementing filtering and interaction capabilities in the Power BI clone.

## Overview

The filtering and interaction capabilities will allow users to:
1. Create and apply filters to visualizations
2. Implement cross-filtering between visualizations
3. Add date range filters
4. Implement drill-down functionality
5. Create interactive dashboards

## Implementation Approach

We'll implement a comprehensive filtering system that works at multiple levels:
- **Global filters**: Apply to all visualizations in the dashboard
- **Visualization filters**: Apply to specific visualizations
- **Cross-filtering**: Clicking on elements in one visualization filters other visualizations
- **Drill-down**: Allows users to navigate from summary to detailed data

## Components

### 1. Filter Context

First, let's create a context for managing filters:

```jsx
// src/contexts/FilterContext.jsx
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
```

### 2. Filter Panel Component

```jsx
// src/components/filters/FilterPanel.jsx
import { useState } from 'react';
import { useFilters } from '../../contexts/FilterContext';
import { useData } from '../../contexts/DataContext';
import { X, Plus, Filter } from 'lucide-react';

export default function FilterPanel() {
  const { 
    globalFilters, 
    addGlobalFilter, 
    updateGlobalFilter, 
    removeGlobalFilter 
  } = useFilters();
  
  const { datasets } = useData();
  const [showAddFilter, setShowAddFilter] = useState(false);
  const [newFilter, setNewFilter] = useState({
    datasetName: '',
    field: '',
    operator: 'equals',
    value: ''
  });
  
  // Get all available datasets
  const availableDatasets = Object.keys(datasets);
  
  // Get fields for selected dataset
  const getFieldsForDataset = (datasetName) => {
    if (!datasetName || !datasets[datasetName]) return [];
    return Object.keys(datasets[datasetName].schema || {});
  };
  
  // Get operators based on field type
  const getOperatorsForField = (datasetName, field) => {
    if (!datasetName || !datasets[datasetName] || !field) return [];
    
    const fieldType = datasets[datasetName].schema?.[field]?.type || 'string';
    
    // Common operators
    const operators = [
      { value: 'equals', label: 'Equals' },
      { value: 'notEquals', label: 'Not Equals' }
    ];
    
    // Type-specific operators
    if (fieldType === 'string') {
      operators.push(
        { value: 'contains', label: 'Contains' },
        { value: 'notContains', label: 'Not Contains' },
        { value: 'in', label: 'In List' },
        { value: 'notIn', label: 'Not In List' }
      );
    } else if (fieldType === 'number' || fieldType === 'date') {
      operators.push(
        { value: 'greaterThan', label: 'Greater Than' },
        { value: 'greaterThanOrEqual', label: 'Greater Than or Equal' },
        { value: 'lessThan', label: 'Less Than' },
        { value: 'lessThanOrEqual', label: 'Less Than or Equal' },
        { value: 'between', label: 'Between' }
      );
    }
    
    return operators;
  };
  
  // Handle adding a new filter
  const handleAddFilter = () => {
    if (!newFilter.datasetName || !newFilter.field || !newFilter.operator) return;
    
    addGlobalFilter(newFilter);
    
    // Reset form
    setNewFilter({
      datasetName: '',
      field: '',
      operator: 'equals',
      value: ''
    });
    
    setShowAddFilter(false);
  };
  
  return (
    <div className="border border-gray-300 rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Filters</h3>
        
        <button
          onClick={() => setShowAddFilter(!showAddFilter)}
          className="flex items-center text-sm text-blue-600 hover:text-blue-800"
        >
          {showAddFilter ? (
            <X className="w-4 h-4 mr-1" />
          ) : (
            <Plus className="w-4 h-4 mr-1" />
          )}
          {showAddFilter ? 'Cancel' : 'Add Filter'}
        </button>
      </div>
      
      {/* Add Filter Form */}
      {showAddFilter && (
        <div className="mb-4 p-3 border border-gray-200 rounded-md bg-gray-50">
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dataset
            </label>
            <select
              value={newFilter.datasetName}
              onChange={(e) => setNewFilter(prev => ({ ...prev, datasetName: e.target.value, field: '' }))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a dataset</option>
              {availableDatasets.map(dataset => (
                <option key={dataset} value={dataset}>{dataset}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Field
            </label>
            <select
              value={newFilter.field}
              onChange={(e) => setNewFilter(prev => ({ ...prev, field: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={!newFilter.datasetName}
            >
              <option value="">Select a field</option>
              {getFieldsForDataset(newFilter.datasetName).map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Operator
            </label>
            <select
              value={newFilter.operator}
              onChange={(e) => setNewFilter(prev => ({ ...prev, operator: e.target.value }))}
              className="w-full p-2 border border-gray-300 rounded-md"
              disabled={!newFilter.field}
            >
              <option value="">Select an operator</option>
              {getOperatorsForField(newFilter.datasetName, newFilter.field).map(op => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Value
            </label>
            {newFilter.operator === 'between' ? (
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={newFilter.value[0] || ''}
                  onChange={(e) => setNewFilter(prev => ({ 
                    ...prev, 
                    value: [e.target.value, prev.value[1] || ''] 
                  }))}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Min"
                />
                <span>to</span>
                <input
                  type="text"
                  value={newFilter.value[1] || ''}
                  onChange={(e) => setNewFilter(prev => ({ 
                    ...prev, 
                    value: [prev.value[0] || '', e.target.value] 
                  }))}
                  className="flex-1 p-2 border border-gray-300 rounded-md"
                  placeholder="Max"
                />
              </div>
            ) : newFilter.operator === 'in' || newFilter.operator === 'notIn' ? (
              <textarea
                value={Array.isArray(newFilter.value) ? newFilter.value.join('\n') : ''}
                onChange={(e) => setNewFilter(prev => ({ 
                  ...prev, 
                  value: e.target.value.split('\n').filter(v => v.trim() !== '')
                }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter values (one per line)"
                rows={3}
              />
            ) : (
              <input
                type="text"
                value={newFilter.value}
                onChange={(e) => setNewFilter(prev => ({ ...prev, value: e.target.value }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                placeholder="Enter value"
              />
            )}
          </div>
          
          <button
            onClick={handleAddFilter}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md"
          >
            Add Filter
          </button>
        </div>
      )}
      
      {/* Active Filters */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-2">Active Filters</h4>
        
        {globalFilters.length === 0 ? (
          <p className="text-sm text-gray-500">No filters applied</p>
        ) : (
          <div className="space-y-2">
            {globalFilters.map(filter => (
              <div 
                key={filter.id}
                className="flex items-center justify-between p-2 bg-blue-50 border border-blue-200 rounded-md"
              >
                <div className="flex items-center">
                  <Filter className="w-4 h-4 text-blue-600 mr-2" />
                  <span className="text-sm">
                    <span className="font-medium">{filter.field}</span>
                    {' '}
                    <span className="text-gray-600">{filter.operator}</span>
                    {' '}
                    <span className="font-medium">
                      {Array.isArray(filter.value) 
                        ? filter.value.join(', ') 
                        : filter.value}
                    </span>
                  </span>
                </div>
                
                <button
                  onClick={() => removeGlobalFilter(filter.id)}
                  className="text-gray-500 hover:text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
```

### 3. Date Range Filter Component

```jsx
// src/components/filters/DateRangeFilter.jsx
import { useState, useEffect } from 'react';
import { useFilters } from '../../contexts/FilterContext';
import { useData } from '../../contexts/DataContext';
import { Calendar, ChevronDown, ChevronUp } from 'lucide-react';

export default function DateRangeFilter() {
  const { addGlobalFilter, globalFilters, removeGlobalFilter } = useFilters();
  const { datasets } = useData();
  
  const [expanded, setExpanded] = useState(true);
  const [selectedDataset, setSelectedDataset] = useState('');
  const [selectedField, setSelectedField] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [activeFilter, setActiveFilter] = useState(null);
  
  // Get all available datasets
  const availableDatasets = Object.keys(datasets);
  
  // Get date fields for selected dataset
  const getDateFieldsForDataset = (datasetName) => {
    if (!datasetName || !datasets[datasetName]) return [];
    
    const { schema } = datasets[datasetName];
    return Object.entries(schema)
      .filter(([_, fieldSchema]) => fieldSchema.type === 'date')
      .map(([fieldName]) => fieldName);
  };
  
  // Check if there's already a date range filter
  useEffect(() => {
    const existingFilter = globalFilters.find(filter => 
      filter.operator === 'between' && 
      datasets[filter.datasetName]?.schema[filter.field]?.type === 'date'
    );
    
    if (existingFilter) {
      setActiveFilter(existingFilter);
      setSelectedDataset(existingFilter.datasetName);
      setSelectedField(existingFilter.field);
      setStartDate(existingFilter.value[0]);
      setEndDate(existingFilter.value[1]);
    } else {
      setActiveFilter(null);
    }
  }, [globalFilters, datasets]);
  
  // Apply date range filter
  const applyDateFilter = () => {
    if (!selectedDataset || !selectedField || !startDate || !endDate) return;
    
    // Remove existing date filter if any
    if (activeFilter) {
      removeGlobalFilter(activeFilter.id);
    }
    
    // Add new date filter
    addGlobalFilter({
      datasetName: selectedDataset,
      field: selectedField,
      operator: 'between',
      value: [startDate, endDate]
    });
  };
  
  // Clear date filter
  const clearDateFilter = () => {
    if (activeFilter) {
      removeGlobalFilter(activeFilter.id);
    }
    
    setStartDate('');
    setEndDate('');
  };
  
  return (
    <div className="border border-gray-300 rounded-md overflow-hidden">
      {/* Header */}
      <div 
        className="flex items-center justify-between p-3 bg-gray-100 cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <Calendar className="w-4 h-4 mr-2 text-blue-600" />
          <h3 className="text-sm font-medium">Date Range Filter</h3>
        </div>
        
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-gray-600" />
        ) : (
          <ChevronDown className="w-4 h-4 text-gray-600" />
        )}
      </div>
      
      {/* Content */}
      {expanded && (
        <div className="p-3">
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Dataset
            </label>
            <select
              value={selectedDataset}
              onChange={(e) => {
                setSelectedDataset(e.target.value);
                setSelectedField('');
              }}
              className="w-full p-2 text-sm border border-gray-300 rounded-md"
              disabled={!!activeFilter}
            >
              <option value="">Select a dataset</option>
              {availableDatasets.map(dataset => (
                <option key={dataset} value={dataset}>{dataset}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Date Field
            </label>
            <select
              value={selectedField}
              onChange={(e) => setSelectedField(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md"
              disabled={!selectedDataset || !!activeFilter}
            >
              <option value="">Select a date field</option>
              {getDateFieldsForDataset(selectedDataset).map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>
          
          <div className="mb-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-xs font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full p-2 text-sm border border-gray-300 rounded-md"
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={applyDateFilter}
              disabled={!selectedDataset || !selectedField || !startDate || !endDate}
              className="flex-1 py-1 px-3 bg-blue-600 text-white text-sm rounded-md disabled:bg-gray-400"
            >
              {activeFilter ? 'Update' : 'Apply'}
            </button>
            
            {activeFilter && (
              <button
                onClick={clearDateFilter}
                className="flex-1 py-1 px-3 bg-gray-200 text-gray-800 text-sm rounded-md"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
```

### 4. Cross-Filtering Implementation

To implement cross-filtering, we need to update our visualization components to handle click events and set cross-filters. Here's an example for the BarChart component:

```jsx
// src/components/visualizations/BarChart.jsx (updated with cross-filtering)
import { useMemo, useCallback } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useFilters } from '../../contexts/FilterContext';
import BaseVisualization from './BaseVisualization';

export default function BarChart(props) {
  const { id, datasetName, fields } = props;
  const { dataset, prepareData, handleOptionsChange, error } = BaseVisualization(props);
  const { setCrossFilter, clearCrossFilter, getFiltersForVisualization, applyFilters } = useFilters();
  
  const { xField, yField } = fields;
  const { 
    color = '#8884d8', 
    horizontal = false,
    showGrid = true,
    showLegend = true,
    barSize = 20,
    enableCrossFiltering = true
  } = props.options || {};
  
  // Get applicable filters
  const filters = getFiltersForVisualization(id, datasetName);
  
  // Prepare and filter data
  const chartData = useMemo(() => {
    if (error) return [];
    
    // Get raw data
    let rawData = prepareData();
    
    // Apply filters
    rawData = applyFilters(rawData, filters);
    
    // Transform data for the chart
    return rawData.map(item => ({
      name: item[xField],
      value: Number(item[yField]) || 0,
      _original: item // Keep reference to original data item
    }));
  }, [prepareData, xField, yField, error, filters, applyFilters]);
  
  // Handle bar click for cross-filtering
  const handleBarClick = useCallback((data) => {
    if (!enableCrossFiltering) return;
    
    const { name, _original } = data;
    
    // Create a cross-filter
    setCrossFilter(id, {
      datasetName,
      field: xField,
      operator: 'equals',
      value: name,
      sourceVisualization: id
    });
  }, [id, datasetName, xField, setCrossFilter, enableCrossFiltering]);
  
  // Clear cross-filter when component unmounts
  useEffect(() => {
    return () => {
      clearCrossFilter(id);
    };
  }, [id, clearCrossFilter]);
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full border border-gray-300 rounded-md p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
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
        {horizontal ? (
          <RechartsBarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis type="number" />
            <YAxis dataKey="name" type="category" width={120} />
            <Tooltip />
            {showLegend && <Legend />}
            <Bar 
              dataKey="value" 
              fill={color} 
              barSize={barSize} 
              onClick={handleBarClick}
              cursor={enableCrossFiltering ? 'pointer' : 'default'}
            />
          </RechartsBarChart>
        ) : (
          <RechartsBarChart
            data={chartData}
            margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
          >
            {showGrid && <CartesianGrid strokeDasharray="3 3" />}
            <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
            <YAxis />
            <Tooltip />
            {showLegend && <Legend />}
            <Bar 
              dataKey="value" 
              fill={color} 
              barSize={barSize} 
              onClick={handleBarClick}
              cursor={enableCrossFiltering ? 'pointer' : 'default'}
            />
          </RechartsBarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
```

### 5. Drill-Down Manager Component

```jsx
// src/components/filters/DrillDownManager.jsx
import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useVisualizations } from '../../contexts/VisualizationContext';
import { ArrowLeft, Layers } from 'lucide-react';

export default function DrillDownManager() {
  const { datasets } = useData();
  const { visualizations, updateVisualization } = useVisualizations();
  
  const [drillHistory, setDrillHistory] = useState([]);
  const [activeVisualization, setActiveVisualization] = useState(null);
  const [drillableFields, setDrillableFields] = useState([]);
  
  // Get active visualization details
  useEffect(() => {
    if (!activeVisualization) return;
    
    const viz = visualizations.find(v => v.id === activeVisualization);
    if (!viz) {
      setActiveVisualization(null);
      return;
    }
    
    // Get drillable fields based on visualization type and dataset
    const dataset = datasets[viz.datasetName];
    if (!dataset) return;
    
    const { schema } = dataset;
    
    // For now, we'll consider all fields as drillable
    // In a real implementation, you'd want to be more selective
    setDrillableFields(Object.keys(schema).filter(field => 
      // Don't include fields already used in the visualization
      !Object.values(viz.fields).includes(field)
    ));
  }, [activeVisualization, visualizations, datasets]);
  
  // Handle drill down
  const handleDrillDown = (field) => {
    if (!activeVisualization) return;
    
    const viz = visualizations.find(v => v.id === activeVisualization);
    if (!viz) return;
    
    // Save current state to history
    setDrillHistory(prev => [...prev, {
      visualizationId: viz.id,
      fields: { ...viz.fields }
    }]);
    
    // Update visualization with new field
    // The exact update depends on the visualization type
    let updatedFields = { ...viz.fields };
    
    if (viz.type === 'bar' || viz.type === 'line') {
      // For bar/line charts, we'll replace the x-axis field
      updatedFields.xField = field;
    } else if (viz.type === 'pie') {
      // For pie charts, we'll replace the label field
      updatedFields.labelField = field;
    }
    
    updateVisualization(viz.id, { fields: updatedFields });
  };
  
  // Handle drill up (back)
  const handleDrillUp = () => {
    if (drillHistory.length === 0) return;
    
    // Get the last state from history
    const lastState = drillHistory[drillHistory.length - 1];
    
    // Update visualization with previous fields
    updateVisualization(lastState.visualizationId, { fields: lastState.fields });
    
    // Remove the last state from history
    setDrillHistory(prev => prev.