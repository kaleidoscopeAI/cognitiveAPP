import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DrugDiscoveryResult, ChemicalCompound, TargetEvidence, DiscoveryPipeline as PipelineData } from '../types';
import { Icon, IconName } from './Icons';
import VirtualScreeningFunnel from './VirtualScreeningFunnel';
import MoleculeViewer from './MoleculeViewer';
import AdmetRadarChart from './AdmetRadarChart';
import ToxicityPanel from './ToxicityPanel';
import MolecularDockingVisualizer from './MolecularDockingVisualizer';
import SynthesisPathwayDiagram from './SynthesisPathwayDiagram';
import MechanismOfActionPanel from './MechanismOfActionPanel';
import PreclinicalTrialsPanel from './PreclinicalTrialsPanel';


interface PipelineStageProps {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

const PipelineStage: React.FC<PipelineStageProps> = ({ icon, title, children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex items-start space-x-4"
      role="region"
      aria-label={title}
    >
      <div className="mt-1 flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-full bg-teal-500">
        <Icon name="checkCircle" className="w-6 h-6 text-white" />
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-bold text-gray-100">{title}</h3>
        <div className="mt-4 w-full">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2, duration: 0.5 }}>
            {children}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const InfoPill: React.FC<{ label: string; value: string | number; tooltip: string }> = ({ label, value, tooltip }) => (
    <div className="group relative flex flex-col items-center justify-center p-3 rounded-lg text-center bg-teal-900/50 text-teal-300" role="tooltip" aria-label={`${label}: ${value}`}>
        <span className="text-xs font-medium uppercase opacity-80">{label}</span>
        <span className="text-lg font-bold">{value}</span>
        <div className="absolute bottom-full mb-2 hidden group-hover:block w-48 bg-gray-800 text-white text-xs rounded-lg py-1 px-2 border border-gray-600 shadow-lg z-10 left-1/2 -translate-x-1/2">
            {tooltip}
        </div>
    </div>
);

const LeadCompoundSection: React.FC<{compound: ChemicalCompound}> = ({ compound }) => (
    <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700">
        <MoleculeViewer name={compound.name} smiles={compound.smiles} />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mt-4">
            <InfoPill label="Drug-like" value={compound.drugLikeness.toFixed(2)} tooltip="Likelihood of being an oral drug (Lipinski's rule, etc.). Higher is better." />
            <InfoPill label="MW" value={compound.molecularWeight.toFixed(1)} tooltip="Molecular Weight (g/mol). Affects absorption and distribution." />
            <InfoPill label="LogP" value={compound.logP.toFixed(2)} tooltip="Lipophilicity. Measures how well the compound dissolves in fats." />
            <InfoPill label="TPSA" value={compound.tpsa.toFixed(1)} tooltip="Topological Polar Surface Area. Influences membrane permeability." />
            <InfoPill label="H-Bonds" value={`${compound.hBondDonors}/${compound.hBondAcceptors}`} tooltip="Hydrogen Bond Donors/Acceptors. Key for target binding." />
            <InfoPill label="Synth Score" value={compound.synthesisScore.toFixed(2)} tooltip="Estimated ease of synthesis. Higher is easier."/>
        </div>
    </div>
);

const EvidenceCard: React.FC<{evidence: TargetEvidence}> = ({ evidence }) => {
    const iconMap: Record<TargetEvidence['type'], IconName> = {
        'Genomic': "dna",
        'Proteomic': "molecule",
        'Literature': "clipboardList",
        'Clinical': "sparkles"
    };
    const scoreColor = evidence.score > 0.8 ? 'text-green-400' : evidence.score > 0.6 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="bg-gray-900/50 p-4 rounded-lg border border-gray-700">
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {iconMap[evidence.type]}
                    <h5 className="font-bold text-gray-200">{evidence.type} Evidence</h5>
                </div>
                <div className={`font-bold text-lg ${scoreColor}`}>{evidence.score.toFixed(2)}</div>
            </div>
            <p className="text-sm text-gray-400">{evidence.description}</p>
        </div>
    );
}

const isValidPipeline = (pipeline: PipelineData | undefined): pipeline is PipelineData => {
    return !!(
        pipeline &&
        pipeline.targetValidation &&
        pipeline.virtualScreening &&
        pipeline.leadCompound &&
        pipeline.admetProfile &&
        pipeline.dockingResult &&
        pipeline.mechanismOfAction &&
        pipeline.preclinicalTrials &&
        pipeline.synthesisPathway &&
        pipeline.laymanSummary
    );
};

const DiscoveryPipeline: React.FC<{ result: DrugDiscoveryResult }> = ({ result }) => {
    const { pipeline, generatedCompounds } = result;
    const [completedStages, setCompletedStages] = useState<number>(0);
    const [generationProps, setGenerationProps] = useState({
        molecularWeight: 350,
        logP: 2.5,
        tpsa: 70,
        hBondDonors: 1,
        hBondAcceptors: 3,
        drugLikeness: 0.8,
        synthesisScore: 0.7,
    });
    const { runGenerateDrugCandidate } = useStore();

    useEffect(() => {
        setCompletedStages(0);
        if (!isValidPipeline(pipeline)) return;

        const stages = [
            pipeline.targetValidation,
            pipeline.virtualScreening,
            pipeline.leadCompound,
            pipeline.dockingResult,
            pipeline.mechanismOfAction,
            pipeline.preclinicalTrials,
            pipeline.synthesisPathway,
            pipeline.laymanSummary
        ];
        
        const timers = stages.map((_, index) => 
            setTimeout(() => {
                setCompletedStages(prev => prev + 1);
            }, index * 1200)
        );

        return () => timers.forEach(clearTimeout);

    }, [pipeline]);

    if (!isValidPipeline(pipeline)) {
        return <div className="text-center text-gray-400" role="alert">Waiting for valid pipeline data...</div>;
    }

    const stages = [
        { 
            title: "Stage 1: Target Identification & Validation", 
            icon: <Icon name="target" className="w-6 h-6 text-white"/>, 
            content: (
                <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700 grid md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 space-y-3">
                        <p className="text-gray-300 font-semibold mb-2">Supporting Evidence Breakdown:</p>
                        {(pipeline.targetValidation?.supportingEvidence ?? []).map((e, i) => <EvidenceCard key={i} evidence={e} />)}
                    </div>
                    <div className="flex flex-col gap-4">
                        <div className="bg-gray-900/50 p-4 rounded-lg text-center flex flex-col justify-center flex-grow">
                            <p className="text-sm text-gray-400">Identified Target</p>
                            <p className="text-xl font-bold text-teal-300">{pipeline.targetValidation?.targetInfo?.name}</p>
                            <p className="font-mono text-xs text-gray-500">Gene: {pipeline.targetValidation?.targetInfo?.gene}</p>
                            <hr className="border-gray-700 my-3"/>
                            <p className="text-sm text-gray-400">Overall Validation Score</p>
                            <p className="text-4xl font-bold text-teal-300">{pipeline.targetValidation?.validationScore?.toFixed(2) ?? 'N/A'}</p>
                        </div>
                        <div className="bg-gray-900/50 p-4 rounded-lg">
                            <p className="text-gray-300 font-semibold flex items-center gap-2"><Icon name="clipboardList" className="w-5 h-5 text-teal-400"/> Target Function</p>
                            <p className="text-sm text-gray-400 mt-1">{pipeline.targetValidation?.targetInfo?.function}</p>
                        </div>
                    </div>
                </div>
            )
        },
        { 
            title: "Stage 2: Virtual Screening", 
            icon: <Icon name="filter" className="w-6 h-6 text-white"/>, 
            content: pipeline.virtualScreening && <VirtualScreeningFunnel data={pipeline.virtualScreening} />
        },
        { 
            title: "Stage 3: Lead Candidate Analysis", 
            icon: <Icon name="molecule" className="w-6 h-6 text-white"/>, 
            content: (
                <>
                    {pipeline.leadCompound && <LeadCompoundSection compound={pipeline.leadCompound} />}
                    {pipeline.admetProfile && (
                        <div className="grid md:grid-cols-2 gap-6 mt-6">
                            <AdmetRadarChart data={pipeline.admetProfile} />
                            <ToxicityPanel toxicityBreakdown={pipeline.admetProfile.toxicityBreakdown} />
                        </div>
                    )}
                </>
            )
        },
        { 
            title: "Stage 4: Molecular Docking", 
            icon: <Icon name="dna" className="w-6 h-6 text-white"/>, 
            content: pipeline.dockingResult && <MolecularDockingVisualizer dockingResult={pipeline.dockingResult} />
        },
        { 
            title: "Stage 5: Mechanism of Action", 
            icon: <Icon name="gitBranch" className="w-6 h-6 text-white"/>, 
            content: pipeline.mechanismOfAction && <MechanismOfActionPanel moa={pipeline.mechanismOfAction} />
        },
        { 
            title: "Stage 6: Preclinical Trials Simulation", 
            icon: <Icon name="testTube" className="w-6 h-6 text-white"/>, 
            content: pipeline.preclinicalTrials && <PreclinicalTrialsPanel trials={pipeline.preclinicalTrials} />
        },
        { 
            title: "Stage 7: Synthesis Planning", 
            icon: <Icon name="beaker" className="w-6 h-6 text-white"/>, 
            content: pipeline.synthesisPathway && <SynthesisPathwayDiagram pathway={pipeline.synthesisPathway} />
        },
        { 
            title: "Final Candidate Profile", 
            icon: <Icon name="lightbulb" className="w-6 h-6 text-white"/>, 
            content: (
                <div className="bg-gradient-to-tr from-teal-900/80 to-cyan-900/80 p-6 rounded-2xl border border-teal-500 text-center">
                    <h4 className="text-2xl font-bold text-white">Discovery Complete</h4>
                    <p className="text-gray-300 mt-2 max-w-2xl mx-auto">{pipeline.laymanSummary}</p>
                    <p className="text-gray-300 mt-4">Lead candidate <span className="font-bold text-teal-300">{pipeline.leadCompound?.name}</span> has been identified and validated through the simulation.</p>
                </div>
            )
        },
        { 
            title: "Stage 8: Generative Chemistry", 
            icon: <Icon name="sparkles" className="w-6 h-6 text-white"/>, 
            content: (
                <div className="bg-gray-800/60 p-6 rounded-2xl border border-gray-700">
                    <h4 className="text-xl font-bold text-teal-300 mb-4">Generate New Compounds</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {Object.entries(generationProps).map(([key, value]) => (
                            <div key={key} className="flex flex-col">
                                <label htmlFor={key} className="text-sm text-gray-400 capitalize mb-1">{key.replace(/([A-Z])/g, ' $1')}:</label>
                                <input
                                    type="number"
                                    id={key}
                                    value={value}
                                    onChange={(e) => setGenerationProps({ ...generationProps, [key]: parseFloat(e.target.value) })}
                                    className="w-full p-2 rounded bg-gray-700 border border-gray-600 text-white"
                                />
                            </div>
                        ))}
                    </div>
                    <button 
                        onClick={() => runGenerateDrugCandidate(generationProps)}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2 px-4 rounded-lg transition-colors"
                    >
                        Generate Compound
                    </button>

                    {generatedCompounds && generatedCompounds.length > 0 && (
                        <div className="mt-8">
                            <h4 className="text-xl font-bold text-teal-300 mb-4">Generated Compounds</h4>
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                {generatedCompounds.map((compound, index) => (
                                    <LeadCompoundSection key={index} compound={compound} />
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )
        }
    ];

  return (
    <div className="space-y-12" role="main" aria-label="Drug Discovery Pipeline">
        <AnimatePresence>
            {stages.slice(0, completedStages).map((stage, index) => (
                <PipelineStage key={index} icon={stage.icon} title={stage.title}>
                    {stage.content}
                </PipelineStage>
            ))}
        </AnimatePresence>
    </div>
  );
};

export default DiscoveryPipeline;
