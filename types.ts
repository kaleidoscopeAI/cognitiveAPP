// --- SHARED & UTILITY TYPES ---
export type AppMode = 'drug' | 'systemMimicry' | 'chat' | 'financial';


// --- DRUG DISCOVERY & MOLECULAR MODELING TYPES ---

export interface ChemicalCompound {
  name: string;
  smiles: string;
  molecularWeight: number;
  logP: number;
  tpsa: number;
  hBondDonors: number;
  hBondAcceptors: number;
  rotatableBonds: number;
  drugLikeness: number;
  synthesisScore: number;
}

export interface AdmetProfile {
  absorption: number;
  distribution: number;
  metabolism: number;
  excretion: number;
  toxicity: number;
  toxicityBreakdown: {
      type: string;
      risk: 'Low' | 'Medium' | 'High';
  }[];
}

export interface DockingInteraction {
  type: 'hydrogen_bond' | 'hydrophobic' | 'ionic' | 'pi_stacking' | 'halogen_bond';
  residue: string;
  distance: number;
}

export interface DockingResult {
  bindingAffinity: number;
  ligandEfficiency: number;
  bindingSite: {
    name: string;
    keyResidues: string[];
  };
  keyInteractions: DockingInteraction[];
}

export interface SynthesisStep {
    step: number;
    reactionType: string;
    reactants: string[];
    reagents: string[];
    product: string;
    yieldPercentage: number;
    laymanSummary?: string;
}

export interface TargetEvidence {
    type: 'Genomic' | 'Proteomic' | 'Literature' | 'Clinical';
    description: string;
    score: number; // A confidence score from 0 to 1
}

export interface TargetValidation {
    validationScore: number;
    supportingEvidence: TargetEvidence[];
    laymanSummary?: string;
    targetInfo: {
        name: string;
        gene: string;
        function: string;
    };
}

export interface VirtualScreeningStats {
    librarySize: number;
    hitsFound: number;
    hitRate: number;
    laymanSummary?: string;
}

export interface MechanismOfAction {
    summary: string;
    bindingType: string;
    downstreamEffects: string[];
}

export interface PreclinicalTrials {
    inVitroStudies: {
        assay: string;
        result: string;
        efficacy: number; // e.g., IC50 value in nM
    }[];
    inVivoStudies: {
        model: string; // e.g., "Alzheimer's Mouse Model"
        outcome: string;
        safetyMargin: number; // e.g., 10x
    }[];
    biomarkerAnalysis: {
        biomarker: string;
        change: string; // e.g., "Reduced by 40%"
        significance: number; // p-value
    }[];
    overallSuccessProbability: number;
    laymanSummary: string;
}

export interface DiscoveryPipeline {
    targetValidation: TargetValidation;
    virtualScreening: VirtualScreeningStats;
    leadCompound: ChemicalCompound;
    admetProfile: AdmetProfile;
    dockingResult: DockingResult;
    mechanismOfAction: MechanismOfAction;
    preclinicalTrials: PreclinicalTrials;
    synthesisPathway: SynthesisStep[];
    laymanSummary?: string;
}

export interface DrugDiscoveryResult {
  disease: string;
  pipeline: DiscoveryPipeline;
  generatedCompounds?: ChemicalCompound[];
}


// --- FINANCIAL MODELING TYPES ---
export interface PriceDataPoint {
    date: string;
    open: number;
    high: number;
    low: number;
    close: number;
}

export interface TechnicalIndicators {
    rsi: number; // Relative Strength Index
    macd: number; // Moving Average Convergence Divergence
    macdSignal: number;
    sma50: number; // 50-day Simple Moving Average
    sma200: number; // 200-day Simple Moving Average
}

export interface AlgorithmicStrategyResult {
    strategyName: string;
    performanceMetrics: {
        cagr: number; // Compound Annual Growth Rate
        sharpeRatio: number;
        maxDrawdown: number;
        volatility: number;
    };
    trades: {
        date: string;
        type: 'BUY' | 'SELL';
        price: number;
        quantity: number;
    }[];
    summary: string;
}

export interface FinancialAnalysisResult {
    ticker: string;
    companyName: string;
    prediction: {
        thesis: string;
        priceTarget: number;
        timeframe: string; // e.g., "6-12 months"
        confidence: number; // 0-1
    };
    technicalAnalysis: {
        summary: string;
        indicators: TechnicalIndicators;
    };
    fundamentalAnalysis: {
        summary: string;
        peRatio: number;
        revenueGrowth: number; // percentage
        strengths: string[];
        weaknesses: string[];
    };
    priceHistory: PriceDataPoint[];
    algorithmicStrategy?: AlgorithmicStrategyResult;
}


// --- SYSTEM ANALYSIS TYPES ---

export interface CubeNode {
  id: string;
  label: string;
  type: 'factor' | 'sentiment' | 'risk' | 'reward' | 'macro' | 'catalyst' | 'component' | 'relationship';
  position: { x: number; y: number; z: number };
  energy: number;
  stress: number;
}

export interface CubeConnection {
  from: string;
  to: string;
  strength: number;
  type: 'synergy' | 'conflict';
}

export interface CubeState {
  nodes: CubeNode[];
  connections: CubeConnection[];
}

export interface ThoughtProcess {
  deconstruction: {
    mainQuestion: string;
    activatedNodes: string[];
  };
  multiAngleAnalysis: {
    perspective: string;
    analysis: string;
    contributingNodes: string[];
  }[];
  riskRewardAssessment: {
    risks: { description: string, associatedNodes: string[] }[];
    rewards: { description: string, associatedNodes: string[] }[];
  };
  synthesis: {
    conclusion: string;
    confidenceScore: number;
    finalStateDescription: string;
  };
}

export interface SystemSummary {
    title: string;
    description: string;
    components: string[];
}

export interface AnalysisInsight {
    theme: 'Opportunity' | 'Risk' | 'Trend' | 'Competition' | 'Data Point';
    description: string;
    confidenceScore: number;
}

export interface SystemAnalysisResult {
  query: string;
  systemSummary: SystemSummary;
  analysisInsights: AnalysisInsight[];
  thoughtProcess: ThoughtProcess;
  simulation: CognitiveCubeSimulation;
}


export interface CognitiveCubeSimulation {
  initialState: CubeState;
  finalState: CubeState;
  simulationSummary: string;
  activeTool?: string; // Name of the tool currently being used by the AI
}


// --- CONSCIOUSNESS CHAT TYPES ---

export interface ChatMessage {
    id: string;
    text: string;
    sender: 'user' | 'ai';
}

export interface ChatState {
    messages: ChatMessage[];
    cubeState: CubeState;
}

// --- SOFTWARE MIMICRY TYPES ---
export interface DecompiledFile {
    path: string;
    language: string;
    lineCount: number;
}

export interface ArchitectureComponent {
    name: string;
    description: string;
    type: 'frontend' | 'backend' | 'database' | 'api' | 'service' | 'library';
}

export interface ArchitectureAnalysis {
    style: string; // e.g., "Microservices", "Monolith"
    components: ArchitectureComponent[];
    dataFlow: string[];
}

export interface ReconstructedComponent {
    originalComponent: string;
    improvement: string;
    newFeatures: string[];
}

export interface InteractivePreviewElement {
    id: string;
    type: 'button' | 'text' | 'image' | 'input';
    label: string;
    description: string;
}

export interface PerformanceAnalysis {
    bottlenecks: { description: string; severity: 'Low' | 'Medium' | 'High'; }[];
    optimizations: { description: string; impact: 'Low' | 'Medium' | 'High'; }[];
    summary: string;
}

export interface SecurityAnalysis {
    vulnerabilities: { description: string; severity: 'Low' | 'Medium' | 'High'; }[];
    recommendations: { description: string; impact: 'Low' | 'Medium' | 'High'; }[];
    summary: string;
}

export interface SoftwareMimicryResult {
    analyzedSoftware: string;
    decompileSummary: {
        totalFiles: number;
        languages: string[];
        files: DecompiledFile[];
    };
    architectureAnalysis: ArchitectureAnalysis;
    reconstructionPlan: {
        summary: string;
        components: ReconstructedComponent[];
    };
    interactivePreview: {
        description: string;
        elements: InteractivePreviewElement[];
    };
    performanceAnalysis?: PerformanceAnalysis;
    securityAnalysis?: SecurityAnalysis;
}