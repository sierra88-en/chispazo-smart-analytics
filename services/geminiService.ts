
import { GoogleGenAI, Type } from "@google/genai";
import { DrawResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

/**
 * Uses Google Search grounding to find the most recent Chispazo results.
 * This bypasses CORS limitations by using the AI as a proxy/agent.
 */
export const syncLatestDraws = async () => {
  try {
    const prompt = `
      Find the most recent winning numbers for the Mexican "Chispazo" lottery (Lotería Nacional).
      Return ONLY a JSON array of objects representing the last 3 draws.
      Format: [{"CONCURSO": number, "FECHA": "DD/MM/YYYY", "R1": number, "R2": number, "R3": number, "R4": number, "R5": number}]
      Ensure the numbers are sorted from lowest to highest within each draw.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // Note: responseMimeType: "application/json" might be tricky with search, 
        // so we'll parse the text for a JSON block.
      }
    });

    const text = response.text || "";
    const jsonMatch = text.match(/\[.*\]/s);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
      title: chunk.web?.title || 'Fuente de Lotería',
      uri: chunk.web?.uri || '#'
    })) || [];

    if (jsonMatch) {
      try {
        const parsed = JSON.parse(jsonMatch[0]) as DrawResult[];
        return { data: parsed, sources };
      } catch (e) {
        console.error("Failed to parse AI JSON", e);
      }
    }
    
    return { data: null, sources, text };
  } catch (error) {
    console.error("Sync Error:", error);
    return { data: null, sources: [] };
  }
};

export const getAIInsights = async (recentDraws: DrawResult[], suggestedNumbers: number[]) => {
  try {
    const isMultiple = suggestedNumbers.length === 7;
    const prompt = `
      Act as a lottery statistician for the Mexican "Chispazo" lottery (5 numbers from 1 to 28).
      Recent historical results (last 5): ${JSON.stringify(recentDraws.slice(0, 5))}
      Suggested combination (${isMultiple ? 'Múltiple 7' : 'Sencilla'}): ${suggestedNumbers.join(', ')}
      
      ${isMultiple ? 'The user is playing a "Multiple 7" play, which covers 21 combinations of 5 numbers each.' : ''}

      Provide a brief, professional analytical insight in Spanish about why this combination might be strategically interesting. 
      Consider concepts like:
      - Distribution across zones (Baja 1-9, Media 10-19, Alta 20-28)
      - Parity (even/odd) balance
      - Historical frequency patterns (Hot/Cold balance)
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
