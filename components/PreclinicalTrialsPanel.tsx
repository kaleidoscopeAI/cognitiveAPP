import React from 'react';
import { PreclinicalTrials } from '../types';
import { Icon, IconName } from './Icons';

const TrialSection: React.FC<{ title: string; children: React.ReactNode, iconName: IconName }> = ({ title, children, iconName }) => (
    <div className="bg-gray-900/50 p-4 rounded-lg">
        <h5 className="font-bold text-gray-200 mb-3 flex items-center gap-2"><Icon name={iconName} className="w-5 h-5" />{title}</h5>
        <div className="space-y-2">{children}</div>
    </div>
);

const ProgressBar: React.FC<{ value: number; max: number; label: string }> = ({ value, max, label }) => (
    <div>
        <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>{label}</span>
            <span>{value} / {max}</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2.5">
            <div className="bg-teal-500 h-2.5 rounded-full" style={{ width: `${(value / max) * 100}%` }}></div>
        </div>
    </div>
);


const PreclinicalTrialsPanel: React.FC<{ trials: PreclinicalTrials }> = ({ trials }) => {
    const probability = trials.overallSuccessProbability * 100;

    return (
        <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700 space-y-4">
            <p className="italic text-gray-400 text-center">"{trials.laymanSummary}"</p>
            <div className="grid md:grid-cols-3 gap-4">
                <TrialSection title="In-Vitro Studies" iconName="beaker">
                    {(trials.inVitroStudies ?? []).map((study, i) => (
                        <div key={i} className="text-sm bg-gray-800/70 p-2 rounded">
                            <p className="font-semibold text-gray-300">{study.assay}</p>
                            <p className="text-teal-400">{study.result}</p>
                        </div>
                    ))}
                </TrialSection>
                <TrialSection title="In-Vivo Studies" iconName="testTube">
                     {(trials.inVivoStudies ?? []).map((study, i) => (
                        <div key={i} className="text-sm bg-gray-800/70 p-2 rounded">
                            <p className="font-semibold text-gray-300">{study.model}</p>
                            <p className="text-teal-400">{study.outcome}</p>
                            <p className="text-xs text-gray-500">Safety Margin: {study.safetyMargin}x</p>
                        </div>
                    ))}
                </TrialSection>
                <div className="md:col-span-1 flex flex-col items-center justify-center bg-gray-900/50 p-4 rounded-lg">
                    <h5 className="font-bold text-lg text-gray-200 mb-2">Success Probability</h5>
                    <div className="relative w-32 h-32">
                        <svg className="w-full h-full" viewBox="0 0 36 36">
                            <path
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#374151"
                                strokeWidth="3"
                            />
                            <path
                                d="M18 2.0845
                                a 15.9155 15.9155 0 0 1 0 31.831
                                a 15.9155 15.9155 0 0 1 0 -31.831"
                                fill="none"
                                stroke="#14b8a6"
                                strokeWidth="3"
                                strokeDasharray={`${probability}, 100`}
                                strokeLinecap="round"
                                transform="rotate(-90 18 18)"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-teal-300">{probability.toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PreclinicalTrialsPanel;
