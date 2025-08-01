import React from 'react';
import { DockingResult } from '../types';

const interactionColors: Record<string, string> = {
    hydrogen_bond: 'stroke-sky-400',
    hydrophobic: 'stroke-orange-400',
    ionic: 'stroke-rose-500',
    pi_stacking: 'stroke-green-400',
    halogen_bond: 'stroke-purple-400'
};

const MolecularDockingVisualizer: React.FC<{ dockingResult: DockingResult }> = ({ dockingResult }) => {
    const { bindingSite, keyInteractions, bindingAffinity } = dockingResult;
    const residues = bindingSite?.keyResidues ?? [];
    const numResidues = residues.length;
    const angleStep = numResidues > 0 ? (2 * Math.PI) / numResidues : 0;
    const radius = 80;

    return (
         <div className="bg-gray-900/70 p-4 rounded-2xl border border-gray-700 flex flex-col md:flex-row items-center gap-6">
            <style>{`.lead-pulse { animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite; } @keyframes pulse { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.05); } }`}</style>
            <div className="w-full md:w-2/3 h-64 relative">
                <svg width="100%" height="100%" viewBox="0 0 200 200">
                    {/* Binding Pocket */}
                    <circle cx="100" cy="100" r={radius + 15} fill="url(#pocketGradient)" />
                     <defs>
                        <radialGradient id="pocketGradient">
                        <stop offset="60%" stopColor="#1f2937" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#111827" stopOpacity="0.2" />
                        </radialGradient>
                    </defs>


                    {/* Lead Compound */}
                    <g transform="translate(100, 100)" className="lead-pulse">
                         <circle cx="0" cy="0" r="20" fill="#4fd1c5" stroke="#a7f3d0" strokeWidth="1" />
                         <text x="0" y="3" fill="#064e3b" textAnchor="middle" fontSize="8" fontWeight="bold">LEAD</text>
                    </g>

                    {/* Residues and Interactions */}
                    {residues.map((residue, i) => {
                        const angle = i * angleStep;
                        const x = 100 + radius * Math.cos(angle);
                        const y = 100 + radius * Math.sin(angle);
                        const interaction = (keyInteractions ?? []).find(inter => inter.residue.startsWith(residue.split('_')[0]));
                        
                        return (
                            <g key={residue}>
                                {interaction && (
                                    <line 
                                        x1="100" 
                                        y1="100" 
                                        x2={x} 
                                        y2={y} 
                                        className={`${interactionColors[interaction.type] || 'stroke-gray-500'}`}
                                        strokeWidth="1" 
                                        strokeDasharray="3 3" 
                                    />
                                )}
                                <circle cx={x} cy={y} r="12" fill="#374151" stroke="#4b5563" strokeWidth="1" />
                                <text x={x} y={y + 3} textAnchor="middle" fontSize="6" fill="#d1d5db" fontWeight="semibold">{residue}</text>
                            </g>
                        );
                    })}
                </svg>
            </div>
             <div className="w-full md:w-1/3 space-y-3">
                <div className="text-center">
                    <p className="text-sm text-gray-400">Binding Affinity</p>
                    <p className="text-3xl font-bold text-indigo-300">{bindingAffinity.toFixed(2)}</p>
                    <p className="text-xs text-gray-500">kcal/mol</p>
                </div>
                 <div className="text-sm space-y-2">
                    <h5 className="font-bold text-gray-200">Key Interactions:</h5>
                    {Object.entries(interactionColors).map(([type, color]) => (
                        <div key={type} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${color.replace('stroke-', 'bg-')}`}></div>
                            <span className="text-gray-400 capitalize">{type.replace('_', ' ')}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default MolecularDockingVisualizer;