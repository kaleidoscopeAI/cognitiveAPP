import React from 'react';
import { FunnelChart, Funnel, Tooltip, ResponsiveContainer, LabelList } from 'recharts';
import { VirtualScreeningStats } from '../types';

interface VirtualScreeningFunnelProps {
  data: VirtualScreeningStats;
}

const VirtualScreeningFunnel: React.FC<VirtualScreeningFunnelProps> = ({ data }) => {
  const chartData = [
    { name: 'Initial Library', value: data.librarySize, fill: '#0d9488' }, // teal-600
    { name: 'Hits Found', value: data.hitsFound, fill: '#0f766e' },    // teal-700
    { name: 'Filtered Leads', value: Math.max(1, Math.round(data.hitsFound / 10)), fill: '#115e59' }, // teal-800
    { name: 'Optimized Candidate', value: 1, fill: '#134e4a' }, // teal-900
  ];
  
  return (
    <div className="w-full h-64 bg-gray-800/60 p-4 rounded-lg border border-gray-700">
        <p className="text-center text-gray-300 mb-2">From {data.librarySize.toLocaleString()} compounds to 1 lead candidate.</p>
      <ResponsiveContainer width="100%" height="90%">
        <FunnelChart>
          <Tooltip 
             contentStyle={{
              backgroundColor: '#1A202C',
              borderColor: '#4A5568',
            }}
          />
          <Funnel dataKey="value" data={chartData} isAnimationActive={true}>
             <LabelList position="right" fill="#fff" stroke="none" dataKey="name"
                formatter={(value: string) => `${value}`}
             />
             <LabelList position="center" fill="#fff" stroke="none" dataKey="value"
                formatter={(value: number) => value.toLocaleString()}
             />
          </Funnel>
        </FunnelChart>
      </ResponsiveContainer>
    </div>
  );
};

export default VirtualScreeningFunnel;