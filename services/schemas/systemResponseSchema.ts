import { Type } from "@google/genai";

export const systemResponseSchema = {
    type: Type.OBJECT,
    properties: {
        query: { type: Type.STRING },
        systemSummary: {
            type: Type.OBJECT,
            properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                components: { type: Type.ARRAY, items: { type: Type.STRING } },
            },
            required: ['title', 'description', 'components']
        },
        analysisInsights: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    theme: { type: Type.STRING },
                    description: { type: Type.STRING },
                    confidenceScore: { type: Type.NUMBER }
                },
                required: ['theme', 'description', 'confidenceScore']
            }
        },
        thoughtProcess: { type: Type.OBJECT, properties: { deconstruction: { type: Type.OBJECT, properties: { mainQuestion: { type: Type.STRING }, activatedNodes: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['mainQuestion', 'activatedNodes'] }, multiAngleAnalysis: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { perspective: { type: Type.STRING }, analysis: { type: Type.STRING }, contributingNodes: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['perspective', 'analysis', 'contributingNodes'] } }, riskRewardAssessment: { type: Type.OBJECT, properties: { risks: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { description: { type: Type.STRING }, associatedNodes: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['description', 'associatedNodes'] } }, rewards: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { description: { type: Type.STRING }, associatedNodes: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['description', 'associatedNodes'] } } }, required: ['risks', 'rewards'] }, synthesis: { type: Type.OBJECT, properties: { conclusion: { type: Type.STRING }, confidenceScore: { type: Type.NUMBER }, finalStateDescription: { type: Type.STRING } }, required: ['conclusion', 'confidenceScore', 'finalStateDescription'] } }, required: ['deconstruction', 'multiAngleAnalysis', 'riskRewardAssessment', 'synthesis'] },
        simulation: { type: Type.OBJECT, properties: { simulationSummary: { type: Type.STRING }, initialState: { type: Type.OBJECT, properties: { nodes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, label: { type: Type.STRING }, type: { type: Type.STRING }, position: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, z: { type: Type.NUMBER } }, required: ['x', 'y', 'z'] }, energy: { type: Type.NUMBER }, stress: { type: Type.NUMBER } }, required: ['id', 'label', 'type', 'position', 'energy', 'stress'] } }, connections: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { from: { type: Type.STRING }, to: { type: Type.STRING }, strength: { type: Type.NUMBER }, type: { type: Type.STRING } }, required: ['from', 'to', 'strength', 'type'] } } }, required: ['nodes', 'connections'] }, finalState: { type: Type.OBJECT, properties: { nodes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, label: { type: Type.STRING }, type: { type: Type.STRING }, position: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, z: { type: Type.NUMBER } }, required: ['x', 'y', 'z'] }, energy: { type: Type.NUMBER }, stress: { type: Type.NUMBER } }, required: ['id', 'label', 'type', 'position', 'energy', 'stress'] } }, connections: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { from: { type: Type.STRING }, to: { type: Type.STRING }, strength: { type: Type.NUMBER }, type: { type: Type.STRING } }, required: ['from', 'to', 'strength', 'type'] } } }, required: ['nodes', 'connections'] } }, required: ['initialState', 'finalState', 'simulationSummary'] }
    },
    required: ['query', 'systemSummary', 'analysisInsights', 'thoughtProcess', 'simulation']
};