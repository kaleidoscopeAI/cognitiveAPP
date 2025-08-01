import React from 'react';
import { ThoughtProcess } from '../types';
import { Icon, IconName } from './Icons';

const ThoughtStep: React.FC<{ iconName: IconName; title: string; children: React.ReactNode }> = ({ iconName, title, children }) => (
    <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-6 flex flex-col sm:flex-row gap-6 items-start">
        <div className="bg-slate-900/50 text-slate-300 p-3 rounded-full self-start border border-slate-700">
            <Icon name={iconName} className="w-6 h-6" />
        </div>
        <div className="flex-1">
            <h4 className="text-xl font-bold text-slate-300 mb-3">{title}</h4>
            {children}
        </div>
    </div>
);

const NodeTag: React.FC<{ label: string }> = ({ label }) => (
    <span className="bg-gray-700/80 text-gray-300 text-xs font-mono px-2 py-1 rounded">{label}</span>
);

const ThoughtProcessVisualizer: React.FC<{ thoughtProcess?: ThoughtProcess }> = ({ thoughtProcess }) => {
    if (!thoughtProcess) {
        return <div className="text-center text-gray-500">Awaiting thought process analysis...</div>;
    }

    const { deconstruction, multiAngleAnalysis, riskRewardAssessment, synthesis } = thoughtProcess;
    
    return (
        <div>
            <h2 className="text-3xl font-bold mb-4 flex items-center gap-3"><Icon name="brainCircuit" className="w-8 h-8 text-slate-400"/> AI Thought Process</h2>
            <div className="space-y-6">
                <ThoughtStep iconName="activity" title="1. Deconstruction">
                    <div>
                        <p className="text-gray-400 mb-2">Main Question Identified:</p>
                        <p className="font-semibold text-gray-200 italic">"{deconstruction?.mainQuestion}"</p>
                        <p className="text-gray-400 mt-4 mb-2">Activated Cognitive Nodes:</p>
                        <div className="flex flex-wrap gap-2">
                            {(deconstruction?.activatedNodes ?? []).map((nodeId, i) => <NodeTag key={i} label={nodeId} />)}
                        </div>
                    </div>
                </ThoughtStep>
                
                <ThoughtStep iconName="users" title="2. Multi-Angle Analysis">
                    <div className="space-y-4">
                        {(multiAngleAnalysis ?? []).map((item, i) => (
                            <div key={i} className="border-l-2 border-slate-800 pl-4">
                                <p className="font-semibold text-gray-200">{item.perspective}:</p>
                                <p className="text-gray-400 mb-2">{item.analysis}</p>
                                <div className="flex flex-wrap gap-1.5">
                                    <span className="text-xs text-gray-500">Influenced by:</span>
                                    {(item.contributingNodes ?? []).map((nodeId, j) => <NodeTag key={j} label={nodeId} />)}
                                </div>
                            </div>
                        ))}
                    </div>
                </ThoughtStep>

                <ThoughtStep iconName="scale" title="3. Risk vs. Reward Assessment">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h5 className="flex items-center gap-2 text-lg font-semibold text-green-400 mb-2"><Icon name="checkCircle" className="w-5 h-5"/> Rewards (Potential Upsides)</h5>
                            <ul className="space-y-3">
                                {(riskRewardAssessment?.rewards ?? []).map((reward, i) => 
                                <li key={i} className="text-gray-400 text-sm">
                                    {reward.description}
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        <span className="text-xs text-gray-500">Nodes:</span>
                                        {(reward.associatedNodes ?? []).map((nodeId, j) => <NodeTag key={j} label={nodeId} />)}
                                    </div>
                                </li>)}
                            </ul>
                        </div>
                        <div>
                           <h5 className="flex items-center gap-2 text-lg font-semibold text-red-400 mb-2"><Icon name="alertTriangle" className="w-5 h-5"/> Risks (Potential Downsides)</h5>
                             <ul className="space-y-3">
                                {(riskRewardAssessment?.risks ?? []).map((risk, i) => 
                                <li key={i} className="text-gray-400 text-sm">
                                    {risk.description}
                                    <div className="flex flex-wrap gap-1.5 mt-1">
                                        <span className="text-xs text-gray-500">Nodes:</span>
                                        {(risk.associatedNodes ?? []).map((nodeId, j) => <NodeTag key={j} label={nodeId} />)}
                                    </div>
                                </li>)}
                            </ul>
                        </div>
                    </div>
                </ThoughtStep>

                <ThoughtStep iconName="lightbulb" title="4. Synthesis & Reconstruction">
                     <div>
                        <p className="text-gray-400 mb-2">Holistic Conclusion:</p>
                        <p className="font-semibold text-gray-200">{synthesis?.conclusion}</p>
                        <p className="text-sm text-gray-500 mt-3 italic">Final Cognitive Cube State: {synthesis?.finalStateDescription}</p>
                        <div className="flex items-center gap-2 mt-4">
                           <span className="text-gray-400">Overall Process Confidence:</span>
                            <div className="w-full bg-gray-700 rounded-full h-4">
                                <div className="bg-gradient-to-r from-slate-500 to-slate-400 h-4 rounded-full text-center text-xs text-black font-bold flex items-center justify-center" style={{ width: `${(synthesis?.confidenceScore ?? 0) * 100}%` }}>
                                    {((synthesis?.confidenceScore ?? 0) * 100).toFixed(0)}%
                                </div>
                            </div>
                        </div>
                    </div>
                </ThoughtStep>
            </div>
        </div>
    );
};

export default ThoughtProcessVisualizer;
