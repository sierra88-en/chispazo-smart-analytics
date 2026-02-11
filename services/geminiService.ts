
import { GoogleGenAI, Type } from "@google/genai";
import { DrawResult, SavedTicket } from "../types";

export const syncLatestDraws = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = `
      Analiza los resultados reales del Chispazo mexicano.
      Sorteo #11820 (Clásico): 1, 15, 17, 24, 27.
      Sorteo #11819 (De las Tres): 3, 5, 14, 15, 22.
      Retorna SOLAMENTE un arreglo JSON con los últimos 5 sorteos actualizados.
      Formato: [{"CONCURSO": number, "FECHA": "DD/MM/YYYY", "R1": number, "R2": number, "R3": number, "R4": number, "R5": number}]
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: { tools: [{ googleSearch: {} }] }
    });
    const text = response.text || "";
    const jsonMatch = text.match(/\[.*\]/s);
    if (jsonMatch) {
      try { return { data: JSON.parse(jsonMatch[0]) as DrawResult[] }; }
      catch (e) { console.error("Failed to parse AI JSON", e); }
    }
    return { data: null };
  } catch (error) {
    console.error("Sync Error:", error);
    return { data: null };
  }
};

export const getAIInsights = async (recentDraws: DrawResult[], suggestedNumbers: number[], roi?: number) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = `
      Actúa como el motor QUANTUM-GOD-X.
      Analiza la Resonancia Probabilística post-sorteo 11820 (Resultado: 01, 15, 17, 24, 27).
      Jugada generada: ${suggestedNumbers.join(', ')}
      ROI Proyectado: ${roi ? roi.toFixed(2) + '%' : 'Calculando...'}
      Contexto: El clúster 15-17 está en máxima resonancia. El nodo 1 ha retornado tras purga. 
      Proporciona un veredicto técnico sobre cómo esta combinación captura la inercia del sorteo #11820.
      Usa tono elite científico, máx 60 palabras. Habla de 'Veta de Oro' y 'Resonancia Magnética'.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.9 }
    });
    return response.text || "Convergencia cuántica absoluta detectada. Inercia clúster 15-17 activada.";
  } catch (error) {
    return "Fallo en la convergencia cuántica. Reintentar balanceo.";
  }
};

export const getTicketAdjustment = async (ticket: SavedTicket, lastResult: DrawResult) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = `
      Ajuste de Puntería Cuántica (Protocolo QUANTUM-GOD-X).
      Ticket auditado: ${ticket.numbers.join(', ')}.
      Resultado Sorteo 11820: 01, 15, 17, 24, 27.
      Instrucción: Evaluar la efectividad del ticket sobre el clúster ganador 15-17-24. 
      Sugiere rotación de simetría para el sorteo de mañana a las 3:00 PM basada en la inercia térmica actual.
      Responde en español, tono elite científico, máx 80 palabras.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: { temperature: 0.8 }
    });
    return response.text || "Ejecutar re-balanceo de inercia inmediato.";
  } catch (error) {
    return "Error en cálculo de ajuste de precisión.";
  }
};
