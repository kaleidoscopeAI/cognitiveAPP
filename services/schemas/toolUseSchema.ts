import { Type } from "@google/genai";

export const toolUseSchema = [
    {
        name: "runDrugDiscovery",
        description: "Simulates a complete drug discovery pipeline for a given disease.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                disease: { type: Type.STRING, description: "The disease to target for drug discovery." },
            },
            required: ["disease"],
        },
    },
    {
        name: "runFinancialAnalysis",
        description: "Provides a detailed financial analysis for a given stock ticker.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                ticker: { type: Type.STRING, description: "The stock ticker symbol (e.g., AAPL, GOOGL)." },
            },
            required: ["ticker"],
        },
    },
    {
        name: "runPerformanceAnalysis",
        description: "Performs a performance analysis for a described software system.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                softwareDescription: { type: Type.STRING, description: "A description of the software system to analyze for performance." },
            },
            required: ["softwareDescription"],
        },
    },
    {
        name: "runSecurityAnalysis",
        description: "Performs a security analysis for a described software system.",
        parameters: {
            type: Type.OBJECT,
            properties: {
                softwareDescription: { type: Type.STRING, description: "A description of the software system to analyze for security." },
            },
            required: ["softwareDescription"],
        },
    },
];