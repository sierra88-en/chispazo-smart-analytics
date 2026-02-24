
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { DrawResult, SavedTicket } from "../types";

export const getDeepQuantumAnalysis = async (recentDraws: DrawResult[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = `
      SISTEMA: QUANTUM-GOD-X DEEP THINKING MODE.
      CONTEXTO: Sorteo Chispazo Clásico 21:15 (Hoy 23 de Febrero).
      ÚLTIMOS RESULTADOS: ${JSON.stringify(recentDraws.slice(0, 10))}
      
      INSTRUCCIÓN: Realiza un análisis exhaustivo de la inercia térmica y resonancia de clústeres.
      Determina la combinación de 7 números (Múltiple 7) con mayor probabilidad de éxito para el sorteo de hoy a las 9 PM.
      Explica la lógica matemática detrás de la selección (frecuencias, vacíos probabilísticos, saltos cuánticos).
      
      RETORNA:
      1. La combinación sugerida.
      2. Justificación técnica detallada.
      Usa tono elite científico.
    `;
    const response = await ai.models.generateContent({
      model: 'gemini-3.1-pro-preview',
      contents: prompt,
      config: { 
        thinkingConfig: { thinkingLevel: ThinkingLevel.HIGH }
      }
    });
    return response.text || "Error en la convergencia de pensamiento profundo.";
  } catch (error) {
    console.error("Deep Analysis Error:", error);
    return "Fallo en el motor de pensamiento profundo. Reintentar sincronización.";
  }
};

export const syncLatestDraws = async () => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const prompt = `
      Analiza los resultados reales del Chispazo mexicano.
      Sorteo #11845 (Clásico): 5, 14, 18, 24, 25.
      Sorteo #11844 (De las Tres): 6, 13, 23, 24, 25.
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
      Analiza la Resonancia Probabilística post-sorteo 11845 (Resultado: 05, 14, 18, 24, 25).
      Jugada generada: ${suggestedNumbers.join(', ')}
      ROI Proyectado: ${roi ? roi.toFixed(2) + '%' : 'Calculando...'}
      Contexto: El clúster 05-14-24 está en máxima resonancia. 
      Proporciona un veredicto técnico sobre cómo esta combinación captura la inercia del sorteo #11845.
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
      Resultado Sorteo 11845: 05, 14, 18, 24, 25.
      Instrucción: Evaluar la efectividad del ticket sobre el clúster ganador 05-14-24. 
      Sugiere rotación de simetría para el sorteo de mañana basada en la inercia térmica actual.
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
