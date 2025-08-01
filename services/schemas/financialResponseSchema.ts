import { Type } from "@google/genai";

export const financialResponseSchema = {
    type: Type.OBJECT,
    properties: {
        ticker: { type: Type.STRING },
        companyName: { type: Type.STRING },
        prediction: {
            type: Type.OBJECT,
            properties: {
                thesis: { type: Type.STRING },
                priceTarget: { type: Type.NUMBER },
                timeframe: { type: Type.STRING },
                confidence: { type: Type.NUMBER },
            },
            required: ['thesis', 'priceTarget', 'timeframe', 'confidence']
        },
        technicalAnalysis: {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING },
                indicators: {
                    type: Type.OBJECT,
                    properties: {
                        rsi: { type: Type.NUMBER },
                        macd: { type: Type.NUMBER },
                        macdSignal: { type: Type.NUMBER },
                        sma50: { type: Type.NUMBER },
                        sma200: { type: Type.NUMBER },
                    },
                    required: ['rsi', 'macd', 'macdSignal', 'sma50', 'sma200']
                },
            },
            required: ['summary', 'indicators']
        },
        fundamentalAnalysis: {
            type: Type.OBJECT,
            properties: {
                summary: { type: Type.STRING },
                peRatio: { type: Type.NUMBER },
                revenueGrowth: { type: Type.NUMBER },
                strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['summary', 'peRatio', 'revenueGrowth', 'strengths', 'weaknesses']
        },
        priceHistory: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    date: { type: Type.STRING, description: "Date in YYYY-MM-DD format" },
                    open: { type: Type.NUMBER },
                    high: { type: Type.NUMBER },
                    low: { type: Type.NUMBER },
                    close: { type: Type.NUMBER },
                },
                required: ['date', 'open', 'high', 'low', 'close']
            }
        },
        algorithmicStrategy: {
            type: Type.OBJECT,
            properties: {
                strategyName: { type: Type.STRING },
                performanceMetrics: {
                    type: Type.OBJECT,
                    properties: {
                        cagr: { type: Type.NUMBER },
                        sharpeRatio: { type: Type.NUMBER },
                        maxDrawdown: { type: Type.NUMBER },
                        volatility: { type: Type.NUMBER },
                    },
                    required: ['cagr', 'sharpeRatio', 'maxDrawdown', 'volatility']
                },
                trades: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            date: { type: Type.STRING },
                            type: { type: Type.STRING },
                            price: { type: Type.NUMBER },
                            quantity: { type: Type.NUMBER },
                        },
                        required: ['date', 'type', 'price', 'quantity']
                    }
                },
                summary: { type: Type.STRING },
            },
            required: ['strategyName', 'performanceMetrics', 'trades', 'summary']
        }
    },
    required: ['ticker', 'companyName', 'prediction', 'technicalAnalysis', 'fundamentalAnalysis', 'priceHistory']
};