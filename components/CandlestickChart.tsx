import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
} from 'recharts';
import { PriceDataPoint } from '../types';

interface CandlestickChartProps {
  data: PriceDataPoint[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const isUp = data.close >= data.open;
    return (
      <div className="bg-stone-800/90 border border-stone-600 p-3 rounded-lg text-sm shadow-lg">
        <p className="font-bold text-white">{label}</p>
        <p className={`text-sm ${isUp ? 'text-green-400' : 'text-red-400'}`}>
          <span className="font-semibold">O:</span> {data.open.toFixed(2)}
          <span className="font-semibold ml-2">H:</span> {data.high.toFixed(2)}
          <span className="font-semibold ml-2">L:</span> {data.low.toFixed(2)}
          <span className="font-semibold ml-2">C:</span> {data.close.toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

// Custom shape for the candlestick body
const CandlestickShape = (props: any) => {
  const { x, y, width, height, payload } = props;
  const isUp = payload.close >= payload.open;
  const fill = isUp ? '#22c55e' : '#ef4444'; // green-500, red-500
  const wickY1 = y + height;
  const wickY2 = y;
  
  return (
    <g>
      <line x1={x + width / 2} y1={wickY1} x2={x + width / 2} y2={wickY2} stroke={fill} strokeWidth={1} />
      <rect x={x} y={y} width={width} height={height} fill={fill} />
    </g>
  );
};

const CandlestickChart: React.FC<CandlestickChartProps> = ({ data }) => {
    if (!data || data.length === 0) {
        return <div className="text-center text-gray-500">No price data available.</div>;
    }
    
    const chartData = data.map(item => ({
        ...item,
        // For the bar chart, the bar should start at the min of open/close and have a height of the difference
        body: [Math.min(item.open, item.close), Math.max(item.open, item.close)],
    }));

    const domain = [
        Math.min(...data.map(p => p.low)) * 0.98,
        Math.max(...data.map(p => p.high)) * 1.02,
    ];

  return (
    <div style={{ width: '100%', height: 400 }}>
      <ResponsiveContainer>
        <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#44403c" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: '#a8a29e', fontSize: 12 }} 
            tickFormatter={(dateStr) => new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            />
          <YAxis 
            orientation="right" 
            domain={domain} 
            tick={{ fill: '#a8a29e', fontSize: 12 }} 
            tickFormatter={(val) => `$${Number(val).toFixed(0)}`}
           />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(124, 58, 237, 0.1)' }} />

          <Bar dataKey="body" shape={<CandlestickShape />}>
             {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.close >= entry.open ? '#22c55e' : '#ef4444'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CandlestickChart;
