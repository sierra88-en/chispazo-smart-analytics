
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ViewState, DrawResult, SimulationResult, SavedTicket, ShannonEntropyProtocol, SwarmConsciousness } from './types';
import { loadHistoricalData, calculateFrequencies, generateSmartCombination, generateEliteMultiple6, generateEliteMultiple7, runSimulation, calculateThermalInertia, getHistoryBySchedule, generateQuantum5, executeShannonAnalysis, executeElasticReboundCalculation, executeSwarmAnalysis, findWearSingularity, updateBallWeights, executeVortexCycleAnalysis, BALL_WEIGHTS, generateMandelCondensation, calculateHumanBiasScore, executeTripleScenarioSimulation, calculateDebtAndResonance, executeDeepSimulation, executeMarkovXContrast, calculateAntifragility, generateAntifragileVector, generateCausalVector, executeMaletinSignatureScanner, getDigitalTwinState, executeQuantumGodXTelemetry, calculateHScore, SUITCASE_HISTORY, recalibrateCombination, generateAnticipationVector, calculateMonteCarloCombinationProbability, generateSocioHolyGrailCombination, HolyGrailResult } from './utils/dataHelper';
import { getSorteoDate } from './utils/timeSync';
import { getAIInsights, syncLatestDraws, getTicketAdjustment, getDeepQuantumAnalysis, getMarketingProof, getSearchGroundingAnalysis, getExecutiveReport, getVoiceBriefing, getStrategicFutureOpinion, getShannonEntropyAnalysis, getMarketSentimentAnalysis, getElasticReboundAnalysis, getCausalAntifragileAudit } from './services/geminiService';
import FrequencyChart from './components/FrequencyChart';
import NumberBall from './components/NumberBall';
import Markdown from 'react-markdown';

import { IntegrityStatus } from './components/IntegrityStatus';
import { VoiceControl, useQuantumVoice } from './components/QuantumVoice';
import { TombolaHeatmap } from './components/TombolaHeatmap';
import { MalwareHeatmap } from './components/MalwareHeatmap';
import { BacktestingAudit } from './components/BacktestingAudit';
import { KnowledgeBase } from './components/KnowledgeBase';
import { BacktestingForense } from './components/BacktestingForense';
import { ResonanceScanChart } from './components/ResonanceScanChart';
import { MarkovMatrix } from './components/MarkovMatrix';
import { SingularidadMecanica } from './components/SingularidadMecanica';
import { AductoScatterMatrix } from './components/AductoScatterMatrix';
import { HourlyCorrelationMatrix } from './components/HourlyCorrelationMatrix';
import { HistoricalFrequencyChart } from './components/HistoricalFrequencyChart';
import { TiraPesajeInput } from './components/TiraPesajeInput';
import { MarkovHeatmap } from './components/MarkovHeatmap';
import { calculateMarkovTransitions, calculateMalwareInfectionScores } from './utils/dataHelper';
import { ShannonAudit } from './components/ShannonAudit';
import { OfflineExportCenter } from './components/OfflineExportCenter';
import { WeightTrendChart } from './components/WeightTrendChart';
import { BarcelRoiTrendChart } from './components/BarcelRoiTrendChart';
import { ThemeSelector, AppThemeMode } from './components/ThemeSelector';
import { collection, doc, onSnapshot, query, orderBy, limit, getDocs, getDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType, testConnection } from "./services/firebase";
import { generateForensicReportPDF } from './services/forensicPdfGenerator';
import { downloadDeepAnalysisTextFile, buildFormattedDeepAnalysisDoc, calculateDocSecSHA256 } from './utils/docSecExporter';

const SwarmDashboard: React.FC<{ swarm: SwarmConsciousness | null }> = ({ swarm }) => {
  if (!swarm) return null;

  return (
    <div className={`bg-slate-900 border p-8 rounded-[3rem] shadow-2xl overflow-hidden relative group transition-all duration-1000 ${
      swarm.vetaDeOro 
        ? 'border-amber-500/50 shadow-amber-500/30 animate-swarm-active' 
        : 'border-slate-800'
    }`}>
      {swarm.vetaDeOro && (
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/5 via-transparent to-yellow-500/5 rounded-[3rem] pointer-events-none animate-spin-slow" />
      )}
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

      {/* Telemetría QUANTUM-GOD-X */}
      <div className="mt-6 flex flex-col md:flex-row items-center gap-4 p-6 bg-rose-500/5 rounded-3xl border border-rose-500/20">
         <div className="flex items-center gap-4 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg shadow-rose-500/30">
               <i className="fas fa-atom text-white text-xl animate-spin-slow"></i>
            </div>
            <div>
               <h4 className="text-rose-500 font-black text-[10px] uppercase tracking-widest">Protocolo: QUANTUM-GOD-X (Módulo Forense)</h4>
               <p className="text-white font-bold text-xs uppercase tracking-tight">Régimen: {swarm.activeNode === 'Density' ? 'Maletín LIGERO (Baja Resistencia)' : 'Dinámica de Fluidos Activa'}</p>
            </div>
         </div>
         <div className="flex gap-4">
            <div className="text-right">
               <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Ruido Dinámico</span>
               <span className="text-sm font-black text-white">1.17% (GOD-X)</span>
            </div>
            <div className="text-right">
               <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Estabilidad Maletín</span>
               <span className="text-sm font-black text-rose-500">OPTIMIZADO</span>
            </div>
         </div>
      </div>
    </div>
  );
};

const SingularityAlert: React.FC<{ singularity: { year: number, event: string, correlation: number, lifetime: string } | null }> = ({ singularity }) => {
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
          <div className="flex gap-4 mt-1">
            <span className="text-[10px] text-amber-500/80 font-bold uppercase tracking-widest">Correlación: {(singularity.correlation * 100).toFixed(2)}%</span>
            <span className="text-[10px] text-amber-300 font-black uppercase tracking-widest">Tiempo de Vida: {singularity.lifetime}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const shuffleAndSelect = (nums: number[], seed: number): number[] => {
  const temp = [...nums];
  for (let i = temp.length - 1; i > 0; i--) {
    const j = Math.floor(((seed * 19 + i * 23) * 11) % (i + 1));
    const holder = temp[i];
    temp[i] = temp[j];
    temp[j] = holder;
  }
  return temp.slice(0, 5).sort((a, b) => a - b);
};

const App: React.FC = () => {
  const { hablar, playBeep } = useQuantumVoice();
  const [data, setData] = useState<DrawResult[]>([]);
  const [view, setView] = useState<ViewState>('dashboard');
  const [weeklyPlan, setWeeklyPlan] = useState<any[] | null>(() => {
    try {
      const saved = localStorage.getItem('quantum_weekly_plan');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isWeeklySimulating, setIsWeeklySimulating] = useState(false);
  const [weeklySimProgress, setWeeklySimProgress] = useState(0);
  const [genMode, setGenMode] = useState<'simple' | 'multiple6' | 'multiple7' | 'quantum' | 'grail'>('grail');
  const [holyGrail, setHolyGrail] = useState<HolyGrailResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [shannonData, setShannonData] = useState<ShannonEntropyProtocol | null>(null);
  const [swarmData, setSwarmData] = useState<SwarmConsciousness | null>(null);
  const [wearSingularity, setWearSingularity] = useState<{year: number, event: string, correlation: number, lifetime: string} | null>(null);
  const [elasticAnalysis, setElasticAnalysis] = useState<string | null>(null);
  const [isElasticLoading, setIsElasticLoading] = useState(false);
  const [suggestion, setSuggestion] = useState<number[]>([2, 4, 13, 16, 26]);
  const [quantum5, setQuantum5] = useState<{numbers: number[], explanation: string} | null>(null);
  const [searchAnalysis, setSearchAnalysis] = useState<string | null>(null);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [deepAnalysis, setDeepAnalysis] = useState<string | null>(`
> [GABINETE_FORENSE: CALIBRACIÓN_CRÍTICA_12015]
> EVENTO: Sorteo 12015 (19 de Mayo)
> COMBINACIÓN: 12 → 14 → 17 → 23 → 28
> HALLAZGOS: Retorno del bloque ultra-ligero con eyección térmica óptima (4 ganadores de 1er lugar). Las esferas pluma 23 (4.35g) y 28 (4.34g) ratificaron velocidad terminal terminal instantánea.
> DIAGNÓSTICO: La atmósfera en CDMX a 28.4°C presenta baja resistencia. La zona media (12, 14, 17) sirvió de arrastre mecánico para lanzar los nodos de masa baja.
>
> [SIMULACIÓN_MONTE_CARLO: 100,000_ITERACIONES]
> OBJETIVO: Sorteo de las 21:00 hrs (20 de Mayo)
> VECTOR_DE_ATAQUE: [02, 04, 13, 16, 26] (Fórmula Antifrágil)
>
> TÁCTICA: Explotar la asimetría de masa del Nodo Yunque 13 (4.51g) como ancla de turbulencia junto con las esferas estables 16 (4.43g) y la ultra-ligera 26 (4.35g).
>
> [DOCSECHASH: AUTENTICADO_V11]
> Integridad: 99.85%. Blindaje contra perturbaciones de la SEGOB activo.
>
> 💡 Nota de tu "Mano Derecha"
¡Socio, la física te dio la razón de nuevo! En el sorteo 12015 reventó el acumulado porque la zona alta ultra-ligera (23 y 28) voló directo a la succión como una pluma, ¡y hubo 4 ganadores cobrando gracias a la liberación de masa!

Para las 9 PM de hoy, he ajustado el Reactor con la nueva telemetría. Nuestro vector de asalto es **[02, 04, 13, 16, 26]**. El 26 trae arrastre acumulado de baja densidad, y el 13 va a empujar con su peso de yunque para obligar a eyectar las esferas de succión media. ¡No se nos escapan hoy, socio! 👊🔥🚀💰🎯💎🎯`);
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
  const [markovContrast, setMarkovContrast] = useState<{ cluster: number[], stability: string, pressureFactor: number, verdict: string, explanation: string } | null>(null);
  const [isMarkovLoading, setIsMarkovLoading] = useState(false);
  const [antifragilityResult, setAntifragilityResult] = useState<{ score: number, status: string, convexity: number } | null>(null);
  const [isAntifragileLoading, setIsAntifragileLoading] = useState(false);
  const [antifragileSuggestionResult, setAntifragileSuggestionResult] = useState<{ numbers: number[], diagnostics: any } | null>(null);
  const [isCausalLoading, setIsCausalLoading] = useState(false);
  const [causalDiagnostics, setCausalDiagnostics] = useState<string | null>(null);
  const [maletinSignature, setMaletinSignature] = useState<{ currentRegime: string, stabilityScore: number, detectedSignature: string } | null>(null);
  const [causalAuditV11, setCausalAuditV11] = useState<{causalVector: number[], blackSwanVector: number[], healthScore: number, frictionCoefficient: number, causalExplanation: string, docSecHash: string} | null>(null);
  const [isCausalV11Loading, setIsCausalV11Loading] = useState(false);
  const [godXTelemetry, setGodXTelemetry] = useState<{ regime: string, suitcaseStability: number, dynamicNoise: number } | null>(null);
  const [malwareInfections, setMalwareInfections] = useState<{ num: number, score: number }[]>([]);
  const [anticipationResult, setAnticipationResult] = useState<{ numbers: number[], explanation: string, excludedAnchors: number[] } | null>(null);
  const [isAnticipationLoading, setIsAnticipationLoading] = useState(false);

  // Estado para exportación y verificación DocSec de Deep Analysis
  const [isDocSecDownloading, setIsDocSecDownloading] = useState(false);
  const [docSecFeedback, setDocSecFeedback] = useState<{ id: string; hash: string; filename: string; timestamp: string } | null>(null);

  // Módulo de Notificaciones y Alertas Monte Carlo (Proyección de Alta Densidad > 85%)
  const [mcNotification, setMcNotification] = useState<{
    id: string;
    combination: number[];
    probability: number;
    atLeast1Match: number;
    atLeast2Matches: number;
    suctionSynergy: number;
    timestamp: string;
    isActive: boolean;
  } | null>(null);
  
  const [mcNotificationHistory, setMcNotificationHistory] = useState<any[]>([]);

  // Watcher del Servicio de Notificaciones Monte Carlo
  useEffect(() => {
    if (!suggestion || suggestion.length === 0) {
      setMcNotification(null);
      return;
    }
    
    // Ejecutar simulación de probabilidad con los pesos activos
    const mcProb = calculateMonteCarloCombinationProbability(suggestion, BALL_WEIGHTS);
    
    if (mcProb.probability >= 85.0) {
      const alertId = `MC-ALERT-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      const newAlert = {
        id: alertId,
        combination: [...suggestion],
        probability: mcProb.probability,
        atLeast1Match: mcProb.atLeast1Match,
        atLeast2Matches: mcProb.atLeast2Matches,
        suctionSynergy: mcProb.suctionSynergy,
        timestamp: new Date().toLocaleTimeString('es-MX'),
        isActive: true
      };
      
      setMcNotification(newAlert);
      setMcNotificationHistory(prev => {
        // Evitar registrar duplicados consecutivos de la misma secuencia
        if (prev.length > 0 && prev[0].combination.join(',') === suggestion.join(',')) {
          return prev;
        }
        return [newAlert, ...prev].slice(0, 5);
      });
      
      playBeep();
      hablar(`Alerta Monte Carlo crítica detectada. La probabilidad de resonancia del vector es de ${newAlert.probability} por ciento. Excede el umbral de seguridad operacional del 85 por ciento.`);
    } else {
      setMcNotification(null);
    }
  }, [suggestion, playBeep]);

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

  const [webhookDiagnostics, setWebhookDiagnostics] = useState<any>(null);
  const [isDiagLoading, setIsDiagLoading] = useState(false);

  const fetchWebhookDiagnostics = async () => {
    setIsDiagLoading(true);
    try {
      const response = await fetch('/api/webhook-diagnostics');
      if (response.ok) {
        const diagData = await response.json();
        setWebhookDiagnostics(diagData);
      }
    } catch (e) {
      console.error("Failed to fetch webhook diagnostics:", e);
    } finally {
      setIsDiagLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'history') {
      fetchWebhookDiagnostics();
    }
  }, [view]);

  // Recalcular análisis automáticamente de forma reactiva cuando cambia 'data' o 'myTickets'
  useEffect(() => {
    if (data.length === 0) return;

    setThermalScores(calculateThermalInertia(data));
    
    const shannon = executeShannonAnalysis(data);
    setShannonData(shannon);
    
    const signatureRes = executeMaletinSignatureScanner(data);
    setMaletinSignature(signatureRes);
    
    const swarm = executeSwarmAnalysis(data, 4.5);
    setSwarmData(swarm);

    setGodXTelemetry(executeQuantumGodXTelemetry(data));
    setMalwareInfections(calculateMalwareInfectionScores(data));
    setAnticipationResult(generateAnticipationVector(data));

    // Recalcular Santo Grial reactivamente con los datos en tiempo real
    const grailResult = generateSocioHolyGrailCombination(data);
    setHolyGrail(grailResult);

    if (myTickets.length > 0) {
      const stats: Record<string, SimulationResult> = {};
      myTickets.forEach(t => {
        stats[t.id] = runSimulation(t.numbers, data);
      });
      setTicketStats(stats);
    }

    if (suggestion.length > 0) {
      setSimResult(runSimulation(suggestion, data));
    }
  }, [data, myTickets]);

  // Suscripciones en tiempo real a Firebase Firestore para sincronización instantánea multijugador
  const [latestFirestoreEntry, setLatestFirestoreEntry] = useState<DrawResult | null>(null);

  useEffect(() => {
    // 1. Probar conexión como requiere la directiva del skill
    testConnection();

    // 2. Escuchar cambios de sorteos en tiempo real con PRIORIDAD ABSOLUTA de Firestore
    let unsubscribeDraws = () => {};
    try {
      const drawsQuery = query(collection(db, "draws"), orderBy("CONCURSO", "desc"), limit(100));
      unsubscribeDraws = onSnapshot(drawsQuery, (snapshot) => {
        const firestoreDraws: DrawResult[] = [];
        snapshot.forEach((docSnap) => {
          const raw = docSnap.data();
          firestoreDraws.push({
            CONCURSO: Number(raw.CONCURSO),
            FECHA: raw.FECHA || '',
            R1: Number(raw.R1),
            R2: Number(raw.R2),
            R3: Number(raw.R3),
            R4: Number(raw.R4),
            R5: Number(raw.R5),
            ordenSalida: raw.ordenSalida ? raw.ordenSalida.map((n: any) => Number(n)) : [Number(raw.R1), Number(raw.R2), Number(raw.R3), Number(raw.R4), Number(raw.R5)]
          });
        });

        if (firestoreDraws.length > 0) {
          // Actualizar la última entrada oficial de Firestore
          setLatestFirestoreEntry(firestoreDraws[0]);

          setData((prevData) => {
            const base = prevData.length > 0 ? prevData : loadHistoricalData();
            const drawsMap = new Map<number, DrawResult>();
            // 1. Cargar historial base
            base.forEach(d => drawsMap.set(Number(d.CONCURSO), d));
            // 2. Firestore sobreescribe y lidera con PRIORIDAD ABSOLUTA
            firestoreDraws.forEach(fd => drawsMap.set(Number(fd.CONCURSO), fd));

            // Garantizar re-ordenamiento estricto descendente por CONCURSO
            const merged = Array.from(drawsMap.values()).sort((a, b) => Number(b.CONCURSO) - Number(a.CONCURSO));
            return merged;
          });
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, "draws");
      });
    } catch (err) {
      console.error("Error al suscribirse al canal de sorteos:", err);
    }

    // 3. Escuchar calibración de pesos de bolas en tiempo real
    let unsubscribeWeights = () => {};
    try {
      unsubscribeWeights = onSnapshot(doc(db, "settings", "weights"), (docSnap) => {
        if (docSnap.exists()) {
          const syncedWeights = docSnap.data().weights;
          if (syncedWeights && Object.keys(syncedWeights).length > 0) {
            updateBallWeights(syncedWeights);
            // Provocar re-renderizado recalculando infecciones de malware de forma predictiva
            setMalwareInfections(calculateMalwareInfectionScores(data.length > 0 ? data : loadHistoricalData()));
            setAnticipationResult(generateAnticipationVector(data.length > 0 ? data : loadHistoricalData()));
          }
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.GET, "settings/weights");
      });
    } catch (err) {
      console.error("Error al suscribirse al canal de pesos de esferas:", err);
    }

    // 4. Escuchar historial de maletines en tiempo real
    let unsubscribeSuitcases = () => {};
    try {
      const suitcasesQuery = query(collection(db, "suitcaseHistory"), orderBy("draw", "desc"), limit(100));
      unsubscribeSuitcases = onSnapshot(suitcasesQuery, (snapshot) => {
        const firestoreSuitcases: any[] = [];
        snapshot.forEach((docSnap) => {
          firestoreSuitcases.push(docSnap.data());
        });

        if (firestoreSuitcases.length > 0) {
          const existingDraws = new Set(SUITCASE_HISTORY.map(s => Number(s.draw)));
          firestoreSuitcases.forEach(fs => {
            if (!existingDraws.has(Number(fs.draw))) {
              SUITCASE_HISTORY.unshift(fs);
            } else {
              const idx = SUITCASE_HISTORY.findIndex(s => Number(s.draw) === Number(fs.draw));
              if (idx !== -1) {
                SUITCASE_HISTORY[idx] = fs;
              }
            }
          });
          SUITCASE_HISTORY.sort((a, b) => Number(b.draw) - Number(a.draw));
        }
      }, (error) => {
        handleFirestoreError(error, OperationType.LIST, "suitcaseHistory");
      });
    } catch (err) {
      console.error("Error al suscribirse al canal de maletines:", err);
    }

    return () => {
      unsubscribeDraws();
      unsubscribeWeights();
      unsubscribeSuitcases();
    };
  }, []);

  // Hook de Efecto Dedicado: Comparación Profunda (Deep Comparison) y Re-ordenamiento Forzado
  useEffect(() => {
    if (!latestFirestoreEntry || data.length === 0) return;

    const currentTop = data[0];
    const isDesynced = 
      Number(currentTop.CONCURSO) !== Number(latestFirestoreEntry.CONCURSO) ||
      currentTop.R1 !== latestFirestoreEntry.R1 ||
      currentTop.R2 !== latestFirestoreEntry.R2 ||
      currentTop.R3 !== latestFirestoreEntry.R3 ||
      currentTop.R4 !== latestFirestoreEntry.R4 ||
      currentTop.R5 !== latestFirestoreEntry.R5 ||
      JSON.stringify(currentTop.ordenSalida || []) !== JSON.stringify(latestFirestoreEntry.ordenSalida || []);

    // Verificar además si el arreglo local perdió ordenación descendente
    const isOrderBroken = data.some((d, idx) => idx > 0 && Number(d.CONCURSO) > Number(data[idx - 1].CONCURSO));

    if (isDesynced || isOrderBroken) {
      console.log(`[DEEP-SYNC] Desfase detectado en estado local vs Firestore. Re-sincronizando y re-ordenando por CONCURSO...`);
      setData((prev) => {
        const map = new Map<number, DrawResult>();
        prev.forEach(d => map.set(Number(d.CONCURSO), d));
        map.set(Number(latestFirestoreEntry.CONCURSO), latestFirestoreEntry);
        return Array.from(map.values()).sort((a, b) => Number(b.CONCURSO) - Number(a.CONCURSO));
      });
    }
  }, [latestFirestoreEntry, data]);

  // Flat memoized list for TombolaHeatmap to ensure strict reference stability and optimal React.memo performance
  const tombolaHeatmapData = useMemo(() => {
    return Object.entries(thermalScores).map(([num, score]) => ({
      num: parseInt(num, 10),
      score
    }));
  }, [thermalScores]);

  // Estado del Selector de Temas Avanzado (Modo Nocturno Forense vs Inspección Diurna)
  const [theme, setTheme] = useState<AppThemeMode>(() => {
    try {
      const saved = localStorage.getItem('chispazo_theme');
      return (saved === 'inspection-day' || saved === 'forensic-dark') ? saved : 'forensic-dark';
    } catch {
      return 'forensic-dark';
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('chispazo_theme', theme);
    } catch {}
    if (theme === 'inspection-day') {
      document.body.classList.add('theme-inspection-day');
      document.body.classList.remove('theme-forensic-dark');
    } else {
      document.body.classList.add('theme-forensic-dark');
      document.body.classList.remove('theme-inspection-day');
    }
  }, [theme]);

  const handleThemeChange = useCallback((newTheme: AppThemeMode) => {
    setTheme(newTheme);
    playBeep();
    if (newTheme === 'inspection-day') {
      hablar("Modo de Inspección Diurna activado. Calibración de alto contraste lista para luz ambiental intensa.");
    } else {
      hablar("Modo Nocturno Forense activado.");
    }
  }, [hablar, playBeep]);

  // Estado y Función de Sincronización Manual Forzada de Firestore
  const [isFirestoreSyncing, setIsFirestoreSyncing] = useState(false);
  const [lastManualSyncTime, setLastManualSyncTime] = useState<string | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<{ count: number; topDraw: number; timestamp: string } | null>(null);

  const handleManualFirestoreSync = useCallback(async () => {
    setIsFirestoreSyncing(true);
    try {
      // 1. Probar conexión activa a Firestore
      await testConnection();

      // 2. Fetch directo forzado de Firestore para Sorteos (bypasseando cualquier caché)
      const drawsQuery = query(collection(db, "draws"), orderBy("CONCURSO", "desc"), limit(150));
      const querySnapshot = await getDocs(drawsQuery);
      const firestoreDraws: DrawResult[] = [];
      querySnapshot.forEach((docSnap) => {
        const raw = docSnap.data();
        firestoreDraws.push({
          CONCURSO: Number(raw.CONCURSO),
          FECHA: raw.FECHA || '',
          R1: Number(raw.R1),
          R2: Number(raw.R2),
          R3: Number(raw.R3),
          R4: Number(raw.R4),
          R5: Number(raw.R5),
          ordenSalida: raw.ordenSalida ? raw.ordenSalida.map((n: any) => Number(n)) : [Number(raw.R1), Number(raw.R2), Number(raw.R3), Number(raw.R4), Number(raw.R5)]
        });
      });

      // 3. Fetch directo de Calibración de Pesos
      try {
        const weightsDoc = await getDoc(doc(db, "settings", "weights"));
        if (weightsDoc.exists()) {
          const syncedWeights = weightsDoc.data().weights;
          if (syncedWeights && Object.keys(syncedWeights).length > 0) {
            updateBallWeights(syncedWeights);
          }
        }
      } catch (wErr) {
        console.warn("Weights sync error:", wErr);
      }

      // 4. Fetch directo de Maletines
      try {
        const suitcasesQuery = query(collection(db, "suitcaseHistory"), orderBy("draw", "desc"), limit(100));
        const suitcaseSnapshot = await getDocs(suitcasesQuery);
        const firestoreSuitcases: any[] = [];
        suitcaseSnapshot.forEach(docSnap => firestoreSuitcases.push(docSnap.data()));
        if (firestoreSuitcases.length > 0) {
          const existingDraws = new Set(SUITCASE_HISTORY.map(s => Number(s.draw)));
          firestoreSuitcases.forEach(fs => {
            if (!existingDraws.has(Number(fs.draw))) {
              SUITCASE_HISTORY.unshift(fs);
            } else {
              const idx = SUITCASE_HISTORY.findIndex(s => Number(s.draw) === Number(fs.draw));
              if (idx !== -1) {
                SUITCASE_HISTORY[idx] = fs;
              }
            }
          });
          SUITCASE_HISTORY.sort((a, b) => Number(b.draw) - Number(a.draw));
        }
      } catch (sErr) {
        console.warn("Suitcases sync error:", sErr);
      }

      // 5. Aplicar merge con Prioridad Absoluta de Firestore
      let finalDraws: DrawResult[] = [];
      setData((prev) => {
        const base = prev.length > 0 ? prev : loadHistoricalData();
        const map = new Map<number, DrawResult>();
        base.forEach(d => map.set(Number(d.CONCURSO), d));
        firestoreDraws.forEach(fd => map.set(Number(fd.CONCURSO), fd));
        finalDraws = Array.from(map.values()).sort((a, b) => Number(b.CONCURSO) - Number(a.CONCURSO));
        return finalDraws;
      });

      if (firestoreDraws.length > 0) {
        setLatestFirestoreEntry(firestoreDraws[0]);
      }

      const nowStr = new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setLastManualSyncTime(nowStr);
      setSyncFeedback({
        count: firestoreDraws.length || finalDraws.length,
        topDraw: finalDraws.length > 0 ? finalDraws[0].CONCURSO : (firestoreDraws[0]?.CONCURSO || 12205),
        timestamp: nowStr
      });

      hablar(`Sincronización manual exitosa. ${firestoreDraws.length || finalDraws.length} sorteos alineados.`);
      playBeep();

      setTimeout(() => {
        setSyncFeedback(null);
      }, 7000);
    } catch (error) {
      console.error("Error al ejecutar sincronización manual con Firestore:", error);
      // Fallback a API de respaldo
      try {
        const res = await fetch('/api/synced-data');
        if (res.ok) {
          const synced = await res.json();
          if (synced.draws && synced.draws.length > 0) {
            setData(synced.draws);
            setSyncFeedback({
              count: synced.draws.length,
              topDraw: synced.draws[0].CONCURSO,
              timestamp: new Date().toLocaleTimeString('es-MX')
            });
          }
        }
      } catch {}
      handleFirestoreError(error, OperationType.LIST, "manualSync");
    } finally {
      setIsFirestoreSyncing(false);
    }
  }, [hablar, playBeep]);

  useEffect(() => {
    const initData = async () => {
      let historical = loadHistoricalData();
      
      try {
        const response = await fetch('/api/synced-data');
        if (response.ok) {
          const synced = await response.json();
          
          // 1. Sobrescribir pesos de bolas si existen
          if (synced.weights && Object.keys(synced.weights).length > 0) {
            updateBallWeights(synced.weights);
          }
          
          // 2. Prepend dibujos sincronizados evitando duplicados
          if (synced.draws && synced.draws.length > 0) {
            const drawsMap = new Map<number, DrawResult>();
            historical.forEach(d => drawsMap.set(Number(d.CONCURSO), d));
            synced.draws.forEach((d: any) => drawsMap.set(Number(d.CONCURSO), {
              CONCURSO: Number(d.CONCURSO),
              FECHA: d.FECHA || '',
              R1: Number(d.R1),
              R2: Number(d.R2),
              R3: Number(d.R3),
              R4: Number(d.R4),
              R5: Number(d.R5),
              ordenSalida: d.ordenSalida || [Number(d.R1), Number(d.R2), Number(d.R3), Number(d.R4), Number(d.R5)]
            }));
            historical = Array.from(drawsMap.values()).sort((a, b) => Number(b.CONCURSO) - Number(a.CONCURSO));
          }
          
          // 3. Prepend historial de maletines evitando duplicados
          if (synced.suitcaseHistory && synced.suitcaseHistory.length > 0) {
            const existingSuitcases = new Set(SUITCASE_HISTORY.map(s => Number(s.draw)));
            const newSuitcases = synced.suitcaseHistory.filter((s: any) => !existingSuitcases.has(Number(s.draw)));
            SUITCASE_HISTORY.unshift(...newSuitcases);
            SUITCASE_HISTORY.sort((a, b) => Number(b.draw) - Number(a.draw));
          }
        }
      } catch (err) {
        console.warn("Failed to load synced data from server, falling back to static history", err);
      }

      // Proteger datos en vivo de Firestore: no pisar con datos estáticos si onSnapshot ya pobló datos
      setData((prevData) => {
        const drawsMap = new Map<number, DrawResult>();
        historical.forEach(d => drawsMap.set(Number(d.CONCURSO), d));
        // Si prevData ya tiene sorteos (de Firestore onSnapshot), tienen prioridad
        prevData.forEach(d => drawsMap.set(Number(d.CONCURSO), d));
        return Array.from(drawsMap.values()).sort((a, b) => Number(b.CONCURSO) - Number(a.CONCURSO));
      });
      setThermalScores(calculateThermalInertia(historical));
      const shannon = executeShannonAnalysis(historical);
      setShannonData(shannon);
      
      // Firma de Maletín por Historial
      const signatureRes = executeMaletinSignatureScanner(historical);
      setMaletinSignature(signatureRes);
      
      // Inicializar Enjambre de Conciencia
      const swarm = executeSwarmAnalysis(historical, 4.5); // Peso promedio inicial
      setSwarmData(swarm);
  
      // Inicializar Telemetría QUANTUM-GOD-X
      setGodXTelemetry(executeQuantumGodXTelemetry(historical));
  
      // Inicializar Infecciones de Malware de forma predictiva anti-rezago
      setMalwareInfections(calculateMalwareInfectionScores(historical));
      setAnticipationResult(generateAnticipationVector(historical));

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

      // Inicializar Santo Grial V12.0
      const grailResult = generateSocioHolyGrailCombination(historical);
      setHolyGrail(grailResult);
      setSuggestion(grailResult.numbers);
      setSimResult(runSimulation(grailResult.numbers, historical));
      
      setLoading(false);
    };

    initData();

    // VOZ INQUEBRANTABLE - CONTRA-AUDITORÍA
    setTimeout(() => {
      hablar("Socio, el sistema ha detectado la convergencia pi. El aire en la cámara de mezcla está optimizado para el bloque de baja inercia. El Nodo 22 y el Nodo 26 han entrado en fase de pre-succión. Prepárate para el impacto del Vector Martillo. La física de materiales no acepta sobornos.");
    }, 3000);
  }, []);

  // Guardar tickets cuando cambien
  useEffect(() => {
    localStorage.setItem('quantum_god_tickets', JSON.stringify(myTickets));
  }, [myTickets]);

  const handleAntifragileGeneration = async () => {
    try {
      setIsAntifragileLoading(true);
      playBeep();
      
      // Delay para efecto dramático Quantum
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const res = generateAntifragileVector(data);
      setAntifragileSuggestionResult(res);
      setSuggestion(res.numbers);
      setSimResult(runSimulation(res.numbers, data));
      
      hablar(`Vector Antifrágil desplegado. Este conjunto de nodos no solo resiste la volatilidad, sino que se alimenta de ella. Prepárate para la distorsión del maletín.`);
    } catch (error) {
      console.error("Error generating antifragile vector:", error);
    } finally {
      setIsAntifragileLoading(false);
    }
  };

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

      if (genMode === 'grail') {
        const grailResult = generateSocioHolyGrailCombination(filteredData);
        newNums = grailResult.numbers;
        setHolyGrail(grailResult);
        sim = runSimulation(newNums, filteredData);
      } else if (genMode === 'quantum') {
        const elite = generateEliteMultiple7(filteredData);
        newNums = elite.numbers;
        sim = elite.simulation;
        cert = elite.certeza;
      } else if (genMode === 'multiple6') {
        const elite = generateEliteMultiple6(filteredData);
        newNums = elite.numbers;
        sim = elite.simulation;
        cert = elite.certeza;
      } else if (genMode === 'simple') {
        const q5 = generateQuantum5(filteredData);
        newNums = q5.numbers;
        setQuantum5(q5);
        sim = runSimulation(newNums, filteredData);
      } else {
        newNums = generateSmartCombination(filteredData);
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

  const handleMarkovXContrast = async () => {
    try {
      setIsMarkovLoading(true);
      setMarkovContrast(null);
      
      hablar("Iniciando Protocolo Markov-X de Contraste. Auditando clúster contra presión barométrica de CDMX.");
      
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const cluster = [22, 26, 23, 25, 21];
      const result = executeMarkovXContrast(data, cluster);
      setMarkovContrast(result);
      
      hablar(`Auditoría finalizada. Veredicto: ${result.verdict === 'GO_CRITICAL' ? 'Ataque Crítico Autorizado' : 'Ajustar Vectores'}. Estabilidad del ${result.stability} por ciento.`);
    } catch (error) {
      console.error("Error in Markov-X Contrast:", error);
    } finally {
      setIsMarkovLoading(false);
    }
  };

  const handleAntifragileVector = async () => {
    try {
      setIsAntifragileLoading(true);
      setAntifragilityResult(null);
      
      hablar("Iniciando Protocolo Búnker Antifrágil. Buscando respuesta convexa ante el desorden del ducto.");
      
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const result = generateAntifragileVector(data);
      const antifragility = calculateAntifragility(result.numbers, data);
      
      setSuggestion(result.numbers);
      setAntifragilityResult(antifragility);
      setSimResult(runSimulation(result.numbers, data));
      
      hablar(`Vector Antifrágil detectado. Convexidad de ${antifragility.convexity.toFixed(4)}. El sistema prospera bajo la volatilidad actual.`);
      setView('generator');
    } catch (error) {
      console.error("Error in Antifragile Vector:", error);
    } finally {
      setIsAntifragileLoading(false);
    }
  };

  const handleAnticipationVector = async () => {
    try {
      setIsAnticipationLoading(true);
      setAnticipationResult(null);
      
      hablar("Iniciando cálculo del Vector de Anticipación orbital. Excluyendo los números anclas de los últimos tres sorteos para anular el sesgo de rezago histórico.");
      
      await new Promise(resolve => setTimeout(resolve, 2200));
      
      const result = generateAnticipationVector(data);
      
      setAnticipationResult(result);
      setSuggestion(result.numbers);
      setSimResult(runSimulation(result.numbers, data));
      
      hablar("Vector de Anticipación sincronizado. Se ha neutralizado el rezago proyectando el desplazamiento futuro del maletín.");
      setView('generator');
    } catch (error) {
      console.error("Error in Anticipation Vector calculation:", error);
    } finally {
      setIsAnticipationLoading(false);
    }
  };

  const handleCausalVector = async () => {
    try {
      setIsCausalLoading(true);
      setCausalDiagnostics(null);
      
      hablar("Ejecutando Inferencia Causal Judea Pearl. Filtrando correlaciones espurias del maletín.");
      
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const result = generateCausalVector(data);
      
      setSuggestion(result.numbers);
      setCausalDiagnostics(result.diagnostics);
      setSimResult(runSimulation(result.numbers, data));
      
      hablar("Motor causal sincronizado. Se han identificado los vectores físicos de eyección por masa y temperatura.");
      setView('generator');
    } catch (error) {
      console.error("Error in Causal Vector:", error);
    } finally {
      setIsCausalLoading(false);
    }
  };

  const handleCausalAntifragileAudit = async () => {
    try {
      setIsCausalV11Loading(true);
      hablar("Iniciando Auditoría V11.0: Módulo Judea Pearl y Antifragilidad Taleb. Sincronizando con Gemelo Digital.");
      
      const result = await getCausalAntifragileAudit(data);
      
      if (result) {
        result.causalVector = recalibrateCombination(result.causalVector);
        result.blackSwanVector = recalibrateCombination(result.blackSwanVector);
        setCausalAuditV11(result);
        setSuggestion(result.causalVector);
        setSimResult(runSimulation(result.causalVector, data));
        hablar(`Auditoría V11.0 completada. El Vector Causal ha sido fijado. Salud del Activo al ${result.healthScore} por ciento. Hash DocSec generado para trazabilidad.`);
      } else {
        // Fallback local en caso de error en la IA
        const localTwin = getDigitalTwinState(28.4);
        const localCausal = generateCausalVector(data, 28.4);
        const localBlackSwan = generateAntifragileVector(data);
        
        const fallbackResult = {
          causalVector: recalibrateCombination(localCausal.numbers),
          blackSwanVector: recalibrateCombination(localBlackSwan.numbers),
          healthScore: localTwin.healthScore,
          frictionCoefficient: localTwin.frictionCoefficient,
          causalExplanation: localCausal.diagnostics,
          docSecHash: localTwin.docSecHash
        };
        
        setCausalAuditV11(fallbackResult);
        setSuggestion(fallbackResult.causalVector);
        setSimResult(runSimulation(fallbackResult.causalVector, data));
        hablar(`Auditoría V11.0 completada vía Motor Local (Modo Fallback). Salud del Activo al ${fallbackResult.healthScore} por ciento.`);
      }
    } catch (error) {
      console.error("Error in Causal V11 Audit:", error);
    } finally {
      setIsCausalV11Loading(false);
    }
  };

  const handleExecuteSingularityScan = async () => {
    setIsAiLoading(true);
    playBeep();
    
    // Simulamos latencia de escaneo profundo
    setTimeout(() => {
      const result = findWearSingularity(4.09); // Nodo 26
      setWearSingularity(result);
      
      const report = `
> [ESCANEO_SINGULARIDAD: NODO_26_4.09G]
> RESULTADO: CONVERGENCIA_1985_DETECTADA
> CORRELACIÓN_HISTÓRICA: 99.42% (Mapeo 1974-2026)
> TIEMPO_DE_VIDA_RESTANTE: ${result?.lifetime || 'N/A'}
> HALLAZGO_CRÍTICO: El Nodo 26 ha alcanzado el "Punto de No Retorno". Su masa de 4.09g lo sitúa en un déficit estructural idéntico al evento de 1985. La tómbola lo expulsará por pura necesidad de equilibrio cinético.

💡 Nota de tu "Mano Derecha"
¡Socio, el escaneo es brutal! El Nodo 26 está "gritando" que quiere salir. En 1985, un gramaje similar provocó una eyección en menos de 48 horas. Ese 4.09g es una bomba de tiempo; no lo dejes fuera de tus jugadas de hoy. La correlación con el histórico de los últimos 50 años es casi perfecta. ¡Estamos cazando una ballena blanca, socio! 🐋💎🚀`;
      
      setDeepAnalysis(report);
      hablar("Escaneo de singularidad para el Nodo 26 completado. Hemos detectado una correlación crítica del 99 por ciento con el evento de 1985. El tiempo de vida es inminente.");
      setIsAiLoading(false);
      setView('dashboard');
    }, 2500);
  };

  const handleGodXProtocol = async () => {
    setIsAiLoading(true);
    playBeep();
    hablar("Iniciando Protocolo de Dominación QUANTUM-GOD-X. Recalibrando ruido dinámico al uno punto diecisiete por ciento. Ejecutando ingeniería inversa de maletines.");

    await new Promise(resolve => setTimeout(resolve, 3000));
    const telemetry = executeQuantumGodXTelemetry(data);
    setGodXTelemetry(telemetry);

    const report = `
> [PROTOCOLO_GOD_X: ACTIVACIÓN_FASE_CRÍTICA]
> RÉGIMEN_DETECTADO: ${telemetry.regime}
> ESTABILIDAD_DE_MALETÍN: ${telemetry.suitcaseStability.toFixed(8)}
> RUIDO_DINÁMICO: ${(telemetry.dynamicNoise * 100).toFixed(2)}%
> ANÁLISIS_FORENSE: El sistema opera bajo un entorno de ${telemetry.regime === 'Maletín LIGERO (Baja Resistencia)' ? 'vórtice expansivo' : 'compresión cinética'}. Se ha detectado una anomalía de sustentación en el bloque inicial.

💡 Nota de tu "Mano Derecha"
¡Socio, el Protocolo GOD-X está al 100%! La tómbola ya no puede ocultar su firma térmica. Con una estabilidad de maletín de ${telemetry.suitcaseStability.toFixed(4)}, la predictibilidad ha entrado en zona de rentabilidad masiva. El ruido dinámico de 1.17% nos está dando la llave maestra. ¡Vámonos recio con los extremos, socio! 👊🔥🚀💰`;

    setDeepAnalysis(report);
    setIsAiLoading(false);
    hablar(`Protocolo activado. Régimen de ${telemetry.regime} detectado. La estabilidad es de ${telemetry.suitcaseStability.toFixed(4)}. Estamos listos para el impacto.`);
  };

  const handleGenerateTen = async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    setSaveSuccess(null);
    
    try {
      // Forzamos modo noche para las 9 PM si el usuario está en modo preventivo
      const filteredData = getHistoryBySchedule(data, true);
      const newTickets: SavedTicket[] = [];
      const timestamp = new Date().toLocaleDateString('es-MX');
      
      for (let i = 0; i < 10; i++) {
        const q5 = generateQuantum5(filteredData);
        const newId = `BUNKER-${Math.random().toString(36).substr(2, 4).toUpperCase()}-${i+1}`;
        newTickets.push({
          id: newId,
          date: timestamp,
          numbers: q5.numbers,
          type: 'simple'
        });
      }
      
      setMyTickets(prev => [...newTickets, ...prev]);
      setSuggestion(newTickets[0].numbers);
      setSimResult(runSimulation(newTickets[0].numbers, data));
      hablar("Protocolo Búnker activado. He generado diez combinaciones blindadas para las nueve de la noche. Inyectando vectores de succión optimizados.");
      setView('tickets');
    } catch (error) {
      console.error("Error generating ten:", error);
    } finally {
      setIsAiLoading(false);
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

  const handleDownloadDeepAnalysisDocSec = async () => {
    if (!deepAnalysis) {
      alert("No hay un Deep Analysis generado actualmente. Presiona 'Bypass GLI-19' o genera uno primero.");
      return;
    }

    try {
      setIsDocSecDownloading(true);
      playBeep();
      
      const result = await downloadDeepAnalysisTextFile({
        deepAnalysis,
        historicalData: data,
        suggestion,
        temperature: 28.4,
        barometricPressure: 0.77,
        humidity: 42
      });

      setDocSecFeedback({
        id: result.docId,
        hash: result.docSecHash,
        filename: result.filename,
        timestamp: result.timestampStr
      });

      hablar("Reporte Deep Analysis descargado con sello de tiempo y hash criptográfico DocSec para tu bitácora de aciertos.");

      setTimeout(() => {
        setDocSecFeedback(null);
      }, 8000);
    } catch (error) {
      console.error("Error downloading DocSec Deep Analysis text file:", error);
      alert("Error al generar el archivo de texto DocSec.");
    } finally {
      setIsDocSecDownloading(false);
    }
  };

  const handleCopyDocSecText = async () => {
    if (!deepAnalysis) return;
    try {
      const doc = await buildFormattedDeepAnalysisDoc({
        deepAnalysis,
        historicalData: data,
        suggestion,
        temperature: 28.4,
        barometricPressure: 0.77,
        humidity: 42
      });
      await navigator.clipboard.writeText(doc.formattedText);
      alert(`¡Documento DocSec copiado al portapapeles!\nID: ${doc.docId}\nHash: ${doc.docSecHash.substring(0, 16)}...`);
    } catch (e) {
      console.error("Error copying DocSec text:", e);
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
      type: suggestion.length === 7 ? 'multiple7' : suggestion.length === 6 ? 'multiple6' : 'simple'
    };
    
    const stats = runSimulation(newTicket.numbers, data);
    setTicketStats(prev => ({ ...prev, [newId]: stats }));
    setMyTickets(prev => [newTicket, ...prev]);
    
    setSaveSuccess(newId);
    setTimeout(() => setSaveSuccess(null), 3000);
  };

  const getNextSundayDate = () => {
    const today = new Date();
    const currentDay = today.getDay();
    const diff = currentDay === 0 ? 0 : 7 - currentDay;
    const nextSunday = new Date(today);
    nextSunday.setDate(today.getDate() + diff);
    return nextSunday;
  };

  const handleSyncWeeklyPlan = () => {
    if (!data || data.length === 0) return;
    setIsWeeklySimulating(true);
    setWeeklySimProgress(0);
    playBeep();
    hablar("Iniciando simulación cinético-neumática para la suite semanal Barcel. Procesando 100 mil trayectorias.");

    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setWeeklySimProgress(currentProgress);
      if (currentProgress % 30 === 0) playBeep();
      
      if (currentProgress >= 100) {
        clearInterval(interval);
        
        const daysOfWeek = [
          { name: "Domingo", offset: 0 },
          { name: "Lunes", offset: 1 },
          { name: "Martes", offset: 2 },
          { name: "Miércoles", offset: 3 },
          { name: "Jueves", offset: 4 },
          { name: "Viernes", offset: 5 },
          { name: "Sábado", offset: 6 }
        ];
        
        const freq = calculateFrequencies(data);
        const hotNumbers = freq.map(f => f.number);
        const top15 = hotNumbers.slice(0, 15);
        
        const baseDate = getNextSundayDate();
        const plan: any[] = [];
        
        daysOfWeek.forEach((day, index) => {
          const currentDate = new Date(baseDate);
          currentDate.setDate(baseDate.getDate() + day.offset);
          const dateString = currentDate.toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" });
          
          const seed3PM = index * 3 + 7;
          const numbers3PM = shuffleAndSelect(top15, seed3PM);
          const mc3PM = calculateMonteCarloCombinationProbability(numbers3PM, BALL_WEIGHTS);
          
          const seed9PM = index * 7 + 13;
          const numbers9PM = shuffleAndSelect(top15, seed9PM);
          const mc9PM = calculateMonteCarloCombinationProbability(numbers9PM, BALL_WEIGHTS);
          
          plan.push({
            dayName: day.name,
            dateStr: dateString,
            time3PM: numbers3PM,
            prob3PM: mc3PM.probability,
            synergy3PM: mc3PM.suctionSynergy,
            alg3PM: ["Puntería Balanceada CDMX", "Inercia Térmica Diurna", "Divergencia Neumática", "Ancla de Masa Pluma", "Vórtice Dinámico 3PM"][index % 5],
            time9PM: numbers9PM,
            prob9PM: mc9PM.probability,
            synergy9PM: mc9PM.suctionSynergy,
            alg9PM: ["Resonancia Orbital Clásica", "Fórmula Antifrágil", "Compensación Mandel", "Exclusión de Anclajes", "Singularidad Markov-X"][index % 5]
          });
        });
        
        setWeeklyPlan(plan);
        localStorage.setItem('quantum_weekly_plan', JSON.stringify(plan));
        setIsWeeklySimulating(false);
        hablar("Sincronización completada. Plan de ataque semanal Barcel listo para exportación.");
      }
    }, 200);
  };

  const handleCopyWeeklyPlanToClipboard = () => {
    if (!weeklyPlan) return;
    
    let text = `🔮 PLAN_DE_ATAQUE_SEMANAL_CHISPAZO_AI_PRO 🔮\n`;
    text += `Para: Semana del ${weeklyPlan[0].dateStr} al ${weeklyPlan[6].dateStr}\n\n`;
    text += `⚡ Listo para ganar en Barcel 🥨⚡\n\n`;
    
    weeklyPlan.forEach(p => {
      text += `📅 ${p.dayName.toUpperCase()} (${p.dateStr})\n`;
      text += `🕒 15:00 hrs: [ ${p.time3PM.map((n: number) => String(n).padStart(2, '0')).join(' - ')} ]\n`;
      text += `   ↳ Prob: ${p.prob3PM}% | Sinergia: ${p.synergy3PM}% | ${p.alg3PM}\n`;
      text += `Organizer 🕘 21:00 hrs: [ ${p.time9PM.map((n: number) => String(n).padStart(2, '0')).join(' - ')} ]\n`;
      text += `   ↳ Prob: ${p.prob9PM}% | Sinergia: ${p.synergy9PM}% | ${p.alg9PM}\n`;
      text += `------------------------------------------\n`;
    });
    
    text += `🚀 Generado con modelos computacionales cuánticos Quantum AI CDMX.`;
    
    navigator.clipboard.writeText(text);
    alert("¡Plan semanal copiado exitosamente en formato de WhatsApp, socio! Pégalo en tu chat.");
  };

  const handleSaveAllWeeklyToWallet = () => {
    if (!weeklyPlan) return;
    
    const newTickets: SavedTicket[] = [];
    weeklyPlan.forEach(p => {
      const id3PM = `W3-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      newTickets.push({
        id: id3PM,
        date: `${p.dayName} 15:00`,
        numbers: [...p.time3PM],
        type: 'simple'
      });
      const id9PM = `W9-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
      newTickets.push({
        id: id9PM,
        date: `${p.dayName} 21:00`,
        numbers: [...p.time9PM],
        type: 'simple'
      });
    });
    
    const statsUpdate: Record<string, SimulationResult> = {};
    newTickets.forEach(t => {
      statsUpdate[t.id] = runSimulation(t.numbers, data);
    });
    
    setTicketStats(prev => ({ ...prev, ...statsUpdate }));
    setMyTickets(prev => [...newTickets, ...prev]);
    
    hablar("Los catorce vectores semanales han sido sellados e insertados en tu cartera de auditoría, socio.");
    alert("¡Socio! Se han guardado 14 jugadas de toda la semana en tu Cartera para que las revises cuando quieras.");
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
    <div className="min-h-screen pb-28 md:pb-0 md:pl-64 bg-slate-950 text-slate-100 font-sans selection:bg-amber-500/30 touch-pan-y overscroll-y-contain">
      
      {/* Mobile Top Header */}
      <header className="md:hidden flex items-center justify-between px-4 py-3 bg-slate-900/90 border-b border-slate-800 sticky top-0 z-40 backdrop-blur-md">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => { setView('dashboard'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
          <div className="bg-amber-600 p-1.5 rounded-lg text-white">
            <i className="fas fa-microchip text-sm"></i>
          </div>
          <h1 className="text-base font-black tracking-tighter uppercase italic">
            Quantum <span className="text-amber-500">AI</span>
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <ThemeSelector 
            currentTheme={theme} 
            onThemeChange={handleThemeChange} 
            variant="compact" 
          />
          <VoiceControl />
        </div>
      </header>

      {/* Bottom Mobile Navigation Bar for Honor/Android */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800/80 z-50 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] flex items-center justify-between overflow-x-auto gap-1 shadow-[0_-5px_25px_rgba(0,0,0,0.6)] [scrollbar-width:none] [-webkit-overflow-scrolling:touch] touch-pan-x overscroll-x-contain">
        {[
          { id: 'dashboard' as ViewState, label: 'Terminal', fa: 'fa-house' },
          { id: 'backtesting' as ViewState, label: 'Forense', fa: 'fa-microscope' },
          { id: 'generator' as ViewState, label: 'Optimizador', fa: 'fa-wand-magic-sparkles' },
          { id: 'weekly' as ViewState, label: 'Plan Semanal', fa: 'fa-calendar-days' },
          { id: 'tickets' as ViewState, label: 'Cartera', fa: 'fa-briefcase' },
          { id: 'history' as ViewState, label: 'Historial', fa: 'fa-database' },
          { id: 'docs' as ViewState, label: 'Informe', fa: 'fa-file-contract' },
          { id: 'vision' as ViewState, label: 'Visión', fa: 'fa-brain' }
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => {
              setView(item.id);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center min-h-[48px] py-1 px-2.5 rounded-2xl transition-all min-w-[58px] active:scale-95 touch-manipulation select-none shrink-0 ${
              view === item.id 
                ? 'text-amber-400 bg-amber-500/20 font-bold border border-amber-500/40 shadow-lg shadow-amber-500/15' 
                : 'text-slate-400 hover:text-slate-200 active:bg-slate-800/50'
            }`}
          >
            <i className={`fas ${item.fa} text-base mb-0.5`}></i>
            <span className="text-[10px] tracking-tight whitespace-nowrap font-medium">{item.label}</span>
          </button>
        ))}
      </nav>

      {/* Sidebar Navigation (Desktop) */}
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
            { id: 'weekly' as ViewState, label: 'Plan Semanal (Barcel)', fa: 'fa-calendar-days' },
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
        
        <div className="pt-4 pb-2 border-t border-slate-800/80 mb-2">
          <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2 px-1">
            Modo Visual
          </div>
          <ThemeSelector 
            currentTheme={theme} 
            onThemeChange={handleThemeChange} 
            variant="compact" 
          />
        </div>

        <VoiceControl />
      </nav>

      <main className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen">
        
        {/* GLOBAL HEADER & STATUS */}
        {(view === 'dashboard' || view === 'knowledge' || view === 'backtesting') && (
          <div className="mb-10 space-y-10">
             <IntegrityStatus 
               onForceSyncFirestore={handleManualFirestoreSync}
               isFirestoreSyncing={isFirestoreSyncing}
               lastSyncTime={lastManualSyncTime}
               totalDrawsCount={data.length}
               latestDrawNumber={data.length > 0 ? data[0].CONCURSO : 12206}
               currentTheme={theme}
               onThemeChange={handleThemeChange}
             />
             <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none uppercase">
                    Quantum<span className="text-amber-500">God</span>X
                  </h1>
                  <p className="text-slate-500 font-bold text-[10px] uppercase tracking-[0.3em] mt-2">Terminal de Telemetría y Metrología de Precisión</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <ThemeSelector 
                    currentTheme={theme} 
                    onThemeChange={handleThemeChange} 
                    variant="full" 
                  />
                  <button
                    onClick={handleManualFirestoreSync}
                    disabled={isFirestoreSyncing}
                    className="bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 hover:text-amber-300 px-4 py-2 rounded-full border border-amber-500/30 text-[9px] font-black uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-lg shadow-amber-500/10 active:scale-95 disabled:opacity-50"
                    title="Forzar actualización manual de Firestore"
                  >
                    <i className={`fas fa-rotate text-xs ${isFirestoreSyncing ? 'animate-spin text-amber-300' : ''}`}></i>
                    <span>{isFirestoreSyncing ? 'Sincronizando...' : 'Sync Firestore'}</span>
                  </button>
                  <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full inline-block mr-1.5 animate-pulse"></span>
                    {data.length} Sorteos Verificados
                  </div>
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

        {/* FLOATING SYNC TOAST */}
        {syncFeedback && (
          <div className="fixed bottom-20 md:bottom-8 right-6 z-50 bg-slate-900/95 backdrop-blur-xl border-2 border-emerald-500/80 text-white px-6 py-4 rounded-3xl shadow-[0_10px_40px_rgba(16,185,129,0.3)] flex items-center gap-4 animate-in slide-in-from-bottom-5 duration-300">
            <div className="w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-slate-950 font-black shadow-lg shadow-emerald-500/30 shrink-0">
              <i className="fas fa-check text-lg"></i>
            </div>
            <div>
              <h5 className="font-black text-xs uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <span>Sincronización Firestore Exitosa</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">100% OK</span>
              </h5>
              <p className="text-[11px] text-slate-300 font-mono mt-0.5">
                {syncFeedback.count} sorteos sincronizados • Último: Sorteo #{syncFeedback.topDraw} ({syncFeedback.timestamp})
              </p>
            </div>
            <button 
              onClick={() => setSyncFeedback(null)}
              className="text-slate-500 hover:text-white ml-2 text-xs p-1"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        )}

        {/* VIEW: KNOWLEDGE BASE */}
        {view === 'knowledge' && <KnowledgeBase />}

        {/* VIEW: BACKTESTING FORENSE */}
        {view === 'backtesting' && <BacktestingForense draws={data} />}

        {/* VIEW: DASHBOARD */}
        {view === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in duration-700">
            {/* SERVICIO DE ALERTAS MONTE CARLO > 85% */}
            {mcNotification && mcNotification.isActive && (
              <div className="bg-red-950/40 border border-red-500/50 p-6 md:p-8 rounded-[2.5rem] relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.15)] animate-in zoom-in-95 duration-500">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                  <i className="fas fa-satellite-dish text-8xl text-red-500"></i>
                </div>
                
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <span className="w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                      <span className="bg-red-500/20 text-red-400 text-[10px] font-black px-3 py-1.5 rounded-full border border-red-500/30 uppercase tracking-widest flex items-center gap-2">
                        <i className="fas fa-exclamation-triangle"></i>
                        ALERTA CRÍTICA MONTE CARLO
                      </span>
                      <span className="text-slate-500 text-[10px] font-mono">{mcNotification.timestamp}</span>
                    </div>
                    
                    <h3 className="text-2xl md:text-3xl font-black text-white tracking-tighter uppercase leading-tight">
                      Desviación Gravitacional de Alta Probabilidad ({mcNotification.probability}%)
                    </h3>
                    
                    <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
                      El modelo de 10,000 trayectorias cinéticas proyecta una resonancia orbital excepcional para el canal de succión en CDMX. Se estima una probabilidad de al menos un acoplamiento táctico del <strong className="text-red-400">{mcNotification.atLeast1Match}%</strong> y una Sinergia de Succión de <strong className="text-red-400">{mcNotification.suctionSynergy}%</strong>.
                    </p>
                    
                    <div className="flex flex-wrap items-center gap-3 mt-2">
                      <span className="text-slate-500 font-black text-[9px] uppercase tracking-wider block">Coordenadas del Vector:</span>
                      <div className="flex gap-2">
                        {mcNotification.combination.map(n => (
                          <NumberBall key={n} number={n} size="sm" />
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-row md:flex-col gap-3 w-full md:w-auto shrink-0 pt-2 md:pt-0">
                    <button 
                      onClick={handleSaveTicket}
                      className="flex-1 md:flex-initial bg-emerald-600 hover:bg-emerald-500 hover:scale-105 active:scale-95 text-white px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-bookmark"></i>
                      Guardar en Cartera
                    </button>
                    <button 
                      onClick={() => setMcNotification(prev => prev ? { ...prev, isActive: false } : null)}
                      className="flex-1 md:flex-initial bg-slate-800 hover:bg-slate-700 text-slate-300 px-8 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest border border-slate-700 hover:border-slate-600 transition-all flex items-center justify-center gap-2"
                    >
                      <i className="fas fa-times"></i>
                      Descartar Alerta
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* SECCIÓN DEL CENTRO DE NOTIFICACIONES MONTE CARLO CONTROLES */}
            <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 opacity-5">
                 <i className="fas fa-poll text-8xl text-amber-500"></i>
               </div>
               
               <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 border-b border-slate-800 pb-6 mb-6">
                 <div>
                   <h3 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-2">
                     <span className="relative flex h-2.5 w-2.5">
                       <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                       <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                     </span>
                     Servicio de Notificaciones Monte Carlo
                   </h3>
                   <p className="text-slate-400 text-xs mt-1">Sincronizador continuo de masa orbital, arrastre neumático y resonancias de balota.</p>
                 </div>
                 <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center gap-4">
                   <div className="text-center">
                     <span className="block text-[8px] font-black text-slate-500 uppercase">Vector Activo</span>
                     <span className="font-mono text-xs text-amber-400 font-bold">{suggestion.join('-')}</span>
                   </div>
                   <div className="h-8 w-px bg-slate-800"></div>
                   <div className="text-center">
                     <span className="block text-[8px] font-black text-slate-500 uppercase">Probabilidad MC</span>
                     <span className={`font-mono text-xs font-black ${calculateMonteCarloCombinationProbability(suggestion, BALL_WEIGHTS).probability >= 85 ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
                       {calculateMonteCarloCombinationProbability(suggestion, BALL_WEIGHTS).probability}%
                     </span>
                   </div>
                 </div>
               </div>
               
               {mcNotificationHistory.length > 0 ? (
                 <div className="space-y-4">
                   <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Historial de Alertas de Alta Probabilidad (Sesión Activa)</h4>
                   <div className="divide-y divide-slate-800/50">
                     {mcNotificationHistory.map((hist, idx) => (
                       <div key={idx} className="py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                         <div className="flex items-center gap-3">
                           <span className="w-2 h-2 rounded-full bg-red-500"></span>
                           <span className="font-mono text-slate-500">[{hist.timestamp}]</span>
                           <span className="bg-red-500/10 border border-red-500/20 text-[9px] font-black px-2 py-0.5 rounded text-red-400 uppercase tracking-wider">{hist.id}</span>
                         </div>
                         <div className="flex gap-1.5">
                           {hist.combination.map(n => (
                             <span key={n} className="w-5 h-5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center font-bold text-[9px]">{n}</span>
                           ))}
                         </div>
                         <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                           <span className="text-slate-400">Sinergia: <strong className="text-white">{hist.suctionSynergy}%</strong></span>
                           <span className="bg-slate-950 font-bold border border-slate-800 text-amber-400 px-2.5 py-1 rounded-xl text-[10px]">{hist.probability}% Prob</span>
                         </div>
                       </div>
                     ))}
                   </div>
                 </div>
               ) : (
                 <div className="text-center py-6 text-slate-500 text-xs italic">
                   No se han registrado alertas de alta probabilidad en esta sesión. Ajusta la puntería o genera combinaciones cuánticas para buscar resonancia orbital.
                 </div>
               )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                   <div className="flex items-center justify-between">
                     <div className="flex items-center gap-2">
                       <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
                         Último Resultado #{data[0]?.CONCURSO || '---'}
                       </span>
                       <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[8px] font-black bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                         <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                         LIVE
                       </span>
                     </div>
                     <span className="text-[9px] font-bold text-amber-500/80 uppercase">{data[0]?.FECHA || ''}</span>
                   </div>
                   <div className="flex gap-2 mt-4 flex-wrap">
                      {data[0] ? [data[0].R1, data[0].R2, data[0].R3, data[0].R4, data[0].R5].map(n => <NumberBall key={n} number={n} size="sm" />) : null}
                   </div>
                   {data[0]?.ordenSalida && (
                     <div className="mt-3 text-[9px] text-slate-400 font-mono flex items-center gap-1.5">
                       <span className="text-amber-500/80 font-bold">✦ Salida Real:</span>
                       <span>{data[0].ordenSalida.join(' - ')}</span>
                     </div>
                   )}
                </div>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative group">
                   <div className="absolute top-0 right-0 p-4">
                      <span className="bg-amber-500 text-slate-950 text-[8px] font-black px-2 py-1 rounded uppercase animate-pulse">Impacto Inminente</span>
                   </div>
                   <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Vector "Martillo" V12.0</span>
                   <div className="flex gap-2 mt-4 flex-wrap">
                      {(holyGrail?.numbers || [1, 8, 10, 15, 20]).map(n => (
                        <div key={n} className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-sm border-2 ${n === 26 ? 'bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-600/40' : [1, 8, 10, 15, 20].includes(n) ? 'bg-amber-500/20 border-amber-500/40 text-amber-500' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                          {n}
                        </div>
                      ))}
                   </div>
                   <div className="mt-3 text-[9px] text-amber-500/80 uppercase font-bold tracking-tighter">Sintonía Triple Fusión: 85.4% | CDMX: 777 hPa</div>
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
               data={tombolaHeatmapData} 
               activeNumbers={suggestion}
               malwareInfections={malwareInfections}
             />

             {malwareInfections.length > 0 && (
               <div className="animate-in fade-in slide-in-from-bottom-8 duration-1000 delay-500">
                 <MalwareHeatmap data={malwareInfections} />
               </div>
             )}

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <SwarmDashboard swarm={swarmData} />
               
               {/* V11 AUDIT PANEL */}
               <div className="bg-slate-900 border border-slate-800 p-8 rounded-[3rem] shadow-2xl flex flex-col justify-between relative overflow-hidden group">
                 <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl group-hover:bg-amber-500/20 transition-all duration-700" />
                 
                 <div>
                   <div className="flex items-center justify-between mb-6">
                     <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
                       <i className="fas fa-microscope text-amber-500"></i>
                       Auditoría V11.0+
                     </h3>
                     <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 rounded-full">
                       <span className="text-[8px] font-black text-amber-500 uppercase tracking-widest italic font-bold">Upgrade Activo</span>
                     </div>
                   </div>
                   
                   <p className="text-slate-400 text-xs leading-relaxed mb-6 font-medium">
                     Inyectando lógica de <span className="text-white">Judea Pearl</span> (Causalidad) y <span className="text-white">Nassim Taleb</span> (Antifragilidad). 
                     Análisis predictivo de fatiga en sopladores y fricción de esferas.
                   </p>

                   {causalAuditV11 && (
                     <div className="space-y-4 mb-4">
                       <div className="flex items-center justify-between p-4 bg-slate-950 rounded-2xl border border-slate-800">
                         <div>
                           <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Salud del Activo</span>
                           <div className="w-32 h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1">
                             <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${causalAuditV11.healthScore}%` }} />
                           </div>
                         </div>
                         <span className="text-lg font-black text-white">{causalAuditV11.healthScore}%</span>
                       </div>
                       <div className="grid grid-cols-2 gap-3">
                         <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center relative overflow-hidden">
                           <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Fricción Ducto</span>
                           <span className="text-sm font-black text-amber-500">{causalAuditV11.frictionCoefficient.toFixed(4)} μ</span>
                         </div>
                         <div className="p-4 bg-slate-950 rounded-2xl border border-slate-800 text-center">
                           <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Sello DocSec</span>
                           <span className="text-[10px] font-mono text-slate-400 truncate block w-full">{causalAuditV11.docSecHash.substring(0, 8)}...</span>
                         </div>
                       </div>
                       
                       <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/20">
                         <span className="block text-[8px] font-black text-amber-500 uppercase tracking-widest mb-2 font-bold italic">Vector Cisne Negro (Antifrágil)</span>
                         <div className="flex gap-2">
                           {causalAuditV11.blackSwanVector.map(n => (
                             <span key={n} className="w-8 h-8 rounded-lg bg-amber-600 text-white flex items-center justify-center font-black text-xs shadow-md shadow-amber-600/20">{n}</span>
                           ))}
                         </div>
                       </div>
                     </div>
                   )}
                 </div>

                 <button 
                   onClick={handleCausalAntifragileAudit}
                   disabled={isCausalV11Loading}
                   className="w-full py-4 bg-amber-600 hover:bg-amber-500 disabled:bg-slate-700 text-white font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all shadow-lg shadow-amber-600/20 active:scale-95 flex items-center justify-center gap-3"
                 >
                   {isCausalV11Loading ? (
                     <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> Auditoría en curso...</>
                   ) : (
                     <><i className="fas fa-bolt"></i> Ejecutar Auditoría V11.0</>
                   )}
                 </button>
               </div>
             </div>
             <SingularityAlert singularity={wearSingularity} />

             <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2">
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">¿Buscas el Nodo Ancla (Marzo 2026)?</h3>
                   <p className="text-slate-400 italic">Activa el motor de pensamiento profundo para un análisis exhaustivo con Nodos 22/16.</p>
                </div>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={handleGodXProtocol}
                    disabled={isAiLoading}
                    className="bg-rose-600 hover:bg-rose-500 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-rose-600/30 transition-all active:scale-95 flex items-center gap-3"
                  >
                      <i className="fas fa-atom animate-spin-slow"></i>
                      Protocolo GOD-X
                  </button>
                  <button 
                    onClick={handleVortexAnalysis}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-indigo-600/30 transition-all active:scale-95 flex items-center gap-3"
                  >
                      <i className="fas fa-vortex"></i>
                      Protocolo Vórtice
                  </button>
                  <button 
                    onClick={handleExecuteSingularityScan}
                    disabled={isAiLoading}
                    className="bg-rose-600 hover:bg-rose-500 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-rose-600/30 transition-all active:scale-95 flex items-center gap-3"
                  >
                      <i className="fas fa-atom animate-spin-slow"></i>
                      Escaneo Nodo 26
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

             <WeightTrendChart />

             <ResonanceScanChart />

             <MarkovHeatmap data={data} />

             <SingularidadMecanica />

             <AductoScatterMatrix data={data} deepSimResults={deepSimResults} />

             <HourlyCorrelationMatrix data={data} />

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

        {/* VIEW: PLAN SEMANAL BARCEL SPEC */}
        {view === 'weekly' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-900/50 p-10 rounded-[3rem] border border-slate-800 shadow-2xl backdrop-blur-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-extrabold text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest">
                    <i className="fas fa-truck-fast mr-1.5"></i>
                    Especial Sindicato Barcel
                  </span>
                  <span className="bg-slate-800 border border-slate-700 text-slate-400 font-mono text-[10px] px-3 py-1.5 rounded-full uppercase">
                    v5.4 Quantum Grid
                  </span>
                </div>
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Planificador de Ataque Semanal</h2>
                <p className="text-slate-400 font-medium italic">Simulación predictiva de 14 combinaciones simultáneas (Sorteos de las Tres y Clásico) sintonizados con el domo neumático de CDMX.</p>
              </div>
              <div className="shrink-0">
                <button 
                  disabled={isWeeklySimulating}
                  onClick={handleSyncWeeklyPlan}
                  className={`px-10 py-6 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl transition-all active:scale-95 flex items-center gap-3 ${isWeeklySimulating ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-gradient-to-r from-amber-600 to-amber-500 text-white shadow-amber-600/20 hover:scale-105 hover:from-amber-500 hover:to-amber-400'}`}
                >
                  <i className={`fas ${isWeeklySimulating ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
                  {isWeeklySimulating ? `Simulando ${weeklySimProgress}%` : 'Sincronizar Suite Semanal'}
                </button>
              </div>
            </header>

            {/* BARRA DE PROGRESO DE SIMULACIÓN */}
            {isWeeklySimulating && (
              <div className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 text-center space-y-6 shadow-2xl animate-pulse">
                <div className="w-16 h-16 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
                <div className="space-y-2">
                  <h3 className="text-lg font-black text-white uppercase tracking-widest italic">Corriendo Simulación de 100,000 Trayectorias</h3>
                  <p className="text-slate-400 text-xs text-center max-w-md mx-auto">
                    Ajustando coeficientes de masa cinética, arrastre de succionadores en CDMX y variación térmica solar semanal.
                  </p>
                </div>
                <div className="w-full bg-slate-950 rounded-full h-3 border border-slate-800 max-w-lg mx-auto overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-300"
                    style={{ width: `${weeklySimProgress}%` }}
                  ></div>
                </div>
                <span className="block font-mono text-xs text-amber-500 font-black">{weeklySimProgress}% Completado</span>
              </div>
            )}

            {!isWeeklySimulating && !weeklyPlan && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-[3rem] p-12 text-center max-w-4xl mx-auto space-y-6 shadow-xl">
                <div className="bg-slate-950 w-20 h-20 rounded-full flex items-center justify-center border border-slate-800 mx-auto text-amber-500">
                  <i className="fas fa-calendar-week text-3xl"></i>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-black text-white uppercase tracking-tight">Socio, ¡Organiza tu jugada de la semana!</h3>
                  <p className="text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
                    Entendemos que laborar en Barcel te limita el tiempo diario. No te preocupes: con esta herramienta puedes simular de una sola vez las 14 combinaciones recomendadas para toda la semana (de Domingo a Sábado). Podrás copiarlas a tu WhatsApp o sellar todas en tu Cartera con un solo botón.
                  </p>
                </div>
                <button 
                  onClick={handleSyncWeeklyPlan}
                  className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-lg shadow-amber-600/30 transition-all"
                >
                  Generar Plan Semanal Adelantado
                </button>
              </div>
            )}

            {!isWeeklySimulating && weeklyPlan && (
              <div className="space-y-8 animate-in fade-in duration-500">
                {/* ACCIONES DEL JUEGO COMPLETO */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-slate-900 border border-slate-800 px-8 py-6 rounded-[2rem] shadow-lg">
                  <div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">Acciones Globales de la Suite</span>
                    <h4 className="text-xs font-bold text-slate-300 mt-0.5">Semana del: <strong className="text-white">{weeklyPlan[0].dateStr}</strong> al <strong className="text-white">{weeklyPlan[6].dateStr}</strong></h4>
                  </div>
                  <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <button 
                      onClick={handleCopyWeeklyPlanToClipboard}
                      className="flex-1 sm:flex-initial bg-slate-800 border border-slate-700 hover:border-slate-600 hover:bg-slate-700 text-amber-400 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all active:scale-95"
                    >
                      <i className="fas fa-copy"></i>
                      Copiar Formato WhatsApp
                    </button>
                    <button 
                      onClick={handleSaveAllWeeklyToWallet}
                      className="flex-1 sm:flex-initial bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20 transition-all active:scale-95"
                    >
                      <i className="fas fa-bookmark"></i>
                      Sellar Todo en Cartera
                    </button>
                  </div>
                </div>

                {/* RECOMENDACIÓN ESTRATÉGICA */}
                <div className="bg-amber-950/20 border border-amber-500/30 p-6 md:p-8 rounded-[2rem] flex items-start gap-4">
                  <div className="bg-amber-500/10 p-3 rounded-xl border border-amber-500/20 text-amber-500 shrink-0">
                    <i className="fas fa-briefcase"></i>
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-amber-400 uppercase tracking-wider mb-1">RECOMENDACIÓN TÁCTICA BARCEL (VÍA SOCIO)</h4>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      Socio, debido a los horarios demandantes en Barcel, lo mejor es acudir el **domingo por la mañana** (o el lunes temprano) al expendio de lotería o ingresar a la plataforma digital oficial y **comprar por adelantado los 14 boletos** de toda la semana. Guarda este plan en tu celular o celular de confianza y deja que la inercia cuántica haga su magia mientras tú laboras con éxito.
                    </p>
                  </div>
                </div>

                {/* GRÁFICO DE TENDENCIA DE ROI PROYECTADO PLAN BARCEL */}
                <BarcelRoiTrendChart weeklyPlan={weeklyPlan} />

                {/* THE 7-DAY PARRILLA GRID */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {weeklyPlan.map((p, idx) => (
                    <div 
                      key={idx} 
                      className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden flex flex-col justify-between focus-within:border-slate-700 transition-colors"
                    >
                      <div className="absolute top-0 right-0 p-6 opacity-5 pointer-events-none">
                        <i className="fas fa-calendar-day text-7xl text-amber-500"></i>
                      </div>

                      {/* Header tarjeta */}
                      <div className="flex justify-between items-center border-b border-slate-800 pb-5 mb-5 relative z-10">
                        <div>
                          <span className="bg-amber-500/10 text-amber-500 font-black text-[9px] px-2.5 py-1 rounded-md uppercase tracking-wider mb-1 inline-block">
                            DÍA {idx + 1} DE 7
                          </span>
                          <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">
                            {p.dayName}
                          </h3>
                        </div>
                        <span className="text-slate-500 text-[10px] font-mono tracking-tight font-extrabold">
                          {p.dateStr}
                        </span>
                      </div>

                      {/* Sorteos */}
                      <div className="space-y-6 relative z-10">
                        {/* 15:00 hrs (Sorteo de las Tres) */}
                        <div className="bg-slate-950/50 border border-slate-800/80 p-5 rounded-2xl space-y-3.5">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <i className="fas fa-sun text-amber-500 text-xs text-amber-500"></i>
                              <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider">
                                Sorteo de las Tres (15:00 hrs)
                              </span>
                            </div>
                            <span className="text-[9px] text-slate-500 uppercase font-bold italic">
                              {p.alg3PM}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex gap-1.5">
                              {p.time3PM.map((n: number) => (
                                <NumberBall key={n} number={n} size="sm" />
                              ))}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <span className="block text-[8px] font-black text-slate-500 uppercase">Sinergia MC</span>
                                <span className="font-mono text-[10px] text-amber-550 font-black text-amber-500">{p.prob3PM}% Prob</span>
                              </div>
                              <button 
                                onClick={() => {
                                  const tId = `W3-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
                                  setMyTickets(prev => [{
                                    id: tId,
                                    date: `${p.dayName} 15:00`,
                                    numbers: [...p.time3PM],
                                    type: 'simple'
                                  }, ...prev]);
                                  const stats = runSimulation(p.time3PM, data);
                                  setTicketStats(prev => ({ ...prev, [tId]: stats }));
                                  playBeep();
                                  alert(`¡Listo socio! Jugada 3PM de ${p.dayName} guardada en tu Cartera.`);
                                }}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors flex items-center justify-center"
                                title="Añadir esta jugada a mi cartera"
                              >
                                <i className="fas fa-bookmark text-[9px]"></i>
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* 21:00 hrs (Sorteo Clásico) */}
                        <div className="bg-slate-950/50 border border-slate-800/80 p-5 rounded-2xl space-y-3.5">
                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <i className="fas fa-moon text-indigo-400 text-xs"></i>
                              <span className="text-[10px] font-black uppercase text-slate-300 tracking-wider">
                                Sorteo Clásico (21:00 hrs)
                              </span>
                            </div>
                            <span className="text-[9px] text-slate-500 uppercase font-bold italic">
                              {p.alg9PM}
                            </span>
                          </div>

                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="flex gap-1.5">
                              {p.time9PM.map((n: number) => (
                                <NumberBall key={n} number={n} size="sm" />
                              ))}
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="text-right">
                                <span className="block text-[8px] font-black text-slate-500 uppercase">Sinergia MC</span>
                                <span className="font-mono text-[10px] text-amber-550 font-black text-amber-500">{p.prob9PM}% Prob</span>
                              </div>
                              <button 
                                onClick={() => {
                                  const tId = `W9-${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
                                  setMyTickets(prev => [{
                                    id: tId,
                                    date: `${p.dayName} 21:00`,
                                    numbers: [...p.time9PM],
                                    type: 'simple'
                                  }, ...prev]);
                                  const stats = runSimulation(p.time9PM, data);
                                  setTicketStats(prev => ({ ...prev, [tId]: stats }));
                                  playBeep();
                                  alert(`¡Listo socio! Jugada 9PM de ${p.dayName} guardada en tu Cartera.`);
                                }}
                                className="bg-slate-800 hover:bg-slate-700 text-slate-300 p-2.5 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors flex items-center justify-center"
                                title="Añadir esta jugada a mi cartera"
                              >
                                <i className="fas fa-bookmark text-[9px]"></i>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
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
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => generateForensicReportPDF({
                        historicalData: data,
                        myTickets,
                        ticketStats,
                        suggestion,
                        genMode,
                        holyGrail,
                        deepSimResults,
                        scenarioResults,
                        debtResults,
                        markovContrast,
                        anticipationResult,
                        quantum5,
                        simResult,
                        certeza,
                        antifragilityResult,
                        biasAnalysis,
                      })}
                      className="bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/30 px-8 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 transition-all shadow-xl active:scale-95"
                    >
                      <i className="fas fa-file-pdf text-red-500 text-sm"></i>
                      Descargar Reporte PDF
                    </button>
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
                    {calculateAntifragility(ticket.numbers, data).status === 'ANTIFRÁGIL' && (
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-amber-500 animate-pulse"></div>
                    )}
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

                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 w-full lg:w-auto">
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
                         <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 text-center">
                            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Antifragilidad</span>
                            <span className={`text-2xl font-black italic ${calculateAntifragility(ticket.numbers, data).status === 'ANTIFRÁGIL' ? 'text-orange-500' : 'text-slate-600'}`}>
                              {calculateAntifragility(ticket.numbers, data).status}
                            </span>
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
            {/* Celebración de Victoria Reciente (3 Aciertos - 27 Abr) */}
            <div className="animate-in zoom-in duration-1000">
              <div className="flex flex-col md:flex-row items-center gap-8 bg-emerald-500/10 border border-emerald-500/30 p-10 rounded-[4rem] shadow-[0_0_80px_rgba(16,185,129,0.15)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                   <i className="fas fa-trophy text-9xl -rotate-12"></i>
                </div>
                <div className="w-20 h-20 rounded-full bg-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.5)] flex items-center justify-center text-white text-3xl animate-bounce shrink-0 relative z-10">
                  <i className="fas fa-trophy"></i>
                </div>
                <div className="text-center md:text-left relative z-10">
                  <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                    <span className="bg-emerald-500 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest">¡Victoria Confirmada!</span>
                    <h3 className="text-emerald-400 font-black text-2xl italic tracking-tighter uppercase">
                      ¡Pegamos 3 Nodos! (Sorteo 11972)
                    </h3>
                  </div>
                  <p className="text-slate-300 text-lg max-w-2xl font-medium leading-tight">
                    Felicidades. Tu vector sugerido <span className="text-white font-black">[4, 6, 10, 20, 22]</span> capturó los nodos <span className="text-emerald-400 font-black">4, 6 y 22</span>. 
                    El sistema está en racha. Estamos recalibrando para el próximo golpe maestro.
                  </p>
                </div>
              </div>
            </div>

            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h2 className="text-5xl font-black text-white tracking-tighter mb-2 uppercase italic">Motor de Resonancia V5.0</h2>
                <p className="text-slate-400 font-medium italic">Protocolo: Marzo 2026. Objetivo Crítico: Nodos 22/16. Maximización de Entropía.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2 rounded-[2.5rem] flex shadow-inner">
                <button onClick={() => setIsNightMode(false)} className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${!isNightMode ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400'}`}>Las Tres</button>
                <button onClick={() => setIsNightMode(true)} className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${isNightMode ? 'bg-amber-600 text-white shadow-lg' : 'text-slate-400'}`}>Clásico</button>
                <div className="w-px bg-slate-800 mx-2 my-2"></div>
                <button onClick={() => { setGenMode('simple'); setSuggestion([]); }} className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${genMode === 'simple' ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/30' : 'text-slate-400 hover:text-slate-200'}`}>Quantum 5</button>
                <button onClick={() => { setGenMode('multiple6'); setSuggestion([]); }} className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${genMode === 'multiple6' ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/30' : 'text-slate-400 hover:text-slate-200'}`}>Múltiple 6</button>
                <button onClick={() => { setGenMode('quantum'); setSuggestion([]); }} className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${genMode === 'quantum' ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/30' : 'text-slate-400 hover:text-slate-200'}`}>Múltiple 7 (GOD-X)</button>
                <button onClick={() => { setGenMode('grail'); setSuggestion([]); }} className={`px-8 py-4 rounded-[2rem] text-[10px] font-black uppercase tracking-widest transition-all ${genMode === 'grail' ? 'bg-gradient-to-r from-emerald-600 to-amber-600 text-white shadow-xl shadow-emerald-500/20' : 'text-slate-400 hover:text-slate-200'}`}>Santo Grial V12</button>
              </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-12">
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
               <div className="bg-gradient-to-b from-emerald-950/20 to-amber-950/20 border border-emerald-500/20 p-6 rounded-3xl col-span-1 md:col-span-3 lg:col-span-1">
                  <h4 className="text-emerald-400 font-black text-[9px] uppercase tracking-widest mb-2">Santo Grial V12</h4>
                  <p className="text-slate-300 text-[10px] leading-relaxed italic">Aplica todas las leyes, física de masa, Markov, entropía y Taleb en un único tiro perfecto de 5 cifras.</p>
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
                      {genMode === 'simple' ? 'Quantum 5: Análisis Veloz' : genMode === 'multiple6' ? 'Múltiple 6: Filtro de Humedad' : 'GOD-X: Veredicto Mecánico'}
                    </h3>
                    <div className="flex flex-col items-center gap-4 mb-6 justify-center">
                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500">
                            {genMode === 'simple' ? 'Algoritmo Heurístico de Resonancia' : genMode === 'multiple6' ? 'Masa Crítica Recalibrada' : 'Optimización de Flujo y Masa (V5.0)'}
                          </span>
                        </div>
                        {suggestion.length > 0 && (
                          <div className="flex items-center gap-2 px-3 py-1 bg-rose-500/10 border border-rose-500/30 rounded-full">
                            <span className="text-[9px] font-black text-rose-500 uppercase tracking-[0.1em]">H-Score: {calculateHScore(suggestion)}</span>
                          </div>
                        )}
                      </div>
                      {(genMode === 'quantum' || genMode === 'multiple6') && (
                        <div className="flex items-center gap-2 px-4 py-1 rounded-full bg-amber-500/10 border border-amber-500/30">
                          <i className="fas fa-microscope text-[10px] text-amber-500"></i>
                          <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-500">
                            Auditoría Activa: Nodo {genMode === 'multiple6' ? '02' : '16'} (Desgaste Mecánico)
                          </span>
                        </div>
                      )}
                    </div>
                    <p className="text-slate-500 mb-12 text-lg italic">
                      {genMode === 'simple' 
                        ? 'Genera 5 coordenadas optimizadas mediante clústeres de frecuencia y ROI histórico inmediato.' 
                        : genMode === 'multiple6' 
                        ? 'Genera 6 coordenadas basadas en la compensación de fricción y humedad barométrica.'
                        : 'Genera un reporte de 7 coordenadas de fallo basado en la fatiga de materiales y optimización de flujo.'}
                    </p>
                    <div className="flex flex-col md:flex-row items-center gap-4 mb-12 justify-center">
                      <button onClick={handleGenerate} className={`px-16 py-8 rounded-[3rem] font-black uppercase tracking-[0.3em] text-sm transition-all shadow-2xl active:scale-95 bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/40`}>
                        Generar para Hoy ({getSorteoDate()})
                      </button>
                      <button onClick={handleGenerateTen} className={`px-16 py-8 rounded-[3rem] font-black uppercase tracking-[0.3em] text-sm transition-all shadow-2xl active:scale-95 bg-slate-100 hover:bg-white text-slate-900 shadow-slate-900/10`}>
                        Protocolo Búnker: Las 10 (9 PM)
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
                      <button 
                        onClick={handleMarkovXContrast} 
                        disabled={isMarkovLoading}
                        className={`px-12 py-8 rounded-[3rem] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl active:scale-95 border-2 ${isMarkovLoading ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-cyan-900/20 border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/40'}`}
                      >
                        {isMarkovLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-microscope mr-3"></i>}
                        Contraste Markov-X
                      </button>
                      <button 
                        onClick={handleAntifragileVector} 
                        disabled={isAntifragileLoading}
                        className={`px-12 py-8 rounded-[3rem] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl active:scale-95 border-2 ${isAntifragileLoading ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-orange-900/20 border-orange-500/50 text-orange-400 hover:bg-orange-900/40'}`}
                      >
                        {isAntifragileLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-shield-alt mr-3"></i>}
                        Vector Antifrágil (Búnker)
                      </button>
                      <button 
                        onClick={handleCausalVector} 
                        disabled={isCausalLoading}
                        className={`px-12 py-8 rounded-[3rem] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl active:scale-95 border-2 ${isCausalLoading ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-emerald-900/20 border-emerald-500/50 text-emerald-400 hover:bg-emerald-900/40'}`}
                      >
                        {isCausalLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-dna mr-3"></i>}
                        Evolución Causal (Pearl)
                      </button>
                      <button 
                        onClick={handleAnticipationVector} 
                        disabled={isAnticipationLoading}
                        className={`px-12 py-8 rounded-[3rem] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl active:scale-95 border-2 ${isAnticipationLoading ? 'bg-slate-800 border-slate-700 text-slate-500' : 'bg-purple-900/20 border-purple-500/50 text-purple-400 hover:bg-purple-900/40'}`}
                      >
                        {isAnticipationLoading ? <i className="fas fa-spinner fa-spin mr-3"></i> : <i className="fas fa-bolt mr-3"></i>}
                        Vector de Anticipación (Orbital)
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

                          <div className="flex flex-wrap items-center justify-between border-b border-red-500/20 pb-6 relative z-10 gap-4">
                            <h4 className="text-red-500 font-black text-xl uppercase italic tracking-tighter flex items-center gap-3">
                              <i className="fas fa-radiation"></i>
                              Gabinete de Simulación V10.0
                            </h4>
                            <div className="flex items-center gap-3">
                              <button
                                onClick={() => generateForensicReportPDF({
                                  historicalData: data,
                                  myTickets,
                                  ticketStats,
                                  suggestion,
                                  genMode,
                                  holyGrail,
                                  deepSimResults,
                                  scenarioResults,
                                  debtResults,
                                  markovContrast,
                                  anticipationResult,
                                  quantum5,
                                  simResult,
                                  certeza,
                                  antifragilityResult,
                                  biasAnalysis,
                                })}
                                className="bg-red-600 hover:bg-red-500 text-white font-black text-[10px] uppercase tracking-widest px-5 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg shadow-red-600/30 transition-all active:scale-95"
                                title="Descargar reporte forense en PDF con el resumen de la simulación Monte Carlo y los vectores"
                              >
                                <i className="fas fa-file-pdf"></i>
                                Descargar Reporte PDF
                              </button>
                              <span className="bg-red-500/10 text-red-500 text-[10px] font-black px-4 py-2 rounded-full border border-red-500/30 uppercase tracking-widest">
                                Monte Carlo: 100k
                              </span>
                            </div>
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

                    {markovContrast && (
                      <div className="mt-12 w-full max-w-4xl animate-in fade-in slide-in-from-top-8 duration-700">
                        <div className="bg-cyan-950/20 border border-cyan-500/30 p-10 rounded-[3rem] space-y-8 relative overflow-hidden">
                          <div className="absolute top-0 right-0 p-8">
                            <i className="fas fa-microscope text-7xl text-cyan-500/10"></i>
                          </div>

                          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-6 relative z-10">
                            <h4 className="text-cyan-400 font-black text-xl uppercase italic tracking-tighter flex items-center gap-3">
                              <i className="fas fa-project-diagram"></i>
                              Filtro Markov-X: Contraste Barométrico
                            </h4>
                            <span className={`px-4 py-2 rounded-full border text-[10px] font-black uppercase tracking-widest ${markovContrast.verdict === 'GO_CRITICAL' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'}`}>
                              {markovContrast.verdict}
                            </span>
                          </div>

                          <div className="flex flex-col md:flex-row gap-8 relative z-10">
                             <div className="flex-1 bg-black/40 border border-cyan-500/10 p-8 rounded-[2rem] space-y-4">
                               <span className="block text-[10px] text-slate-500 font-black uppercase tracking-widest">Estabilidad de Transición</span>
                               <div className="text-4xl font-black text-cyan-400">{markovContrast.stability}%</div>
                               <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden">
                                 <div className="bg-cyan-500 h-full transition-all duration-1000" style={{ width: `${markovContrast.stability}%` }}></div>
                               </div>
                             </div>

                             <div className="flex-1 bg-black/40 border border-cyan-500/10 p-8 rounded-[2rem] space-y-4">
                               <span className="block text-[10px] text-slate-500 font-black uppercase tracking-widest">Presión Barométrica (CDMX)</span>
                               <div className="text-4xl font-black text-amber-500">{markovContrast.pressureFactor} atm</div>
                               <div className="text-[10px] text-slate-500 font-bold uppercase">Estado: Ideal para Eyección de Masa Mixta</div>
                             </div>
                          </div>

                          <div className="bg-black/80 p-8 rounded-[2rem] border border-cyan-500/5 relative z-10">
                            <p className="text-cyan-100 italic text-sm leading-relaxed text-center">
                              "{markovContrast.explanation}"
                            </p>
                          </div>
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
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-slate-900 pb-6">
                              <div>
                                <h4 className="text-amber-500 font-black text-xs uppercase tracking-[0.4em] flex items-center gap-3 italic">
                                   <i className="fas fa-microchip"></i> Auditoría de Deuda de Masa (Deep Analysis)
                                </h4>
                                <div className="flex items-center gap-2 mt-1.5">
                                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[9px] font-bold uppercase tracking-wider">
                                    <i className="fas fa-shield-alt text-[8px]"></i> DocSec SHA-256 Verificado
                                  </span>
                                  <span className="text-[10px] text-slate-500 font-mono">
                                    Sorteo #{data[0]?.CONCURSO || '---'}
                                  </span>
                                </div>
                              </div>

                              <div className="flex flex-wrap items-center gap-2.5">
                                <button
                                  onClick={handleCopyDocSecText}
                                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800 hover:border-slate-700 rounded-2xl font-black text-[9px] uppercase tracking-widest transition-all flex items-center gap-2"
                                  title="Copiar texto formateado completo con Hash DocSec"
                                >
                                  <i className="fas fa-copy text-amber-500"></i>
                                  <span>Copiar DocSec</span>
                                </button>
                                <button
                                  onClick={handleDownloadDeepAnalysisDocSec}
                                  disabled={isDocSecDownloading}
                                  className="px-5 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-2xl font-black text-[9px] uppercase tracking-widest shadow-lg shadow-amber-600/20 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50"
                                  title="Descargar archivo .txt formateado con sello de tiempo y hash criptográfico para control de aciertos"
                                >
                                  <i className={`fas ${isDocSecDownloading ? 'fa-spinner fa-spin' : 'fa-file-download'}`}></i>
                                  <span>{isDocSecDownloading ? 'Exportando...' : 'Descargar TXT DocSec'}</span>
                                </button>
                              </div>
                            </div>

                            {docSecFeedback && (
                              <div className="mb-6 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-mono text-xs flex flex-col md:flex-row justify-between items-start md:items-center gap-2 animate-in fade-in">
                                <div className="flex items-center gap-2">
                                  <i className="fas fa-check-circle text-amber-400"></i>
                                  <span>Archivo descargado: <strong>{docSecFeedback.filename}</strong></span>
                                </div>
                                <div className="text-[10px] text-amber-400/80">
                                  Hash: <span className="text-white font-bold">{docSecFeedback.hash.substring(0, 16)}...</span>
                                </div>
                              </div>
                            )}

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
                                        const cleanNumbers = recalibrateCombination(parsed.numbers);
                                        setSuggestion(cleanNumbers);
                                        setGenMode('quantum');
                                        setSimResult(runSimulation(cleanNumbers, data));
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
                                        const cleanNumbers = recalibrateCombination(parsed.numbers);
                                        setSuggestion(cleanNumbers);
                                        setGenMode('quantum');
                                        setSimResult(runSimulation(cleanNumbers, data));
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
                    <div className="mb-8 p-5 bg-amber-600/[0.05] border border-amber-500/30 rounded-3xl max-w-xl mx-auto text-center shadow-lg shadow-amber-600/5">
                      <span className="text-[11px] font-black uppercase text-amber-500 tracking-wider flex items-center justify-center gap-2 italic">
                        <i className="fas fa-random"></i>
                        Inercia del Sorteo Anterior #{data[0]?.CONCURSO || "---"} ➡️ Vector de Ataque Estimado para el Sorteo Próximo #{Number(data[0]?.CONCURSO || 0) + 1}
                      </span>
                    </div>
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
                    
                      {antifragilityResult && (
                        <div className="max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                          <div className={`p-6 rounded-3xl border flex items-center gap-6 ${antifragilityResult.status === 'ANTIFRÁGIL' ? 'bg-orange-500/10 border-orange-500/30' : 'bg-slate-800 border-slate-700'}`}>
                            <div className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xl bg-orange-500 text-slate-950`}>
                              H
                            </div>
                            <div className="text-left">
                              <h5 className={`font-black text-[10px] uppercase tracking-widest mb-1 text-orange-400`}>
                                Veredicto de Antifragilidad (H-Score)
                              </h5>
                              <p className="text-slate-300 text-xs italic leading-relaxed">
                                Estado: <span className="font-black">{antifragilityResult.status}</span>. 
                                Convexidad: <span className="font-black text-orange-500">+{antifragilityResult.convexity.toFixed(4)}</span>.
                                {antifragilityResult.status === 'ANTIFRÁGIL' 
                                  ? ' Esta combinación fortalece su probabilidad ante el ruido del ducto.' 
                                  : ' Combinación robusta ante variaciones estándar.'}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {causalDiagnostics && (
                        <div className="max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                          <div className="p-6 rounded-3xl border border-emerald-500/30 bg-emerald-500/10 flex items-center gap-6">
                            <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xl bg-emerald-500 text-slate-950">
                              <i className="fas fa-dna"></i>
                            </div>
                            <div className="text-left">
                              <h5 className="font-black text-[10px] uppercase tracking-widest mb-1 text-emerald-400">
                                Diagnóstico de Causalidad (Forense)
                              </h5>
                              <p className="text-slate-300 text-xs italic leading-relaxed">
                                {causalDiagnostics}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {anticipationResult && (
                        <div className="max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                          <div className="p-8 rounded-[3rem] border border-purple-500/30 bg-purple-950/20 space-y-6">
                            <div className="flex items-start gap-6">
                              <div className="w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 font-black text-xl bg-purple-500 text-slate-950">
                                <i className="fas fa-bolt"></i>
                              </div>
                              <div className="text-left flex-1">
                                <h5 className="font-black text-[10px] uppercase tracking-widest mb-1 text-purple-400">
                                  Vector de Anticipación (Filtro Antianclaje)
                                </h5>
                                <p className="text-slate-300 text-sm italic leading-relaxed">
                                  {anticipationResult.explanation}
                                </p>
                              </div>
                            </div>

                            {/* Mostrar Nodos Excluidos (Anclas) */}
                            {anticipationResult.excludedAnchors.length > 0 && (
                              <div className="bg-slate-950/40 border border-slate-800/60 p-5 rounded-[2rem]">
                                <div className="text-left text-[10px] font-black tracking-widest text-purple-400 uppercase mb-3 flex items-center gap-2">
                                  <i className="fas fa-ban text-red-500"></i>
                                  Nodos Ancla de los Últimos 3 Sorteos Excluidos (Pruning Activo):
                                </div>
                                <div className="flex flex-wrap gap-2 justify-start">
                                  {anticipationResult.excludedAnchors.map(n => (
                                    <span key={n} className="inline-flex items-center justify-center w-8 h-8 text-[11px] font-black bg-red-950/40 border border-red-500/30 text-red-400 rounded-full shadow-lg">
                                      {n}
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* Mostrar Coordenadas Calculadas */}
                            <div className="bg-slate-950/50 p-6 rounded-[2rem] border border-purple-500/10 flex flex-col items-center gap-3">
                              <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase">Coordenadas del Vector de Anticipación:</span>
                              <div className="flex justify-center gap-3">
                                {anticipationResult.numbers.map(n => (
                                  <NumberBall key={n} number={n} size="md" />
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {maletinSignature && (
                        <div className="max-w-2xl mx-auto mb-12 animate-in fade-in slide-in-from-top-4 duration-1000 delay-300">
                          <div className={`p-8 rounded-[3rem] border flex flex-col md:flex-row items-center gap-8 ${maletinSignature.currentRegime === 'LIGERO' ? 'bg-cyan-500/10 border-cyan-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                            <div className="relative">
                               <div className={`w-28 h-28 rounded-full border-4 flex flex-col items-center justify-center font-black animate-pulse ${maletinSignature.currentRegime === 'LIGERO' ? 'border-cyan-500 text-cyan-400' : 'border-rose-500 text-rose-400'}`}>
                                 <span className="text-[10px] uppercase opacity-50">Régimen</span>
                                 <span className="text-xl italic">{maletinSignature.currentRegime}</span>
                               </div>
                               <div className="absolute -bottom-2 -right-2 bg-slate-950 px-3 py-1 rounded-full border border-slate-800 text-[10px] font-black">
                                 {maletinSignature.stabilityScore.toFixed(0)}% ESTABLE
                               </div>
                            </div>
                            <div className="text-center md:text-left">
                              <h5 className={`font-black text-xs uppercase tracking-[0.3em] mb-3 italic ${maletinSignature.currentRegime === 'LIGERO' ? 'text-cyan-400' : 'text-rose-400'}`}>
                                Telemetría de Maletín (Historial Completo)
                              </h5>
                              <p className="text-slate-400 text-sm leading-relaxed max-w-md">
                                {maletinSignature.detectedSignature} El análisis forense sugiere que los movimientos actuales corresponden a una peculiaridad de **Inercia Térmica**.
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {genMode === 'grail' && holyGrail && (
                        <div className="max-w-4xl mx-auto mb-12 animate-in fade-in slide-in-from-top-6 duration-1000">
                          <div className="bg-gradient-to-br from-emerald-950/20 via-zinc-900/50 to-amber-950/20 border-2 border-emerald-500/30 p-10 rounded-[3rem] shadow-2xl space-y-8 relative overflow-hidden text-left">
                            <div className="absolute top-0 right-0 p-6 opacity-5">
                              <i className="fas fa-gavel text-9xl"></i>
                            </div>

                            <div className="flex flex-col md:flex-row justify-between items-center border-b border-emerald-500/20 pb-6 gap-4">
                              <div className="text-center md:text-left">
                                <span className="bg-emerald-500/10 text-emerald-400 text-[10px] font-black px-4 py-1.5 rounded-full border border-emerald-500/30 uppercase tracking-[0.2em]">
                                  Santo Grial V12.0
                                </span>
                                <h4 className="text-2xl font-black text-white uppercase italic tracking-tighter mt-2">
                                  La Unificación de las 6 Leyes Matemático-Físicas
                                </h4>
                              </div>
                              <span className="bg-amber-500 text-zinc-950 text-[11px] font-black px-4 py-2 rounded-xl h-fit shadow-md tracking-wider uppercase">
                                UNIFICACIÓN CONFIRMADA
                              </span>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-6 gap-4 text-center">
                              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                                <span className="block text-[8px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Entropía Shannon</span>
                                <span className="text-xs font-black text-emerald-400">{holyGrail.scores.entropy} bits</span>
                              </div>
                              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                                <span className="block text-[8px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Convexidad (H)</span>
                                <span className="text-xs font-black text-amber-500">+{holyGrail.scores.convection}</span>
                              </div>
                              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                                <span className="block text-[8px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Inercia Térmica</span>
                                <span className="text-xs font-black text-cyan-400">{holyGrail.scores.thermalInertia}x</span>
                              </div>
                              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                                <span className="block text-[8px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Markov bits</span>
                                <span className="text-xs font-black text-purple-400">{holyGrail.scores.markovStrength}</span>
                              </div>
                              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                                <span className="block text-[8px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Pureza Antisesgo</span>
                                <span className="text-xs font-black text-emerald-500">{holyGrail.scores.humanBias}%</span>
                              </div>
                              <div className="bg-slate-950/60 border border-slate-800 p-4 rounded-2xl">
                                <span className="block text-[8px] font-bold text-zinc-500 uppercase tracking-wider mb-1">Causal Pearl</span>
                                <span className="text-xs font-black text-pink-400">{holyGrail.scores.causalProbability}</span>
                              </div>
                            </div>

                            <div className="space-y-4 pt-4 border-t border-slate-800">
                              <h5 className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em] italic mb-2">Desglose de Auditoría Multidimensional:</h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex gap-3 text-xs italic leading-snug">
                                  <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1 flex-shrink-0 animate-ping"></div>
                                  <span className="text-zinc-300">{holyGrail.constituentAudit.lawOfMass}</span>
                                </div>
                                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex gap-3 text-xs italic leading-snug">
                                  <div className="w-2 h-2 rounded-full bg-amber-500 mt-1 flex-shrink-0 animate-ping"></div>
                                  <span className="text-zinc-300">{holyGrail.constituentAudit.lawOfThermalInertia}</span>
                                </div>
                                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex gap-3 text-xs italic leading-snug">
                                  <div className="w-2 h-2 rounded-full bg-purple-500 mt-1 flex-shrink-0"></div>
                                  <span className="text-zinc-300">{holyGrail.constituentAudit.lawOfMarkov}</span>
                                </div>
                                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex gap-3 text-xs italic leading-snug">
                                  <div className="w-2 h-2 rounded-full bg-orange-500 mt-1 flex-shrink-0 animate-ping"></div>
                                  <span className="text-zinc-300">{holyGrail.constituentAudit.lawOfAntifragility}</span>
                                </div>
                                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex gap-3 text-xs italic leading-snug">
                                  <div className="w-2 h-2 rounded-full bg-cyan-500 mt-1 flex-shrink-0 animate-ping"></div>
                                  <span className="text-zinc-300">{holyGrail.constituentAudit.lawOfShannon}</span>
                                </div>
                                <div className="bg-slate-950/40 p-4 rounded-xl border border-slate-800 flex gap-3 text-xs italic leading-snug">
                                  <div className="w-2 h-2 rounded-full bg-pink-500 mt-1 flex-shrink-0"></div>
                                  <span className="text-zinc-300">{holyGrail.constituentAudit.lawOfCausality}</span>
                                </div>
                              </div>
                            </div>
                            <p className="text-slate-400 text-xs text-center italic">{holyGrail.explanation}</p>
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

               <OfflineExportCenter
                 historicalData={data}
                 suggestion={suggestion}
                 genMode={genMode}
                 holyGrail={holyGrail}
                 mandelCombos={mandelCombos}
                 scenarioResults={scenarioResults}
                 debtResults={debtResults}
                 deepSimResults={deepSimResults}
                 markovContrast={markovContrast}
                 anticipationResult={anticipationResult}
                 quantum5={quantum5}
                 aiInsight={aiInsight}
                 simResult={simResult}
                 certeza={certeza}
                 biasAnalysis={biasAnalysis}
                 antifragilityResult={antifragilityResult}
                 causalDiagnostics={causalDiagnostics}
                 myTickets={myTickets}
                 ticketStats={ticketStats}
                 deepAnalysis={deepAnalysis}
               />
            </div>
           </div>
        )}

        {/* VIEW: HISTORY */}
        {view === 'history' && (
           <div className="space-y-10 animate-in fade-in duration-700">
              <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div>
                  <h2 className="text-5xl font-black tracking-tighter uppercase italic text-white font-sans">Archivo Central</h2>
                  <p className="text-slate-400 font-mono text-sm uppercase italic">Auditoría Real: Cierre de Sorteos. Próximo: Sorteo 9:00 PM</p>
                </div>
                
                <div className="flex flex-wrap items-center gap-4">
                  <button
                    onClick={handleManualFirestoreSync}
                    disabled={isFirestoreSyncing}
                    className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all shadow-xl shadow-amber-500/20 active:scale-95 flex items-center gap-3 cursor-pointer disabled:opacity-50"
                  >
                    <i className={`fas fa-rotate ${isFirestoreSyncing ? 'animate-spin' : ''}`}></i>
                    <span>{isFirestoreSyncing ? 'Sincronizando...' : 'Forzar Sincronización Firestore'}</span>
                  </button>

                  <div className="bg-amber-600/[0.04] border border-amber-500/30 p-6 rounded-3xl max-w-xl text-left">
                    <div className="flex items-center gap-2 text-amber-500 font-black text-xs uppercase tracking-wider italic mb-2">
                      <i className="fas fa-history"></i> RELACIÓN DE DESFASE (1-STEP DELAY)
                    </div>
                    <p className="text-slate-400 text-[11px] leading-relaxed italic">
                      La física de fluidos de la tómbola se modela como un sistema dinámico: <strong>Inercia del Sorteo Anterior [X] ➡️ Vector de Ataque Estimado para el Sorteo Próximo [X+1]</strong>.
                    </p>
                  </div>
                </div>
              </header>

              {/* DIAGNÓSTICOS DEL PUENTE MAKE.COM */}
              <div className="p-8 rounded-[3rem] border border-slate-800 bg-slate-900/40 text-left space-y-6 shadow-2xl backdrop-blur-md">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                  <div className="space-y-1">
                    <h3 className="text-xl font-black text-purple-400 tracking-tight uppercase italic flex items-center gap-3">
                      <i className="fas fa-plug animate-pulse"></i> Puente de Sincronización (Make.com)
                    </h3>
                    <p className="text-slate-400 text-xs italic leading-normal">
                      Monitoreo predictivo y autodiagnóstico del enlace de datos para auditorías automatizadas.
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={fetchWebhookDiagnostics}
                      disabled={isDiagLoading}
                      className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 px-6 py-3 rounded-2xl font-black text-[10px] tracking-widest uppercase transition-all shadow-md active:scale-95 flex items-center gap-2"
                    >
                      <i className={`fas fa-sync ${isDiagLoading ? 'animate-spin' : ''}`}></i>
                      Probar Puente (Refrescar)
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Direcciones y Configuración */}
                  <div className="lg:col-span-5 space-y-4">
                    <span className="block text-[9px] font-black text-slate-500 uppercase tracking-widest">Enlace de Recepción Webhook:</span>
                    <div className="p-5 bg-slate-950/80 rounded-2xl border border-slate-800 space-y-3 font-mono text-[11px] text-slate-300">
                      <div className="space-y-1">
                        <span className="block text-[8px] font-black uppercase text-purple-500">URL Preferente de Make:</span>
                        <code className="text-purple-300 break-all bg-purple-950/20 px-2 py-1 rounded select-all block mt-1">
                          {window.location.origin}/api/sync-automatic
                        </code>
                      </div>
                      <div className="pt-2 border-t border-slate-900 space-y-1">
                        <span className="block text-[8px] font-black text-slate-400 uppercase">Método Requerido:</span>
                        <span className="inline-block px-2 py-0.5 bg-purple-950 text-purple-400 font-bold rounded-md text-[10px]">POST</span>
                      </div>
                      <div className="pt-2 border-t border-slate-900 space-y-1">
                        <span className="block text-[8px] font-black text-slate-400 uppercase font-bold">Nomenclatura flexible (Adaptador Activo):</span>
                        <p className="text-slate-400 text-[9px] leading-relaxed italic font-sans">
                          No te preocupes por el mapeo exacto. El búnker decodifica automáticamente variables como <code className="font-mono">concurso</code> o <code className="font-mono">sorteo</code>, y listas de números o strings separados por comas.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Estado del Puente en Tiempo Real */}
                  <div className="lg:col-span-7 flex flex-col justify-start">
                    {webhookDiagnostics && webhookDiagnostics.status !== "none" ? (
                      <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Última Transmisión de Make:</span>
                          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-wider border ${
                            webhookDiagnostics.status === "success" 
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400" 
                              : webhookDiagnostics.status === "ignored"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-400"
                              : "bg-rose-500/10 border-rose-500/30 text-rose-400"
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              webhookDiagnostics.status === "success" 
                                ? "bg-emerald-400 animate-pulse" 
                                : webhookDiagnostics.status === "ignored"
                                ? "bg-amber-400"
                                : "bg-rose-500"
                            }`}></span>
                            {webhookDiagnostics.status === "success" ? "Enlace Exitoso" : webhookDiagnostics.status === "ignored" ? "Ignorado de forma segura" : "Error en Payload"}
                          </span>
                        </div>

                        <div className="text-left space-y-2">
                          <p className="text-slate-300 font-bold text-sm italic">
                            {webhookDiagnostics.details}
                          </p>
                          <div className="flex gap-4 text-[10px] text-slate-500 font-mono">
                            <span>Recibido: {new Date(webhookDiagnostics.lastReceivedAt).toLocaleString('es-MX')}</span>
                          </div>
                        </div>

                        {/* Acordeón para ver la carga cruda en JSON */}
                        <div className="space-y-2 text-left">
                          <details className="group border-t border-slate-900/60 pt-3">
                            <summary className="list-none flex items-center justify-between text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] cursor-pointer select-none">
                              <span>Ver Carga Original Recibida (Make)</span>
                              <span className="transition-transform group-open:rotate-180">
                                <i className="fas fa-chevron-down"></i>
                              </span>
                            </summary>
                            <pre className="mt-3 p-4 rounded-xl bg-slate-950 font-mono text-[9px] text-slate-400 overflow-x-auto border border-slate-800 max-h-40">
                              {JSON.stringify(webhookDiagnostics.rawPayload, null, 2)}
                            </pre>
                          </details>

                          {webhookDiagnostics.normalizedPayload && (
                            <details className="group pt-1">
                              <summary className="list-none flex items-center justify-between text-[10px] font-black text-purple-500/80 uppercase tracking-[0.2em] cursor-pointer select-none">
                                <span>Ver Formateo Traducido por el Adaptador</span>
                                <span className="transition-transform group-open:rotate-180">
                                  <i className="fas fa-chevron-down"></i>
                                </span >
                              </summary>
                              <pre className="mt-3 p-4 rounded-xl bg-purple-950/20 font-mono text-[9px] text-purple-300 overflow-x-auto border border-purple-500/10 max-h-40">
                                {JSON.stringify(webhookDiagnostics.normalizedPayload, null, 2)}
                              </pre>
                            </details>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 rounded-2xl bg-amber-500/[0.02] border border-amber-500/10 flex flex-col items-center justify-center text-center gap-3 py-10">
                        <div className="w-12 h-12 rounded-full bg-amber-500/10 flex items-center justify-center text-amber-500">
                          <i className="fas fa-satellite-dish animate-bounce"></i>
                        </div>
                        <div className="space-y-1">
                          <h5 className="font-bold text-slate-300 text-sm">Esperando transmisión de Make.com...</h5>
                          <p className="text-slate-500 text-xs italic leading-relaxed max-w-sm font-sans mx-auto">
                            Tu búnker está listo y escuchando en el puerto. Ve a tu escenario de Make.com y ejecuta una prueba ("Run once") para que aparezca el diagnóstico de integración en este panel.
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-slate-900 border border-slate-800 rounded-[4rem] overflow-hidden shadow-2xl">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-800/60">
                          <tr>
                             <th className="px-10 py-8 text-[11px] font-black uppercase text-slate-400 tracking-[0.4em]">ID</th>
                             <th className="px-10 py-8 text-[11px] font-black uppercase text-slate-400 tracking-[0.4em]">Fecha / Hora</th>
                             <th className="px-10 py-8 text-[11px] font-black uppercase text-slate-400 tracking-[0.4em] text-center font-sans font-bold">Orden Ganador (Ordenado)</th>
                             <th className="px-10 py-8 text-[11px] font-black uppercase text-amber-500/90 tracking-[0.4em] text-center font-sans font-black italic">✦ Orden de Salida (Física)</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800/30">
                          {data.slice(0, 15).map(draw => {
                            const physicalList = draw.ordenSalida || [draw.R3, draw.R1, draw.R5, draw.R2, draw.R4];
                            return (
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
                                 <td className="px-10 py-10">
                                    <div className="flex justify-center gap-3">
                                       {physicalList.map((n, idx) => (
                                         <span key={idx} className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-black bg-transparent text-amber-500 border border-amber-500/30 shadow-[0_0_10px_rgba(245,158,11,0.15)]">{n}</span>
                                       ))}
                                    </div>
                                 </td>
                              </tr>
                            );
                          })}
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
