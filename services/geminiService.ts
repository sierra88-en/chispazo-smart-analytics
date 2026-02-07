
import { GoogleGenAI, Type } from "@google/genai";
import { DrawResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getAIInsights = async (recentDraws: DrawResult[], suggestedNumbers: number[]) => {
  try {
    const prompt = `
      Act as a lottery statistician for the Mexican "Chispazo" lottery (5 numbers from 1 to 28).
      Recent historical results (last 5): ${JSON.stringify(recentDraws.slice(0, 5))}
      Suggested new combination: ${suggestedNumbers.join(', ')}
      
      Provide a brief, professional analytical insight in Spanish about why this combination might be strategically interesting. 
      Consider concepts like:
      - Distribution across zones (Baja 1-9, Media 10-19, Alta 20-28)
      - Parity (even/odd) balance
      - Historical frequency patterns
      Keep the response under 100 words.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        topP: 0.9,
      }
    });

    return response.text || "Análisis no disponible en este momento.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "No se pudo obtener el análisis de la IA.";
  }
};
