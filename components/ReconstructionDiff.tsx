import React from 'react';
import { SoftwareMimicryResult } from '../types';

const ReconstructionDiff: React.FC<{ plan: SoftwareMimicryResult['reconstructionPlan'] }> = ({ plan }) => {
    return (
        <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-700">
             <p className="text-sm text-gray-400 italic mb-4">"{plan.summary}"</p>
            <div className="space-y-4 font-mono text-sm">
                {(plan.components ?? []).map((comp, index) => (
                    <div key={index} className="bg-gray-800/70 p-4 rounded-lg overflow-x-auto">
                        <div className="flex items-center">
                            <span className="text-red-400 w-6 text-center">-</span>
                            <p className="text-red-400/80">
                                <span className="font-bold">Original:</span> {comp.originalComponent}
                            </p>
                        </div>
                         <div className="flex items-center mt-1">
                            <span className="text-green-400 w-6 text-center">+</span>
                            <p className="text-green-300">
                                <span className="font-bold">Improvement:</span> {comp.improvement}
                            </p>
                        </div>
                        {(comp.newFeatures ?? []).map((feature, i) => (
                             <div key={i} className="flex items-center mt-1 ml-4">
                                <span className="text-cyan-400 w-6 text-center">*</span>
                                <p className="text-cyan-400/80">
                                    <span className="font-semibold">New Feature:</span> {feature}
                                </p>
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ReconstructionDiff;
