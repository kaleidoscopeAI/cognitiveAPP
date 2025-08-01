import { Type } from "@google/genai";

export const drugResponseSchema = {
    type: Type.OBJECT,
    properties: {
        disease: { type: Type.STRING },
        pipeline: {
            type: Type.OBJECT,
            properties: {
                targetValidation: {
                    type: Type.OBJECT,
                    properties: {
                        validationScore: { type: Type.NUMBER },
                        supportingEvidence: { 
                            type: Type.ARRAY, 
                            items: { 
                                type: Type.OBJECT,
                                properties: {
                                    type: { type: Type.STRING },
                                    description: { type: Type.STRING },
                                    score: { type: Type.NUMBER }
                                },
                                required: ['type', 'description', 'score']
                             } 
                        },
                        laymanSummary: { type: Type.STRING },
                        targetInfo: {
                            type: Type.OBJECT,
                            properties: {
                                name: { type: Type.STRING },
                                gene: { type: Type.STRING },
                                function: { type: Type.STRING }
                            },
                            required: ['name', 'gene', 'function']
                        }
                    },
                    required: ['validationScore', 'supportingEvidence', 'laymanSummary', 'targetInfo']
                },
                virtualScreening: {
                    type: Type.OBJECT,
                    properties: {
                        librarySize: { type: Type.INTEGER },
                        hitsFound: { type: Type.INTEGER },
                        hitRate: { type: Type.NUMBER },
                        laymanSummary: { type: Type.STRING },
                    },
                    required: ['librarySize', 'hitsFound', 'hitRate', 'laymanSummary']
                },
                leadCompound: {
                    type: Type.OBJECT,
                    properties: { name: { type: Type.STRING }, smiles: { type: Type.STRING }, molecularWeight: { type: Type.NUMBER }, logP: { type: Type.NUMBER }, tpsa: { type: Type.NUMBER }, hBondDonors: { type: Type.INTEGER }, hBondAcceptors: { type: Type.INTEGER }, rotatableBonds: { type: Type.INTEGER }, drugLikeness: { type: Type.NUMBER }, synthesisScore: { type: Type.NUMBER } },
                    required: ['name', 'smiles', 'molecularWeight', 'logP', 'tpsa', 'hBondDonors', 'hBondAcceptors', 'rotatableBonds', 'drugLikeness', 'synthesisScore']
                },
                admetProfile: {
                    type: Type.OBJECT,
                    properties: {
                        absorption: { type: Type.NUMBER },
                        distribution: { type: Type.NUMBER },
                        metabolism: { type: Type.NUMBER },
                        excretion: { type: Type.NUMBER },
                        toxicity: { type: Type.NUMBER },
                        toxicityBreakdown: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    type: { type: Type.STRING },
                                    risk: { type: Type.STRING }
                                },
                                required: ['type', 'risk']
                            }
                        }
                    },
                    required: ['absorption', 'distribution', 'metabolism', 'excretion', 'toxicity', 'toxicityBreakdown']
                },
                 dockingResult: {
                    type: Type.OBJECT,
                    properties: {
                        bindingAffinity: { type: Type.NUMBER },
                        ligandEfficiency: { type: Type.NUMBER },
                        bindingSite: { type: Type.OBJECT, properties: { name: { type: Type.STRING }, keyResidues: { type: Type.ARRAY, items: { type: Type.STRING } } }, required: ['name', 'keyResidues']},
                        keyInteractions: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { type: Type.STRING, residue: Type.STRING, distance: Type.NUMBER }, required: ['type', 'residue', 'distance'] } }
                    },
                    required: ['bindingAffinity', 'ligandEfficiency', 'bindingSite', 'keyInteractions']
                },
                mechanismOfAction: {
                    type: Type.OBJECT,
                    properties: {
                        summary: { type: Type.STRING },
                        bindingType: { type: Type.STRING },
                        downstreamEffects: { type: Type.ARRAY, items: { type: Type.STRING } }
                    },
                    required: ['summary', 'bindingType', 'downstreamEffects']
                },
                preclinicalTrials: {
                    type: Type.OBJECT,
                    properties: {
                        inVitroStudies: {
                            type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    assay: { type: Type.STRING },
                                    result: { type: Type.STRING },
                                    efficacy: { type: Type.NUMBER }
                                },
                                required: ['assay', 'result', 'efficacy']
                            }
                        },
                        inVivoStudies: {
                             type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    model: { type: Type.STRING },
                                    outcome: { type: Type.STRING },
                                    safetyMargin: { type: Type.NUMBER }
                                },
                                required: ['model', 'outcome', 'safetyMargin']
                            }
                        },
                        biomarkerAnalysis: {
                             type: Type.ARRAY,
                            items: {
                                type: Type.OBJECT,
                                properties: {
                                    biomarker: { type: Type.STRING },
                                    change: { type: Type.STRING },
                                    significance: { type: Type.NUMBER }
                                },
                                required: ['biomarker', 'change', 'significance']
                            }
                        },
                        overallSuccessProbability: { type: Type.NUMBER },
                        laymanSummary: { type: Type.STRING }
                    },
                    required: ['inVitroStudies', 'inVivoStudies', 'biomarkerAnalysis', 'overallSuccessProbability', 'laymanSummary']
                },
                synthesisPathway: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: { step: { type: Type.INTEGER }, reactionType: { type: Type.STRING }, reactants: { type: Type.ARRAY, items: { type: Type.STRING } }, reagents: { type: Type.ARRAY, items: { type: Type.STRING } }, product: { type: Type.STRING }, yieldPercentage: { type: Type.NUMBER }, laymanSummary: {type: Type.STRING}},
                        required: ['step', 'reactionType', 'reactants', 'reagents', 'product', 'yieldPercentage', 'laymanSummary']
                    }
                },
                 laymanSummary: { type: Type.STRING }
            },
            required: ['targetValidation', 'virtualScreening', 'leadCompound', 'admetProfile', 'dockingResult', 'mechanismOfAction', 'preclinicalTrials', 'synthesisPathway', 'laymanSummary']
        },
        generatedCompounds: {
            type: Type.ARRAY,
            items: {
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
            }
        }
    },
    required: ['disease', 'pipeline', 'generatedCompounds']
};