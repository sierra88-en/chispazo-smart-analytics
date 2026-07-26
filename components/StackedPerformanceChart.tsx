import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ReferenceLine } from 'recharts';
import { DrawResult } from '../types';

interface StackedPerformanceChartProps {
  draws?: DrawResult[];
}

interface PresetPlay {
  name: string;
  numbers: number[];
  origin: string;
}

export const StackedPerformanceChart: React.FC<StackedPerformanceChartProps> = ({ draws = [] }) => {
  const [allDraws, setAllDraws] = useState<DrawResult[]>([]);
  const [selectedPreset, setSelectedPreset] = useState<number>(0);
  const [customNumbers, setCustomNumbers] = useState<number[]>([3, 14, 20, 27, 28]);
  const [concursoInicial, setConcursoInicial] = useState<number>(12050);
  const [cantidadSorteos, setCantidadSorteos] = useState<number>(15);
  const [isEditingCustom, setIsEditingCustom] = useState<boolean>(false);
  const [inputVal, setInputVal] = useState<string>("3, 14, 20, 27, 28");

  // Presets based on actual tickets from user screenshots
  const PRESET_PLAYS: PresetPlay[] = [
    { name: "Ticket Chis. Tres (16 Jun)", numbers: [3, 6, 7, 13, 14], origin: "Screenshot Chis. de las Tres" },
    { name: "Ticket Chis. Clásico (16 Jun)", numbers: [2, 4, 5, 8, 15], origin: "Screenshot Chis. Clásico" },
    { name: "Sugerencia Activa", numbers: [3, 14, 20, 27, 28], origin: "Boleto Activo en Pantalla" },
    { name: "Combinación Delta", numbers: [4, 18, 23, 25, 28], origin: "Resultado Sorteo 12071" }
  ];

  useEffect(() => {
    if (draws && draws.length > 0) {
      // Sort chronologically ascending for simulation direction
      const sorted = [...draws].sort((a, b) => Number(a.CONCURSO) - Number(b.CONCURSO));
      setAllDraws(sorted);
      
      // Auto set initial concurso to something around 15 drawings from the end
      if (sorted.length > 15) {
        setConcursoInicial(Number(sorted[sorted.length - 16].CONCURSO));
      } else if (sorted.length > 0) {
        setConcursoInicial(Number(sorted[0].CONCURSO));
      }
    } else {
      // Fallback local fetch
      fetch('/api/synced-data')
        .then(res => res.json())
        .then(synced => {
          if (synced.draws && synced.draws.length > 0) {
            const sorted = [...synced.draws].sort((a, b) => Number(a.CONCURSO) - Number(b.CONCURSO));
            setAllDraws(sorted);
            if (sorted.length > 15) {
              setConcursoInicial(Number(sorted[sorted.length - 16].CONCURSO));
            } else if (sorted.length > 0) {
              setConcursoInicial(Number(sorted[0].CONCURSO));
            }
          }
        })
        .catch(err => {
          console.warn("No se pudo cargar datos sincrónicos de respaldo para comparación:", err);
        });
    }
  }, [draws]);

  // Sync custom numbers with customPreset index selection
  useEffect(() => {
    if (selectedPreset !== -1) {
      setCustomNumbers(PRESET_PLAYS[selectedPreset].numbers);
      setInputVal(PRESET_PLAYS[selectedPreset].numbers.join(", "));
    }
  }, [selectedPreset]);

  // Parse custom text
  const handleApplyCustom = () => {
    const parsed = inputVal
      .split(',')
      .map(n => parseInt(n.trim()))
      .filter(n => !isNaN(n) && n >= 1 && n <= 28);
    
    // Ensure we have exactly 5 unique sorted numbers
    const unique = Array.from(new Set(parsed)).sort((a, b) => a - b);
    if (unique.length === 5) {
      setCustomNumbers(unique);
      setSelectedPreset(-1);
      setIsEditingCustom(false);
    } else {
      alert("Por favor ingresa exactamente 5 números válidos del 1 al 28 separados por comas.");
    }
  };

  // 1. Filter draws subsequent to concursoInicial
  const subsequentDraws = allDraws
    .filter(d => Number(d.CONCURSO) >= concursoInicial)
    .slice(0, cantidadSorteos);

  // 2. Generate chart-friendly statistics
  const chartData = subsequentDraws.map(draw => {
    const drawNumbers = [draw.R1, draw.R2, draw.R3, draw.R4, draw.R5];
    const matchingNumbers = customNumbers.filter(num => drawNumbers.includes(num));
    const hitsCount = matchingNumbers.length;
    const missesCount = 5 - hitsCount;

    return {
      concurso: `#${draw.CONCURSO}`,
      fecha: draw.FECHA,
      aciertos: hitsCount,
      noAciertos: missesCount,
      matchedList: matchingNumbers,
      allList: drawNumbers,
      rawConcurso: draw.CONCURSO
    };
  });

  // Calculate stats
  const totalSubsequent = subsequentDraws.length;
  const hitDistribution = { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  let totalFreePlays = 0; // 2 hits
  let totalHits3 = 0; // 3 hits
  let totalHits4 = 0; // 4 hits
  let totalHits5 = 0; // 5 hits

  chartData.forEach(item => {
    const h = item.aciertos as 0 | 1 | 2 | 3 | 4 | 5;
    hitDistribution[h]++;
    if (h === 2) totalFreePlays++;
    else if (h === 3) totalHits3++;
    else if (h === 4) totalHits4++;
    else if (h === 5) totalHits5++;
  });

  // Financial simulation (Mexican Pesos MXN)
  const costPerDraw = 10;
  const totalInvestment = totalSubsequent * costPerDraw;
  
  // Custom estimated prizes (Chispazo average)
  const reward2HitsFreePlay = totalFreePlays * 10; // value equivalent
  const reward3Hits = totalHits3 * 50;
  const reward4Hits = totalHits4 * 1400;
  const reward5Hits = totalHits5 * 120000;
  const totalRecovery = reward2HitsFreePlay + reward3Hits + reward4Hits + reward5Hits;
  const netEarnings = totalRecovery - totalInvestment;
  const roiVal = totalInvestment > 0 ? ((totalRecovery / totalInvestment) * 100).toFixed(1) : "0.0";

  // Individual ballot frequencies in subsequent draws
  const ballFrequencies = customNumbers.map(num => {
    let hits = 0;
    subsequentDraws.forEach(draw => {
      const drawNumbers = [draw.R1, draw.R2, draw.R3, draw.R4, draw.R5];
      if (drawNumbers.includes(num)) hits++;
    });
    return { number: num, occurrences: hits };
  });

  return (
    <div id="stacked-performance-chart" className="bg-slate-900 border border-slate-800 p-8 rounded-[3.5rem] shadow-2xl relative overflow-hidden backdrop-blur-2xl">
      <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
        <i className="fas fa-chart-bar text-9xl text-amber-500"></i>
      </div>

      <header className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-black text-amber-500 uppercase tracking-widest">
            Backtesting Comparativo
          </span>
          <span className="px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full text-[9px] font-black text-blue-500 uppercase tracking-widest">
            Simulador de Jugada Posterior
          </span>
        </div>
        <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter">
          Rendimiento en <span className="text-amber-500">Sorteos Posteriores</span>
        </h3>
        <p className="text-slate-400 font-mono text-xs uppercase tracking-widest mt-2">
          Evaluación analítica con gráfico de barras apiladas
        </p>
      </header>

      {/* CONTROLES */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-8 p-6 bg-slate-950/60 border border-slate-800 rounded-3xl relative z-10">
        
        {/* JUGADA SELECCIONADA */}
        <div className="space-y-3">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Jugada del Experimento</label>
          <div className="flex flex-wrap gap-2 items-center">
            {customNumbers.map((num, i) => (
              <span 
                key={i} 
                className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 text-slate-950 flex items-center justify-center font-black text-sm shadow-md"
              >
                {String(num).padStart(2, '0')}
              </span>
            ))}
          </div>

          <div className="pt-2 flex gap-2">
            {!isEditingCustom ? (
              <button 
                onClick={() => setIsEditingCustom(true)}
                className="text-[10px] bg-slate-800 hover:bg-slate-700 text-amber-500 px-3 py-1.5 rounded-lg border border-slate-700 font-bold uppercase transition-all"
              >
                <i className="fas fa-edit mr-1"></i> Personalizar Combo
              </button>
            ) : (
              <div className="flex items-center gap-2 w-full">
                <input 
                  type="text" 
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1 text-xs text-white placeholder-slate-500 focus:outline-none w-28 font-mono"
                  placeholder="3, 14, 20..."
                />
                <button 
                  onClick={handleApplyCustom}
                  className="text-[9px] bg-emerald-600 text-white px-2 py-1 rounded hover:bg-emerald-500 font-bold uppercase"
                >
                  OK
                </button>
                <button 
                  onClick={() => setIsEditingCustom(false)}
                  className="text-[9px] bg-slate-800 text-slate-400 px-2 py-1 rounded hover:bg-slate-700 hover:text-white uppercase"
                >
                  X
                </button>
              </div>
            )}
          </div>
        </div>

        {/* PRESETS */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Presets Históricos</label>
          <select 
            value={selectedPreset}
            onChange={(e) => setSelectedPreset(Number(e.target.value))}
            className="w-full bg-slate-900 border border-slate-800 py-2.5 px-3 rounded-xl text-xs text-slate-300 font-bold focus:outline-none focus:border-amber-500/50"
          >
            {PRESET_PLAYS.map((preset, idx) => (
              <option key={idx} value={idx}>{preset.name}</option>
            ))}
            <option value={-1}>[Personalizado / Manual]</option>
          </select>
          <span className="block text-[9px] text-slate-500 uppercase italic font-medium">
            {selectedPreset >= 0 ? PRESET_PLAYS[selectedPreset].origin : "Combinación definida libremente"}
          </span>
        </div>

        {/* PUNTO DE PARTIDA */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Concurso de Origen</label>
          <div className="flex gap-2">
            <input 
              type="number"
              value={concursoInicial}
              onChange={(e) => setConcursoInicial(Number(e.target.value))}
              className="w-full bg-slate-900 border border-slate-800 py-2 px-3 rounded-xl text-xs text-slate-300 font-mono font-bold focus:outline-none"
            />
            <div className="flex flex-col gap-1">
              <button 
                onClick={() => setConcursoInicial(prev => Math.min(prev + 1, allDraws.length > 0 ? Number(allDraws[allDraws.length-1].CONCURSO) : prev + 1))}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[8px]"
              >
                ▲
              </button>
              <button 
                onClick={() => setConcursoInicial(prev => Math.max(prev - 1, allDraws.length > 0 ? Number(allDraws[0].CONCURSO) : prev - 1))}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-2 py-0.5 rounded text-[8px]"
              >
                ▼
              </button>
            </div>
          </div>
          <span className="block text-[9px] text-slate-500 uppercase">
            Evalúa sorteos que ocurrieron después.
          </span>
        </div>

        {/* CANTIDAD DE RESULTADOS */}
        <div className="space-y-2">
          <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Profundidad del Test</label>
          <div className="flex gap-4 items-center pt-1.5">
            {[10, 15, 20, 25].map(qty => (
              <button
                key={qty}
                onClick={() => setCantidadSorteos(qty)}
                className={`py-1.5 px-3 rounded-lg text-xs font-black transition-all ${cantidadSorteos === qty ? 'bg-amber-500 text-slate-950 font-black' : 'bg-slate-900 hover:bg-slate-800 text-slate-400'}`}
              >
                {qty}
              </button>
            ))}
          </div>
          <span className="block text-[9px] text-slate-500 uppercase">
            Sorteos consecutivos simulados.
          </span>
        </div>

      </div>

      {/* METRICAS KPI */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8 relative z-10">
        
        {/* KPI 1: EFFICIENT HITS */}
        <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-2xl">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Tasa de Acierto (Tier ≥ 2#)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-4xl font-extrabold text-emerald-500 tracking-tighter">
              {totalSubsequent > 0 
                ? `${(( (totalFreePlays + totalHits3 + totalHits4 + totalHits5) / totalSubsequent) * 100).toFixed(1)}%`
                : "0.0%"
              }
            </span>
            <span className="text-xs text-slate-400 font-bold">
              ({totalFreePlays + totalHits3 + totalHits4 + totalHits5}/{totalSubsequent} d.)
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-2 uppercase">Proporción de draws con premios directos</span>
        </div>

        {/* KPI 2: TOTAL INVESTMENT */}
        <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-2xl">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Inversión Simulada</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className="text-4xl font-extrabold text-slate-300 tracking-tighter">${totalInvestment.toFixed(2)}</span>
            <span className="text-xs text-slate-500 font-bold uppercase">MXN</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-2 uppercase">Costo acumulado de ${costPerDraw} por boleto</span>
        </div>

        {/* KPI 3: TOTAL RECOVERY */}
        <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-2xl">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Recuperación Acumulada</span>
          <div className="flex items-baseline gap-1 mt-2">
            <span className={`text-4xl font-extrabold tracking-tighter ${totalRecovery >= totalInvestment ? 'text-amber-500' : 'text-slate-200'}`}>
              ${totalRecovery.toFixed(2)}
            </span>
            <span className="text-xs text-slate-500 font-bold uppercase">MXN</span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-2 uppercase">Retorno simulado de premios oficiales</span>
        </div>

        {/* KPI 4: ROI */}
        <div className="bg-slate-950/40 border border-slate-800 p-6 rounded-2xl">
          <span className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Retorno de Inversión (ROI)</span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className={`text-4xl font-extrabold tracking-tighter ${Number(roiVal) >= 100 ? 'text-amber-500' : 'text-red-400'}`}>
              {roiVal}%
            </span>
            <span className="text-[10px] font-bold text-slate-500 uppercase">
              {Number(roiVal) >= 100 ? "SUPERÁVIT" : "DÉFICIT"}
            </span>
          </div>
          <span className="text-[10px] text-slate-500 block mt-2 uppercase">Rendimiento porcentual neto de la jugada</span>
        </div>

      </div>

      {/* CHART CONTAINER */}
      <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-[2.5rem] relative overflow-hidden mb-8 z-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div>
            <h4 className="text-white text-base font-black uppercase tracking-tight">Gráfico Forense Apilado (5 Spots del Chispazo)</h4>
            <p className="text-slate-500 text-[10px] font-bold uppercase">Comportamiento secuencial por draw</p>
          </div>
          <div className="flex items-center gap-4 mt-2 md:mt-0">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-amber-500 rounded border border-amber-400"></span>
              <span className="text-[10px] text-slate-300 font-black uppercase">Esferas Coincidentes (Hits)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-slate-800 rounded border border-slate-700"></span>
              <span className="text-[10px] text-slate-500 font-black uppercase">Resto Sorteo (Misses)</span>
            </div>
          </div>
        </div>

        <div className="h-[350px] w-full">
          {chartData.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-500">
              <i className="fas fa-exclamation-circle text-4xl mb-3 text-slate-600 animate-pulse"></i>
              <p className="text-xs font-mono uppercase">No se encontraron sorteos posteriores para el concurso inicial seleccionado.</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 10, left: -20, bottom: 5 }}
                barSize={32}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis 
                  dataKey="concurso" 
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dy={10}
                />
                <YAxis 
                  domain={[0, 5]} 
                  ticks={[0, 1, 2, 3, 4, 5]}
                  stroke="#475569" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false} 
                  dx={-5}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(245, 158, 11, 0.03)' }}
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-slate-950 border border-slate-800 p-5 rounded-2xl shadow-2xl relative z-50 max-w-sm">
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-xs font-black text-amber-500 uppercase font-mono">{data.concurso}</span>
                            <span className="text-[9px] font-bold text-slate-500 font-mono">{data.fecha}</span>
                          </div>
                          
                          <div className="space-y-3">
                            <div>
                              <span className="text-[9px] text-slate-500 font-black uppercase block tracking-wider">Comb. Ganadora Sorteo</span>
                              <div className="flex gap-1.5 mt-1">
                                {data.allList.map((n: number, idx: number) => {
                                  const isHit = customNumbers.includes(n);
                                  return (
                                    <span 
                                      key={idx} 
                                      className={`w-7 h-7 rounded-full text-[11px] font-black flex items-center justify-center font-mono ${
                                        isHit 
                                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20' 
                                          : 'bg-slate-900 border border-slate-800 text-slate-400'
                                      }`}
                                    >
                                      {n}
                                    </span>
                                  );
                                })}
                              </div>
                            </div>

                            <div className="border-t border-slate-900 pt-2.5 flex justify-between items-center">
                              <div>
                                <span className="text-[9px] text-slate-400 font-black uppercase block">Resultado Binario</span>
                                <span className="text-xl font-bold font-mono text-white">
                                  {data.aciertos} Aciertos
                                </span>
                              </div>
                              <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                                data.aciertos === 2 ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                                data.aciertos === 3 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                                data.aciertos > 3 ? 'bg-amber-500/25 text-amber-300 border border-amber-500/30' :
                                'bg-slate-900 text-slate-600'
                              }`}>
                                {data.aciertos === 2 ? 'Reintegro/Gratis' :
                                 data.aciertos === 3 ? 'Premio 3er Tier' :
                                 data.aciertos === 4 ? 'Premio 2do Tier' :
                                 data.aciertos === 5 ? '¡JACKPOT CHISPAZO!' : 'Sin Premio'}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                
                {/* STACKED BARS: aciertos (Hits) and noAciertos (Misses) */}
                <Bar 
                  dataKey="aciertos" 
                  stackId="performance" 
                  fill="#f59e0b" 
                  radius={[0, 0, 4, 4]}
                />
                <Bar 
                  dataKey="noAciertos" 
                  stackId="performance" 
                  fill="#1e293b" 
                  radius={[4, 4, 0, 0]}
                  stroke="#334155"
                  strokeWidth={1}
                />
                
                {/* Horizontal reference for average threshold or perfect run lines */}
                <ReferenceLine y={2} stroke="#3b82f6" strokeDasharray="3 3" opacity={0.6} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* METRICAS DE BOLA INDIVIDUAL */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
        
        {/* COMPORTAMIENTO INDIVIDUAL DE LAS BOLAS */}
        <div className="bg-slate-950/60 border border-slate-850 p-6 rounded-3xl">
          <h4 className="text-white text-sm font-black uppercase tracking-wider mb-4 flex items-center">
            <i className="fas fa-adjust text-amber-500 mr-2"></i> Frecuencia Sucesiva de cada Bola
          </h4>
          <p className="text-[10px] text-slate-500 uppercase leading-relaxed mb-6">
            Cantidad de menciones del número específico en el universo de {totalSubsequent} sorteos evaluados:
          </p>

          <div className="space-y-4">
            {ballFrequencies.map((ball, idx) => {
              const frequencyPercent = totalSubsequent > 0 ? (ball.occurrences / totalSubsequent) * 100 : 0;
              return (
                <div key={idx} className="flex items-center gap-4">
                  <span className="w-9 h-9 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center font-black text-sm text-amber-500 font-mono shadow">
                    {String(ball.number).padStart(2, '0')}
                  </span>
                  <div className="flex-grow">
                    <div className="flex justify-between items-center text-[10px] font-black uppercase text-slate-300 mb-1">
                      <span>Frecuencia en Ventana</span>
                      <span className="font-mono text-amber-500">{ball.occurrences} veces ({frequencyPercent.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-slate-900 h-2 rounded-full overflow-hidden border border-slate-800">
                      <div 
                        className="bg-gradient-to-r from-amber-600 to-amber-400 h-full rounded-full transition-all duration-1000" 
                        style={{ width: `${Math.min(frequencyPercent * 3, 100)}%` }} // Scaled relative to standard frequency
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* DISTRIBUCION DE PARTICIÓN SUCESORA */}
        <div className="bg-slate-950/60 border border-slate-850 p-6 rounded-3xl flex flex-col justify-between">
          <div>
            <h4 className="text-white text-sm font-black uppercase tracking-wider mb-4 flex items-center">
              <i className="fas fa-network-wired text-amber-500 mr-2"></i> Distribución de Convergencia
            </h4>
            <p className="text-[10px] text-slate-500 uppercase leading-relaxed mb-4">
              Breakdown estadístico de la cantidad de aciertos sumados en el bloque temporal:
            </p>

            <div className="grid grid-cols-3 gap-3 mb-6">
              {[2, 3, 4].map(hCount => {
                const count = hitDistribution[hCount as 2 | 3 | 4] || 0;
                const percent = totalSubsequent > 0 ? (count / totalSubsequent) * 100 : 0;
                return (
                  <div key={hCount} className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-2xl flex flex-col items-center text-center">
                    <div className="text-sm font-bold text-slate-500 font-mono">{hCount} Aciertos</div>
                    <div className="text-2xl font-black text-white mt-1">{count}</div>
                    <div className="text-[9px] text-amber-500 font-mono mt-1">({percent.toFixed(0)}%)</div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="p-4 bg-amber-500/5 border border-amber-550/20 rounded-2xl">
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest block">Interpretación Física CDMX</span>
            <p className="text-[10px] text-slate-400 italic leading-relaxed mt-1 font-bold">
              "El rendimiento sostenido de la combinaciones de peso medio y bajo convalida la teoría barométrica. Las colisiones en el foso de aire de la tómbola favorecen los clusters de baja inercia."
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
