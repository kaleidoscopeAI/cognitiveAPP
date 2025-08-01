import { Type } from "@google/genai";

export const chatResponseSchema = {
    type: Type.OBJECT, properties: { response: { type: Type.STRING }, cubeState: { type: Type.OBJECT, properties: { nodes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { id: { type: Type.STRING }, label: { type: Type.STRING }, type: { type: Type.STRING }, position: { type: Type.OBJECT, properties: { x: { type: Type.NUMBER }, y: { type: Type.NUMBER }, z: { type: Type.NUMBER } }, required: ['x', 'y', 'z'] }, energy: { type: Type.NUMBER }, stress: { type: Type.NUMBER } }, required: ['id', 'label', 'type', 'position', 'energy', 'stress'] } }, connections: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { from: { type: Type.STRING }, to: { type: Type.STRING }, strength: { type: Type.NUMBER }, type: { type: Type.STRING } }, required: ['from', 'to', 'strength', 'type'] } } }, required: ['nodes', 'connections'] } },
    required: ['response', 'cubeState']
};