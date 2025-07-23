import { useData } from '../../../../src/contexts/DataContext';

export default function DataExport() {
  const { getActiveData } = useData();
  
  const handleExport = () => {
    const activeData = getActiveData();
    if (!activeData || !activeData.data) return;
    
    // Create a blob with the data
    const blob = new Blob(
      [JSON.stringify(activeData.data, null, 2)], 
      { type: 'application/json' }
    );
    
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a link element
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exported-data.json';
    
    // Append to the document and click
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };
  
  return (
    <button
      onClick={handleExport}
      className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm"
      disabled={!getActiveData()}
    >
      Export Data as JSON
    </button>
  );
}