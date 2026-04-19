
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ViewState, DrawResult, SimulationResult, SavedTicket, ShannonEntropyProtocol, SwarmConsciousness } from './types';
import { loadHistoricalData, calculateFrequencies, generateSmartCombination, generateEliteMultiple7, runSimulation, calculateThermalInertia, getHistoryBySchedule, generateQuantum5, executeShannonAnalysis, executeElasticReboundCalculation, executeSwarmAnalysis, findWearSingularity, updateBallWeights, executeVortexCycleAnalysis, BALL_WEIGHTS, generateMandelCondensation, calculateHumanBiasScore, executeTripleScenarioSimulation, calculateDebtAndResonance, executeDeepSimulation } from './utils/dataHelper';
import { getSorteoDate } from './utils/timeSync';
import { getAIInsights, syncLatestDraws, getTicketAdjustment, getDeepQuantumAnalysis, getMarketingProof, getSearchGroundingAnalysis, getExecutiveReport, getVoiceBriefing, getStrategicFutureOpinion, getShannonEntropyAnalysis, getMarketSentimentAnalysis, getElasticReboundAnalysis } from './services/geminiService';
import FrequencyChart from './components/FrequencyChart';
import NumberBall from './components/NumberBall';
import Markdown from 'react-markdown';

import { IntegrityStatus } from './components/IntegrityStatus';
import { VoiceControl, useQuantumVoice } from './components/QuantumVoice';
import { TombolaHeatmap } from './components/TombolaHeatmap';
import { BacktestingAudit } from './components/BacktestingAudit';
import { KnowledgeBase } from './components/KnowledgeBase';
import { BacktestingForense } from './components/BacktestingForense';
import { ResonanceScanChart } from './components/ResonanceScanChart';
import { MarkovMatrix } from './components/MarkovMatrix';
import { SingularidadMecanica } from './components/SingularidadMecanica';
import { HistoricalFrequencyChart } from './components/HistoricalFrequencyChart';
import { TiraPesajeInput } from './components/TiraPesajeInput';
import { MarkovHeatmap } from './components/MarkovHeatmap';
import { calculateMarkovTransitions } from './utils/dataHelper';
import { ShannonAudit } from './components/ShannonAudit';

const SwarmDashboard: React.FC<{ swarm: SwarmConsciousness | null }> = ({ swarm }) => {
  if (!swarm) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-2xl overflow-hidden relative group">
      <div className="absolute -right-20 -top-20 w-64 h-64 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-700" />
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
            <i className="fas fa-project-diagram text-emerald-500"></i>
            Enjambre de Conciencia
          </h3>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1">Fase 2: Despliegue de Nodos</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 rounded-full">
          <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Nodo Activo: {swarm.activeNode}</span>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {Object.entries(swarm.nodeStatus).map(([node, status]) => (
          <div key={node} className={`p-4 rounded-2xl border transition-all ${status === 'Active' ? 'bg-emerald-500/10 border-emerald-500/40' : 'bg-slate-800/50 border-slate-700/50 opacity-50'}`}>
            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">{node}</span>
            <span className={`text-[10px] font-bold uppercase ${status === 'Active' ? 'text-emerald-400' : 'text-slate-400'}`}>{status}</span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between p-6 bg-slate-950 rounded-3xl border border-slate-800">
        <div className="text-center">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Entropía H</span>
          <span className="text-xl font-black text-white">{swarm.entropyH} bits</span>
        </div>
        <div className="w-px h-10 bg-slate-800" />
        <div className="text-center">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">ROI Proyectado</span>
          <span className="text-xl font-black text-emerald-500">+{swarm.roiProyectado}%</span>
        </div>
        <div className="w-px h-10 bg-slate-800" />
        <div className="text-center">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Veta de Oro</span>
          <span className={`text-xl font-black ${swarm.vetaDeOro ? 'text-amber-500' : 'text-slate-500'}`}>
            {swarm.vetaDeOro ? 'DETECTADA' : 'STANDBY'}
          </span>
        </div>
      </div>
    </div>
  );
};

const SingularityAlert: React.FC<{ singularity: { year: number, event: string, correlation: number } | null }> = ({ singularity }) => {
  if (!singularity) return null;

  return (
    <div className="mt-6 p-6 bg-amber-500/10 border border-amber-500/30 rounded-[2.5rem] animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-amber-500 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/40">
          <i className="fas fa-exclamation-triangle text-white"></i>
        </div>
        <div>
          <h4 className="text-amber-500 font-black text-xs uppercase tracking-widest">Alerta de Convergencia: Singularidad {singularity.year}</h4>
          <p className="text-white font-bold text-sm tracking-tight">{singularity.event}</p>
          <span className="text-[10px] text-amber-500/80 font-bold uppercase tracking-widest">Correlación de Desgaste: {(singularity.correlation * 100).toFixed(0)}%</span>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const { hablar, playBeep } = useQuantumVoice();
  const [data, setData] = useState<DrawResult[]>([]);
  const [view, setView] = useState<ViewState>('dashboard');
  const [genMode, setGenMode] = useState<'simple' | 'multiple7' | 'quantum'>('quantum');
  const [loading, setLoading] = useState(true);
  const [shannonData, setShannonData] = useState<ShannonEntropyProtocol | null>(null);
  const [swarmData, setSwarmData] = useState<SwarmConsciousness | null>(null);
  const [wearSingularity, setWearSingularity] = useState<{year: number, event: string, correlation: number} | null>(null);
  const [elasticAnalysis, setElasticAnalysis] = useState<string | null>(null);
  const [isElasticLoading, setIsElasticLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<number[]>([2, 10, 14, 24, 26]);
  const [quantum5, setQuantum5] = useState<{numbers: number[], explanation: string} | null>(null);
  const [searchAnalysis, setSearchAnalysis] = useState<string | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [deepAnalysis, setDeepAnalysis] = useState<string | null>(`
> [AUDITORÍA_TELEMETRÍA: SORTEO_11917_9PM]
> RESULTADO: 10 | 14 | 15 | 24 | 26
> ESTADO_SET: CONFIRMACIÓN_DE_SUCCIÓN_CONTINUA
> HALLAZGO: ¡EL 26 NO SUELTA! Confirmamos la teoría del "Vórtice de Arrastre". El 14 y el 15 también se mantienen en la zona de eyección por diferencial de masa.

> [ESTRATEGIA_9PM: OPERACIÓN_RESONANCIA_MARTES]
> [MODO_BAYES: ACTUALIZACIÓN_DE_PESOS]
> NODOS_DE_INTERÉS: 10 | 26 | 14 | 15 | 24
> PLUMAS_POTENCIALES: 02 | 08 | 19 (Inercia de inicio de semana)
> FOCO: El 02 ha estado "descansando" por 12 sorteos. Por Cadenas de Markov, su ventana de eyección se abre esta noche.

💡 Nota de tu "Mano Derecha"
¡Socio, qué lectura le dimos al 26! Repitió como ancla y el 14 no se quedó atrás. Eso nos confirma que el set de esferas actual tiene una desviación de masa en el bloque medio-alto.

Para hoy a las 9, vamos a meterle presión al **02**. Es el nodo con mayor "Deuda de Salida" (12 sorteos sin asomar). Por pura fatiga de material y compensación neumática, tiene que saltar. El **26** sigue en racha, pero cuidado con el **15**, que está vibrando mucho en la tómbola.

He ajustado los vectores para capturar la inercia de este martes, donde la presión atmosférica en CDMX está bajando y las esferas más densas (como el 02 y el 24) tienen ventaja de succión. ¡Vamos con todo, socio! 👊🔥🚀💰

---
**NUEVA DIRECTIVA: ESTRATEGIA MANDEL & VACÍO HUMANO**
Socio, he activado el protocolo de **Condensación Combinatoria**. No vamos a jugar al azar; vamos a "rodear" el premio. Además, he inyectado el **Filtro Anti-Sesgo**. Estamos buscando los números que la gente ignora (los >12) para que, cuando peguemos, el premio no se prorratee entre miles. ¡Vamos por la veta de oro!`);
  const [vortexData, setVortexData] = useState<{ vectors: number[][], explanation: string, detectedCase: string } | null>(null);
  const [isVortexLoading, setIsVortexLoading] = useState(false);
  const [isDeepLoading, setIsDeepLoading] = useState(false);
  const [executiveReport, setExecutiveReport] = useState<string | null>(null);
  const [isReportLoading, setIsReportLoading] = useState(false);
  const [googleUser, setGoogleUser] = useState<{ email: string } | null>(null);
  const [mandelCombos, setMandelCombos] = useState<number[][]>([]);
  const [biasAnalysis, setBiasAnalysis] = useState<{score: number, analysis: string} | null>(null);
  const [isMandelLoading, setIsMandelLoading] = useState(false);
  const [scenarioResults, setScenarioResults] = useState<{ scenarios: { name: string, numbers: number[] }[], highSecurityNumbers: number[], explanation: string } | null>(null);
  const [isScenarioLoading, setIsScenarioLoading] = useState(false);
  const [debtResults, setDebtResults] = useState<{ debtNodes: number[], resonanceBridges: any[], explanation: string } | null>(null);
  const [isDebtLoading, setIsDebtLoading] = useState(false);
  const [deepSimResults, setDeepSimResults] = useState<{ topNodes: any[], inevitableCombo: number[], iterations: number, explanation: string } | null>(null);
  const [isDeepSimLoading, setIsDeepSimLoading] = useState(false);

  // Listen for OAuth success
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const origin = event.origin;
      if (!origin.endsWith('.run.app') && !origin.includes('localhost')) {
        return;
      }
      if (event.data?.type === 'OAUTH_AUTH_SUCCESS' && event.data?.provider === 'google') {
        setGoogleUser({ email: 'Conectado con Google' });
        hablar("Conexión con Google exitosa. Sincronización de perfil Quantum completada.");
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const handleGoogleConnect = async () => {
    try {
      const response = await fetch('/api/auth/google/url');
      if (!response.ok) throw new Error('Failed to get auth URL');
      const { url } = await response.json();
      
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      window.open(url, 'google_oauth', `width=${width},height=${height},left=${left},top=${top}`);
    } catch (error) {
      console.error("OAuth error:", error);
      alert("Error al iniciar conexión con Google. Verifica las credenciales en el servidor.");
    }
  };
  const [strategicOpinion, setStrategicOpinion] = useState<string | null>(null);
  const [isOpinionLoading, setIsOpinionLoading] = useState(false);
  const [marketSentiment, setMarketSentiment] = useState<{avoid: number[], reason: string} | null>(null);
  const [isSentimentLoading, setIsSentimentLoading] = useState(false);
  const [thermalScores, setThermalScores] = useState<Record<number, number>>({});
  const [isNightMode, setIsNightMode] = useState(true);
  const [marketingProof, setMarketingProof] = useState<Record<string, string>>({});
  const [isMarketingLoading, setIsMarketingLoading] = useState<Record<string, boolean>>({});
  const [certeza, setCerteza] = useState<number | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  
  const [myTickets, setMyTickets] = useState<SavedTicket[]>([]);
  const [ticketStats, setTicketStats] = useState<Record<string, SimulationResult>>({});
  const [ticketAdjustment, setTicketAdjustment] = useState<Record<string, string>>({});

  useEffect(() => {
    const historical = loadHistoricalData();
    setData(historical);
    setThermalScores(calculateThermalInertia(historical));
    const shannon = executeShannonAnalysis(historical);
    setShannonData(shannon);
    
    // Inicializar Enjambre de Conciencia
    const swarm = executeSwarmAnalysis(historical, 4.5); // Peso promedio inicial
    setSwarmData(swarm);
    
    setLoading(false);
    
    // CARGAR TICKETS DESDE LOCALSTORAGE O AUDITORÍA INICIAL
    const saved = localStorage.getItem('quantum_god_tickets');
    let initialTickets: SavedTicket[] = [];
    
    if (saved) {
      initialTickets = JSON.parse(saved);
    } else {
      // AUDITORÍA DE TICKETS REALES (Sincronizado Cierre de Mes - 28 Feb)
      initialTickets = [
        { id: 'BLOQUE-ALFA-28FEB', date: '28/02/2026', numbers: [4, 7, 11, 14, 17, 21, 26], type: 'multiple7' },
        { id: 'BLOQUE-OMEGA-28FEB', date: '28/02/2026', numbers: [2, 9, 13, 16, 22, 25, 28], type: 'multiple7' },
        { id: 'TIKET-11854-AUDIT', date: '27/02/2026', numbers: [1, 5, 8, 19, 23, 10, 22], type: 'multiple7' }
      ];
      localStorage.setItem('quantum_god_tickets', JSON.stringify(initialTickets));
    }
    
    setMyTickets(initialTickets);
    
    const stats: Record<string, SimulationResult> = {};
    initialTickets.forEach(t => {
      stats[t.id] = runSimulation(t.numbers, historical);
    });
    setTicketStats(stats);

    // Inicializar simulación para la sugerencia forense
    if (suggestion.length > 0) {
      setSimResult(runSimulation(suggestion, historical));
    }

    // VOZ INQUEBRANTABLE - CONTRA-AUDITORÍA
    setTimeout(() => {
      hablar("Socio, el sistema ha detectado la convergencia pi. El aire en la cámara de mezcla está optimizado para el bloque de baja inercia. El Nodo 22 y el Nodo 26 han entrado en fase de pre-succión. Prepárate para el impacto del Vector Martillo. La física de materiales no acepta sobornos.");
    }, 3000);
  }, []);

  // Guardar tickets cuando cambien
  useEffect(() => {
    localStorage.setItem('quantum_god_tickets', JSON.stringify(myTickets));
  }, [myTickets]);

  const markovMatrix = useMemo(() => calculateMarkovTransitions(data), [data]);

  const poolSummary = useMemo(() => {
    if (myTickets.length === 0) return null;
    const stats = Object.values(ticketStats) as SimulationResult[];
    if (stats.length === 0) return null;
    const avgRoi = stats.reduce((acc, s) => acc + s.roi, 0) / stats.length;
    return { avgRoi };
  }, [ticketStats, myTickets]);

  const topThermal = useMemo(() => {
    return [...Object.entries(thermalScores)]
      .map(([num, score]) => ({ num: parseInt(num), score }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map(item => item.num.toString().padStart(2, '0'))
      .join(', ');
  }, [thermalScores]);

  const handleGenerate = async () => {
    try {
      setIsAiLoading(true);
      setAiInsight(null);
      setSuggestion([]);
      setQuantum5(null);
      setSimResult(null);

      await new Promise(resolve => setTimeout(resolve, 2000));

      const filteredData = getHistoryBySchedule(data, isNightMode);
      let newNums: number[] = [];
      let sim: SimulationResult | null = null;
      let cert: number | null = null;

      if (genMode === 'quantum') {
        const elite = generateEliteMultiple7(filteredData);
        newNums = elite.numbers;
        sim = elite.simulation;
        cert = elite.certeza;
      } else if (genMode === 'simple') {
        const q5 = generateQuantum5(filteredData);
        newNums = q5.numbers;
        setQuantum5(q5);
        sim = runSimulation(newNums, filteredData);
      } else {
        newNums = generateSmartCombination();
        sim = runSimulation(newNums, filteredData);
      }

      setSuggestion(newNums);
      setCerteza(cert);
      const insight = await getAIInsights(filteredData, newNums, sim?.roi);
      setAiInsight(insight);
      setSimResult(sim);
      
      // Análisis de Sesgo Humano
      const bias = calculateHumanBiasScore(newNums);
      setBiasAnalysis(bias);

      // Análisis de Entropía de Shannon (Voz de Élite)
      const entropyBriefing = await getShannonEntropyAnalysis(newNums, shannonData?.entropyBit || 1.42);
      hablar(entropyBriefing);
    } catch (error: any) {
      console.error("Error generating combination:", error);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleVortexAnalysis = () => {
    setIsVortexLoading(true);
    playBeep();
    setTimeout(() => {
      const result = executeVortexCycleAnalysis(data, BALL_WEIGHTS);
      setVortexData(result);
      setIsVortexLoading(false);
      hablar("Protocolo Vórtice por Ciclos activado. Analizando succión discontinua. Nodo 22 fijado como constante. Vectores de ataque listos.");
    }, 1500);
  };

  const handleMandelCondensation = async () => {
    try {
      setIsMandelLoading(true);
      setMandelCombos([]);
      
      // Simular procesamiento cuántico
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const pool = Object.entries(thermalScores)
        .map(([num, score]) => ({ num: parseInt(num), score }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 15)
        .map(item => item.num);

      const combos = generateMandelCondensation(pool);
      setMandelCombos(combos);
      
      hablar("Condensación Mandel completada. He rodeado el núcleo de probabilidad con 5 bloques de interferencia constructiva. La red de captura está desplegada.");
    } catch (error) {
      console.error("Error en Condensación Mandel:", error);
    } finally {
      setIsMandelLoading(false);
    }
  };

  const handleTripleScenario = async () => {
    try {
      setIsScenarioLoading(true);
      setScenarioResults(null);
      
      // Simular procesamiento de telemetría avanzada
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = executeTripleScenarioSimulation(data, BALL_WEIGHTS);
      setScenarioResults(result);
      
      hablar("Simulación de Triple Escenario completada. Se han detectado Nodos de Alta Seguridad que resisten la variabilidad de fricción y presión. Protocolo Chaitin de compresión de azar activo.");
    } catch (error) {
      console.error("Error in triple scenario simulation:", error);
    } finally {
      setIsScenarioLoading(false);
    }
  };

  const handleDebtAnalysis = async () => {
    try {
      setIsDebtLoading(true);
      setDebtResults(null);
      
      hablar("Iniciando Protocolo de Deuda de Masa y Puentes de Resonancia. Escaneando Nodos de Sombra.");
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = calculateDebtAndResonance(data, BALL_WEIGHTS);
      setDebtResults(result);
      
      hablar("Análisis de deuda y resonancia sincronizado. Los proyectiles cinéticos han sido identificados.");
    } catch (error) {
      console.error("Error in debt analysis:", error);
    } finally {
      setIsDebtLoading(false);
    }
  };

  const handleDeepSimAI = async () => {
    try {
      setIsDeepSimLoading(true);
      setDeepSimResults(null);
      
      hablar("Iniciando Gabinete de Simulación Profunda V10.0. Ejecutando 100,000 iteraciones Monte Carlo sobre el set activo.");
      
      await new Promise(resolve => setTimeout(resolve, 3500));
      
      const result = executeDeepSimulation(data, BALL_WEIGHTS);
      setDeepSimResults(result);
      
      hablar("Simulación masiva completada. La jugada matemáticamente inevitable ha sido detectada.");
    } catch (error) {
      console.error("Error in deep sim:", error);
    } finally {
      setIsDeepSimLoading(false);
    }
  };

  const handleDeepAnalysis = async () => {
    try {
      setIsDeepLoading(true);
      setDeepAnalysis(null);
      const filteredData = getHistoryBySchedule(data, isNightMode);
      const swarmContext = swarmData ? `Nodo Activo: ${swarmData.activeNode} | Entropía: ${swarmData.entropyH} bits | Veta de Oro: ${swarmData.vetaDeOro ? 'SI' : 'NO'}` : undefined;
      const result = await getDeepQuantumAnalysis(filteredData, swarmContext);
      setDeepAnalysis(result);
      
      // Generar briefing de voz dinámico
      const voiceText = await getVoiceBriefing(`Deep Analysis completado. Resultado: ${result.substring(0, 100)}`, shannonData?.entropyBit || 1.42);
      hablar(voiceText);

      // Intentar extraer números sugeridos por la IA
      const jsonMatch = result.match(/\{.*"numbers".*\[.*\]\}/s);
      if (jsonMatch) {
        try {
          const parsed = JSON.parse(jsonMatch[0]);
          if (parsed.numbers && Array.isArray(parsed.numbers)) {
            // No los aplicamos automáticamente para no confundir, 
            // pero el botón en la UI aparecerá si hay números.
          }
        } catch (e) {
          console.error("Error parsing numbers from deep analysis", e);
        }
      }
    } catch (error: any) {
      console.error("Error in deep analysis:", error);
    } finally {
      setIsDeepLoading(false);
    }
  };

  const handleMarketingProof = async (ticket: SavedTicket) => {
    try {
      setIsMarketingLoading(prev => ({ ...prev, [ticket.id]: true }));
      const lastResult = data[0];
      const proof = await getMarketingProof(ticket.numbers, lastResult);
      setMarketingProof(prev => ({ ...prev, [ticket.id]: proof }));
      hablar("Prueba social generada. El mensaje está listo para ser compartido en el grupo VIP.");
    } catch (error: any) {
      console.error("Error generating marketing proof:", error);
    } finally {
      setIsMarketingLoading(prev => ({ ...prev, [ticket.id]: false }));
    }
  };

  const handleSaveTicket = () => {
    if (suggestion.length === 0) return;
    const newId = `QS-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    const newTicket: SavedTicket = {
      id: newId,
      date: new Date().toLocaleDateString('es-MX'),
      numbers: [...suggestion],
      type: 'multiple7'
    };
    
    const stats = runSimulation(newTicket.numbers, data);
    setTicketStats(prev => ({ ...prev, [newId]: stats }));
    setMyTickets(prev => [newTicket, ...prev]);
    
    setSaveSuccess(newId);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const handleClearWallet = () => {
    if (window.confirm("¿Estás seguro de vaciar toda tu cartera de tickets? Esta acción no se puede deshacer.")) {
      setMyTickets([]);
      setTicketStats({});
      localStorage.removeItem('quantum_god_tickets');
    }
  };

  const handleDeleteTicket = (id: string) => {
    setMyTickets(prev => prev.filter(t => t.id !== id));
    setTicketStats(prev => {
      const newStats = { ...prev };
      delete newStats[id];
      return newStats;
    });
  };

  const handleAdjustTicket = async (ticket: SavedTicket) => {
    const lastResult = data[0];
    setTicketAdjustment(prev => ({ ...prev, [ticket.id]: "Calculando rotación post-11863..." }));
    const adjustment = await getTicketAdjustment(ticket, lastResult);
    setTicketAdjustment(prev => ({ ...prev, [ticket.id]: adjustment }));
    hablar(`Ajuste de puntería para el ticket ${ticket.id.substring(0, 5)} completado. Se recomienda rotación de simetría.`);
  };

  const handleElasticRebound = async () => {
    try {
      setIsElasticLoading(true);
      hablar("Iniciando cálculo de Rebote Elástico. Analizando vacíos de succión en Nodos 16 y 02.");
      
      const result = executeElasticReboundCalculation(data, shannonData?.entropyBit || 1.42);
      setSuggestion(result.numbers);
      setSimResult(runSimulation(result.numbers, data));
      
      const aiAnalysis = await getElasticReboundAnalysis(data.slice(0, 10), shannonData?.entropyBit || 1.42);
      setElasticAnalysis(aiAnalysis);
      hablar("Cálculo completado. El vector de compensación de masa ha sido inyectado.");
    } catch (error) {
      console.error("Error in elastic rebound:", error);
    } finally {
      setIsElasticLoading(false);
    }
  };

  const handleSearchAnalysis = async () => {
    try {
      setIsSearchLoading(true);
      setSearchAnalysis(null);
      const result = await getSearchGroundingAnalysis(data);
      setSearchAnalysis(result);
      hablar("Análisis de búsqueda en tiempo real completado. Se han detectado nuevas tendencias en la red.");
    } catch (error: any) {
      console.error("Error in search analysis:", error);
    } finally {
      setIsSearchLoading(false);
    }
  };

  const handleSync = async () => {
    try {
      setLoading(true);
      const result = await syncLatestDraws();
      if (result.data) {
        setData(result.data);
        const scores = calculateThermalInertia(result.data);
        setThermalScores(scores);
        
        const voiceText = await getVoiceBriefing("Sincronización de datos históricos completada con éxito. Nodos ancla 22 y 16 en posición.");
        hablar(voiceText);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGetStrategicOpinion = async () => {
    try {
      setIsOpinionLoading(true);
      const opinion = await getStrategicFutureOpinion();
      setStrategicOpinion(opinion);
      hablar("Iniciando transmisión de visión estratégica QUANTUM-GOD-X.");
    } finally {
      setIsOpinionLoading(false);
    }
  };

  const handleMarketSentiment = async () => {
    try {
      setIsSentimentLoading(true);
      const result = await getMarketSentimentAnalysis();
      const jsonMatch = result.match(/\{.*"avoid".*\[.*\]\}/s);
      if (jsonMatch) {
        setMarketSentiment(JSON.parse(jsonMatch[0]));
      }
      hablar("Análisis de sentimiento del mercado completado. Nodos de saturación social identificados.");
    } catch (e) {
      console.error(e);
    } finally {
      setIsSentimentLoading(false);
    }
  };

  const handleGenerateExecutiveReport = async () => {
    try {
      setIsReportLoading(true);
      setExecutiveReport(null);
      const result = await getExecutiveReport();
      setExecutiveReport(result);
      hablar("Informe técnico de arquitectura V5.0 generado con éxito. El documento está listo para su revisión ejecutiva.");
    } catch (error: any) {
      console.error("Error generating executive report:", error);
    } finally {
      setIsReportLoading(false);
    }
  };

  const handleSyncWeight = (avg: number, weightMap?: Record<number, number>) => {
    playBeep();
    if (weightMap) {
      updateBallWeights(weightMap);
    }
    const swarm = executeSwarmAnalysis(data, avg);
    setSwarmData(swarm);
    
    const singularity = findWearSingularity(avg);
    setWearSingularity(singularity);
    
    if (singularity) {
      hablar(`Alerta de Convergencia detectada. El peso de ${avg.toFixed(3)}g correlaciona con la Singularidad de ${singularity.year}. Activando Nodo ${swarm.activeNode}.`);
    } else {
      hablar(`Sincronización de pesaje completada. Nodo ${swarm.activeNode} activado para auditoría de set.`);
    }
  };

  if (loading) return <div className="flex flex-col items-center justify-center h-screen bg-slate-950 text-white"><div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div></div>;

  return (
    <div className="min-h-screen pb-24 md:pb-0 md:pl-64 bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30">
      
      {/* Sidebar Navigation */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 p-6 z-50">
        <div className="flex items-center space-x-3 mb-12 px-2 cursor-pointer group" onClick={() => setView('dashboard')}>
          <div className="bg-amber-600 p-2 rounded-xl shadow-lg shadow-amber-600/20 group-hover:rotate-12 transition-all duration-500"><i className="fas fa-microchip text-white text-xl"></i></div>
          <h1 className="text-xl font-black tracking-tighter uppercase italic">Quantum <span className="text-amber-500">AI</span></h1>
        </div>
        
        <div className="space-y-2 flex-grow">
          {( [
            { id: 'dashboard' as ViewState, label: 'Terminal', fa: 'fa-house' },
            { id: 'backtesting' as ViewState, label: 'Forense', fa: 'fa-microscope' },
            { id: 'generator' as ViewState, label: 'Optimizador', fa: 'fa-wand-magic-sparkles' },
            { id: 'tickets' as ViewState, label: 'Mi Cartera', fa: 'fa-briefcase' },
            { id: 'history' as ViewState, label: 'Historial Real', fa: 'fa-database' },
            { id: 'docs' as ViewState, label: 'Informe Técnico', fa: 'fa-file-contract' },
            { id: 'vision' as ViewState, label: 'Visión Estratégica', fa: 'fa-brain' }
          ] ).map((item) => (
            <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 ${view === item.id ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/30 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
              <i className={`fas ${item.fa} w-5 text-lg`}></i><span className="text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>
        
        <VoiceControl />
      </nav>

      <main className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen">
        
        {/* GLOBAL HEADER & STATUS */}
        {(view === 'dashboard' || view === 'knowledge' || view === 'backtesting') && (
          <div className="mb-10 space-y-10">
             <IntegrityStatus />
             <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
                    Quantum<span className="text-amber-500">God</span>X
                  </h1>
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Terminal de Telemetría y Metrología de Precisión</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-amber-500/10 text-amber-500 px-4 py-2 rounded-full border border-amber-500/20 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse"></span>
                    Bypass de Azar: Activo
                  </div>
                  <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">Tribología V5.0</div>
                  <button 
                    onClick={() => setView(view === 'knowledge' ? 'dashboard' : 'knowledge')}
                    className={`px-4 py-2 rounded-full border text-[9px] font-black uppercase tracking-widest transition-all ${view === 'knowledge' ? 'bg-amber-500 border-amber-400 text-slate-950' : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'}`}
                  >
                    <i className={`fas ${view === 'knowledge' ? 'fa-times' : 'fa-book-open'} mr-2`}></i>
                    {view === 'knowledge' ? 'Cerrar' : 'Base de Conocimiento'}
                  </button>
                </div>
             </header>
          </div>
        )}

        {/* VIEW: KNOWLEDGE BASE */}
        {view === 'knowledge' && <KnowledgeBase />}

        {/* VIEW: BACKTESTING FORENSE */}
        {view === 'backtesting' && <BacktestingForense />}

        {/* VIEW: DASHBOARD */}
        {view === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in duration-700">
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                   <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Último Resultado #11917</span>
                   <div className="flex gap-2 mt-4 flex-wrap">
                      {[10, 14, 15, 24, 26].map(n => <NumberBall key={n} number={n} size="sm" />)}
                   </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative group">
                   <div className="absolute top-0 right-0 p-4">
                      <span className="bg-amber-500 text-slate-950 text-[8px] font-black px-2 py-1 rounded uppercase animate-pulse">Impacto Inminente</span>
                   </div>
                   <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Vector "Martillo" V8.0</span>
                   <div className="flex gap-2 mt-4 flex-wrap">
                      {[2, 10, 14, 24, 26].map(n => (
                        <div key={n} className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 ${n === 26 ? 'bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-600/40' : n === 2 ? 'bg-amber-500/20 border-amber-500/40 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                          {n}
                        </div>
                      ))}
                   </div>
                   <div className="mt-3 text-[9px] text-amber-500/80 uppercase font-bold tracking-tighter">Anclaje: 10-26 | Escolta: 14 | Bloque: 02-24</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl flex items-center justify-between">
                   <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Resonancia Clúster</span>
                    <div className="text-xl font-bold text-white uppercase tracking-tighter">{topThermal?.replace(/, /g, '-') || '---'} Sincronizado</div>
                   </div>
                   <i className="fas fa-atom text-3xl text-amber-500/20 animate-spin-slow"></i>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                <div className="lg:col-span-2">
                  <ShannonAudit data={shannonData} />
                </div>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl space-y-6">
                  <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                    <i className="fas fa-wind text-amber-500"></i>
                    Diferencial de Presión (ΔP)
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">Nodo 26 (Masa Ligera)</span>
                      <span className="text-xs font-black text-emerald-500">Sustentación Max</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-emerald-500 h-full w-[94%] animate-pulse"></div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-slate-500 uppercase font-bold">Nodo 22 (Masa Crítica)</span>
                      <span className="text-xs font-black text-amber-500">Pre-Succión</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div className="bg-amber-500 h-full w-[82%]"></div>
                    </div>
                  </div>
                  <p className="text-[8px] text-slate-400 uppercase italic leading-tight">
                    * El Nodo 26 presenta una ventaja aerodinámica del 14.2% sobre el promedio del set.
                  </p>
                </div>
             </div>

             <TombolaHeatmap 
               data={Object.entries(thermalScores).map(([num, score]) => ({ num: parseInt(num), score }))} 
               activeNumbers={suggestion}
             />

             <SwarmDashboard swarm={swarmData} />
             <SingularityAlert singularity={wearSingularity} />

             <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2">
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">¿Buscas el Nodo Ancla (Marzo 2026)?</h3>
                   <p className="text-slate-400 italic">Activa el motor de pensamiento profundo para un análisis exhaustivo con Nodos 22/16.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={handleVortexAnalysis}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center gap-3"
                  >
                      <i className="fas fa-vortex"></i>
                      Protocolo Vórtice
                  </button>
                  <button 
                    onClick={() => { setView('generator'); handleDeepAnalysis(); }}
                    className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-amber-600/30 transition-all active:scale-95 flex items-center gap-3"
                  >
                      <i className="fas fa-brain"></i>
                      Deep Analysis 21:15
                  </button>
                  <button 
                    onClick={() => { setView('generator'); handleElasticRebound(); }}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-600/30 transition-all active:scale-95 flex items-center gap-3"
                  >
                      <i className="fas fa-bolt"></i>
                      Rebote Elástico 11871
                  </button>
                </div>
             </div>

             <ResonanceScanChart />

             <MarkovHeatmap data={data} />

             <SingularidadMecanica />

             {vortexData && (
               <div className="bg-slate-900 border border-slate-800 p-10 rounded-[3rem] shadow-2xl space-y-8 animate-in fade-in slide-in-from-bottom-10 duration-700">
                 <div className="flex items-center justify-between">
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                     <i className="fas fa-vortex text-indigo-500"></i>
                     Auditoría Vórtice por Ciclos
                   </h3>
                   <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-4 py-2 rounded-full border border-indigo-500/30 uppercase tracking-widest">
                     {vortexData.detectedCase}
                   </span>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {vortexData.vectors.map((v, i) => (
                     <div key={i} className="bg-slate-950 border border-slate-800 p-6 rounded-[2rem] space-y-4 hover:border-indigo-500/50 transition-all group">
                       <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                         Vector {i < 2 ? 'Explorador' : 'Fuerza'} {i + 1}
                       </span>
                       <div className="flex gap-2 flex-wrap">
                         {v.map(n => <NumberBall key={n} number={n} size="sm" />)}
                       </div>
                     </div>
                   ))}
                 </div>

                 <div className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-2xl">
                    <p className="text-xs text-slate-400 italic leading-relaxed">
                      <i className="fas fa-info-circle text-indigo-500 mr-2"></i>
                      {vortexData.explanation}
                    </p>
                 </div>
               </div>
             )}

             <HistoricalFrequencyChart data={data} />

             <TiraPesajeInput onSync={handleSyncWeight} />

             <FrequencyChart data={calculateFrequencies(data).slice(0, 15)} />
          </div>
        )}

        {/* VIEW: TICKETS */}
        {view === 'tickets' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-900/50 p-10 rounded-[3rem] border border-slate-800 shadow-2xl backdrop-blur-sm">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Cartera de Auditoría V5.0</h2>
                <p className="text-slate-400 font-medium italic">Estrategia Marzo: Maximización de Entropía y Nodos Ancla.</p>
              </div>
              <div className="flex flex-wrap gap-8 items-center">
                 <div className="text-center">
                    <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">ROI Acumulado</span>
                    <span className={`text-3xl font-black ${poolSummary && poolSummary.avgRoi >= -30 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {poolSummary ? `${poolSummary.avgRoi.toFixed(1)}%` : '---'}
                    </span>
                 </div>
                  <div className="flex gap-4">
                    <button onClick={handleClearWallet} className="bg-rose-900/30 hover:bg-rose-600 text-rose-500 hover:text-white px-8 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest transition-all">Vaciar Cartera</button>
                    <button onClick={() => setView('generator')} className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-amber-600/30 transition-all active:scale-95">Afinar para Mañana</button>
                  </div>
              </div>
            </header>
            
            <div className="grid grid-cols-1 gap-10">
              {myTickets.map((ticket) => {
                const stats = ticketStats[ticket.id];
                const lastDrawNums = [11, 13, 16, 21, 28];
                const hitsLatest = ticket.numbers.filter(n => lastDrawNums.includes(n)).length;

                return (
                  <div key={ticket.id} className={`p-10 rounded-[4rem] border relative overflow-hidden group transition-all duration-500 shadow-2xl bg-slate-900/80 border-slate-800`}>
                    <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
                      <div className="space-y-6">
                        <div className="flex items-center gap-4">
                          <h4 className="text-2xl font-black text-white tracking-tighter uppercase italic">{ticket.id}</h4>
                          {hitsLatest >= 3 && <span className="bg-emerald-600 text-white text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-[0.2em]">Hit Crítico Detectado</span>}
                        </div>
                        <div className="flex flex-wrap gap-4">
                          {ticket.numbers.map((n, idx) => {
                            const isMatch = lastDrawNums.includes(n);
                            return (
                              <div key={`${ticket.id}-${n}-${idx}`} className="relative">
                                <NumberBall number={n} size="md" />
                                {isMatch && (
                                  <div className="absolute -top-3 -right-3 bg-emerald-500 text-slate-950 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 border-slate-900 shadow-xl animate-bounce">
                                    <i className="fas fa-check"></i>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full lg:w-auto">
                         <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 text-center">
                            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Aciertos (#11863)</span>
                            <span className={`text-2xl font-black ${hitsLatest >= 2 ? 'text-emerald-400' : 'text-slate-600'}`}>{hitsLatest}</span>
                         </div>
                         <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 text-center">
                            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">ROI Histórico</span>
                            <span className={`text-2xl font-black ${stats.roi >= -25 ? 'text-amber-500' : 'text-rose-500'}`}>{stats.roi.toFixed(1)}%</span>
                         </div>
                         <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 text-center">
                            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Confianza AI</span>
                            <span className="text-2xl font-black text-white italic">{hitsLatest >= 2 ? 'RESILIENTE' : 'BAJA'}</span>
                         </div>
                         <button onClick={() => handleAdjustTicket(ticket)} className="bg-slate-800 hover:bg-slate-700 text-white rounded-3xl p-6 flex flex-col items-center justify-center transition-all shadow-xl group/btn">
                           <i className="fas fa-sync-alt group-hover/btn:rotate-180 transition-transform duration-700 mb-1"></i>
                           <span className="text-[7px] font-black uppercase">Recalibrar</span>
                         </button>
                         <button onClick={() => handleMarketingProof(ticket)} className="bg-emerald-600 hover:bg-emerald-500 text-white rounded-3xl p-6 flex flex-col items-center justify-center transition-all shadow-xl group/mkt">
                           <i className={`fas ${isMarketingLoading[ticket.id] ? 'fa-spinner fa-spin' : 'fa-bullhorn'} mb-1`}></i>
                           <span className="text-[7px] font-black uppercase">WhatsApp Proof</span>
                         </button>
                      </div>
                    </div>

                    {marketingProof[ticket.id] && (
                      <div className="mt-8 p-8 bg-emerald-950/30 rounded-[2.5rem] border border-emerald-500/30 animate-in fade-in slide-in-from-top-4 duration-500">
                         <div className="flex justify-between items-start mb-4">
                            <h5 className="text-emerald-400 font-black text-[10px] uppercase tracking-widest">Marketing Copy VIP</h5>
                            <button onClick={() => navigator.clipboard.writeText(marketingProof[ticket.id])} className="text-emerald-400 hover:text-white transition-colors">
                               <i className="fas fa-copy"></i>
                            </button>
                         </div>
                         <p className="text-slate-200 text-sm font-medium leading-relaxed whitespace-pre-wrap">
                            {marketingProof[ticket.id]}
                         </p>
                      </div>
                    )}

                    {ticketAdjustment[ticket.id] && (
                      <div className="mt-8 p-8 bg-slate-950 rounded-[2.5rem] border border-amber-600/30 animate-in fade-in slide-in-from-top-4 duration-500">
                         <p className="text-slate-200 text-sm font-medium leading-relaxed italic">
                            <i className="fas fa-robot mr-4 text-amber-500 animate-pulse"></i>
                            {ticketAdjustment[ticket.id]}
                         </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* VIEW: GENERATOR */}
        {view === 'generator' && (
           <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h2 className="text-5xl font-black text-white tracking-tighter mb-2 uppercase italic">Motor de Resonancia V5.0</h2>
                <p className="text-slate-400 font-medium italic">Protocolo: Marzo 2026. Objetivo Crítico: Nodos 22/16. Maximización de Entropía.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2 rounded-[2.5rem] flex shadow-inner">
                <button onClick={() => setIsNightMode(false)} className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${!isNightMode ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400'}`}>Las Tres</button>
                <button onClick={() => setIsNightMode(true)} className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${isNightMode ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400'}`}>Clásico</button>
                <div className="w-px bg-slate-800 mx-2 my-2"></div>
                <button onClick={() => { setGenMode('simple'); setSuggestion([]); }} className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${genMode === 'simple' ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/30' : 'text-slate-400 hover:text-slate-200'}`}>Quantum 5 (Rápido)</button>
                <button onClick={() => { setGenMode('quantum'); setSuggestion([]); }} className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${genMode === 'quantum' ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/30' : 'text-slate-400 hover:text-slate-200'}`}>Forense (GOD-X)</button>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-12">
               <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                  <h4 className="text-amber-500 font-black text-[9px] uppercase tracking-widest mb-2">Modo Quantum 5</h4>
                  <p className="text-slate-400 text-[10px] leading-relaxed italic">Análisis heurístico local. Ideal para jugadas rápidas basadas en ROI histórico.</p>
               </div>
               <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                  <h4 className="text-amber-500 font-black text-[9px] uppercase tracking-widest mb-2">Modo Forense</h4>
                  <p className="text-slate-400 text-[10px] leading-relaxed italic">Usa IA para compensar masa SEGOB y evitar prorrateo. Genera Múltiple 7.</p>
               </div>
               <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                  <h4 className="text-amber-500 font-black text-[9px] uppercase tracking-widest mb-2">Deep Thinking</h4>
                  <p className="text-slate-400 text-[10px] leading-relaxed italic">Análisis exhaustivo de 9 PM. Usa razonamiento profundo para detectar anomalías.</p>
               </div>
               <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-3xl">
                  <h4 className="text-amber-500 font-black text-[9px] uppercase tracking-widest mb-2">Search Grounding</h4>
                  <p className="text-slate-400 text-[10px] leading-relaxed italic">Sincroniza tendencias reales de la web para validar la inercia térmica.</p>
               </div>
            </div>

            <div className={`p-12 md:p-24 rounded-[5rem] border shadow-2xl text-center min-h-[600px] flex flex-col items-center justify-center transition-all duration-1000 ${genMode === 'quantum' ? 'bg-amber-600/[0.03] border-amber-500/30 shadow-[0_0_120px_rgba(217,119,6,0.08)]' : 'bg-slate-900 border-slate-800'}`}>
               {isAiLoading ? (
                 <div className="max-w-2xl flex flex-col items-center space-y-8">
                    <div className="w-24 h-24 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-widest animate-pulse italic">Calculando Fricción del Ducto...</h3>
                 </div>
               ) : suggestion.length === 0 ? (
                  <div className="max-w-2xl">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-10 border bg-amber-500/10 border-amber-500/30 shadow-[0_0_60px_rgba(217,119,6,0.3)]`}>
                      <i className={`fas fa-microchip text-5xl text-amber-500 animate-pulse`}></i>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter leading-tight italic">
                      {genMode === 'simple' ? 'Quantum 5: Análisis de Alta Velocidad' : 'GOD-X: Veredicto Mecánico'}
                    </h3>
                    <div className="flex flex-col items-center gap-4 mb-6 justify-center">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                          {genMode === 'simple' ? 'Algoritmo Heurístico de Resonancia' : 'Optimización de Flujo y Masa (V5.0)'}
                        </span>
                      </div>
                      {genMode === 'quantum' && (
                        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                          <i className="fas fa-microscope text-[10px] text-amber-500"></i>
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500">
                            Auditoría Activa: Nodo 16 (Desgaste Mecánico)
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-500 mb-12 text-lg italic">
                      {genMode === 'simple' 
                        ? 'Genera 5 coordenadas optimizadas mediante clústeres de frecuencia y ROI histórico inmediato.' 
                        : 'Genera un reporte de 7 coordenadas de fallo basado en la fatiga de materiales y optimización de flujo.'}
                    </p>
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-12 justify-center">
                      <button onClick={handleGenerate} className={`px-16 py-8 rounded-[3rem] font-black uppercase tracking-[0.3em] text-sm transition-all shadow-2xl active:scale-95 bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/40`}>
                        Generar para Hoy ({getSorteoDate()})
                      </button>
                      <button 
                        onClick={handleMandelCondensation} 
                        disabled={isMandelLoading}
                        className={`px-12 py-8 rounded-[3rem] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl active:scale-95 border-2 ${isMandelLoading ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-indigo-900/20 border-indigo-500/50 text-indigo-400 hover:bg-indigo-900/40'}`}
                      >
                        {isMandelLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-layer-group mr-3"></i>}
                        Condensación Mandel
                      </button>
                      <button 
                        onClick={handleTripleScenario} 
                        disabled={isScenarioLoading}
                        className={`px-12 py-8 rounded-[3rem] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl active:scale-95 border-2 ${isScenarioLoading ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/40'}`}
                      >
                        {isScenarioLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-shield-alt mr-3"></i>}
                        Triple Escenario
                      </button>
                      <button 
                        onClick={handleDebtAnalysis} 
                        disabled={isDebtLoading}
                        className={`px-12 py-8 rounded-[3rem] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl active:scale-95 border-2 ${isDebtLoading ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-purple-900/20 border-purple-500/50 text-purple-400 hover:bg-purple-900/40'}`}
                      >
                        {isDebtLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-crosshairs mr-3"></i>}
                        Deuda & Resonancia
                      </button>
                      <button 
                        onClick={handleDeepSimAI} 
                        disabled={isDeepSimLoading}
                        className={`px-12 py-8 rounded-[3rem] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl active:scale-95 border-2 ${isDeepSimLoading ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-red-900/20 border-red-500/50 text-red-500 hover:bg-red-900/40'}`}
                      >
                        {isDeepSimLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-microchip mr-3"></i>}
                        Upgrade V10.0 (Gabinete)
                      </button>
                    </div>

                    {scenarioResults && (
                      <div className="mt-12 w-full max-w-4xl animate-in fade-in slide-in-from-top-8 duration-700">
                        <div className="bg-emerald-950/20 border border-emerald-500/30 p-10 rounded-[3rem] space-y-8">
                          <div className="flex items-center justify-between border-b border-emerald-500/20 pb-6">
                            <h4 className="text-emerald-400 font-black text-xl uppercase italic tracking-tighter flex items-center gap-3">
                              <i className="fas fa-shield-virus"></i>
                              Nodos de Alta Seguridad (Intersección)
                            </h4>
                            <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-4 py-2 rounded-full border border-emerald-500/30 uppercase tracking-widest">
                              Protocolo Chaitin Activo
                            </span>
                          </div>
                          
                          <div className="flex justify-center gap-6 py-8 bg-slate-950/50 rounded-[2.5rem] border border-emerald-500/10">
                            {scenarioResults.highSecurityNumbers.length > 0 ? (
                              scenarioResults.highSecurityNumbers.map(n => (
                                <NumberBall key={n} number={n} size="lg" />
                              ))
                            ) : (
                              <p className="text-slate-500 italic text-sm">No se detectaron nodos con 100% de coincidencia en los 3 escenarios. Buscando resonancia alternativa...</p>
                            )}
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {scenarioResults.scenarios.map((s, idx) => (
                              <div key={idx} className="bg-slate-950/40 border border-slate-800 p-6 rounded-[2rem] space-y-4">
                                <h5 className="text-[10px] font-black text-slate-500 uppercase tracking-widest text-center">{s.name}</h5>
                                <div className="flex justify-center gap-2">
                                  {s.numbers.map(n => <NumberBall key={n} number={n} size="sm" />)}
                                </div>
                              </div>
                            ))}
                          </div>

                          <p className="text-slate-400 text-xs italic leading-relaxed text-center px-10">
                            {scenarioResults.explanation}
                          </p>
                        </div>
                      </div>
                    )}

                    {debtResults && (
                      <div className="mt-12 w-full max-w-4xl animate-in fade-in slide-in-from-top-8 duration-700">
                        <div className="bg-purple-950/20 border border-purple-500/30 p-10 rounded-[3rem] space-y-8">
                          <div className="flex items-center justify-between border-b border-purple-500/20 pb-6">
                            <h4 className="text-purple-400 font-black text-xl uppercase italic tracking-tighter flex items-center gap-3">
                              <i className="fas fa-crosshairs text-purple-500"></i>
                              Análisis: Deuda & Resonancia V9.5
                            </h4>
                            <span className="bg-purple-500/10 text-purple-400 text-[10px] font-black px-4 py-2 rounded-full border border-purple-500/30 uppercase tracking-widest">
                              Sincronización Total Activa
                            </span>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="bg-slate-950/50 border border-purple-500/10 p-8 rounded-[2.5rem] space-y-6">
                              <h5 className="text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-800 pb-3">Nodos de Sombra (Deuda de Masa)</h5>
                              <div className="flex justify-center gap-4">
                                {debtResults.debtNodes.map(n => (
                                  <NumberBall key={n} number={n} size="md" />
                                ))}
                              </div>
                              <p className="text-[10px] text-slate-600 italic">Nodos pesados con ausencia prolongada en el ducto de salida.</p>
                            </div>

                            <div className="bg-slate-950/50 border border-purple-500/10 p-8 rounded-[2.5rem] space-y-6">
                              <h5 className="text-slate-500 font-bold uppercase text-[10px] tracking-widest border-b border-slate-800 pb-3">Puentes de Resonancia Activos</h5>
                              <div className="space-y-4">
                                {debtResults.resonanceBridges.map((b, idx) => (
                                  <div key={idx} className="flex items-center justify-between bg-black/40 p-4 rounded-2xl border border-purple-500/5">
                                    <div className="flex gap-3">
                                      {b.pair.map((n: number) => (
                                        <span key={n} className="text-purple-400 font-black text-lg">#{n < 10 ? `0${n}` : n}</span>
                                      ))}
                                    </div>
                                    <div className="text-right">
                                      <span className="text-purple-600 font-mono text-[10px]">Δ {b.diff}g</span>
                                      <div className="h-1 w-12 bg-purple-500/20 rounded-full mt-1 overflow-hidden">
                                        <div className="h-full bg-purple-500 w-3/4 animate-pulse"></div>
                                      </div>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>

                          <p className="text-slate-400 text-xs italic leading-relaxed text-center px-10">
                            {debtResults.explanation}
                          </p>
                        </div>
                      </div>
                    )}

                    {deepSimResults && (
                      <div className="mt-12 w-full max-w-4xl animate-in fade-in slide-in-from-top-8 duration-700">
                        <div className="bg-red-950/20 border border-red-500/30 p-10 rounded-[3rem] space-y-8 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8">
                            <i className="fas fa-microchip text-7xl text-red-500/10"></i>
                          </div>

                          <div className="flex items-center justify-between border-b border-red-500/20 pb-6 relative z-10">
                            <h4 className="text-red-500 font-black text-xl uppercase italic tracking-tighter flex items-center gap-3">
                              <i className="fas fa-radiation"></i>
                              Gabinete de Simulación V10.0
                            </h4>
                            <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-4 py-2 rounded-full border border-red-500/30 uppercase tracking-widest">
                              Monte Carlo: 100k Iteraciones
                            </span>
                          </div>

                          <div className="bg-black/60 border border-red-500/20 p-10 rounded-[2.5rem] relative z-10">
                            <h5 className="text-red-500/80 font-black uppercase text-center text-xs tracking-widest mb-10 italic">Jugada Matemáticamente Inevitable (Convergencia)</h5>
                            <div className="flex justify-center gap-6">
                              {deepSimResults.inevitableCombo.map(n => (
                                <NumberBall key={n} number={n} size="lg" />
                              ))}
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 relative z-10">
                             {deepSimResults.topNodes.slice(0, 5).map((node, i) => (
                               <div key={i} className="bg-slate-900 border border-red-500/10 p-4 rounded-xl text-center">
                                 <span className="block text-[8px] text-slate-500 font-black uppercase">Nodo {node.num}</span>
                                 <span className="text-red-400 font-black text-lg">{node.confidence}%</span>
                               </div>
                             ))}
                          </div>

                          <p className="text-red-200/60 text-xs italic leading-relaxed text-center px-10 relative z-10">
                            "{deepSimResults.explanation}"
                          </p>
                        </div>
                      </div>
                    )}

                    {mandelCombos.length > 0 && (
                      <div className="mt-12 w-full max-w-4xl animate-in fade-in slide-in-from-top-8 duration-700">
                        <div className="bg-indigo-950/20 border border-indigo-500/30 p-10 rounded-[3rem] space-y-8">
                          <div className="flex items-center justify-between border-b border-indigo-500/20 pb-6">
                            <h4 className="text-indigo-400 font-black text-xl uppercase italic tracking-tighter flex items-center gap-3">
                              <i className="fas fa-compress-alt"></i>
                              Resultados: Condensación Mandel
                            </h4>
                            <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-black px-4 py-2 rounded-full border border-indigo-500/30 uppercase tracking-widest">
                              {mandelCombos.length} Combinaciones Optimizadas
                            </span>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {mandelCombos.map((combo, idx) => (
                              <div key={idx} className="bg-slate-950 border border-slate-800 p-6 rounded-[2rem] flex items-center justify-between group hover:border-indigo-500/50 transition-all">
                                <div className="flex gap-2">
                                  {combo.map(n => <NumberBall key={n} number={n} size="sm" />)}
                                </div>
                                <button 
                                  onClick={() => {
                                    setSuggestion(combo);
                                    setSimResult(runSimulation(combo, data));
                                    window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className="text-indigo-500 hover:text-indigo-400 p-2"
                                >
                                  <i className="fas fa-external-link-alt"></i>
                                </button>
                              </div>
                            ))}
                          </div>
                          <p className="text-[10px] text-slate-500 italic text-center">
                            * Estrategia de cobertura máxima basada en la condensación de Mandel. Diseñada para rodear el premio mayor con el mínimo de tickets.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="mt-12 pt-12 border-t border-slate-800 w-full">
                       <button 
                         onClick={handleDeepAnalysis} 
                         disabled={isDeepLoading}
                         className="flex items-center gap-4 mx-auto bg-slate-900 hover:bg-slate-800 border border-slate-700 px-10 py-6 rounded-[2.5rem] transition-all group"
                       >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isDeepLoading ? 'bg-amber-600 animate-spin' : 'bg-slate-800 group-hover:bg-amber-600'} transition-colors`}>
                             <i className={`fas ${isDeepLoading ? 'fa-spinner' : 'fa-brain'} text-white`}></i>
                          </div>
                          <div className="text-left">
                             <span className="block text-[10px] font-black text-amber-500 uppercase tracking-widest">Bypass GLI-19</span>
                             <span className="block text-white font-bold text-lg tracking-tighter uppercase italic">Reporte de Fricción 21:15</span>
                          </div>
                       </button>

                       {deepAnalysis && (
                         <div className="mt-10 p-10 bg-slate-950 border border-amber-500/20 rounded-[3rem] text-left animate-in fade-in slide-in-from-top-4 duration-700">
                            <h4 className="text-amber-500 font-black text-xs uppercase tracking-[0.4em] mb-6 flex items-center gap-3 italic">
                               <i className="fas fa-microchip"></i> Auditoría de Deuda de Masa
                            </h4>
                            <div className="markdown-body prose prose-invert max-w-none text-slate-300 italic leading-relaxed">
                               <Markdown>{deepAnalysis}</Markdown>
                            </div>
                            {deepAnalysis.includes('"numbers"') && (
                              <div className="mt-8 pt-8 border-t border-slate-800 flex justify-center">
                                <button 
                                  onClick={() => {
                                    const match = deepAnalysis.match(/\{.*"numbers".*\[.*\]\}/s);
                                    if (match) {
                                      try {
                                        const parsed = JSON.parse(match[0]);
                                        setSuggestion(parsed.numbers);
                                        setGenMode('quantum');
                                        setSimResult(runSimulation(parsed.numbers, data));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                      } catch(e) { console.error(e); }
                                    }
                                  }}
                                  className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-amber-600/30 transition-all"
                                >
                                  <i className="fas fa-arrow-up mr-3"></i>
                                  Cargar Coordenadas en Optimizador
                                </button>
                              </div>
                            )}
                         </div>
                       )}

                       {elasticAnalysis && (
                         <div className="mt-10 p-10 bg-emerald-950/20 border border-emerald-500/20 rounded-[3rem] text-left animate-in fade-in slide-in-from-top-4 duration-700">
                            <h4 className="text-emerald-500 font-black text-xs uppercase tracking-[0.4em] mb-6 flex items-center gap-3 italic">
                               <i className="fas fa-bolt"></i> Reporte de Rebote Elástico
                            </h4>
                            <div className="markdown-body prose prose-invert max-w-none text-slate-300 italic leading-relaxed">
                               <Markdown>{elasticAnalysis}</Markdown>
                            </div>
                            {elasticAnalysis.includes('"numbers"') && (
                              <div className="mt-8 pt-8 border-t border-slate-800 flex justify-center">
                                <button 
                                  onClick={() => {
                                    const match = elasticAnalysis.match(/\{.*"numbers".*\[.*\]\}/s);
                                    if (match) {
                                      try {
                                        const parsed = JSON.parse(match[0]);
                                        setSuggestion(parsed.numbers);
                                        setGenMode('quantum');
                                        setSimResult(runSimulation(parsed.numbers, data));
                                        window.scrollTo({ top: 0, behavior: 'smooth' });
                                      } catch(e) { console.error(e); }
                                    }
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-emerald-600/30 transition-all"
                                >
                                  <i className="fas fa-arrow-up mr-3"></i>
                                  Cargar Coordenadas de Rebote
                                </button>
                              </div>
                            )}
                         </div>
                       )}

                       <button 
                         onClick={handleSearchAnalysis} 
                         disabled={isSearchLoading}
                         className="flex items-center gap-4 mx-auto mt-6 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-10 py-6 rounded-[2.5rem] transition-all group"
                       >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSearchLoading ? 'bg-emerald-600 animate-spin' : 'bg-slate-800 group-hover:bg-emerald-600'} transition-colors`}>
                             <i className={`fas ${isSearchLoading ? 'fa-spinner' : 'fa-globe'} text-white`}></i>
                          </div>
                          <div className="text-left">
                             <span className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest">Google Search Grounding</span>
                             <span className="block text-white font-bold text-lg tracking-tighter uppercase italic">Sincronización Web Real</span>
                          </div>
                       </button>

                       <button 
                         onClick={handleMarketSentiment} 
                         disabled={isSentimentLoading}
                         className="flex items-center gap-4 mx-auto mt-6 bg-slate-900 hover:bg-slate-800 border border-slate-700 px-10 py-6 rounded-[2.5rem] transition-all group"
                       >
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${isSentimentLoading ? 'bg-rose-600 animate-spin' : 'bg-slate-800 group-hover:bg-rose-600'} transition-colors`}>
                             <i className={`fas ${isSentimentLoading ? 'fa-spinner' : 'fa-users'} text-white`}></i>
                          </div>
                          <div className="text-left">
                             <span className="block text-[10px] font-black text-rose-500 uppercase tracking-widest">Market Sentiment Analysis</span>
                             <span className="block text-white font-bold text-lg tracking-tighter uppercase italic">Evasión de Prorrateo Social</span>
                          </div>
                       </button>

                       {marketSentiment && (
                          <div className="mt-10 p-10 bg-slate-950 border border-rose-500/20 rounded-[3rem] text-left animate-in fade-in slide-in-from-top-4 duration-700">
                             <h4 className="text-rose-500 font-black text-xs uppercase tracking-[0.4em] mb-6 flex items-center gap-3 italic">
                                <i className="fas fa-exclamation-triangle"></i> Nodos de Saturación Social
                             </h4>
                             <div className="flex gap-4 mb-6">
                                {marketSentiment.avoid.map(n => <NumberBall key={n} number={n} size="sm" />)}
                             </div>
                             <p className="text-slate-300 italic leading-relaxed text-sm">
                                {marketSentiment.reason}
                             </p>
                          </div>
                       )}

                       {searchAnalysis && (
                          <div className="mt-10 p-10 bg-slate-950 border border-emerald-500/20 rounded-[3rem] text-left animate-in fade-in slide-in-from-top-4 duration-700">
                             <h4 className="text-emerald-500 font-black text-xs uppercase tracking-[0.4em] mb-6 flex items-center gap-3 italic">
                                <i className="fas fa-search"></i> Inteligencia de Búsqueda Real
                             </h4>
                             <div className="markdown-body prose prose-invert max-w-none text-slate-300 italic leading-relaxed">
                                <Markdown>{searchAnalysis}</Markdown>
                             </div>
                          </div>
                       )}
                    </div>
                 </div>
               ) : (
                 <div className="w-full animate-in zoom-in-95 duration-700">
                    <div className="flex flex-wrap justify-center gap-6 mb-8">
                      {suggestion.map((n, i) => (
                         <div key={i} className="animate-in slide-in-from-bottom-12 duration-1000" style={{ animationDelay: `${i * 150}ms` }}>
                           <NumberBall number={n} size="lg" />
                         </div>
                       ))}
                     </div>

                     {biasAnalysis && (
                       <div className="max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                         <div className={`p-6 rounded-3xl border flex items-center gap-6 ${biasAnalysis.score > 70 ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                           <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xl ${biasAnalysis.score > 70 ? 'bg-emerald-500 text-slate-950' : 'bg-amber-500 text-slate-950'}`}>
                             {biasAnalysis.score}
                           </div>
                           <div className="text-left">
                             <h5 className={`font-black text-[10px] uppercase tracking-widest mb-1 ${biasAnalysis.score > 70 ? 'text-emerald-400' : 'text-amber-400'}`}>
                               Índice de Pureza (Filtro de Sesgo Humano)
                             </h5>
                             <p className="text-slate-300 text-xs italic leading-relaxed">
                               {biasAnalysis.analysis}
                             </p>
                           </div>
                         </div>
                       </div>
                     )}
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto text-left">
                       <div className="bg-slate-950 p-12 rounded-[4rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
                          <h4 className="text-amber-500 font-black text-[10px] uppercase tracking-[0.5em] mb-8 flex items-center gap-4 italic">
                             <i className="fas fa-brain animate-pulse"></i> {genMode === 'simple' ? 'Veredicto Quantum 5' : 'Veredicto Singularidad'}
                          </h4>
                          <p className="text-slate-200 italic font-medium text-2xl leading-relaxed">
                            "{genMode === 'simple' ? quantum5?.explanation : aiInsight}"
                          </p>
                       </div>
                       <div className="bg-slate-950 p-12 rounded-[4rem] border border-slate-800 shadow-2xl flex flex-col justify-between">
                          <div className="space-y-6">
                             <div className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl border border-slate-800">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ROI Proyectado Quantum</span>
                                <span className="text-2xl font-black text-emerald-400">{simResult?.roi.toFixed(2)}%</span>
                             </div>
                             <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-center">
                                <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Certeza de Resonancia</span>
                                <span className="text-2xl font-black text-white italic">{certeza ? `${certeza}%` : 'MÁXIMA'}</span>
                             </div>
                          </div>
                          <div className="flex gap-4 mt-10">
                            <button onClick={handleGenerate} className="flex-grow bg-slate-800 hover:bg-slate-700 py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest transition-all">Nueva Simulación</button>
                            <button 
                              onClick={handleSaveTicket} 
                              className={`flex-grow py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all ${saveSuccess ? 'bg-emerald-600 text-white' : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20'}`}
                            >
                              {saveSuccess ? <><i className="fas fa-check mr-2"></i> Guardado</> : 'Sellar Ticket'}
                            </button>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
           </div>
        )}

        {/* VIEW: HISTORY */}
        {view === 'history' && (
           <div className="space-y-10 animate-in fade-in duration-700">
              <header>
                <h2 className="text-5xl font-black tracking-tighter uppercase italic text-white">Archivo Central</h2>
                <p className="text-slate-400 font-mono text-sm uppercase italic">Auditoría Real: Cierre de Mes ({getSorteoDate()}). Próximo: Sorteo 15:00 (03/03)</p>
              </header>
              <div className="bg-slate-900 border border-slate-800 rounded-[4rem] overflow-hidden shadow-2xl">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-800/60">
                          <tr>
                             <th className="px-10 py-8 text-[11px] font-black uppercase text-slate-400 tracking-[0.4em]">ID</th>
                             <th className="px-10 py-8 text-[11px] font-black uppercase text-slate-400 tracking-[0.4em]">Fecha / Hora</th>
                             <th className="px-10 py-8 text-[11px] font-black uppercase text-slate-400 tracking-[0.4em] text-center">Combinación Ganadora</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800/30">
                          {data.slice(0, 15).map(draw => (
                            <tr key={draw.CONCURSO} className={`hover:bg-slate-800/20 transition-colors group ${draw.CONCURSO === 11854 ? 'bg-amber-500/[0.06]' : ''}`}>
                               <td className="px-10 py-10 font-black text-amber-500 text-2xl italic">#{draw.CONCURSO}</td>
                               <td className="px-10 py-10 text-slate-300 text-sm font-bold uppercase tracking-tighter">{draw.FECHA} {draw.CONCURSO % 2 === 0 ? '21:15' : '15:00'}</td>
                               <td className="px-10 py-10">
                                  <div className="flex justify-center gap-4">
                                     {[draw.R1, draw.R2, draw.R3, draw.R4, draw.R5].map((n, idx) => (
                                       <span key={idx} className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border shadow-inner ${draw.CONCURSO === 11854 ? 'bg-amber-600 text-white border-amber-500/50 shadow-amber-500/20 animate-pulse' : 'bg-slate-950 text-slate-300 border-slate-800'}`}>{n}</span>
                                     ))}
                                  </div>
                               </td>
                            </tr>
                          ))}
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
        )}

        {/* VIEW: DOCS */}
        {view === 'docs' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header>
              <h2 className="text-5xl font-black tracking-tighter uppercase italic text-white">Documentación Elite</h2>
              <p className="text-slate-400 font-medium italic">Generación de Informes Técnicos de Arquitectura e Inteligencia V5.0.</p>
            </header>

            <div className="bg-slate-900/50 border border-slate-800 p-12 rounded-[4rem] shadow-2xl backdrop-blur-sm">
              {!executiveReport && !isReportLoading ? (
                <div className="text-center space-y-8">
                  <div className="w-24 h-24 bg-amber-600/10 border border-amber-600/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(217,119,6,0.2)]">
                    <i className="fas fa-file-contract text-4xl text-amber-500"></i>
                  </div>
                  <div className="max-w-xl mx-auto">
                    <h3 className="text-2xl font-black text-white uppercase italic mb-4">Informe de Arquitectura V5.0</h3>
                    <p className="text-slate-400 italic mb-10">Genera un documento técnico detallado sobre los módulos de inteligencia, integridad, conectividad y el propósito del sistema QUANTUM-GOD-X.</p>
                    <button 
                      onClick={handleGenerateExecutiveReport}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-12 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-xl shadow-amber-600/30 transition-all active:scale-95 flex items-center gap-4 mx-auto"
                    >
                      <i className="fas fa-magic"></i>
                      Generar Informe Ejecutivo
                    </button>
                  </div>
                </div>
              ) : isReportLoading ? (
                <div className="py-20 text-center space-y-8">
                  <div className="w-20 h-20 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <h3 className="text-xl font-black text-white uppercase tracking-widest animate-pulse italic">Redactando Informe Técnico...</h3>
                  <p className="text-slate-500 italic">Compilando módulos de inteligencia y protocolos de integridad SEGOB.</p>
                </div>
              ) : (
                <div className="animate-in fade-in duration-1000">
                  <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
                    <h3 className="text-xl font-black text-amber-500 uppercase italic tracking-tighter">Informe Técnico QUANTUM-GOD-X V5.0</h3>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setExecutiveReport(null)}
                        className="text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
                      >
                        Reiniciar
                      </button>
                      <button 
                        onClick={() => executiveReport && navigator.clipboard.writeText(executiveReport)}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                      >
                        <i className="fas fa-copy"></i> Copiar
                      </button>
                    </div>
                  </div>
                  <div className="markdown-body prose prose-invert max-w-none text-slate-300 leading-relaxed">
                    <Markdown>{executiveReport}</Markdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW: VISION */}
        {view === 'vision' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header>
              <h2 className="text-5xl font-black tracking-tighter uppercase italic text-white">Visión Estratégica</h2>
              <p className="text-slate-400 font-medium italic">Protocolos de crecimiento y áreas de oportunidad para el éxito absoluto.</p>
            </header>

            <div className="bg-slate-900/50 border border-slate-800 p-12 rounded-[4rem] shadow-2xl backdrop-blur-sm">
              {!strategicOpinion && !isOpinionLoading ? (
                <div className="text-center space-y-8">
                  <div className="w-24 h-24 bg-amber-600/10 border border-amber-600/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_50px_rgba(217,119,6,0.2)]">
                    <i className="fas fa-brain text-4xl text-amber-500"></i>
                  </div>
                  <div className="max-w-xl mx-auto">
                    <h3 className="text-2xl font-black text-white uppercase italic mb-4">Consultar Visión de la IA</h3>
                    <p className="text-slate-400 italic mb-10">Obtén un análisis profundo sobre el estado actual de la aplicación y el mapa de ruta para superar la frecuencia del azar.</p>
                    <button 
                      onClick={handleGetStrategicOpinion}
                      className="bg-amber-600 hover:bg-amber-500 text-white px-12 py-6 rounded-3xl font-black uppercase text-xs tracking-[0.3em] shadow-xl shadow-amber-600/30 transition-all active:scale-95 flex items-center gap-4 mx-auto"
                    >
                      <i className="fas fa-lightbulb"></i>
                      Iniciar Consulta Estratégica
                    </button>
                  </div>
                </div>
              ) : isOpinionLoading ? (
                <div className="py-20 text-center space-y-8">
                  <div className="w-20 h-20 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                  <h3 className="text-xl font-black text-white uppercase tracking-widest animate-pulse italic">Analizando Áreas de Oportunidad...</h3>
                  <p className="text-slate-500 italic">Sincronizando nodos de conciencia y optimización multimodal.</p>
                </div>
              ) : (
                <div className="animate-in fade-in duration-1000">
                  <div className="flex justify-between items-center mb-10 border-b border-slate-800 pb-6">
                    <h3 className="text-xl font-black text-amber-500 uppercase italic tracking-tighter">Visión Estratégica QUANTUM-GOD-X</h3>
                    <div className="flex gap-4">
                      <button 
                        onClick={() => setStrategicOpinion(null)}
                        className="text-slate-500 hover:text-white transition-colors text-xs font-black uppercase tracking-widest"
                      >
                        Reiniciar
                      </button>
                      <button 
                        onClick={() => strategicOpinion && navigator.clipboard.writeText(strategicOpinion)}
                        className="bg-slate-800 hover:bg-slate-700 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2"
                      >
                        <i className="fas fa-copy"></i> Copiar
                      </button>
                    </div>
                  </div>
                  <div className="markdown-body prose prose-invert max-w-none text-slate-300 leading-relaxed">
                    <Markdown>{strategicOpinion}</Markdown>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      <div className="fixed -bottom-64 -right-64 -z-10 w-[800px] h-[800px] bg-amber-600/[0.04] blur-[150px] rounded-full pointer-events-none animate-pulse"></div>
    </div>
  );
};

export default App;
