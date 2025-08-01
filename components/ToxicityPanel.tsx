import React from 'react';
import { AdmetProfile } from '../types';
import { Icon, IconName } from './Icons';

interface ToxicityPanelProps {
    toxicityBreakdown: AdmetProfile['toxicityBreakdown'];
}

const getRiskColor = (risk: 'Low' | 'Medium' | 'High') => {
    switch (risk) {
        case 'Low': return 'bg-green-500/20 text-green-400 border-green-500/30';
        case 'Medium': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        case 'High': return 'bg-red-500/20 text-red-400 border-red-500/30';
        default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
};

const ToxicityPanel: React.FC<ToxicityPanelProps> = ({ toxicityBreakdown }) => {
    return (
        <div className="w-full h-64 bg-gray-900/50 p-4 rounded-lg border border-gray-700 flex flex-col">
            <h4 className="text-lg font-semibold text-gray-200 mb-3 flex items-center gap-2">
                <Icon name="alertTriangle" className="w-5 h-5 text-red-400" />
                Toxicity Profile
            </h4>
            <div className="space-y-2 overflow-y-auto pr-2">
                {(toxicityBreakdown ?? []).map((item, index) => (
                    <div key={index} className="flex justify-between items-center bg-gray-800/70 p-2 rounded-md">
                        <span className="text-sm text-gray-300">{item.type}</span>
                        <span className={`text-xs font-bold px-2 py-1 rounded-full border ${getRiskColor(item.risk)}`}>
                            {item.risk}
                        </span>
                    </div>
                ))}
                 {(!toxicityBreakdown || toxicityBreakdown.length === 0) && (
                    <p className="text-center text-gray-500 text-sm">No specific toxicity data available.</p>
                )}
            </div>
        </div>
    );
};

export default ToxicityPanel;
