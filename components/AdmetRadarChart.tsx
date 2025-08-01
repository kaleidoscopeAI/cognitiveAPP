import React from 'react';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { AdmetProfile } from '../types';

interface AdmetRadarChartProps {
  data: AdmetProfile;
}

const isValidAdmetProfile = (data: AdmetProfile): boolean => {
  return (
    data &&
    typeof data.absorption === 'number' &&
    typeof data.distribution === 'number' &&
    typeof data.metabolism === 'number' &&
    typeof data.excretion === 'number' &&
    typeof data.toxicity === 'number'
  );
};

const AdmetRadarChart: React.FC<AdmetRadarChartProps> = ({ data }) => {
  if (!isValidAdmetProfile(data)) {
    return <div className="text-red-400 text-center flex items-center justify-center h-full">Invalid ADMET profile data</div>;
  }

  const chartData = [
    { subject: 'Absorption', value: Math.min(Math.max(data.absorption, 0), 1), fullMark: 1 },
    { subject: 'Distribution', value: Math.min(Math.max(data.distribution, 0), 1), fullMark: 1 },
    { subject: 'Metabolism', value: Math.min(Math.max(data.metabolism, 0), 1), fullMark: 1 },
    { subject: 'Excretion', value: Math.min(Math.max(data.excretion, 0), 1), fullMark: 1 },
    { subject: 'Safety', value: 1 - Math.min(Math.max(data.toxicity, 0), 1), fullMark: 1 }, // Invert toxicity for "good" score
  ];

  return (
    <div className="w-full h-64" role="figure" aria-label="ADMET Profile Radar Chart">
      <h3 className="sr-only">ADMET Profile Visualization</h3>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
          <PolarGrid stroke="#4A5568" />
          <PolarAngleAxis dataKey="subject" tick={{ fill: '#E2E8F0', fontSize: 12 }} />
          <PolarRadiusAxis angle={30} domain={[0, 1]} tick={{ fill: 'transparent' }} />
          <Radar name="ADMET Score" dataKey="value" stroke="#4FD1C5" fill="#4FD1C5" fillOpacity={0.6} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1A202C',
              borderColor: '#4A5568',
              color: '#E2E8F0',
              borderRadius: '4px',
              padding: '8px',
            }}
            formatter={(value: number, name: string, props: any) => [`${(Number(value) * 100).toFixed(0)}%`, props.payload.subject]}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default AdmetRadarChart;