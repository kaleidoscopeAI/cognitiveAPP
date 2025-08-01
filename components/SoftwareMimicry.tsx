import React, { useState, useEffect } from 'react';
import { SoftwareMimicryResult } from '../types';
import { Icon, IconName } from './Icons';
import FileTree from './FileTree';
import ArchitectureDiagram from './ArchitectureDiagram';
import ReconstructionDiff from './ReconstructionDiff';
import { useStore } from '../store';

interface SoftwareMimicryPipelineStageProps {
  iconName: IconName;
  title: string;
  isComplete: boolean;
  delay: number;
  children: React.ReactNode;
}

const SoftwareMimicryPipelineStage: React.FC<SoftwareMimicryPipelineStageProps> = ({ iconName, title, isComplete, delay, children }) => {
    const [showContent, setShowContent] = useState(false);

    useEffect(() => {
        if (isComplete) {
            const timer = setTimeout(() => setShowContent(true), delay);
            return () => clearTimeout(timer);
        }
    }, [isComplete, delay]);
  
    if (!isComplete) return null;

    return (
        <div className="animate-fade-in-up" style={{ animationDelay: `${delay}ms`}}>
            <div className="flex items-start space-x-4">
                <div className={`mt-1 flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full ${isComplete ? 'bg-blue-500' : 'bg-gray-600'}`}>
                    {isComplete ? <Icon name="checkCircle" className="w-6 h-6 text-white"/> : <Icon name={iconName} className="w-6 h-6 text-white"/>}
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-xl font-bold text-gray-100">{title}</h3>
                    <div className="mt-4 w-full">
                        {showContent && <div className="animate-fade-in">{children}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

interface InteractivePreviewPanelProps {
    data: SoftwareMimicryResult['interactivePreview'];
}

const InteractivePreviewPanel: React.FC<InteractivePreviewPanelProps> = ({ data }) => {
    const [notification, setNotification] = useState<string | null>(null);

    const handlePreviewClick = (elementId: string, description: string) => {
        setNotification(`Action: "${description}" on element [${elementId}]`);
        setTimeout(() => setNotification(null), 3000);
    };

    return (
        <div className="bg-gray-800/60 p-4 rounded-lg border border-gray-700 relative h-[28rem]">
             <p className="italic text-gray-400 mb-4 text-sm">{data.description}</p>
            <div className="bg-gray-900/80 p-6 rounded-lg border-2 border-dashed border-gray-600 h-96 overflow-y-auto">
                <div className="space-y-4">
                    {(data.elements ?? []).map(el => (
                        <div key={el.id} className="text-center p-3 rounded bg-gray-800/50 group transition-all duration-200 hover:bg-gray-700/50">
                            {el.type === 'button' && <button onClick={() => handlePreviewClick(el.id, el.description)} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full sm:w-auto">{el.label}</button>}
                            {el.type === 'text' && <p className="text-gray-300 py-2">{el.label}</p>}
                            {el.type === 'input' && <input type="text" placeholder={el.label} className="w-full p-2 bg-gray-700 rounded border border-gray-500 text-white placeholder-gray-400" />}
                            {el.type === 'image' && <div className="w-full h-24 bg-gray-700 rounded flex items-center justify-center text-gray-500"><Icon name="image" className="w-6 h-6" /></div>}
                            <p className="text-xs text-gray-500 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">{el.description}</p>
                        </div>
                    ))}
                </div>
            </div>
             {notification && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-green-500 text-white text-xs font-bold py-1 px-3 rounded-full animate-fade-in-up">
                    {notification}
                </div>
            )}
        </div>
    );
};


const SoftwareMimicry: React.FC<{ result: SoftwareMimicryResult }> = ({ result }) => {
    const [completedStages, setCompletedStages] = useState<number>(0);
    const [analysisQuery, setAnalysisQuery] = useState('');
    const { runPerformanceAnalysis, runSecurityAnalysis, isLoading } = useStore();

    useEffect(() => {
        setCompletedStages(0);
        const stages = [
            result?.decompileSummary,
            result?.architectureAnalysis,
            result?.reconstructionPlan,
            result?.interactivePreview,
            result?.performanceAnalysis,
            result?.securityAnalysis,
        ];
        
        stages.forEach((stage, index) => {
            if (stage) {
                 const timer = setTimeout(() => setCompletedStages(prev => prev + 1), index * 1200);
                return () => clearTimeout(timer);
            }
        });
    }, [result]);

    if (!result) return null;

    return (
        <div className="space-y-12">
            <SoftwareMimicryPipelineStage iconName="codeBrackets" title={`1. Decompilation: ${result.analyzedSoftware}`} isComplete={completedStages >= 1} delay={100}>
                {result.decompileSummary && <FileTree summary={result.decompileSummary} />}
            </SoftwareMimicryPipelineStage>
            
            <SoftwareMimicryPipelineStage iconName="codeBrackets" title="2. Architecture Analysis" isComplete={completedStages >= 2} delay={100}>
                 {result.architectureAnalysis && <ArchitectureDiagram analysis={result.architectureAnalysis} />}
            </SoftwareMimicryPipelineStage>
            
            <SoftwareMimicryPipelineStage iconName="codeBrackets" title="3. Reconstruction & Improvement" isComplete={completedStages >= 3} delay={100}>
                 {result.reconstructionPlan && <ReconstructionDiff plan={result.reconstructionPlan} />}
            </SoftwareMimicryPipelineStage>
            
            <SoftwareMimicryPipelineStage iconName="codeBrackets" title="4. Interactive Preview" isComplete={completedStages >= 4} delay={100}>
                {result.interactivePreview && <InteractivePreviewPanel data={result.interactivePreview} />}
            </SoftwareMimicryPipelineStage>

            <SoftwareMimicryPipelineStage iconName="activity" title="5. Performance Analysis" isComplete={completedStages >= 5} delay={100}>
                <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700">
                    <h4 className="text-xl font-bold text-blue-300 mb-4">Run Performance Analysis</h4>
                    <input
                        type="text"
                        placeholder="Describe performance aspects to analyze (e.g., 'database queries', 'startup time')"
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white mb-4"
                        value={analysisQuery}
                        onChange={(e) => setAnalysisQuery(e.target.value)}
                    />
                    <button 
                        onClick={() => runPerformanceAnalysis(analysisQuery)}
                        disabled={isLoading || !analysisQuery.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Analyzing Performance...' : 'Analyze Performance'}
                    </button>

                    {result.performanceAnalysis && (
                        <div className="mt-6 space-y-3">
                            <h5 className="font-bold text-lg text-blue-300">Analysis Summary:</h5>
                            <p className="text-gray-300 text-sm">{result.performanceAnalysis.summary}</p>
                            <h6 className="font-semibold text-gray-300 mt-4">Bottlenecks:</h6>
                            <ul className="list-disc list-inside text-sm text-gray-400">
                                {result.performanceAnalysis.bottlenecks.map((b, i) => (
                                    <li key={i} className={`text-${b.severity === 'High' ? 'red' : b.severity === 'Medium' ? 'yellow' : 'green'}-400`}>{b.description} (Severity: {b.severity})</li>
                                ))}
                            </ul>
                            <h6 className="font-semibold text-gray-300 mt-4">Optimizations:</h6>
                            <ul className="list-disc list-inside text-sm text-gray-400">
                                {result.performanceAnalysis.optimizations.map((o, i) => (
                                    <li key={i} className={`text-${o.impact === 'High' ? 'green' : o.impact === 'Medium' ? 'yellow' : 'gray'}-400`}>{o.description} (Impact: {o.impact})</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </SoftwareMimicryPipelineStage>

            <SoftwareMimicryPipelineStage iconName="alertTriangle" title="6. Security Analysis" isComplete={completedStages >= 6} delay={100}>
                <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700">
                    <h4 className="text-xl font-bold text-blue-300 mb-4">Run Security Analysis</h4>
                    <input
                        type="text"
                        placeholder="Describe security aspects to analyze (e.g., 'authentication', 'data encryption')"
                        className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white mb-4"
                        value={analysisQuery}
                        onChange={(e) => setAnalysisQuery(e.target.value)}
                    />
                    <button 
                        onClick={() => runSecurityAnalysis(analysisQuery)}
                        disabled={isLoading || !analysisQuery.trim()}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? 'Analyzing Security...' : 'Analyze Security'}
                    </button>

                    {result.securityAnalysis && (
                        <div className="mt-6 space-y-3">
                            <h5 className="font-bold text-lg text-blue-300">Analysis Summary:</h5>
                            <p className="text-gray-300 text-sm">{result.securityAnalysis.summary}</p>
                            <h6 className="font-semibold text-gray-300 mt-4">Vulnerabilities:</h6>
                            <ul className="list-disc list-inside text-sm text-gray-400">
                                {result.securityAnalysis.vulnerabilities.map((v, i) => (
                                    <li key={i} className={`text-${v.severity === 'High' ? 'red' : v.severity === 'Medium' ? 'yellow' : 'green'}-400`}>{v.description} (Severity: {v.severity})</li>
                                ))}
                            </ul>
                            <h6 className="font-semibold text-gray-300 mt-4">Recommendations:</h6>
                            <ul className="list-disc list-inside text-sm text-gray-400">
                                {result.securityAnalysis.recommendations.map((r, i) => (
                                    <li key={i} className={`text-${r.impact === 'High' ? 'green' : r.impact === 'Medium' ? 'yellow' : 'gray'}-400`}>{r.description} (Impact: {r.impact})</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </SoftwareMimicryPipelineStage>

        </div>
    );
};

export default SoftwareMimicry;