import { Type } from "@google/genai";

export const softwareMimicrySchema = {
    type: Type.OBJECT,
    properties: {
        analyzedSoftware: { type: Type.STRING },
        decompileSummary: { type: Type.OBJECT, properties: { totalFiles: { type: Type.INTEGER }, languages: { type: Type.ARRAY, items: { type: Type.STRING } }, files: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { path: { type: Type.STRING }, language: { type: Type.STRING }, lineCount: { type: Type.INTEGER } }, required: ['path', 'language', 'lineCount'] } } }, required: ['totalFiles', 'languages', 'files'] },
        architectureAnalysis: { type: Type.OBJECT, properties: { style: { type: Type.STRING }, components: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, description: { type: Type.STRING }, type: { type: Type.STRING } }, required: ['name', 'description', 'type'] } }, dataFlow: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['style', 'components', 'dataFlow'] },
        reconstructionPlan: { type: Type.OBJECT, properties: { summary: { type: Type.STRING }, components: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { originalComponent: { type: Type.STRING }, improvement: { type: Type.STRING }, newFeatures: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['originalComponent', 'improvement', 'newFeatures'] } } }, required: ['summary', 'components'] },
        interactivePreview: { type: Type.OBJECT, properties: { description: { type: Type.STRING }, elements: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, type: { type: Type.STRING }, label: { type: Type.STRING }, description: { type: Type.STRING } }, required: ['id', 'type', 'label', 'description'] } } }, required: ['description', 'elements'] },
        performanceAnalysis: {
            type: Type.OBJECT,
            properties: {
                bottlenecks: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: { type: Type.STRING },
                            severity: { type: Type.STRING },
                        },
                        required: ['description', 'severity']
                    }
                },
                optimizations: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: { type: Type.STRING },
                            impact: { type: Type.STRING },
                        },
                        required: ['description', 'impact']
                    }
                },
                summary: { type: Type.STRING },
            },
            required: ['bottlenecks', 'optimizations', 'summary']
        },
        securityAnalysis: {
            type: Type.OBJECT,
            properties: {
                vulnerabilities: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: { type: Type.STRING },
                            severity: { type: Type.STRING },
                        },
                        required: ['description', 'severity']
                    }
                },
                recommendations: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            description: { type: Type.STRING },
                            impact: { type: Type.STRING },
                        },
                        required: ['description', 'impact']
                    }
                },
                summary: { type: Type.STRING },
            },
            required: ['vulnerabilities', 'recommendations', 'summary']
        }
    },
    required: ['analyzedSoftware', 'decompileSummary', 'architectureAnalysis', 'reconstructionPlan', 'interactivePreview', 'performanceAnalysis', 'securityAnalysis']
};