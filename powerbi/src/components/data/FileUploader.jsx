import { useState } from 'react';
import { useData } from '../../../../src/contexts/DataContext';
import * as XLSX from 'xlsx';

export default function FileUploader() {
  const { addDataset } = useData();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      // Check if it's an Excel file
      if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
        throw new Error('Please upload an Excel file (.xlsx or .xls)');
      }

      // Read the file
      const data = await readExcelFile(file);
      
      // Generate a schema from the data
      const schema = generateSchema(data);
      
      // Add to datasets
      const fileName = file.name.split('.')[0];
      addDataset(fileName, data, schema);
      
      setLoading(false);
      setSuccess(true);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Function to read Excel file
  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          
          // Get first sheet
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          
          // Convert to JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
          
          // Extract headers and rows
          const headers = jsonData[0];
          const rows = jsonData.slice(1);
          
          // Convert to array of objects
          const formattedData = rows.map(row => {
            const obj = {};
            headers.forEach((header, index) => {
              obj[header] = row[index];
            });
            return obj;
          });
          
          resolve(formattedData);
        } catch (err) {
          reject(new Error('Failed to parse Excel file'));
        }
      };
      
      reader.onerror = () => {
        reject(new Error('Failed to read file'));
      };
      
      reader.readAsArrayBuffer(file);
    });
  };

  // Function to generate schema from data
  const generateSchema = (data) => {
    if (!data || data.length === 0) return {};
    
    const sample = data[0];
    const schema = {};
    
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
    
    return schema;
  };

  return (
    <div className="p-4 border border-gray-300 rounded-md">
      <h3 className="text-lg font-medium mb-2">Upload Excel File</h3>
      
      <input
        type="file"
        accept=".xlsx,.xls"
        onChange={handleFileUpload}
        className="block w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-md file:border-0
          file:text-sm file:font-semibold
          file:bg-green-50 file:text-green-700
          hover:file:bg-green-100"
      />
      
      {loading && <p className="mt-2 text-gray-600">Loading file...</p>}
      {error && <p className="mt-2 text-red-500">{error}</p>}
      {success && <p className="mt-2 text-green-500">File uploaded successfully!</p>}
    </div>
  );
}