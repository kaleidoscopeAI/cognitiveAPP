import React from 'react';
import { SynthesisStep } from '../types';

const SynthesisPathwayDiagram: React.FC<{ pathway: SynthesisStep[] }> = ({ pathway }) => {
    if (!pathway || pathway.length === 0) {
        return <p className="text-gray-400">No synthesis pathway available.</p>;
    }

    return (
        <div className="space-y-4 p-4 bg-gray-900/50 rounded-2xl border border-gray-700">
            {pathway.map((step, index) => (
                <div key={step.step} className="flex items-start space-x-4">
                    {/* Step Number */}
                    <div className="flex-shrink-0 flex flex-col items-center justify-center w-16">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-teal-800 border-2 border-teal-600">
                            <span className="text-xl font-bold text-white">{step.step}</span>
                        </div>
                        {index < pathway.length - 1 && (
                            <div className="mt-2 h-12 w-px bg-gray-600" />
                        )}
                    </div>

                    {/* Step Details */}
                    <div className="flex-grow bg-gray-800 p-4 rounded-lg border border-gray-700 w-full">
                        <div className="flex justify-between items-center">
                            <p className="font-bold text-teal-300 text-lg">{step.reactionType}</p>
                            <span className="text-xs font-semibold bg-green-900/80 text-green-300 px-2 py-1 rounded-full">
                                Yield: {step.yieldPercentage}%
                            </span>
                        </div>

                         {step.laymanSummary && <p className="text-sm text-gray-400 italic mt-2 mb-3">"{step.laymanSummary}"</p>}

                        <div className="text-sm space-y-2 border-t border-gray-700 pt-3 mt-3">
                            <p><strong className="text-gray-400 w-24 inline-block">Reactants:</strong> <span className="font-mono text-gray-300">{(step.reactants ?? []).join(', ')}</span></p>
                            <p><strong className="text-gray-400 w-24 inline-block">Reagents:</strong> <span className="font-mono text-gray-300">{(step.reagents ?? []).join(', ')}</span></p>
                            <p><strong className="text-gray-400 w-24 inline-block">Product:</strong> <span className="font-mono font-semibold text-white">{step.product}</span></p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SynthesisPathwayDiagram;