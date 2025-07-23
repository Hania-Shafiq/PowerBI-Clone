import { useState } from 'react';
import { useData } from '../../../../src/contexts/DataContext';

export default function DataPreview({ fullSize = false }) {
  const { getActiveData } = useData();
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  
  const activeData = getActiveData();
  
  if (!activeData || !activeData.data || activeData.data.length === 0) {
    return (
      <div className={`p-4 border border-gray-300 rounded-md ${fullSize ? 'h-full' : ''}`}>
        <p className="text-gray-500">No data available. Please load a dataset.</p>
      </div>
    );
  }
  
  const { data, schema } = activeData;
  const totalPages = Math.ceil(data.length / rowsPerPage);
  const startIndex = (page - 1) * rowsPerPage;
  const visibleData = data.slice(startIndex, startIndex + rowsPerPage);
  
  const columns = Object.keys(schema);
  
  return (
    <div className={`p-4 border border-gray-300 rounded-md ${fullSize ? 'h-full flex flex-col' : ''}`}>
      <h3 className="text-lg font-medium mb-2">Data Preview</h3>
      
      <div className="text-sm text-gray-600 mb-2">
        Total rows: {data.length}
      </div>
      
      <div className={`overflow-x-auto ${fullSize ? 'flex-grow' : ''}`}>
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map(column => (
                <th 
                  key={column}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  {column}
                  <span className="ml-1 text-gray-400">({schema[column].type})</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {visibleData.map((row, rowIndex) => (
              <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                {columns.map(column => (
                  <td 
                    key={`${rowIndex}-${column}`}
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
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
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