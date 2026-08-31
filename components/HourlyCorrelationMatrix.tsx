import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DrawResult } from '../types';
import { BALL_WEIGHTS } from '../utils/dataHelper';
import NumberBall from './NumberBall';

interface HourlyCorrelationMatrixProps {
  data: DrawResult[];
}

interface SorteoPair {
  date: string;
  tresDraw: DrawResult;
  clasicoDraw: DrawResult;
  tresNumbers: number[];
  clasicoNumbers: number[];
  directRepeats: number[];
  tresSum: number;
  clasicoSum: number;
  tresMass: number;
  clasicoMass: number;
  tresParity: { even: number; odd: number };
  clasicoParity: { even: number; odd: number };
}

export const HourlyCorrelationMatrix: React.FC<HourlyCorrelationMatrixProps> = ({ data }) => {
  const [windowSize, setWindowSize] = useState<number>(60); // 30, 60, 0 (all)
  const [activeTab, setActiveTab] = useState<'matrix' | 'diurnal_nocturnal' | 'drag_projector' | 'decile_transfer'>('matrix');
  const [selectedNum, setSelectedNum] = useState<number>(1);
  const [hoveredCell, setHoveredCell] = useState<{ tres: number; clasico: number; count: number; prob: number; lift: number } | null>(null);
  
  // Custom test vector for drag projector (defaults to the latest 15:00 draw)
  const [customTresInput, setCustomTresInput] = useState<string>('');

  // 1. Emparejar sorteos del mismo día (De las Tres vs Clásico)
  const { pairs, tresDraws, clasicoDraws, latestTresDraw } = useMemo(() => {
    // Agrupar sorteos por fecha
    const groupedByDate: Record<string, DrawResult[]> = {};
    
    // Sort draws chronologically ascending for analysis
    const sorted = [...data].sort((a, b) => Number(a.CONCURSO) - Number(b.CONCURSO));
    
    sorted.forEach(d => {
      if (!groupedByDate[d.FECHA]) {
        groupedByDate[d.FECHA] = [];
      }
      groupedByDate[d.FECHA].push(d);
    });

    const parsedPairs: SorteoPair[] = [];
    const allTres: DrawResult[] = [];
    const allClasico: DrawResult[] = [];

    Object.keys(groupedByDate).forEach(date => {
      const dayDraws = groupedByDate[date].sort((a, b) => Number(a.CONCURSO) - Number(b.CONCURSO));
      if (dayDraws.length >= 2) {
        const tres = dayDraws[0]; // Sorteo de las Tres (15:00)
        const clasico = dayDraws[1]; // Sorteo Clásico (21:15)
        
        allTres.push(tres);
        allClasico.push(clasico);

        const tresNums = [tres.R1, tres.R2, tres.R3, tres.R4, tres.R5].sort((a, b) => a - b);
        const clasicoNums = [clasico.R1, clasico.R2, clasico.R3, clasico.R4, clasico.R5].sort((a, b) => a - b);
        
        const directRepeats = tresNums.filter(n => clasicoNums.includes(n));
        
        const tresSum = tresNums.reduce((a, b) => a + b, 0);
        const clasicoSum = clasicoNums.reduce((a, b) => a + b, 0);

        const tresMass = tresNums.reduce((acc, n) => acc + (BALL_WEIGHTS[n] || 4.40), 0);
        const clasicoMass = clasicoNums.reduce((acc, n) => acc + (BALL_WEIGHTS[n] || 4.40), 0);

        const tresParity = {
          even: tresNums.filter(n => n % 2 === 0).length,
          odd: tresNums.filter(n => n % 2 !== 0).length
        };

        const clasicoParity = {
          even: clasicoNums.filter(n => n % 2 === 0).length,
          odd: clasicoNums.filter(n => n % 2 !== 0).length
        };

        parsedPairs.push({
          date,
          tresDraw: tres,
          clasicoDraw: clasico,
          tresNumbers: tresNums,
          clasicoNumbers: clasicoNums,
          directRepeats,
          tresSum,
          clasicoSum,
          tresMass,
          clasicoMass,
          tresParity,
          clasicoParity
        });
      } else if (dayDraws.length === 1) {
        // Individual draw (e.g. today's 15:00 if 21:15 hasn't played yet)
        // Check if concurso is odd (typically Tres) or even
        if (Number(dayDraws[0].CONCURSO) % 2 === 1) {
          allTres.push(dayDraws[0]);
        } else {
          allClasico.push(dayDraws[0]);
        }
      }
    });

    // Encontrar el último sorteo de las Tres disponible
    const latestTres = allTres.length > 0 ? allTres[allTres.length - 1] : sorted[sorted.length - 1];

    return {
      pairs: parsedPairs,
      tresDraws: allTres,
      clasicoDraws: allClasico,
      latestTresDraw: latestTres
    };
  }, [data]);

  // Filtrar según ventana de tiempo
  const activePairs = useMemo(() => {
    if (windowSize === 0 || windowSize >= pairs.length) {
      return pairs;
    }
    return pairs.slice(-windowSize);
  }, [pairs, windowSize]);

  // 2. Construcción de la Matriz de Transición 28x28 (De las Tres -> Clásico)
  const matrixStats = useMemo(() => {
    // 28x28 counts (1-indexed)
    const counts: number[][] = Array(29).fill(0).map(() => Array(29).fill(0));
    const tresOccurrences: number[] = Array(29).fill(0);
    const clasicoOccurrences: number[] = Array(29).fill(0);
    let totalDirectEchoes = 0;

    activePairs.forEach(pair => {
      pair.tresNumbers.forEach(t => {
        tresOccurrences[t]++;
        pair.clasicoNumbers.forEach(c => {
          counts[t][c]++;
        });
      });

      pair.clasicoNumbers.forEach(c => {
        clasicoOccurrences[c]++;
      });

      totalDirectEchoes += pair.directRepeats.length;
    });

    const totalPairsCount = Math.max(activePairs.length, 1);
    
    // Probabilidad condicional P(Clasico=j | Tres=i) = counts[i][j] / tresOccurrences[i]
    const probs: number[][] = Array(29).fill(0).map(() => Array(29).fill(0));
    // Lift: P(j|i) / P(j)
    const lifts: number[][] = Array(29).fill(0).map(() => Array(29).fill(0));
    
    let maxCount = 1;

    for (let i = 1; i <= 28; i++) {
      const baseCount = Math.max(tresOccurrences[i], 1);
      for (let j = 1; j <= 28; j++) {
        probs[i][j] = counts[i][j] / baseCount;
        if (counts[i][j] > maxCount) {
          maxCount = counts[i][j];
        }
        const baseProbClasico = clasicoOccurrences[j] / totalPairsCount;
        lifts[i][j] = baseProbClasico > 0 ? probs[i][j] / baseProbClasico : 1.0;
      }
    }

    // Direct repeat stats by number
    const repeatsPerNumber: { num: number; count: number; rate: number }[] = [];
    for (let n = 1; n <= 28; n++) {
      const diag = counts[n][n];
      const rate = tresOccurrences[n] > 0 ? (diag / tresOccurrences[n]) * 100 : 0;
      repeatsPerNumber.push({ num: n, count: diag, rate });
    }
    repeatsPerNumber.sort((a, b) => b.rate - a.rate);

    return {
      counts,
      probs,
      lifts,
      tresOccurrences,
      clasicoOccurrences,
      maxCount,
      totalDirectEchoes,
      avgEchoesPerDraw: (totalDirectEchoes / totalPairsCount).toFixed(2),
      repeatsPerNumber,
      totalPairsCount
    };
  }, [activePairs]);

  // 3. Diferencial Diurno (15h) vs Nocturno (21h)
  const diurnalVsNocturnal = useMemo(() => {
    const totalPairs = Math.max(activePairs.length, 1);
    const result = [];

    for (let num = 1; num <= 28; num++) {
      const fTres = matrixStats.tresOccurrences[num] || 0;
      const fClasico = matrixStats.clasicoOccurrences[num] || 0;
      const pTres = (fTres / totalPairs) * 100;
      const pClasico = (fClasico / totalPairs) * 100;
      const delta = pTres - pClasico; // positivo = Diurno, negativo = Nocturno
      
      let classification: 'DIURNO' | 'NOCTURNO' | 'NEUTRO' = 'NEUTRO';
      if (delta >= 6.0) classification = 'DIURNO';
      else if (delta <= -6.0) classification = 'NOCTURNO';

      result.push({
        num,
        fTres,
        fClasico,
        pTres,
        pClasico,
        delta,
        weight: BALL_WEIGHTS[num] || 4.40,
        classification
      });
    }

    return result;
  }, [activePairs, matrixStats]);

  // 4. Proyección de Arrastre para el próximo Sorteo Clásico (21:15)
  const dragProjection = useMemo(() => {
    let sourceVector: number[] = [];
    
    if (customTresInput.trim()) {
      const parsed = customTresInput
        .split(/[\s,.-]+/)
        .map(s => parseInt(s, 10))
        .filter(n => !isNaN(n) && n >= 1 && n <= 28);
      if (parsed.length > 0) {
        sourceVector = Array.from(new Set(parsed)).slice(0, 5);
      }
    }

    if (sourceVector.length === 0 && latestTresDraw) {
      sourceVector = [latestTresDraw.R1, latestTresDraw.R2, latestTresDraw.R3, latestTresDraw.R4, latestTresDraw.R5];
    }

    // Calcular resonancia acumulada de arrastre para cada número 1..28
    const candidateScores: { num: number; score: number; lift: number; transitionSources: number[]; mass: number }[] = [];

    for (let target = 1; target <= 28; target++) {
      let combinedScore = 0;
      let combinedLift = 0;
      const transitionSources: number[] = [];

      sourceVector.forEach(source => {
        const prob = matrixStats.probs[source][target] || 0;
        const lift = matrixStats.lifts[source][target] || 1;
        
        if (prob > 0.15) {
          transitionSources.push(source);
        }

        // Peso exponencial si es arrastre directo (source == target) o puente fuerte
        const directBonus = source === target ? 1.25 : 1.0;
        combinedScore += prob * directBonus;
        combinedLift += lift;
      });

      const avgLift = sourceVector.length > 0 ? combinedLift / sourceVector.length : 1;
      const normalizedScore = (combinedScore / Math.max(sourceVector.length, 1)) * 100;

      candidateScores.push({
        num: target,
        score: normalizedScore,
        lift: avgLift,
        transitionSources,
        mass: BALL_WEIGHTS[target] || 4.40
      });
    }

    candidateScores.sort((a, b) => b.score - a.score);

    const top5Recommended = candidateScores.slice(0, 5).map(c => c.num).sort((a, b) => a - b);

    return {
      sourceVector,
      candidateScores,
      top5Recommended
    };
  }, [customTresInput, latestTresDraw, matrixStats]);

  // 5. Transferencia por Deciles (Bloques 1-9, 10-19, 20-28)
  const decileTransferMatrix = useMemo(() => {
    // 0: Bajo (1-9), 1: Medio (10-19), 2: Alto (20-28)
    const getDecile = (num: number) => {
      if (num <= 9) return 0;
      if (num <= 19) return 1;
      return 2;
    };

    const decileCounts = [
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ];
    const decileTotals = [0, 0, 0];

    activePairs.forEach(pair => {
      pair.tresNumbers.forEach(t => {
        const decT = getDecile(t);
        decileTotals[decT]++;
        pair.clasicoNumbers.forEach(c => {
          const decC = getDecile(c);
          decileCounts[decT][decC]++;
        });
      });
    });

    const decileProbs = decileCounts.map((row, i) =>
      row.map(val => (decileTotals[i] > 0 ? (val / (decileTotals[i] * 5)) * 100 : 33.3))
    );

    return {
      decileCounts,
      decileProbs,
      decileTotals
    };
  }, [activePairs]);

  // Estadísticas globales de promedios de masa y suma
  const globalTelemetry = useMemo(() => {
    if (activePairs.length === 0) {
      return {
        avgTresSum: 0,
        avgClasicoSum: 0,
        avgTresMass: 0,
        avgClasicoMass: 0,
        deltaMass: 0,
        deltaSum: 0
      };
    }

    const sumT = activePairs.reduce((acc, p) => acc + p.tresSum, 0) / activePairs.length;
    const sumC = activePairs.reduce((acc, p) => acc + p.clasicoSum, 0) / activePairs.length;
    const massT = activePairs.reduce((acc, p) => acc + p.tresMass, 0) / activePairs.length;
    const massC = activePairs.reduce((acc, p) => acc + p.clasicoMass, 0) / activePairs.length;

    return {
      avgTresSum: sumT.toFixed(1),
      avgClasicoSum: sumC.toFixed(1),
      avgTresMass: massT.toFixed(2),
      avgClasicoMass: massC.toFixed(2),
      deltaMass: (massC - massT).toFixed(3),
      deltaSum: (sumC - sumT).toFixed(1)
    };
  }, [activePairs]);

  // Transiciones del número seleccionado en la matriz
  const selectedNumTransitions = useMemo(() => {
    const row = matrixStats.counts[selectedNum] || [];
    const list = [];
    for (let j = 1; j <= 28; j++) {
      const count = row[j] || 0;
      const prob = (matrixStats.probs[selectedNum][j] || 0) * 100;
      const lift = matrixStats.lifts[selectedNum][j] || 1;
      const massDelta = (BALL_WEIGHTS[j] || 4.40) - (BALL_WEIGHTS[selectedNum] || 4.40);
      list.push({
        num: j,
        count,
        prob,
        lift,
        massDelta,
        isEcho: j === selectedNum
      });
    }
    list.sort((a, b) => b.count - a.count);
    return list;
  }, [selectedNum, matrixStats]);

  return (
    <div className="bg-slate-900/60 border border-amber-500/20 rounded-[3rem] p-6 md:p-10 shadow-2xl backdrop-blur-xl space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-700">
      {/* HEADER PRINCIPAL */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <span className="bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-[10px] px-3.5 py-1.5 rounded-full uppercase tracking-widest flex items-center gap-2">
              <i className="fas fa-clock text-amber-500"></i>
              Auditoría Horaria 15:00 vs 21:15
            </span>
            <span className="bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 font-mono text-[10px] px-3 py-1.5 rounded-full uppercase font-bold">
              {activePairs.length} Días Emparejados
            </span>
          </div>
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
            <i className="fas fa-arrows-split-up-and-left text-amber-500"></i>
            Matriz de Correlación & Arrastre de Masa Horario
          </h3>
          <p className="text-slate-400 text-xs italic max-w-3xl leading-relaxed">
            Detección de patrones de resonancia, transferencia de inercia y eco de esferas entre el Sorteo de las Tres (15:00 hrs) y el Sorteo Clásico (21:15 hrs) originados por gradientes térmicos y dinámica neumática en CDMX.
          </p>
        </div>

        {/* FILTROS DE VENTANA TEMPORAL */}
        <div className="flex flex-wrap items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800">
          <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 px-3">Ventana:</span>
          {[
            { label: '30 Días', value: 30 },
            { label: '60 Días', value: 60 },
            { label: 'Historial Completo', value: 0 }
          ].map(opt => (
            <button
              key={opt.value}
              onClick={() => setWindowSize(opt.value)}
              className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all ${
                windowSize === opt.value
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* MÉTRICAS DE TELEMETRÍA GLOBAL COMPARATIVA */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-left">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Pares Auditados</div>
          <div className="text-2xl font-black text-white font-mono">{activePairs.length}</div>
          <div className="text-[9px] text-slate-400 mt-1">Días completos</div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-amber-500/20 text-left">
          <div className="text-[9px] font-bold text-amber-500/80 uppercase tracking-widest mb-1">Eco Directo (i → i)</div>
          <div className="text-2xl font-black text-amber-400 font-mono">{matrixStats.avgEchoesPerDraw}</div>
          <div className="text-[9px] text-slate-400 mt-1">Esferas repetidas / día</div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-left">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Suma Media 15h</div>
          <div className="text-2xl font-black text-cyan-400 font-mono">{globalTelemetry.avgTresSum}</div>
          <div className="text-[9px] text-slate-400 mt-1">Masa diurna</div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-left">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Suma Media 21h</div>
          <div className="text-2xl font-black text-indigo-400 font-mono">{globalTelemetry.avgClasicoSum}</div>
          <div className="text-[9px] text-slate-400 mt-1">Masa nocturna</div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-left">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Δ Suma (21h - 15h)</div>
          <div className={`text-2xl font-black font-mono ${Number(globalTelemetry.deltaSum) >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
            {Number(globalTelemetry.deltaSum) >= 0 ? `+${globalTelemetry.deltaSum}` : globalTelemetry.deltaSum}
          </div>
          <div className="text-[9px] text-slate-400 mt-1">Deriva de masa</div>
        </div>

        <div className="bg-slate-950/60 p-4 rounded-2xl border border-slate-800 text-left">
          <div className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mb-1">Δ Peso Cámara</div>
          <div className="text-2xl font-black text-amber-300 font-mono">{globalTelemetry.deltaMass}g</div>
          <div className="text-[9px] text-slate-400 mt-1">Inercia gravimétrica</div>
        </div>
      </div>

      {/* PESTAÑAS DE VISTAS ANALÍTICAS */}
      <div className="flex flex-wrap gap-3 border-b border-slate-800 pb-4">
        {[
          { id: 'matrix', label: 'Matriz 28x28 (Heatmap de Arrastre)', icon: 'fa-th' },
          { id: 'drag_projector', label: 'Proyector 15h → 21h (Próximo Sorteo)', icon: 'fa-crosshairs' },
          { id: 'diurnal_nocturnal', label: 'Sesgo Diurno vs Nocturno', icon: 'fa-sun' },
          { id: 'decile_transfer', label: 'Inercia por Deciles (3x3)', icon: 'fa-layer-group' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center gap-2.5 ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/20 font-black'
                : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-white hover:border-slate-700'
            }`}
          >
            <i className={`fas ${tab.icon} ${activeTab === tab.id ? 'text-slate-950' : 'text-amber-500'}`}></i>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: MATRIZ DE CO-OCURRENCIA 28x28 HEATMAP */}
      {activeTab === 'matrix' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-slate-950/40 p-5 rounded-2xl border border-slate-800">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Guía de Lectura:</span>
              <p className="text-xs text-slate-300 italic">
                <strong>Fila = Esfera en Sorteo de las Tres (15:00)</strong> → <strong>Columna = Esfera arrastrada al Clásico (21:15)</strong>.
                La diagonal resaltada indica <em>ecos directos</em> (esferas que repitieron el mismo día).
              </p>
            </div>

            {/* Selector de número base */}
            <div className="flex items-center gap-3">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Inspeccionar Esfera:</span>
              <select
                value={selectedNum}
                onChange={e => setSelectedNum(Number(e.target.value))}
                className="bg-slate-900 border border-slate-700 text-amber-400 font-bold text-xs rounded-xl px-4 py-2 font-mono outline-none focus:border-amber-500"
              >
                {Array.from({ length: 28 }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>
                    Nodo #{n < 10 ? `0${n}` : n} ({BALL_WEIGHTS[n]?.toFixed(2)}g)
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
            {/* TABLERO DE LA MATRIZ 28x28 */}
            <div className="xl:col-span-2 bg-slate-950 p-4 md:p-6 rounded-[2.5rem] border border-slate-800 overflow-x-auto shadow-inner">
              <div className="min-w-[620px]">
                {/* Cabecera de columnas (Clásico 21:15) */}
                <div className="flex items-center mb-2">
                  <div className="w-10 text-[9px] font-black text-amber-500 text-right pr-2">15h \ 21h</div>
                  <div className="flex-1 grid gap-0.5" style={{ gridTemplateColumns: 'repeat(28, minmax(0, 1fr))' }}>
                    {Array.from({ length: 28 }, (_, i) => i + 1).map(col => (
                      <div
                        key={col}
                        className={`text-center text-[8px] font-mono font-bold ${
                          col === selectedNum ? 'text-amber-400 bg-amber-500/10 rounded' : 'text-slate-500'
                        }`}
                      >
                        {col}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Filas (De las Tres 15:00) */}
                <div className="space-y-0.5">
                  {Array.from({ length: 28 }, (_, i) => i + 1).map(row => {
                    const isSelectedRow = row === selectedNum;
                    return (
                      <div key={row} className="flex items-center">
                        <button
                          onClick={() => setSelectedNum(row)}
                          className={`w-10 text-right pr-2 text-[9px] font-mono font-black transition-colors ${
                            isSelectedRow ? 'text-amber-400 underline font-extrabold' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          #{row < 10 ? `0${row}` : row}
                        </button>
                        
                        <div className="flex-1 grid gap-0.5" style={{ gridTemplateColumns: 'repeat(28, minmax(0, 1fr))' }}>
                          {Array.from({ length: 28 }, (_, j) => j + 1).map(col => {
                            const count = matrixStats.counts[row][col] || 0;
                            const prob = matrixStats.probs[row][col] || 0;
                            const lift = matrixStats.lifts[row][col] || 1;
                            const isDiagonal = row === col;
                            const intensity = count / Math.max(matrixStats.maxCount, 1);

                            // Color ramp
                            let bgClass = 'bg-slate-900/40 text-slate-600';
                            if (count > 0) {
                              if (intensity > 0.65) bgClass = 'bg-amber-500 text-slate-950 font-black shadow-sm';
                              else if (intensity > 0.45) bgClass = 'bg-amber-600/80 text-white font-bold';
                              else if (intensity > 0.25) bgClass = 'bg-indigo-600/70 text-indigo-100';
                              else bgClass = 'bg-slate-800/80 text-slate-300';
                            }

                            if (isDiagonal) {
                              bgClass += ' ring-1 ring-amber-400/60';
                            }

                            return (
                              <button
                                key={col}
                                onClick={() => setSelectedNum(row)}
                                onMouseEnter={() => setHoveredCell({ tres: row, clasico: col, count, prob, lift })}
                                onMouseLeave={() => setHoveredCell(null)}
                                className={`h-5 md:h-6 flex items-center justify-center text-[7px] md:text-[8px] font-mono rounded-sm transition-all hover:scale-125 hover:z-20 hover:ring-2 hover:ring-white ${bgClass}`}
                                title={`15:00 (#${row}) → 21:15 (#${col}): ${count} veces (${(prob * 100).toFixed(1)}%) | Lift: ${lift.toFixed(2)}x`}
                              >
                                {count > 0 ? count : ''}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* LEYENDA DEL HEATMAP */}
              <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-slate-900 pt-4 text-[10px] text-slate-400">
                <div className="flex items-center gap-2">
                  <span className="font-bold">Frecuencia de Arrastre:</span>
                  <div className="flex items-center gap-1 font-mono text-[8px]">
                    <span className="px-2 py-0.5 bg-slate-900 text-slate-500 rounded">0</span>
                    <span className="px-2 py-0.5 bg-slate-800 text-slate-300 rounded">Baja</span>
                    <span className="px-2 py-0.5 bg-indigo-600 text-white rounded">Media</span>
                    <span className="px-2 py-0.5 bg-amber-600 text-white rounded">Alta</span>
                    <span className="px-2 py-0.5 bg-amber-500 text-slate-950 font-black rounded">Pico</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="inline-block w-3 h-3 ring-1 ring-amber-400 bg-amber-500/20 rounded-sm"></span>
                  <span>Borde Amarillo: Eco Directo (El mismo número en 15h y 21h)</span>
                </div>
              </div>
            </div>

            {/* PANEL LATERAL DE DETALLE DE LA ESFERA SELECCIONADA */}
            <div className="bg-slate-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">Perfil de Arrastre</span>
                  <h4 className="text-xl font-black text-white uppercase italic">Nodo #{selectedNum < 10 ? `0${selectedNum}` : selectedNum}</h4>
                </div>
                <NumberBall number={selectedNum} size="md" />
              </div>

              <div className="grid grid-cols-2 gap-3 text-left">
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[8px] font-bold text-slate-500 uppercase">Masa en Balanza</div>
                  <div className="text-sm font-black text-amber-400 font-mono">{BALL_WEIGHTS[selectedNum]?.toFixed(2)} g</div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[8px] font-bold text-slate-500 uppercase">Apariciones a las 15h</div>
                  <div className="text-sm font-black text-cyan-400 font-mono">{matrixStats.tresOccurrences[selectedNum]} veces</div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[8px] font-bold text-slate-500 uppercase">Tasa de Eco Directo</div>
                  <div className="text-sm font-black text-emerald-400 font-mono">
                    {((matrixStats.counts[selectedNum][selectedNum] / Math.max(matrixStats.tresOccurrences[selectedNum], 1)) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                  <div className="text-[8px] font-bold text-slate-500 uppercase">Ecos Absolutos</div>
                  <div className="text-sm font-black text-white font-mono">{matrixStats.counts[selectedNum][selectedNum]} días</div>
                </div>
              </div>

              {/* LISTA TOP DE NÚMEROS ARRASTRADOS */}
              <div className="space-y-3">
                <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Top Vectores Atraídos a las 21:15 hrs:
                </h5>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {selectedNumTransitions.slice(0, 6).map((item, idx) => (
                    <div
                      key={item.num}
                      className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                        item.isEcho
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300'
                          : 'bg-slate-900/50 border-slate-800/70 text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono font-bold text-slate-500">#{idx + 1}</span>
                        <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-xs text-white">
                          {item.num < 10 ? `0${item.num}` : item.num}
                        </div>
                        {item.isEcho && (
                          <span className="text-[8px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full font-bold uppercase">
                            Eco Directo
                          </span>
                        )}
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono font-black text-white">{item.prob.toFixed(1)}%</div>
                        <div className="text-[9px] text-slate-500 font-mono">
                          {item.count} veces | Lift {item.lift.toFixed(2)}x
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {hoveredCell && (
                <div className="p-3 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl text-[10px] font-mono text-indigo-300">
                  Transición: #{hoveredCell.tres} (15h) → #{hoveredCell.clasico} (21h): {hoveredCell.count} veces ({(hoveredCell.prob * 100).toFixed(1)}%)
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PROYECTOR DE ARRASTRE PRÓXIMO (15H -> 21H) */}
      {activeTab === 'drag_projector' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-slate-950 p-8 rounded-[2.5rem] border border-amber-500/30 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Inferencia de Arrastre Neumático</span>
                <h4 className="text-2xl font-black text-white uppercase italic">Proyector de Coordenadas para el Sorteo Clásico (21:15 hrs)</h4>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">Sorteo Base:</span>
                <span className="px-3 py-1 bg-slate-900 border border-slate-700 rounded-full font-mono text-xs text-amber-400 font-bold">
                  #{latestTresDraw?.CONCURSO || '---'} ({latestTresDraw?.FECHA || '---'})
                </span>
              </div>
            </div>

            {/* VECTOR BASE DE LAS TRES */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Combinación Extraída a las 15:00 hrs (Sorteo de las Tres):
                </span>
                <div className="flex flex-wrap items-center gap-3 bg-slate-900/60 p-4 rounded-2xl border border-slate-800">
                  {dragProjection.sourceVector.map(n => (
                    <NumberBall key={n} number={n} size="md" />
                  ))}
                  <span className="text-xs font-mono text-slate-400 ml-3">
                    Σ = {dragProjection.sourceVector.reduce((a, b) => a + b, 0)} | Masa = {dragProjection.sourceVector.reduce((a, b) => a + (BALL_WEIGHTS[b] || 4.40), 0).toFixed(2)}g
                  </span>
                </div>
              </div>

              {/* INPUT PARA PROBAR COMBINACIONES ALTERNATIVAS */}
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Probar con otra combinación de las 3:00 p. m.:
                </span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Ej: 01 05 16 19 21"
                    value={customTresInput}
                    onChange={e => setCustomTresInput(e.target.value)}
                    className="flex-1 bg-slate-900 border border-slate-700 text-white text-xs font-mono px-4 py-3 rounded-2xl outline-none focus:border-amber-500"
                  />
                  {customTresInput && (
                    <button
                      onClick={() => setCustomTresInput('')}
                      className="px-4 py-3 bg-slate-800 text-slate-400 hover:text-white rounded-2xl text-xs font-bold"
                    >
                      Restablecer
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* VECTOR RECOMENDADO TOP 5 */}
            <div className="p-6 bg-gradient-to-r from-amber-950/30 via-slate-900/60 to-slate-950 border border-amber-500/40 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                  <i className="fas fa-bullseye"></i>
                  Vector Óptimo de Mayor Arrastre Calculado (21:15 hrs):
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full font-mono font-bold">
                  Resonancia Cuántica 15h → 21h
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-4 justify-center py-2">
                {dragProjection.top5Recommended.map(n => (
                  <div key={n} className="flex flex-col items-center gap-1.5">
                    <NumberBall number={n} size="lg" />
                    <span className="text-[9px] font-mono text-amber-400 font-bold">
                      {BALL_WEIGHTS[n]?.toFixed(2)}g
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* TABLA COMPLETA DE RESONANCIA DE LOS 28 NÚMEROS */}
            <div className="space-y-3">
              <h5 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Ranking de Fuerza de Arrastre de los 28 Nodos para las 21:15 hrs:
              </h5>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 max-h-[380px] overflow-y-auto pr-1">
                {dragProjection.candidateScores.map((cand, idx) => {
                  const isTop5 = idx < 5;
                  return (
                    <div
                      key={cand.num}
                      className={`p-3.5 rounded-2xl border transition-all flex items-center justify-between ${
                        isTop5
                          ? 'bg-amber-500/10 border-amber-500/40 text-white ring-1 ring-amber-500/20'
                          : 'bg-slate-900/40 border-slate-800 text-slate-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className={`text-xs font-mono font-black ${isTop5 ? 'text-amber-400' : 'text-slate-600'}`}>
                          #{idx + 1}
                        </span>
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-black text-xs ${
                          isTop5 ? 'bg-amber-500 text-slate-950 font-extrabold shadow-md' : 'bg-slate-800 text-white'
                        }`}>
                          {cand.num < 10 ? `0${cand.num}` : cand.num}
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-xs font-mono font-black text-amber-300">
                          {cand.score.toFixed(1)} pts
                        </div>
                        <div className="text-[8px] text-slate-500 font-mono">
                          Lift: {cand.lift.toFixed(2)}x | {cand.mass.toFixed(2)}g
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: SESGO DIURNO VS NOCTURNO */}
      {activeTab === 'diurnal_nocturnal' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-slate-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
              <div>
                <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Termodinámica de Horario</span>
                <h4 className="text-2xl font-black text-white uppercase italic">Preferencia Diurna (15:00) vs. Nocturna (21:15)</h4>
              </div>
              <div className="flex items-center gap-4 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-amber-400">
                  <span className="w-3 h-3 rounded-full bg-amber-500"></span> Diurnas (15h)
                </span>
                <span className="flex items-center gap-1.5 text-indigo-400">
                  <span className="w-3 h-3 rounded-full bg-indigo-500"></span> Nocturnas (21h)
                </span>
              </div>
            </div>

            {/* GRÁFICO COMPARATIVO DE BARRAS DE LOS 28 NÚMEROS */}
            <div className="space-y-3">
              {diurnalVsNocturnal.map(item => {
                const maxPct = Math.max(item.pTres, item.pClasico, 35);
                const isDiurnal = item.classification === 'DIURNO';
                const isNocturnal = item.classification === 'NOCTURNO';

                return (
                  <div key={item.num} className="bg-slate-900/40 p-3 rounded-2xl border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center gap-4">
                    <div className="flex items-center gap-3 w-32 shrink-0">
                      <div className="w-8 h-8 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center font-black text-xs text-white">
                        {item.num < 10 ? `0${item.num}` : item.num}
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {item.weight.toFixed(2)}g
                      </span>
                    </div>

                    <div className="flex-1 w-full space-y-1.5">
                      {/* Barra 15:00 hrs */}
                      <div className="flex items-center gap-3">
                        <span className="w-12 text-[9px] font-mono text-amber-400">15:00h</span>
                        <div className="flex-1 h-3 bg-slate-950 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.pTres / maxPct) * 100}%` }}
                            className="h-full bg-amber-500"
                          />
                        </div>
                        <span className="w-14 text-[10px] font-mono text-right text-slate-300 font-bold">
                          {item.pTres.toFixed(1)}% ({item.fTres})
                        </span>
                      </div>

                      {/* Barra 21:15 hrs */}
                      <div className="flex items-center gap-3">
                        <span className="w-12 text-[9px] font-mono text-indigo-400">21:15h</span>
                        <div className="flex-1 h-3 bg-slate-950 rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${(item.pClasico / maxPct) * 100}%` }}
                            className="h-full bg-indigo-500"
                          />
                        </div>
                        <span className="w-14 text-[10px] font-mono text-right text-slate-300 font-bold">
                          {item.pClasico.toFixed(1)}% ({item.fClasico})
                        </span>
                      </div>
                    </div>

                    {/* Badge de Sesgo */}
                    <div className="w-28 text-right shrink-0">
                      {isDiurnal && (
                        <span className="inline-block px-2.5 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 text-[9px] font-black rounded-full uppercase">
                          +Diurna ({item.delta.toFixed(0)}%)
                        </span>
                      )}
                      {isNocturnal && (
                        <span className="inline-block px-2.5 py-1 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[9px] font-black rounded-full uppercase">
                          +Nocturna ({Math.abs(item.delta).toFixed(0)}%)
                        </span>
                      )}
                      {!isDiurnal && !isNocturnal && (
                        <span className="inline-block px-2.5 py-1 bg-slate-800 text-slate-400 text-[9px] font-mono rounded-full">
                          Equilibrada
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INERCIA DE MASA POR DECILES (3X3) */}
      {activeTab === 'decile_transfer' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <div className="bg-slate-950 p-6 md:p-8 rounded-[2.5rem] border border-slate-800 space-y-6">
            <div className="border-b border-slate-800 pb-6">
              <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Termodinámica de Grupos</span>
              <h4 className="text-2xl font-black text-white uppercase italic">Transferencia de Bloques de Masa (15:00 → 21:15)</h4>
              <p className="text-xs text-slate-400 italic mt-1">
                Evalúa si la eyección de esferas en un decil a las 3:00 p. m. satura o vacía dicho decil para el sorteo de las 9:15 p. m.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Bloque Bajo (01 al 09)', idx: 0, color: 'text-cyan-400', border: 'border-cyan-500/30' },
                { title: 'Bloque Medio (10 al 19)', idx: 1, color: 'text-amber-400', border: 'border-amber-500/30' },
                { title: 'Bloque Alto (20 al 28)', idx: 2, color: 'text-purple-400', border: 'border-purple-500/30' }
              ].map(block => (
                <div key={block.idx} className={`bg-slate-900/50 p-6 rounded-3xl border ${block.border} space-y-4`}>
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <h5 className={`text-xs font-black uppercase tracking-wider ${block.color}`}>{block.title}</h5>
                    <span className="text-[9px] font-mono text-slate-500">15:00 hrs</span>
                  </div>

                  <div className="space-y-3">
                    <div className="text-[10px] text-slate-400 uppercase font-bold">Destino en Clásico (21:15 hrs):</div>
                    
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-cyan-400">→ Hacia Bajo (01-09):</span>
                        <span className="font-bold text-white">{decileTransferMatrix.decileProbs[block.idx][0].toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-cyan-500" style={{ width: `${decileTransferMatrix.decileProbs[block.idx][0]}%` }}></div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono pt-1">
                        <span className="text-amber-400">→ Hacia Medio (10-19):</span>
                        <span className="font-bold text-white">{decileTransferMatrix.decileProbs[block.idx][1].toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-amber-500" style={{ width: `${decileTransferMatrix.decileProbs[block.idx][1]}%` }}></div>
                      </div>

                      <div className="flex items-center justify-between text-xs font-mono pt-1">
                        <span className="text-purple-400">→ Hacia Alto (20-28):</span>
                        <span className="font-bold text-white">{decileTransferMatrix.decileProbs[block.idx][2].toFixed(1)}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
                        <div className="h-full bg-purple-500" style={{ width: `${decileTransferMatrix.decileProbs[block.idx][2]}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
