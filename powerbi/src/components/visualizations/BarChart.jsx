import { useMemo } from 'react';
import { useData } from '../../../../src/contexts/DataContext';

export default function BarChart({ datasetName, xField, yField }) {
  const { datasets } = useData();
  
  const chartData = useMemo(() => {
    if (!datasets[datasetName]) return [];
    
    const data = datasets[datasetName].data;
    return data.map(item => ({
      x: item[xField],
      y: item[yField] || 0
    }));
  }, [datasets, datasetName, xField, yField]);
  
  // Calculate max value for scaling
  const maxValue = Math.max(...chartData.map(d => d.y), 0);
  
  if (chartData.length === 0) {
    return <div className="text-center p-4">No data available</div>;
  }
  
  return (
    <div className="w-full h-full p-4">
      <div className="flex flex-col h-64">
        <div className="flex items-end h-full space-x-2">
          {chartData.slice(0, 10).map((d, i) => (
            <div key={i} className="flex flex-col items-center">
              <div 
                className="bg-blue-500 w-12" 
                style={{ 
                  height: `${(d.y / maxValue) * 100}%`,
                  minHeight: '1px'
                }}
              ></div>
              <div className="text-xs mt-1 w-12 truncate text-center">{d.x}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}