# Visualization Components Implementation

This document outlines the approach for implementing visualization components in the Power BI clone.

## Overview

The visualization components will allow users to:
1. Create various types of charts and visualizations
2. Customize visualization properties
3. Interact with visualizations (filtering, drill-down)
4. Arrange visualizations in a dashboard layout

## Implementation Approach

We'll use `recharts` as our primary visualization library, which is a composable charting library built on React components. This approach has several advantages:
- High customizability
- Good performance
- React-based architecture
- Support for responsive design

## Core Visualization Components

### 1. Base Visualization Component

First, let's create a base component that all visualizations will extend:

```jsx
// src/components/visualizations/BaseVisualization.jsx
import { useState } from 'react';
import { useData } from '../../contexts/DataContext';

export default function BaseVisualization({ 
  id, 
  type, 
  datasetName, 
  fields, 
  options, 
  onOptionsChange 
}) {
  const { datasets } = useData();
  const [error, setError] = useState(null);
  
  // Get dataset
  const dataset = datasets[datasetName];
  if (!dataset) {
    return (
      <div className="flex items-center justify-center h-full border border-gray-300 rounded-md p-4">
        <p className="text-red-500">Dataset not found</p>
      </div>
    );
  }
  
  // Prepare data for visualization
  const prepareData = () => {
    try {
      const { data } = dataset;
      
      // Basic validation
      if (!data || data.length === 0) {
        throw new Error('No data available');
      }
      
      if (!fields || Object.keys(fields).length === 0) {
        throw new Error('No fields selected');
      }
      
      return data;
    } catch (err) {
      setError(err.message);
      return [];
    }
  };
  
  // Handle options change
  const handleOptionsChange = (newOptions) => {
    onOptionsChange?.(id, { ...options, ...newOptions });
  };
  
  return {
    dataset,
    prepareData,
    handleOptionsChange,
    error
  };
}
```

### 2. Bar Chart Component

```jsx
// src/components/visualizations/BarChart.jsx
import { useMemo } from 'react';
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import BaseVisualization from './BaseVisualization';

export default function BarChart(props) {
  const { dataset, prepareData, handleOptionsChange, error } = BaseVisualization(props);
  
  const { fields, options } = props;
  const { xField, yField } = fields;
  const { 
    color = '#8884d8', 
    horizontal = false,
    showGrid = true,
    showLegend = true,
    barSize = 20
  } = options || {};
  
  const chartData = useMemo(() => {
    if (error) return [];
    
    const rawData = prepareData();
    
    // Transform data for the chart
    return rawData.map(item => ({
      name: item[xField],
      value: Number(item[yField]) || 0
    }));
  }, [prepareData, xField, yField, error]);
  
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
            <Bar dataKey="value" fill={color} barSize={barSize} />
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
            <Bar dataKey="value" fill={color} barSize={barSize} />
          </RechartsBarChart>
        )}
      </ResponsiveContainer>
    </div>
  );
}
```

### 3. Line Chart Component

```jsx
// src/components/visualizations/LineChart.jsx
import { useMemo } from 'react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import BaseVisualization from './BaseVisualization';

export default function LineChart(props) {
  const { dataset, prepareData, handleOptionsChange, error } = BaseVisualization(props);
  
  const { fields, options } = props;
  const { xField, yField } = fields;
  const { 
    color = '#8884d8', 
    showGrid = true,
    showLegend = true,
    lineType = 'monotone',
    showDots = true
  } = options || {};
  
  const chartData = useMemo(() => {
    if (error) return [];
    
    const rawData = prepareData();
    
    // Transform data for the chart
    return rawData.map(item => ({
      name: item[xField],
      value: Number(item[yField]) || 0
    }));
  }, [prepareData, xField, yField, error]);
  
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
        <RechartsLineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" />}
          <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
          <YAxis />
          <Tooltip />
          {showLegend && <Legend />}
          <Line 
            type={lineType} 
            dataKey="value" 
            stroke={color} 
            dot={showDots} 
            activeDot={{ r: 8 }} 
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### 4. Pie Chart Component

```jsx
// src/components/visualizations/PieChart.jsx
import { useMemo } from 'react';
import { PieChart as RechartsPieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import BaseVisualization from './BaseVisualization';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D', '#A4DE6C', '#D0ED57', '#FFC658'];

export default function PieChart(props) {
  const { dataset, prepareData, handleOptionsChange, error } = BaseVisualization(props);
  
  const { fields, options } = props;
  const { labelField, valueField } = fields;
  const { 
    showLegend = true,
    innerRadius = 0,
    outerRadius = '70%',
    paddingAngle = 0
  } = options || {};
  
  const chartData = useMemo(() => {
    if (error) return [];
    
    const rawData = prepareData();
    
    // Transform data for the chart
    return rawData.map(item => ({
      name: item[labelField],
      value: Number(item[valueField]) || 0
    }));
  }, [prepareData, labelField, valueField, error]);
  
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
        <RechartsPieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={true}
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            paddingAngle={paddingAngle}
            dataKey="value"
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => [`${value}`, 'Value']} />
          {showLegend && <Legend />}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
```

### 5. Data Table Component

```jsx
// src/components/visualizations/DataTable.jsx
import { useMemo, useState } from 'react';
import BaseVisualization from './BaseVisualization';

export default function DataTable(props) {
  const { dataset, prepareData, handleOptionsChange, error } = BaseVisualization(props);
  
  const { fields, options } = props;
  const { columns } = fields;
  const { 
    pageSize = 10,
    showPagination = true,
    striped = true,
    bordered = true
  } = options || {};
  
  const [page, setPage] = useState(1);
  
  const tableData = useMemo(() => {
    if (error) return { data: [], columns: [] };
    
    const rawData = prepareData();
    
    // If no columns specified, use all columns
    const tableColumns = columns && columns.length > 0 
      ? columns 
      : dataset && dataset.data && dataset.data.length > 0 
        ? Object.keys(dataset.data[0]) 
        : [];
    
    return {
      data: rawData,
      columns: tableColumns
    };
  }, [prepareData, columns, dataset, error]);
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full border border-gray-300 rounded-md p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  if (tableData.data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full border border-gray-300 rounded-md p-4">
        <p className="text-gray-500">No data available for this table</p>
      </div>
    );
  }
  
  const totalPages = Math.ceil(tableData.data.length / pageSize);
  const startIndex = (page - 1) * pageSize;
  const visibleData = tableData.data.slice(startIndex, startIndex + pageSize);
  
  return (
    <div className="h-full w-full flex flex-col">
      <div className="overflow-x-auto flex-grow">
        <table className={`min-w-full divide-y divide-gray-200 ${bordered ? 'border border-gray-200' : ''}`}>
          <thead className="bg-gray-50">
            <tr>
              {tableData.columns.map((column, idx) => (
                <th 
                  key={idx}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visibleData.map((row, rowIdx) => (
              <tr 
                key={rowIdx}
                className={striped && rowIdx % 2 === 0 ? 'bg-gray-50' : ''}
              >
                {tableData.columns.map((column, colIdx) => (
                  <td 
                    key={`${rowIdx}-${colIdx}`}
                    className={`px-6 py-4 whitespace-nowrap text-sm text-gray-500 ${bordered ? 'border-r border-gray-200 last:border-r-0' : ''}`}
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
      {showPagination && totalPages > 1 && (
        <div className="flex items-center justify-between mt-4 px-4 py-2 bg-gray-50 border-t border-gray-200">
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

### 6. KPI Card Component

```jsx
// src/components/visualizations/KPICard.jsx
import { useMemo } from 'react';
import { ArrowUpIcon, ArrowDownIcon } from 'lucide-react';
import BaseVisualization from './BaseVisualization';

export default function KPICard(props) {
  const { dataset, prepareData, handleOptionsChange, error } = BaseVisualization(props);
  
  const { fields, options } = props;
  const { valueField, compareField } = fields;
  const { 
    title = 'KPI',
    format = 'number',
    positiveIsGood = true,
    showComparison = true,
    backgroundColor = 'white',
    textColor = 'black'
  } = options || {};
  
  const cardData = useMemo(() => {
    if (error) return null;
    
    const rawData = prepareData();
    
    if (rawData.length === 0) return null;
    
    // For KPI, we typically use the latest value
    const latestData = rawData[rawData.length - 1];
    
    // Get the previous value for comparison if available
    const previousData = rawData.length > 1 ? rawData[rawData.length - 2] : null;
    
    const value = Number(latestData[valueField]) || 0;
    const compareValue = previousData ? Number(previousData[compareField || valueField]) || 0 : null;
    
    let percentChange = null;
    if (compareValue !== null && compareValue !== 0) {
      percentChange = ((value - compareValue) / Math.abs(compareValue)) * 100;
    }
    
    return {
      value,
      compareValue,
      percentChange
    };
  }, [prepareData, valueField, compareField, error]);
  
  if (error) {
    return (
      <div className="flex items-center justify-center h-full border border-gray-300 rounded-md p-4">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }
  
  if (!cardData) {
    return (
      <div className="flex items-center justify-center h-full border border-gray-300 rounded-md p-4">
        <p className="text-gray-500">No data available for this KPI</p>
      </div>
    );
  }
  
  // Format the value based on the format option
  const formatValue = (value) => {
    if (format === 'currency') {
      return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
    } else if (format === 'percent') {
      return new Intl.NumberFormat('en-US', { style: 'percent', minimumFractionDigits: 1 }).format(value / 100);
    } else {
      return new Intl.NumberFormat('en-US').format(value);
    }
  };
  
  // Determine if the change is positive or negative
  const isPositive = cardData.percentChange > 0;
  const isGood = positiveIsGood ? isPositive : !isPositive;
  
  return (
    <div 
      className="h-full w-full flex flex-col justify-center items-center p-4 rounded-md border border-gray-200"
      style={{ backgroundColor, color: textColor }}
    >
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      
      <div className="text-3xl font-bold mb-2">
        {formatValue(cardData.value)}
      </div>
      
      {showComparison && cardData.percentChange !== null && (
        <div className={`flex items-center text-sm ${isGood ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? (
            <ArrowUpIcon className="w-4 h-4 mr-1" />
          ) : (
            <ArrowDownIcon className="w-4 h-4 mr-1" />
          )}
          <span>{Math.abs(cardData.percentChange).toFixed(1)}%</span>
        </div>
      )}
    </div>
  );
}
```

## Visualization Factory

To manage the creation of different visualization types, we'll implement a factory pattern:

```jsx
// src/components/visualizations/VisualizationFactory.jsx
import BarChart from './BarChart';
import LineChart from './LineChart';
import PieChart from './PieChart';
import DataTable from './DataTable';
import KPICard from './KPICard';

export default function VisualizationFactory({ type, ...props }) {
  switch (type) {
    case 'bar':
      return <BarChart {...props} />;
    case 'line':
      return <LineChart {...props} />;
    case 'pie':
      return <PieChart {...props} />;
    case 'table':
      return <DataTable {...props} />;
    case 'kpi':
      return <KPICard {...props} />;
    default:
      return (
        <div className="flex items-center justify-center h-full border border-gray-300 rounded-md p-4">
          <p className="text-red-500">Unknown visualization type: {type}</p>
        </div>
      );
  }
}
```

## Visualization Creator Component

Now, let's create a component for creating and configuring visualizations:

```jsx
// src/components/visualizations/VisualizationCreator.jsx
import { useState, useEffect } from 'react';
import { useData } from '../../contexts/DataContext';
import { useVisualizations } from '../../contexts/VisualizationContext';

export default function VisualizationCreator() {
  const { datasets, activeDataset } = useData();
  const { addVisualization } = useVisualizations();
  
  const [vizType, setVizType] = useState('bar');
  const [fields, setFields] = useState({});
  const [options, setOptions] = useState({});
  const [title, setTitle] = useState('');
  
  // Reset fields when visualization type changes
  useEffect(() => {
    setFields({});
    
    // Set default options based on visualization type
    switch (vizType) {
      case 'bar':
        setOptions({ color: '#8884d8', horizontal: false, showGrid: true, showLegend: true });
        break;
      case 'line':
        setOptions({ color: '#8884d8', showGrid: true, showLegend: true, lineType: 'monotone', showDots: true });
        break;
      case 'pie':
        setOptions({ showLegend: true, innerRadius: 0, outerRadius: '70%', paddingAngle: 0 });
        break;
      case 'table':
        setOptions({ pageSize: 10, showPagination: true, striped: true, bordered: true });
        break;
      case 'kpi':
        setOptions({ title: 'KPI', format: 'number', positiveIsGood: true, showComparison: true });
        break;
      default:
        setOptions({});
    }
  }, [vizType]);
  
  if (!activeDataset || !datasets[activeDataset]) {
    return (
      <div className="p-4 border border-gray-300 rounded-md">
        <p className="text-gray-500">Please select a dataset first</p>
      </div>
    );
  }
  
  const { schema } = datasets[activeDataset];
  const availableFields = Object.keys(schema);
  
  // Get required fields based on visualization type
  const getRequiredFields = () => {
    switch (vizType) {
      case 'bar':
        return [
          { name: 'xField', label: 'X-Axis Field', type: 'select' },
          { name: 'yField', label: 'Y-Axis Field', type: 'select', filter: 'number' }
        ];
      case 'line':
        return [
          { name: 'xField', label: 'X-Axis Field', type: 'select' },
          { name: 'yField', label: 'Y-Axis Field', type: 'select', filter: 'number' }
        ];
      case 'pie':
        return [
          { name: 'labelField', label: 'Label Field', type: 'select' },
          { name: 'valueField', label: 'Value Field', type: 'select', filter: 'number' }
        ];
      case 'table':
        return [
          { name: 'columns', label: 'Columns', type: 'multiselect' }
        ];
      case 'kpi':
        return [
          { name: 'valueField', label: 'Value Field', type: 'select', filter: 'number' },
          { name: 'compareField', label: 'Comparison Field (Optional)', type: 'select', filter: 'number', required: false }
        ];
      default:
        return [];
    }
  };
  
  // Get options fields based on visualization type
  const getOptionsFields = () => {
    switch (vizType) {
      case 'bar':
        return [
          { name: 'color', label: 'Bar Color', type: 'color' },
          { name: 'horizontal', label: 'Horizontal Bars', type: 'checkbox' },
          { name: 'showGrid', label: 'Show Grid', type: 'checkbox' },
          { name: 'showLegend', label: 'Show Legend', type: 'checkbox' },
          { name: 'barSize', label: 'Bar Size', type: 'number', min: 1, max: 100 }
        ];
      case 'line':
        return [
          { name: 'color', label: 'Line Color', type: 'color' },
          { name: 'showGrid', label: 'Show Grid', type: 'checkbox' },
          { name: 'showLegend', label: 'Show Legend', type: 'checkbox' },
          { name: 'lineType', label: 'Line Type', type: 'select', options: [
            { value: 'linear', label: 'Linear' },
            { value: 'monotone', label: 'Smooth' },
            { value: 'step', label: 'Step' }
          ]},
          { name: 'showDots', label: 'Show Data Points', type: 'checkbox' }
        ];
      case 'pie':
        return [
          { name: 'showLegend', label: 'Show Legend', type: 'checkbox' },
          { name: 'innerRadius', label: 'Inner Radius (%)', type: 'number', min: 0, max: 100 },
          { name: 'paddingAngle', label: 'Padding Angle', type: 'number', min: 0, max: 10 }
        ];
      case 'table':
        return [
          { name: 'pageSize', label: 'Rows Per Page', type: 'number', min: 5, max: 100 },
          { name: 'showPagination', label: 'Show Pagination', type: 'checkbox' },
          { name: 'striped', label: 'Striped Rows', type: 'checkbox' },
          { name: 'bordered', label: 'Bordered Cells', type: 'checkbox' }
        ];
      case 'kpi':
        return [
          { name: 'title', label: 'Title', type: 'text' },
          { name: 'format', label: 'Value Format', type: 'select', options: [
            { value: 'number', label: 'Number' },
            { value: 'currency', label: 'Currency' },
            { value: 'percent', label: 'Percentage' }
          ]},
          { name: 'positiveIsGood', label: 'Positive Change is Good', type: 'checkbox' },
          { name: 'showComparison', label: 'Show Comparison', type: 'checkbox' },
          { name: 'backgroundColor', label: 'Background Color', type: 'color' },
          { name: 'textColor', label: 'Text Color', type: 'color' }
        ];
      default:
        return [];
    }
  };
  
  const requiredFields = getRequiredFields();
  const optionsFields = getOptionsFields();
  
  // Check if all required fields are filled
  const isFormValid = () => {
    return requiredFields.every(field => 
      !field.required === false || fields[field.name]
    ) && title.trim() !== '';
  };
  
  // Handle field change
  const handleFieldChange = (name, value) => {
    setFields(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle option change
  const handleOptionChange = (name, value) => {
    setOptions(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Handle create visualization
  const handleCreateVisualization = () => {
    if (!isFormValid()) return;
    
    const config = {
      type: vizType,
      title,
      datasetName: activeDataset,
      fields,
      options
    };
    
    addVisualization(config);
    
    // Reset form
    setTitle('');
    setFields({});
  };
  
  // Render field input based on field type
  const renderFieldInput = (field) => {
    const { name, label, type, filter, required = true, options: fieldOptions } = field;
    
    // Filter available fields based on type if needed
    let filteredFields = availableFields;
    if (filter === 'number') {
      filteredFields = availableFields.filter(field => 
        schema[field].type === 'number'
      );
    }
    
    switch (type) {
      case 'select':
        return (
          <div key={name} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label} {required === false && <span className="text-gray-400">(Optional)</span>}
            </label>
            <select
              value={fields[name] || ''}
              onChange={(e) => handleFieldChange(name, e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="">Select a field</option>
              {filteredFields.map(field => (
                <option key={field} value={field}>{field}</option>
              ))}
            </select>
          </div>
        );
        
      case 'multiselect':
        return (
          <div key={name} className="mb-3">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {label}
            </label>
            <div className="border border-gray-300 rounded-md p-2 max-h-40 overflow-y-auto">
              {filteredFields.map(field => (
                <div key={field} className="flex items-center mb-1">
                  <input
                    type="checkbox"
                    id={`field-${field}`}
                    checked={fields[name]?.includes(field) || false}
                    onChange={(e) => {
                      const currentFields = fields[name] || [];
                      if (e.target.checked) {
                        handleFieldChange(name, [...currentFields, field]);
                      } else {
                        handleFieldChange(name, currentFields.filter(f => f !== field));
                      }
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`field-${field}`} className="text-