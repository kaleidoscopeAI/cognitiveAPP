import React from 'react';
import { SystemAnalysisResult, AnalysisInsight, SoftwareMimicryResult } from '../types';
import ThoughtProcessVisualizer from './ThoughtProcessVisualizer';
import CognitiveCube from './CognitiveCube';
import SoftwareMimicry from './SoftwareMimicry';
import { Icon, IconName } from './Icons';

const SystemSummaryCard: React.FC<{ summary: SystemAnalysisResult['systemSummary'] }> = ({ summary }) => (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6">
        <h3 className="text-2xl font-bold text-slate-300 mb-2">{summary.title}</h3>
        <p className="text-slate-400 mb-4">{summary.description}</p>
        <h4 className="font-semibold text-slate-300 mb-2">Core Components Identified:</h4>
        <div className="flex flex-wrap gap-2">
            {(summary.components ?? []).map(comp => (
                <span key={comp} className="bg-slate-700/60 text-slate-300 text-sm font-medium px-3 py-1 rounded-full">
                    {comp}
                </span>
            ))}
        </div>
    </div>
);

const InsightCard: React.FC<{ insight: AnalysisInsight }> = ({ insight }) => {
    const themeDetails = {
        Opportunity: { iconName: "trendingUp", color: 'green' },
        Risk: { iconName: "alertTriangle", color: 'red' },
        Trend: { iconName: "lightbulb", color: 'blue' },
        Competition: { iconName: "users", color: 'orange' },
        'Data Point': { iconName: "barChart", color: 'purple' },
    }[insight.theme];

    return (
        <div className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <Icon name={themeDetails.iconName} className={`w-5 h-5 text-${themeDetails.color}-400`} />
                    <h4 className={`font-bold text-lg text-${themeDetails.color}-400`}>{insight.theme}</h4>
                </div>
            </div>
            <p className="text-slate-300 mb-4">{insight.description}</p>
            <div className="flex items-center gap-2 mt-2">
                <span className="text-slate-400 text-xs font-semibold">CONFIDENCE</span>
                <div className="w-full bg-slate-700 rounded-full h-2.5">
                    <div 
                        className={`bg-${themeDetails.color}-500 h-2.5 rounded-full`} 
                        style={{ width: `${(insight.confidenceScore ?? 0) * 100}%` }}
                    ></div>
                </div>
                <span className={`font-bold text-sm text-${themeDetails.color}-300`}>
                    {((insight.confidenceScore ?? 0) * 100).toFixed(0)}%
                </span>
            </div>
        </div>
    );
};

const SystemResults: React.FC<{ systemResult: SystemAnalysisResult | null, softwareResult: SoftwareMimicryResult | null }> = ({ systemResult, softwareResult }) => {
    return (
        <div className="space-y-12 animate-fade-in">
            {systemResult && (
                <div className="space-y-12">
                    <SystemSummaryCard summary={systemResult.systemSummary} />
                    
                    <div>
                        <h2 className="text-3xl font-bold mb-4 text-slate-300">Key Insights</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {systemResult.analysisInsights.map((insight, index) => (
                                <InsightCard key={index} insight={insight} />
                            ))}
                        </div>
                    </div>

                    <div>
                        <h2 className="text-3xl font-bold mb-4 text-slate-300">Cognitive Cube Simulation</h2>
                        <CognitiveCube simulation={systemResult.simulation} />
                    </div>

                    <ThoughtProcessVisualizer thoughtProcess={systemResult.thoughtProcess} />
                </div>
            )}
            
            {softwareResult && (
                <div className="mt-16 pt-12 border-t-2 border-slate-800">
                     <h2 className="text-4xl font-bold mb-8 text-center text-blue-300">Software Mimicry Simulation</h2>
                    <SoftwareMimicry result={softwareResult} />
                </div>
            )}
        </div>
    );
};

export default SystemResults;