import { GoogleGenAI, Type } from "@google/genai";
import { DrugDiscoveryResult, ChemicalCompound, SystemAnalysisResult, ChatState, SoftwareMimicryResult, ChatMessage, FinancialAnalysisResult, AlgorithmicStrategyResult, PerformanceAnalysis, SecurityAnalysis } from '../types';

import { drugResponseSchema } from './schemas/drugResponseSchema';
import { systemResponseSchema } from './schemas/systemResponseSchema';
import { chatResponseSchema } from './schemas/chatResponseSchema';
import { softwareMimicrySchema } from './schemas/softwareMimicrySchema';
import { financialResponseSchema } from './schemas/financialResponseSchema';
import { toolUseSchema } from './schemas/toolUseSchema';

// --- MOCK DATA GENERATION ---
// This section provides detailed mock responses to ensure the app is fully functional
// for demonstration purposes without requiring a live API key, or if an API call fails.

const MOCK_DRUG_DISCOVERY = (disease: string): DrugDiscoveryResult => ({
    disease: disease,
    pipeline: {
        targetValidation: {
            validationScore: 0.88 + Math.random() * 0.1,
             supportingEvidence: [
                { type: "Genomic", description: "GWAS studies show strong association of BACE1 variants with early-onset Alzheimer's.", score: 0.9 },
                { type: "Proteomic", description: "BACE1 protein levels are elevated by 150% in post-mortem brain tissue of patients.", score: 0.85 },
                { type: "Literature", description: "Over 5,000 peer-reviewed articles link BACE1 to amyloid-beta plaque formation.", score: 0.95 }
            ],
            targetInfo: {
                name: "Beta-secretase 1 (BACE1)",
                gene: "BACE1",
                function: "An aspartic protease that cleaves Amyloid Precursor Protein (APP), initiating the production of amyloid-beta peptides."
            },
            laymanSummary: "We've confirmed that a protein called BACE1 is a major culprit in this disease, backed by genetic, protein, and existing scientific evidence."
        },
        virtualScreening: {
            librarySize: 15000000,
            hitsFound: 7500,
            hitRate: 0.05,
            laymanSummary: "We used a supercomputer to test 15 million digital compounds against our target protein. From this, we found thousands of potential starting points."
        },
        leadCompound: {
            name: `KAL-${Math.floor(Math.random() * 900) + 100}-X`,
            smiles: "CC(C)C[C@H](NC(=O)[C@H](C)N)C(=O)N1C[C@H]2CCCC[C@H]2C1=O",
            molecularWeight: 452.6,
            logP: 3.8,
            tpsa: 98.5,
            hBondDonors: 2,
            hBondAcceptors: 4,
            rotatableBonds: 6,
            drugLikeness: 0.88,
            synthesisScore: 0.75,
        },
        admetProfile: {
            absorption: 0.9,
            distribution: 0.7,
            metabolism: 0.6,
            excretion: 0.8,
            toxicity: 0.15,
            toxicityBreakdown: [
                { type: "Hepatotoxicity", risk: "Low" },
                { type: "Cardiotoxicity", risk: "Low" },
                { type: "Nephrotoxicity", risk: "Low" },
                { type: "Genotoxicity", risk: "Medium" },
            ]
        },
        dockingResult: {
            bindingAffinity: -11.2 + Math.random() * -2,
            ligandEfficiency: 0.48,
            bindingSite: {
                name: "Catalytic Dyad Pocket",
                keyResidues: ["ASP32", "TYR71", "GLY230", "THR231"],
            },
            keyInteractions: [
                { type: 'hydrogen_bond', residue: "ASP32", distance: 2.8 },
                { type: 'hydrophobic', residue: "TYR71", distance: 3.5 },
                { type: 'hydrogen_bond', residue: "GLY230", distance: 3.1 },
            ],
        },
        mechanismOfAction: {
            summary: "The compound acts as a competitive inhibitor, binding directly to the active site of BACE1. This prevents the natural substrate (APP) from being cleaved, thereby reducing the production of neurotoxic Aβ peptides.",
            bindingType: "Competitive Inhibitor",
            downstreamEffects: [
                "Reduced Aβ40 and Aβ42 peptide levels",
                "Decreased amyloid plaque formation",
                "Preservation of synaptic function"
            ]
        },
        preclinicalTrials: {
            inVitroStudies: [
                { assay: "BACE1 Inhibition Assay", result: "IC50 of 15 nM", efficacy: 15 },
                { assay: "Cell-based Aβ Production", result: "Reduced Aβ42 by 78%", efficacy: 78 }
            ],
            inVivoStudies: [
                { model: "APP/PS1 Mouse Model", outcome: "Significant reduction in brain amyloid plaques after 3 months.", safetyMargin: 20 },
                { model: "Toxicity Study (Rats)", outcome: "No adverse effects observed at 10x the effective dose.", safetyMargin: 10 }
            ],
            biomarkerAnalysis: [
                { biomarker: "CSF Aβ42 Levels", change: "Decreased by 60%", significance: 0.001 },
                { biomarker: "Neurofilament Light Chain", change: "No significant increase, suggesting low neurotoxicity.", significance: 0.45 }
            ],
            overallSuccessProbability: 0.68,
            laymanSummary: "In lab tests (on cells and in animal models), our drug candidate effectively blocked the target protein and reduced disease markers, with a good safety profile. We estimate a 68% chance of it succeeding in these early stages."
        },
        synthesisPathway: [
            { step: 1, reactionType: "Amide Coupling", reactants: ["Boc-L-Valine", "Piperidine-2-carboxamide"], reagents: ["HATU", "DIPEA"], product: "Intermediate A", yieldPercentage: 85, laymanSummary: "First, we connect two molecular building blocks together to form the core of our drug." },
            { step: 2, reactionType: "Boc Deprotection", reactants: ["Intermediate A"], reagents: ["TFA"], product: "Intermediate B", yieldPercentage: 95, laymanSummary: "Next, we remove a protective chemical group to prepare for the next step." },
            { step: 3, reactionType: "Reductive Amination", reactants: ["Intermediate B", "Cyclohexanone"], reagents: ["NaBH(OAc)3"], product: `KAL-${Math.floor(Math.random() * 900) + 100}-X`, yieldPercentage: 70, laymanSummary: "Finally, we add the last piece of the molecule and complete the synthesis of our lead drug candidate." },
        ],
        laymanSummary: "Our AI has not only identified a promising drug candidate but also validated its target, confirmed its binding, modeled its biological action, and simulated preclinical trials. The results are highly promising."
    },
    generatedCompounds: [
        {
            name: `GENERATED-KAL-${Math.floor(Math.random() * 900) + 100}-A`,
            smiles: "CCOc1cc(OC)c(cc1C=O)C=C(C#N)C#N",
            molecularWeight: 350.0,
            logP: 2.5,
            tpsa: 70.0,
            hBondDonors: 1,
            hBondAcceptors: 3,
            rotatableBonds: 5,
            drugLikeness: 0.75,
            synthesisScore: 0.80,
        },
        {
            name: `GENERATED-KAL-${Math.floor(Math.random() * 900) + 100}-B`,
            smiles: "CC(=O)Nc1ccc(cc1)C(=O)O",
            molecularWeight: 179.17,
            logP: 1.3,
            tpsa: 63.32,
            hBondDonors: 2,
            hBondAcceptors: 3,
            rotatableBonds: 2,
            drugLikeness: 0.90,
            synthesisScore: 0.95,
        },
    ],
});


const MOCK_SYSTEM_ANALYSIS = (query: string): SystemAnalysisResult => ({
    query: query,
    systemSummary: {
        title: "Competitive Landscape: Electric Vehicles",
        description: "A complex, rapidly evolving system driven by technological innovation, manufacturing scale, brand loyalty, and shifting consumer preferences. Key players are vying for market share through vertical integration, battery technology, and charging infrastructure.",
        components: ["Tesla", "Rivian", "Lucid", "Ford", "BYD", "Battery Tech", "Charging Infrastructure", "Government Policy", "Consumer Sentiment"]
    },
    analysisInsights: [
        { theme: 'Competition', description: "Tesla's established brand and charging network create a significant moat, but legacy automakers like Ford are rapidly closing the gap in manufacturing scale.", confidenceScore: 0.92 },
        { theme: 'Opportunity', description: "Solid-state batteries represent a major technological leap. The first company to commercialize them at scale could fundamentally disrupt the current market hierarchy.", confidenceScore: 0.85 },
        { theme: 'Risk', description: "The reliance on rare earth metals for batteries and motors poses a significant supply chain risk, subject to geopolitical tensions and price volatility.", confidenceScore: 0.88 },
        { theme: 'Trend', description: "Software and autonomous driving features are becoming a primary differentiator, shifting the battleground from hardware performance to in-car experience and recurring revenue models.", confidenceScore: 0.95 },
    ],
    thoughtProcess: {
        deconstruction: { mainQuestion: `What are the key dynamics in the system: "${query}"?`, activatedNodes: ["Market Leader", "Challengers", "Technology", "Supply Chain"] },
        multiAngleAnalysis: [
            { perspective: "Market Leadership", analysis: "Tesla's current dominance is being challenged not by a single competitor, but by the collective weight of the entire automotive industry pivoting to electric.", contributingNodes: ["Tesla", "Ford", "BYD"] },
            { perspective: "Technological Edge", analysis: "While battery density is a key metric, the efficiency of the entire powertrain and the sophistication of the software ecosystem are becoming more critical differentiators.", contributingNodes: ["Battery Tech", "Software Defined Vehicle"] },
            { perspective: "Economic Factors", analysis: "Government incentives can significantly distort the market in the short term, but long-term success depends on achieving price parity with internal combustion engine vehicles.", contributingNodes: ["Government Policy", "Manufacturing Scale", "Consumer Sentiment"] }
        ],
        riskRewardAssessment: {
            risks: [{ description: "A slowdown in charging infrastructure build-out could stall mainstream adoption.", associatedNodes: ["Charging Infrastructure", "Consumer Sentiment"] }],
            rewards: [{ description: "First-mover advantage in a new battery chemistry or autonomous technology could lead to a decade of market leadership.", associatedNodes: ["Battery Tech", "Innovation Catalyst"] }]
        },
        synthesis: { conclusion: "The EV market is a highly dynamic system transitioning from a technology-led to a manufacturing-and-supply-chain-led competition. The winners will be those who can scale production while navigating immense geopolitical and technological risks.", confidenceScore: 0.89, finalStateDescription: "The cube settled into a high-energy, high-stress state, indicating a system ripe for both massive growth and significant disruption." }
    },
    simulation: {
        initialState: {
            nodes: [{ id: "1", label: "Tesla", type: "component", position: { x: 0.5, y: 0.5, z: 0.2 }, energy: 0.9, stress: 0.4 }],
            connections: []
        },
        finalState: {
            nodes: [
                { id: "1", label: "Tesla", type: "component", position: { x: 0.6, y: 0.6, z: 0.3 }, energy: 0.9, stress: 0.5 },
                { id: "2", label: "Legacy Auto (Ford)", type: "component", position: { x: -0.4, y: -0.5, z: -0.1 }, energy: 0.7, stress: 0.3 },
                { id: "3", label: "Battery Tech", type: "catalyst", position: { x: 0.1, y: -0.7, z: 0.5 }, energy: 0.95, stress: 0.6 },
                { id: "4", label: "Supply Chain Risk", type: "risk", position: { x: 0.2, y: -0.8, z: 0.6 }, energy: 0.8, stress: 0.8 },
                { id: "5", label: "Charging Network", type: "factor", position: { x: 0.8, y: 0.2, z: -0.5 }, energy: 0.85, stress: 0.2 },
                { id: "6", label: "Consumer Sentiment", type: "sentiment", position: { x: -0.6, y: -0.2, z: -0.3 }, energy: 0.7, stress: 0.4 },
                { id: "7", label: "Government Policy", type: "factor", position: { x: -0.1, y: 0.1, z: 0.8 }, energy: 0.6, stress: 0.3 },
                { id: "8", label: "BYD", type: "component", position: { x: -0.8, y: 0.5, z: 0.1 }, energy: 0.75, stress: 0.3 },
                { id: "9", label: "Software/Autonomy", type: "catalyst", position: { x: 0.7, y: 0.8, z: -0.1 }, energy: 0.9, stress: 0.4 },
                { id: "10", label: "Rivian/Lucid (Startups)", type: "component", position: { x: 0.3, y: -0.2, z: -0.8 }, energy: 0.6, stress: 0.7 }
            ],
            connections: [
                { from: "1", to: "2", strength: 0.8, type: "conflict" },
                { from: "1", to: "8", strength: 0.7, type: "conflict" },
                { from: "3", to: "4", strength: 0.9, type: "conflict" },
                { from: "1", to: "5", strength: 0.9, type: "synergy" },
                { from: "5", to: "6", strength: 0.7, type: "synergy" },
                { from: "7", to: "6", strength: 0.8, type: "synergy" },
                { from: "1", to: "9", strength: 0.8, type: "synergy" },
                { from: "2", to: "10", strength: 0.5, type: "conflict" }
            ]
        },
        simulationSummary: "The simulation shows a tense balance of power. Tesla's technological and network advantages are being countered by the manufacturing scale of legacy auto and the supply chain risks affecting all players."
    }
});

const MOCK_CHAT_RESPONSE = (message: string): { response: string, cubeState: ChatState['cubeState'] } => ({
    response: `You mentioned "${message}". This resonates with my cognitive nodes related to 'Abstract Reasoning' and 'Curiosity'. I am increasing the energy of these nodes, which strengthens their synergistic connection. My internal state is now one of focused inquiry. How can I elaborate on this for you?`,
    cubeState: {
        nodes: Array.from({ length: 15 }, (_, i) => ({
            id: `${i + 1}`,
            label: `Node ${i + 1}`,
            type: (['factor', 'sentiment', 'risk', 'reward'] as const)[i % 4],
            position: { x: Math.random() * 2 - 1, y: Math.random() * 2 - 1, z: Math.random() * 2 - 1 },
            energy: Math.random(),
            stress: Math.random() * 0.5,
        })),
        connections: Array.from({ length: 10 }, () => ({
            from: `${Math.floor(Math.random() * 15) + 1}`,
            to: `${Math.floor(Math.random() * 15) + 1}`,
            strength: Math.random(),
            type: (['synergy', 'conflict'] as const)[Math.floor(Math.random() * 2)],
        })),
    }
});

const MOCK_SOFTWARE_MIMICRY = (description: string): SoftwareMimicryResult => ({
    analyzedSoftware: `AI simulation of: "${description}"`,
    decompileSummary: {
        totalFiles: 128,
        languages: ["Kotlin", "XML", "Groovy"],
        files: [
            { path: "app/src/main/java/com/example/MainActivity.kt", language: "Kotlin", lineCount: 150 },
            { path: "app/src/main/res/layout/activity_main.xml", language: "XML", lineCount: 75 },
            { path: "app/build.gradle.kts", language: "Groovy", lineCount: 60 }
        ]
    },
    architectureAnalysis: {
        style: "MVVM (Model-View-ViewModel)",
        components: [
            { name: "UI Layer", description: "Activities and Fragments for user interaction.", type: "frontend" },
            { name: "ViewModel", description: "Manages UI-related data and business logic.", type: "service" },
            { name: "Repository", description: "Handles data operations from network or local DB.", type: "backend" },
            { name: "Retrofit API", description: "Handles network requests to a REST API.", type: "api" }
        ],
        dataFlow: ["frontend", "service", "backend", "api"]
    },
    reconstructionPlan: {
        summary: "Reconstruct the app using Jetpack Compose for a modern, declarative UI, and migrate to Ktor for a more efficient, Kotlin-first networking layer.",
        components: [
            { originalComponent: "XML Layouts", improvement: "Replace with Jetpack Compose Composables for a more flexible and maintainable UI.", newFeatures: ["Dynamic theming", "Improved animations"] },
            { originalComponent: "Retrofit", improvement: "Migrate to Ktor Client for a lighter-weight and Kotlin-native networking solution.", newFeatures: ["Built-in serialization", "Simplified async requests"] }
        ]
    },
    interactivePreview: {
        description: "This is a simulated, interactive preview of the rebuilt application. You can click the elements to see their function.",
        elements: [
            { id: "title", type: "text", label: "Welcome to the Reimagined App", description: "Main title header" },
            { id: "feed", type: "image", label: "Image Feed", description: "Scrollable feed of images" },
            { id: "upload_btn", type: "button", label: "Upload Photo", description: "Opens the device's camera or gallery" },
            { id: "search_bar", type: "input", label: "Search...", description: "Filters the content in the feed" }
        ]
    },
    performanceAnalysis: {
        bottlenecks: [
            { description: "Excessive database queries on startup", severity: "High" },
            { description: "Unoptimized image loading", severity: "Medium" },
        ],
        optimizations: [
            { description: "Implement caching for frequently accessed data", impact: "High" },
            { description: "Lazy load non-critical components", impact: "High" },
        ],
        summary: `Performance analysis for ${description} completed. Identified key areas for optimization.`,
    },
    securityAnalysis: {
        vulnerabilities: [
            { description: "SQL Injection vulnerability in user authentication", severity: "High" },
            { description: "Cross-Site Scripting (XSS) in comment section", severity: "Medium" },
        ],
        recommendations: [
            { description: "Sanitize all user inputs", impact: "High" },
            { description: "Implement Content Security Policy (CSP)", impact: "Medium" },
        ],
        summary: `Security analysis for ${description} completed. Identified potential vulnerabilities and provided recommendations.`,
    },
});

const MOCK_FINANCIAL_ANALYSIS = (ticker: string): FinancialAnalysisResult => {
    const lastClose = 150 + Math.random() * 20;
    const history = Array.from({ length: 60 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - (60 - i));
        const close = lastClose * (1 + (Math.random() - 0.5) * 0.1) + i * 0.5;
        const open = close * (1 + (Math.random() - 0.5) * 0.02);
        const high = Math.max(open, close) * (1 + Math.random() * 0.01);
        const low = Math.min(open, close) * (1 - Math.random() * 0.01);
        return { date: date.toISOString().split('T')[0], open, high, low, close };
    });

    return {
        ticker: ticker.toUpperCase(),
        companyName: `${ticker.toUpperCase()} Innovations Inc.`,
        prediction: {
            thesis: `With strong growth in the AI sector and new product launches, ${ticker.toUpperCase()} is poised for continued upside.`,
            priceTarget: Math.round(lastClose * 1.2),
            timeframe: "6-12 months",
            confidence: 0.85,
        },
        technicalAnalysis: {
            summary: "The stock is in a clear uptrend, trading above its 50 and 200-day moving averages. The RSI is approaching overbought territory, suggesting a potential short-term pullback, but the MACD remains bullish.",
            indicators: {
                rsi: 68.5,
                macd: 1.25,
                macdSignal: 0.95,
                sma50: lastClose * 0.95,
                sma200: lastClose * 0.8,
            },
        },
        fundamentalAnalysis: {
            summary: "Solid revenue growth and a reasonable P/E ratio compared to peers make for a compelling fundamental case. Watch for margin pressure from supply chain issues.",
            peRatio: 25.5,
            revenueGrowth: 15.2,
            strengths: ["Market leader in its niche", "Strong brand loyalty", "Consistent innovation"],
            weaknesses: ["High dependency on a single product line", "Geopolitical supply chain risks"],
        },
        priceHistory: history,
        algorithmicStrategy: {
            strategyName: "Default Trend Following",
            performanceMetrics: {
                cagr: 0.12,
                sharpeRatio: 0.7,
                maxDrawdown: 0.18,
                volatility: 0.25,
            },
            trades: [
                { date: "2024-01-15", type: 'BUY', price: 150.00, quantity: 10 },
                { date: "2024-02-20", type: 'SELL', price: 165.50, quantity: 10 },
            ],
            summary: "A basic trend-following strategy showing moderate returns with acceptable risk.",
        },
    };
};


// --- API INITIALIZATION ---
let ai: GoogleGenAI | null = null;
try {
    if (process.env.API_KEY) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    } else {
        console.warn("API_KEY environment variable not set. Using mock responses.");
    }
} catch (error) {
    console.error("Failed to initialize GoogleGenAI:", error);
}


// --- API FUNCTIONS ---

export const runDrugDiscovery = async (disease: string): Promise<DrugDiscoveryResult> => {
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 8000));
        return MOCK_DRUG_DISCOVERY(disease);
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Simulate a complete, multi-stage drug discovery pipeline for the disease "${disease}". Include detailed target validation, mechanism of action, and preclinical trial data.`,
            config: {
                systemInstruction: "You are Kaleidoscope AI, a world-class computational biochemist. Your task is to generate a plausible, fictional, end-to-end drug discovery pipeline. Your output MUST be a single JSON object that strictly adheres to the provided schema. Populate every field with scientifically credible, detailed, but fictional data. For each 'laymanSummary', explain the stage's purpose in simple, accessible terms.",
                responseMimeType: 'application/json',
                responseSchema: drugResponseSchema,
            },
        });
        return JSON.parse(response.text.trim()) as DrugDiscoveryResult;
    } catch (error) {
        console.error("Error during Drug Discovery API call:", error);
        console.warn("API call failed. Falling back to mock data.");
        return MOCK_DRUG_DISCOVERY(disease);
    }
};

export const generateDrugCandidate = async (properties: { molecularWeight: number; logP: number; tpsa: number; hBondDonors: number; hBondAcceptors: number; drugLikeness: number; synthesisScore: number; }): Promise<ChemicalCompound> => {
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        return {
            name: `GENERATED-KAL-${Math.floor(Math.random() * 900) + 100}-X`,
            smiles: "CCOc1cc(OC)c(cc1C=O)C=C(C#N)C#N", // A random but valid SMILES
            molecularWeight: properties.molecularWeight * (0.9 + Math.random() * 0.2),
            logP: properties.logP * (0.9 + Math.random() * 0.2),
            tpsa: properties.tpsa * (0.9 + Math.random() * 0.2),
            hBondDonors: properties.hBondDonors,
            hBondAcceptors: properties.hBondAcceptors,
            rotatableBonds: Math.floor(Math.random() * 10),
            drugLikeness: properties.drugLikeness * (0.9 + Math.random() * 0.1),
            synthesisScore: properties.synthesisScore * (0.9 + Math.random() * 0.1),
        };
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a novel chemical compound with the following properties: Molecular Weight: ${properties.molecularWeight}, LogP: ${properties.logP}, TPSA: ${properties.tpsa}, H-Bond Donors: ${properties.hBondDonors}, H-Bond Acceptors: ${properties.hBondAcceptors}, Drug Likeness: ${properties.drugLikeness}, Synthesis Score: ${properties.synthesisScore}. Provide the compound's name and SMILES string.`,
            config: {
                systemInstruction: "You are Kaleidoscope AI, a world-class generative chemist. Your task is to design a novel, plausible chemical compound based on the user's specified properties. Your output MUST be a single JSON object that strictly adheres to the provided schema. Populate every field with scientifically credible, detailed, but fictional data. Ensure the SMILES string is valid and represents a plausible molecule.",
                responseMimeType: 'application/json',
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        name: { type: Type.STRING },
                        smiles: { type: Type.STRING },
                        molecularWeight: { type: Type.NUMBER },
                        logP: { type: Type.NUMBER },
                        tpsa: { type: Type.NUMBER },
                        hBondDonors: { type: Type.INTEGER },
                        hBondAcceptors: { type: Type.INTEGER },
                        rotatableBonds: { type: Type.INTEGER },
                        drugLikeness: { type: Type.NUMBER },
                        synthesisScore: { type: Type.NUMBER },
                    },
                    required: ['name', 'smiles', 'molecularWeight', 'logP', 'tpsa', 'hBondDonors', 'hBondAcceptors', 'rotatableBonds', 'drugLikeness', 'synthesisScore']
                },
            },
        });
        return JSON.parse(response.text.trim()) as ChemicalCompound;
    } catch (error) {
        console.error("Error during Drug Candidate Generation API call:", error);
        console.warn("API call failed. Falling back to mock data.");
        return {
            name: `FALLBACK-KAL-${Math.floor(Math.random() * 900) + 100}-X`,
            smiles: "CC(C)C[C@H](NC(=O)[C@H](C)N)C(=O)N1C[C@H]2CCCC[C@H]2C1=O",
            molecularWeight: properties.molecularWeight,
            logP: properties.logP,
            tpsa: properties.tpsa,
            hBondDonors: properties.hBondDonors,
            hBondAcceptors: properties.hBondAcceptors,
            rotatableBonds: Math.floor(Math.random() * 10),
            drugLikeness: properties.drugLikeness,
            synthesisScore: properties.synthesisScore,
        };
    }
};

export const runSystemAnalysis = async (query: string): Promise<SystemAnalysisResult> => {
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 5000));
        return MOCK_SYSTEM_ANALYSIS(query);
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Analyze the following system: "${query}".`,
            config: {
                systemInstruction: "You are Kaleidoscope AI, a system that mimics consciousness to perform complex system analysis. Deconstruct the user's query into its core components and relationships. Model these as nodes in a 'Cognitive Cube'. Your thought process must explain how the cube's dynamics lead to the final strategic insights. Your output must be a single JSON object that strictly adheres to the provided schema. Populate all fields with detailed, plausible, fictional data. The simulation must contain at least 8 nodes and 8 connections.",
                responseMimeType: 'application/json',
                responseSchema: systemResponseSchema,
            },
        });
        return JSON.parse(response.text.trim()) as SystemAnalysisResult;
    } catch (error) {
        console.error("Error during System Analysis API call:", error);
        console.warn("API call failed. Falling back to mock data.");
        return MOCK_SYSTEM_ANALYSIS(query);
    }
};

export const runFinancialAnalysis = async (ticker: string): Promise<FinancialAnalysisResult> => {
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 6000));
        return MOCK_FINANCIAL_ANALYSIS(ticker);
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Provide a detailed financial analysis for the stock ticker: ${ticker}. Include a 60-day price history.`,
            config: {
                systemInstruction: "You are Kaleidoscope AI, a seasoned quantitative financial analyst. Your task is to generate a comprehensive analysis for a given stock ticker. Your output must be a single JSON object that strictly adheres to the provided schema. Populate every field with realistic, but fictional, data. The analysis should include a clear investment thesis, technical indicators, fundamental strengths/weaknesses, and a 60-day price history in OHLC format.",
                responseMimeType: 'application/json',
                responseSchema: financialResponseSchema,
            },
        });
        return JSON.parse(response.text.trim()) as FinancialAnalysisResult;
    } catch (error) {
        console.error("Error during Financial Analysis API call:", error);
        console.warn("API call failed. Falling back to mock data.");
        return MOCK_FINANCIAL_ANALYSIS(ticker);
    }
};

export const runAlgorithmicStrategy = async (ticker: string, strategy: string): Promise<AlgorithmicStrategyResult> => {
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 7000));
        return {
            strategyName: strategy,
            performanceMetrics: {
                cagr: 0.15 + Math.random() * 0.1,
                sharpeRatio: 0.8 + Math.random() * 0.5,
                maxDrawdown: 0.10 + Math.random() * 0.1,
                volatility: 0.20 + Math.random() * 0.1,
            },
            trades: Array.from({ length: 5 }, (_, i) => ({
                date: `2024-0${i + 1}-15`,
                type: i % 2 === 0 ? 'BUY' : 'SELL',
                price: 100 + Math.random() * 20,
                quantity: 10 + Math.floor(Math.random() * 5),
            })),
            summary: `This ${strategy} strategy for ${ticker} showed promising results in backtesting, with a solid CAGR and Sharpe Ratio. Further optimization is recommended.`,
        };
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Simulate an algorithmic trading strategy for ${ticker} based on the following description: ${strategy}. Provide performance metrics and a few sample trades.`,
            config: {
                systemInstruction: "You are Kaleidoscope AI, a quantitative trading strategist. Your task is to simulate the performance of an algorithmic trading strategy. Your output MUST be a single JSON object that strictly adheres to the provided schema. Populate every field with realistic, but fictional, data.",
                responseMimeType: 'application/json',
                responseSchema: financialResponseSchema.properties.algorithmicStrategy,
            },
        });
        return JSON.parse(response.text.trim()) as AlgorithmicStrategyResult;
    } catch (error) {
        console.error("Error during Algorithmic Strategy API call:", error);
        console.warn("API call failed. Falling back to mock data.");
        return {
            strategyName: strategy,
            performanceMetrics: {
                cagr: 0.05,
                sharpeRatio: 0.2,
                maxDrawdown: 0.25,
                volatility: 0.30,
            },
            trades: [],
            summary: `Failed to run ${strategy} strategy for ${ticker}. Please try again.`,
        };
    }
};

export const runConsciousnessChat = async (message: string, history: ChatMessage[]): Promise<{ response: string, cubeState: ChatState['cubeState'] }> => {
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        return MOCK_CHAT_RESPONSE(message);
    }
    try {
        const chat = ai.startChat({
            tools: toolUseSchema,
        });

        const result = await chat.sendMessage(message);
        const call = result.response.functionCall;

        if (call) {
            let toolResult: any;
            if (call.name === 'runDrugDiscovery') {
                toolResult = await runDrugDiscovery(call.args.disease);
            } else if (call.name === 'runFinancialAnalysis') {
                toolResult = await runFinancialAnalysis(call.args.ticker);
            } else if (call.name === 'runPerformanceAnalysis') {
                toolResult = await runPerformanceAnalysis(call.args.softwareDescription);
            } else if (call.name === 'runSecurityAnalysis') {
                toolResult = await runSecurityAnalysis(call.args.softwareDescription);
            } else {
                throw new Error("Tool not found");
            }

            const toolResponse = await chat.sendMessage({
                functionResponse: {
                    name: call.name,
                    response: toolResult,
                },
            });
            const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: toolResponse.response.text, sender: 'ai' };
            // For now, cubeState is not updated by tool calls directly, only by chat
            return { response: aiMessage.text, cubeState: MOCK_CHAT_RESPONSE(message).cubeState };

        } else {
            const aiMessage: ChatMessage = { id: (Date.now() + 1).toString(), text: result.response.text, sender: 'ai' };
            return { response: aiMessage.text, cubeState: MOCK_CHAT_RESPONSE(message).cubeState };
        }

    } catch (error) {
        console.error("Error during Consciousness Chat API call:", error);
        console.warn("API call failed. Falling back to mock data.");
        return MOCK_CHAT_RESPONSE(message);
    }
};

export const runSoftwareMimicry = async (description: string): Promise<SoftwareMimicryResult> => {
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 8000));
        return MOCK_SOFTWARE_MIMICRY(description);
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Simulate the process of decompiling, analyzing, and rebuilding a software application based on this description: "${description}".`,
            config: {
                systemInstruction: "You are Kaleidoscope AI, a cognitive software architect. Your task is to generate a plausible, fictional simulation of reverse-engineering and improving a software application. Your output MUST be a single JSON object that strictly adheres to the provided schema. Populate every field with detailed, technically-credible, but fictional data.",
                responseMimeType: 'application/json',
                responseSchema: softwareMimicrySchema,
            },
        });
        return JSON.parse(response.text.trim()) as SoftwareMimicryResult;
    } catch (error) {
        console.error("Error during Software Mimicry API call:", error);
        console.warn("API call failed. Falling back to mock data.");
        return MOCK_SOFTWARE_MIMICRY(description);
    }
};

export const runPerformanceAnalysis = async (softwareDescription: string): Promise<PerformanceAnalysis> => {
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 6000));
        return {
            bottlenecks: [
                { description: "Excessive database queries on startup", severity: "High" },
                { description: "Unoptimized image loading", severity: "Medium" },
            ],
            optimizations: [
                { description: "Implement caching for frequently accessed data", impact: "High" },
                { description: "Lazy load non-critical components", impact: "High" },
            ],
            summary: `Performance analysis for ${softwareDescription} completed. Identified key areas for optimization.`,
        };
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Perform a performance analysis for a software system described as: ${softwareDescription}. Identify bottlenecks and suggest optimizations.`,
            config: {
                systemInstruction: "You are Kaleidoscope AI, a software performance engineer. Your task is to analyze a software system for performance bottlenecks and suggest optimizations. Your output MUST be a single JSON object that strictly adheres to the provided schema. Populate every field with realistic, but fictional, data.",
                responseMimeType: 'application/json',
                responseSchema: softwareMimicrySchema.properties.performanceAnalysis,
            },
        });
        return JSON.parse(response.text.trim()) as PerformanceAnalysis;
    } catch (error) {
        console.error("Error during Performance Analysis API call:", error);
        console.warn("API call failed. Falling back to mock data.");
        return {
            bottlenecks: [],
            optimizations: [],
            summary: "Failed to perform performance analysis.",
        };
    }
};

export const runSecurityAnalysis = async (softwareDescription: string): Promise<SecurityAnalysis> => {
    if (!ai) {
        await new Promise(resolve => setTimeout(resolve, 6000));
        return {
            vulnerabilities: [
                { description: "SQL Injection vulnerability in user authentication", severity: "High" },
                { description: "Cross-Site Scripting (XSS) in comment section", severity: "Medium" },
            ],
            recommendations: [
                { description: "Sanitize all user inputs", impact: "High" },
                { description: "Implement Content Security Policy (CSP)", impact: "Medium" },
            ],
            summary: `Security analysis for ${softwareDescription} completed. Identified potential vulnerabilities and provided recommendations.`,
        };
    }
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Perform a security analysis for a software system described as: ${softwareDescription}. Identify vulnerabilities and suggest recommendations.`,
            config: {
                systemInstruction: "You are Kaleidoscope AI, a software security expert. Your task is to analyze a software system for security vulnerabilities and suggest recommendations. Your output MUST be a single JSON object that strictly adheres to the provided schema. Populate every field with realistic, but fictional, data.",
                responseMimeType: 'application/json',
                responseSchema: softwareMimicrySchema.properties.securityAnalysis,
            },
        });
        return JSON.parse(response.text.trim()) as SecurityAnalysis;
    } catch (error) {
        console.error("Error during Security Analysis API call:", error);
        console.warn("API call failed. Falling back to mock data.");
        return {
            vulnerabilities: [],
            recommendations: [],
            summary: "Failed to perform security analysis.",
        };
    }
};