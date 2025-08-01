import React from 'react';
import { RadialBarChart, RadialBar, PolarAngleAxis, ResponsiveContainer } from 'recharts';
import { TechnicalIndicators } from '../types';

interface IndicatorGaugesProps {
  indicators: TechnicalIndicators;
}

const Gauge: React.FC<{ value: number; label: string; unit?: string; domain: [number, number]; colors: [string, string, string] }> = ({ value, label, unit = '', domain, colors }) => {
    const data = [{ name: label, value }];
    const [color1, color2, color3] = colors;
    
    const getZone = () => {
        if (value > 70) return { text: "Overbought", color: "text-red-400" };
        if (value < 30) return { text: "Oversold", color: "text-green-400" };
        return { text: "Neutral", color: "text-yellow-400" };
    };

    const zone = getZone();
    
    return (
        <div className="w-full h-48 flex flex-col items-center justify-center">
             <ResponsiveContainer>
                <RadialBarChart
                    innerRadius="80%"
                    outerRadius="100%"
                    data={data}
                    startAngle={180}
                    endAngle={0}
                    barSize={20}
                >
                    <PolarAngleAxis
                        type="number"
                        domain={domain}
                        angleAxisId={0}
                        tick={false}
                    />
                    <RadialBar
                        background
                        dataKey="value"
                        cornerRadius={10}
                        angleAxisId={0}
                        data={data}
                        fill={zone.color.replace('text-','bg-')}
                    >
                    </RadialBar>
                    <g>
                       <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" className="text-4xl font-bold fill-current text-white">
                            {value.toFixed(1)}
                        </text>
                        <text x="50%" y="80%" textAnchor="middle" dominantBaseline="middle" className={`text-lg font-semibold fill-current ${zone.color}`}>
                            {zone.text}
                        </text>
                     </g>
                </RadialBarChart>
            </ResponsiveContainer>
             <p className="text-sm font-semibold text-gray-400 -mt-4">{label}</p>
        </div>
    );
};

const IndicatorGauges: React.FC<IndicatorGaugesProps> = ({ indicators }) => {
  const { rsi, macd, macdSignal } = indicators;
  const isMacdPositive = macd > macdSignal;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
      <Gauge
        value={rsi}
        label="RSI (14)"
        domain={[0, 100]}
        colors={['#22c55e', '#facc15', '#ef4444']} // green, yellow, red
      />
      <div className="text-center">
        <h4 className="text-lg font-bold text-gray-300">MACD</h4>
        <p className={`text-3xl font-extrabold ${isMacdPositive ? 'text-green-400' : 'text-red-400'}`}>
            {isMacdPositive ? 'Bullish' : 'Bearish'}
        </p>
        <div className="text-sm mt-2">
            <p className="text-gray-400">MACD: <span className="font-semibold text-white">{macd.toFixed(2)}</span></p>
            <p className="text-gray-400">Signal: <span className="font-semibold text-white">{macdSignal.toFixed(2)}</span></p>
        </div>
      </div>
    </div>
  );
};

export default IndicatorGauges;
