# SQL Database Connectivity Implementation

This document outlines the approach for implementing SQL database connectivity in the Power BI clone.

## Overview

The SQL connectivity feature will allow users to:
1. Connect to SQL databases
2. Write and execute SQL queries
3. Preview query results
4. Import data into the application for visualization

## Implementation Approach

We'll use `sql.js`, a JavaScript SQL database engine that runs entirely in the browser. This approach has several advantages:
- No need for backend server
- Works with local SQL files
- Provides a familiar SQL interface
- Supports most common SQL operations

## Components

### 1. SQL Connection Interface

```jsx
// src/components/data/SQLConnector.jsx
import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import initSqlJs from 'sql.js';

export default function SQLConnector() {
  const { addDataset } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sqlFile, setSqlFile] = useState(null);
  const [connected, setConnected] = useState(false);
  const [db, setDb] = useState(null);
  
  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Check if it's an SQLite file
      if (!file.name.endsWith('.sqlite') && !file.name.endsWith('.db')) {
        throw new Error('Please upload an SQLite database file (.sqlite or .db)');
      }
      
      // Read the file
      const fileBuffer = await file.arrayBuffer();
      
      // Initialize SQL.js
      const SQL = await initSqlJs();
      
      // Create a database from the file
      const database = new SQL.Database(new Uint8Array(fileBuffer));
      
      setDb(database);
      setSqlFile(file);
      setConnected(true);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  
  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h3 className="text-lg font-medium mb-2">Connect to SQL Database</h3>
      
      {!connected ? (
        <>
          <input
            type="file"
            accept=".sqlite,.db"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
          
          {loading && <p className="mt-2 text-gray-600">Loading database...</p>}
          {error && <p className="mt-2 text-red-500">{error}</p>}
        </>
      ) : (
        <div className="text-green-600 font-medium">
          Connected to {sqlFile.name}
        </div>
      )}
    </div>
  );
}
```

### 2. Query Builder Component

```jsx
// src/components/data/QueryBuilder.jsx
import { useState } from 'react';
import { useData } from '../../contexts/DataContext';

export default function QueryBuilder({ db, onQueryExecuted }) {
  const [query, setQuery] = useState('SELECT * FROM sqlite_master WHERE type="table"');
  const [executing, setExecuting] = useState(false);
  const [error, setError] = useState(null);
  
  const executeQuery = () => {
    if (!db || !query.trim()) return;
    
    try {
      setExecuting(true);
      setError(null);
      
      // Execute the query
      const result = db.exec(query);
      
      // Process the result
      if (result.length === 0) {
        onQueryExecuted({ columns: [], rows: [] });
      } else {
        const columns = result[0].columns;
        const rows = result[0].values.map(row => {
          const obj = {};
          columns.forEach((col, idx) => {
            obj[col] = row[idx];
          });
          return obj;
        });
        
        onQueryExecuted({ columns, rows });
      }
      
      setExecuting(false);
    } catch (err) {
      setError(err.message);
      setExecuting(false);
    }
  };
  
  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h3 className="text-lg font-medium mb-2">SQL Query</h3>
      
      <textarea
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full h-32 p-2 border border-gray-300 rounded-md font-mono text-sm"
        placeholder="Enter your SQL query here..."
      />
      
      <button
        onClick={executeQuery}
        disabled={executing || !db}
        className="mt-2 py-2 px-4 bg-blue-600 text-white rounded-md disabled:bg-gray-400"
      >
        {executing ? 'Executing...' : 'Execute Query'}
      </button>
      
      {error && (
        <div className="mt-2 p-2 bg-red-100 border border-red-300 rounded-md text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  );
}
```

### 3. Query Result Component

```jsx
// src/components/data/QueryResult.jsx
import { useState } from 'react';
import { useData } from '../../contexts/DataContext';

export default function QueryResult({ result, onImport }) {
  const [datasetName, setDatasetName] = useState('');
  
  if (!result || !result.columns || result.columns.length === 0) {
    return (
      <div className="p-4 border border-gray-300 rounded-md">
        <p className="text-gray-500">No results to display. Execute a query to see results.</p>
      </div>
    );
  }
  
  const { columns, rows } = result;
  
  const handleImport = () => {
    if (!datasetName.trim()) return;
    onImport(datasetName, rows);
  };
  
  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h3 className="text-lg font-medium mb-2">Query Results</h3>
      
      <div className="mb-4">
        <p className="text-sm text-gray-600">{rows.length} rows returned</p>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column, idx) => (
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
            {rows.slice(0, 10).map((row, rowIdx) => (
              <tr key={rowIdx}>
                {columns.map((column, colIdx) => (
                  <td 
                    key={`${rowIdx}-${colIdx}`}
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
      
      {rows.length > 10 && (
        <p className="mt-2 text-sm text-gray-500">
          Showing 10 of {rows.length} rows
        </p>
      )}
      
      <div className="mt-4 flex items-center">
        <input
          type="text"
          value={datasetName}
          onChange={(e) => setDatasetName(e.target.value)}
          placeholder="Dataset name"
          className="flex-1 p-2 border border-gray-300 rounded-md"
        />
        <button
          onClick={handleImport}
          disabled={!datasetName.trim()}
          className="ml-2 py-2 px-4 bg-green-600 text-white rounded-md disabled:bg-gray-400"
        >
          Import Data
        </button>
      </div>
    </div>
  );
}
```

### 4. SQL Workspace Component

```jsx
// src/components/data/SQLWorkspace.jsx
import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import SQLConnector from './SQLConnector';
import QueryBuilder from './QueryBuilder';
import QueryResult from './QueryResult';

export default function SQLWorkspace() {
  const { addDataset } = useData();
  const [db, setDb] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  
  const handleDatabaseConnected = (database) => {
    setDb(database);
  };
  
  const handleQueryExecuted = (result) => {
    setQueryResult(result);
  };
  
  const handleImportData = (name, data) => {
    // Generate schema from data
    const schema = {};
    if (data.length > 0) {
      const sample = data[0];
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
    }
    
    // Add to datasets
    addDataset(name, data, schema);
  };
  
  return (
    <div className="space-y-4">
      <SQLConnector onDatabaseConnected={handleDatabaseConnected} />
      
      {db && (
        <>
          <QueryBuilder db={db} onQueryExecuted={handleQueryExecuted} />
          <QueryResult result={queryResult} onImport={handleImportData} />
        </>
      )}
    </div>
  );
}
```

### 5. Integration with DataSourceOptions

Update the DataSourceOptions component to handle SQL database selection:

```jsx
// src/components/DataSourceOptions.jsx (updated)
import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useUI } from '../contexts/UIContext';

import excelIcon from '../assets/excel.png';
import onelakeIcon from '../assets/onelake.png';
import reportIcon from '../assets/report.png';
import sampleIcon from '../assets/sampledata.png';
import sqlIcon from '../assets/sql.png';
import addIcon from '../assets/add.png';

const dataSources = [
  { name: "Blank report", icon: reportIcon },
  { name: "OneLake catalog", icon: onelakeIcon },
  { name: "Excel workbook", icon: excelIcon },
  { name: "SQL Server", icon: sqlIcon },
  { name: "Learn with sample data", icon: sampleIcon },
  { name: "Get data from other sources", icon: addIcon },
];

export default function DataSourceOptions({ onSelectSource }) {
  const [showSources, setShowSources] = useState(true);
  const { setActiveView } = useUI();
  
  const handleSourceSelect = (name) => {
    if (name === "Blank report") {
      onSelectSource?.(name);
    } else if (name === "SQL Server") {
      setActiveView('sql');
      onSelectSource?.(name);
    } else if (name === "Excel workbook") {
      setActiveView('excel');
      onSelectSource?.(name);
    } else if (name === "Learn with sample data") {
      setActiveView('sample');
      onSelectSource?.(name);
    } else {
      onSelectSource?.(name);
    }
  };

  return (
    <div className="mb-6">
      {/* DROPDOWN HEADER */}
      <div
        className="font-semibold text-lg mb-3 cursor-pointer select-none flex items-center gap-2"
        onClick={() => setShowSources(!showSources)}
      >
        <ChevronDown
          size={18}
          className={`transition-transform duration-200 ${
            showSources ? "rotate-0" : "-rotate-90"
          }`}
        />
        <span>Select a data source or start with a blank report</span>
      </div>

      {/* DATA SOURCE BOXES */}
      {showSources && (
        <div className="flex space-x-4 overflow-x-auto">
          {dataSources.map((item) => (
            <div
              key={item.name}
              className="w-32 h-32 min-w-[8rem] border border-gray-300 rounded-md p-3 flex flex-col items-center justify-center shadow-sm hover:bg-gray-100 transition cursor-pointer"
              onClick={() => handleSourceSelect(item.name)}
            >
              <img
                src={item.icon}
                alt={item.name}
                className="w-10 h-10 mb-2 object-contain"
              />
              <div className="text-center text-xs font-medium">{item.name}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
```

## SQL Database Schema Explorer

To enhance the SQL connectivity feature, we'll also implement a schema explorer that allows users to browse tables and columns in the connected database:

```jsx
// src/components/data/SQLSchemaExplorer.jsx
import { useState, useEffect } from 'react';

export default function SQLSchemaExplorer({ db, onTableSelect }) {
  const [tables, setTables] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Load tables when database changes
  useEffect(() => {
    if (!db) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get all tables
      const result = db.exec("SELECT name FROM sqlite_master WHERE type='table'");
      
      if (result.length > 0) {
        const tableNames = result[0].values.map(row => row[0]);
        setTables(tableNames);
      } else {
        setTables([]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [db]);
  
  // Load columns when selected table changes
  useEffect(() => {
    if (!db || !selectedTable) return;
    
    try {
      setLoading(true);
      setError(null);
      
      // Get columns for the selected table
      const result = db.exec(`PRAGMA table_info(${selectedTable})`);
      
      if (result.length > 0) {
        const columnInfo = result[0].values.map(row => ({
          cid: row[0],
          name: row[1],
          type: row[2],
          notNull: row[3] === 1,
          defaultValue: row[4],
          primaryKey: row[5] === 1
        }));
        
        setColumns(columnInfo);
      } else {
        setColumns([]);
      }
      
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [db, selectedTable]);
  
  const handleTableClick = (tableName) => {
    setSelectedTable(tableName);
    onTableSelect?.(tableName);
  };
  
  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h3 className="text-lg font-medium mb-2">Database Schema</h3>
      
      {loading && <p className="text-gray-600">Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      
      <div className="flex">
        {/* Tables list */}
        <div className="w-1/2 pr-2">
          <h4 className="text-sm font-medium mb-1">Tables</h4>
          <ul className="border border-gray-200 rounded-md overflow-y-auto max-h-40">
            {tables.map(table => (
              <li 
                key={table}
                className={`px-3 py-1 cursor-pointer hover:bg-gray-100 text-sm ${
                  selectedTable === table ? 'bg-blue-100' : ''
                }`}
                onClick={() => handleTableClick(table)}
              >
                {table}
              </li>
            ))}
            {tables.length === 0 && (
              <li className="px-3 py-1 text-gray-500 text-sm">No tables found</li>
            )}
          </ul>
        </div>
        
        {/* Columns list */}
        <div className="w-1/2 pl-2">
          <h4 className="text-sm font-medium mb-1">Columns</h4>
          <ul className="border border-gray-200 rounded-md overflow-y-auto max-h-40">
            {columns.map(column => (
              <li 
                key={column.cid}
                className="px-3 py-1 text-sm"
              >
                <span className="font-medium">{column.name}</span>
                <span className="text-gray-500 ml-1">({column.type})</span>
                {column.primaryKey && (
                  <span className="text-xs bg-yellow-100 text-yellow-800 px-1 rounded ml-1">PK</span>
                )}
              </li>
            ))}
            {columns.length === 0 && (
              <li className="px-3 py-1 text-gray-500 text-sm">
                {selectedTable ? 'No columns found' : 'Select a table to view columns'}
              </li>
            )}
          </ul>
        </div>
      </div>
      
      {selectedTable && (
        <div className="mt-2">
          <button
            onClick={() => onTableSelect?.(selectedTable, `SELECT * FROM ${selectedTable} LIMIT 100`)}
            className="py-1 px-3 bg-blue-600 text-white text-sm rounded-md"
          >
            Query {selectedTable}
          </button>
        </div>
      )}
    </div>
  );
}
```

## Enhanced SQL Workspace

Finally, let's update the SQLWorkspace component to include the schema explorer:

```jsx
// src/components/data/SQLWorkspace.jsx (updated)
import { useState } from 'react';
import { useData } from '../../contexts/DataContext';
import SQLConnector from './SQLConnector';
import SQLSchemaExplorer from './SQLSchemaExplorer';
import QueryBuilder from './QueryBuilder';
import QueryResult from './QueryResult';

export default function SQLWorkspace() {
  const { addDataset } = useData();
  const [db, setDb] = useState(null);
  const [queryResult, setQueryResult] = useState(null);
  const [query, setQuery] = useState('SELECT * FROM sqlite_master WHERE type="table"');
  
  const handleDatabaseConnected = (database) => {
    setDb(database);
  };
  
  const handleQueryExecuted = (result) => {
    setQueryResult(result);
  };
  
  const handleTableSelect = (tableName, defaultQuery) => {
    if (defaultQuery) {
      setQuery(defaultQuery);
    }
  };
  
  const handleImportData = (name, data) => {
    // Generate schema from data
    const schema = {};
    if (data.length > 0) {
      const sample = data[0];
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
    }
    
    // Add to datasets
    addDataset(name, data, schema);
  };
  
  return (
    <div className="space-y-4">
      <SQLConnector onDatabaseConnected={handleDatabaseConnected} />
      
      {db && (
        <>
          <div className="flex gap-4">
            <div className="w-1/3">
              <SQLSchemaExplorer db={db} onTableSelect={handleTableSelect} />
            </div>
            
            <div className="w-2/3">
              <QueryBuilder 
                db={db} 
                query={query}
                setQuery={setQuery}
                onQueryExecuted={handleQueryExecuted} 
              />
            </div>
          </div>
          
          <QueryResult result={queryResult} onImport={handleImportData} />
        </>
      )}
    </div>
  );
}
```

## Conclusion

This implementation provides a comprehensive SQL database connectivity feature for the Power BI clone. Users can:

1. Connect to SQLite database files
2. Browse database schema (tables and columns)
3. Write and execute SQL queries
4. Preview query results
5. Import data into the application for visualization

The implementation uses sql.js, which runs entirely in the browser, making it easy to use without requiring a backend server. This approach is suitable for a client-side application and provides a good balance between functionality and simplicity.