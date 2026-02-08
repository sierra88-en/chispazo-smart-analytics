
import { GoogleGenAI, Type } from "@google/genai";
import { DrawResult, SavedTicket } from "../types";

export const syncLatestDraws = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = `
      Find the most recent winning numbers for the Mexican "Chispazo" lottery (Lotería Nacional).
      Return ONLY a JSON array of objects representing the last 3 draws.
      Format: [{"CONCURSO": number, "FECHA": "DD/MM/YYYY", "R1": number, "R2": number, "R3": number, "R4": number, "R5": number}]
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });
    const text = response.text || "";
    const jsonMatch = text.match(/\[.*\]/s);
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map(chunk => ({
      title: chunk.web?.title || 'Fuente de Lotería',
      uri: chunk.web?.uri || '#'
    })) || [];
    if (jsonMatch) {
      try { return { data: JSON.parse(jsonMatch[0]) as DrawResult[], sources }; }
      catch (e) { console.error("Failed to parse AI JSON", e); }
    }
    return { data: null, sources, text };
  } catch (error) {
    console.error("Sync Error:", error);
    return { data: null, sources: [] };
  }
};

export const getAIInsights = async (recentDraws: DrawResult[], suggestedNumbers: number[], roi?: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const isMultiple = suggestedNumbers.length === 7;
    const prompt = `
      Actúa como un Optimizador de Probabilidad Cuántica de Nivel Dios.
      Analiza esta jugada Múltiple 7 de Chispazo: ${suggestedNumbers.join(', ')}
      ROI Histórico detectado: ${roi ? roi.toFixed(2) + '%' : 'Calculando...'}
      Últimos sorteos analizados: ${JSON.stringify(recentDraws.slice(0, 2))}
      Criterio estricto: Priorizar ROI entre -15% y -25% (Veta de Oro).
      Valida si la combinación presenta "Alta Inercia" (hits de 2do lugar recientes en ventana de 200 sorteos).
      Proporciona un veredicto técnico y motivador.
      Máximo 60 palabras. Tono: Elite Científico.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.8 }
    });
    return response.text || "Análisis de nivel cuántico no disponible.";
  } catch (error) {
    return "Error en la convergencia de datos cuánticos.";
  }
};

export const getTicketAdjustment = async (ticket: SavedTicket, lastResult: DrawResult) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = `
      Ajuste de Estrategia Chispazo (Modo Optimizador Cuántico Nivel Dios).
      Jugada: ${ticket.numbers.join(', ')}
      Último Resultado: ${lastResult.R1}, ${lastResult.R2}, ${lastResult.R3}, ${lastResult.R4}, ${lastResult.R5}
      Analiza si la jugada mantiene su inercia de veta de oro. 
      Sugiere cambios quirúrgicos para mantenerse en el dulce ROI de -20%.
      Responde en español, máximo 80 palabras.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.9 }
    });
    return response.text || "Sin sugerencias de ajuste.";
  } catch (error) {
    return "Error al calcular el ajuste de precisión.";
  }
};
