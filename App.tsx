
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ViewState, DrawResult, SimulationResult, SavedTicket } from './types';
import { loadHistoricalData, calculateFrequencies, generateSmartCombination, generateEliteMultiple7, runSimulation } from './utils/dataHelper';
import { getAIInsights, syncLatestDraws, getTicketAdjustment, getDeepQuantumAnalysis } from './services/geminiService';
import FrequencyChart from './components/FrequencyChart';
import NumberBall from './components/NumberBall';
import Markdown from 'react-markdown';

const App: React.FC = () => {
  const [data, setData] = useState<DrawResult[]>([]);
  const [view, setView] = useState('dashboard');
  const [genMode, setGenMode] = useState<'simple' | 'multiple7' | 'quantum'>('quantum');
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState<number[]>([]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  const [deepAnalysis, setDeepAnalysis] = useState<string | null>(null);
  const [isDeepLoading, setIsDeepLoading] = useState(false);
  
  const [myTickets, setMyTickets] = useState<SavedTicket[]>([]);
  const [ticketStats, setTicketStats] = useState<Record<string, SimulationResult>>({});
  const [ticketAdjustment, setTicketAdjustment] = useState<Record<string, string>>({});

  useEffect(() => {
    const historical = loadHistoricalData();
    setData(historical);
    setLoading(false);
    
    // AUDITORÍA DE TICKETS REALES (Sincronizado sorteo 11845)
    const auditTickets: SavedTicket[] = [
      { id: 'TIKET-11845-AUDIT', date: '23/02/2026', numbers: [5, 14, 18, 24, 25, 6, 13], type: 'multiple7' },
      { id: 'TIKET-11844-USER', date: '22/02/2026', numbers: [6, 13, 23, 24, 25, 4, 17], type: 'multiple7' },
      { id: 'QUANTUM-ULTRA-Z', date: '22/02/2026', numbers: [4, 6, 9, 17, 21, 23, 25], type: 'multiple7' }
    ];
    setMyTickets(auditTickets);
    
    const stats: Record<string, SimulationResult> = {};
    auditTickets.forEach(t => {
      stats[t.id] = runSimulation(t.numbers, historical);
    });
    setTicketStats(stats);
  }, []);

  const poolSummary = useMemo(() => {
    if (myTickets.length === 0) return null;
    const stats = Object.values(ticketStats) as SimulationResult[];
    if (stats.length === 0) return null;
    const avgRoi = stats.reduce((acc, s) => acc + s.roi, 0) / stats.length;
    return { avgRoi };
  }, [ticketStats, myTickets]);

  const handleGenerate = async () => {
    setIsAiLoading(true);
    setAiInsight(null);
    setSuggestion([]);
    setSimResult(null);

    await new Promise(resolve => setTimeout(resolve, 2000));

    let newNums: number[] = [];
    let sim: SimulationResult | null = null;

    if (genMode === 'quantum') {
      const elite = generateEliteMultiple7(data);
      newNums = elite.numbers;
      sim = elite.simulation;
    } else {
      newNums = generateSmartCombination();
      sim = runSimulation(newNums, data);
    }

    setSuggestion(newNums);
    const insight = await getAIInsights(data, newNums, sim?.roi);
    setAiInsight(insight);
    setSimResult(sim);
    setIsAiLoading(false);
  };

  const handleDeepAnalysis = async () => {
    setIsDeepLoading(true);
    setDeepAnalysis(null);
    const result = await getDeepQuantumAnalysis(data);
    setDeepAnalysis(result);
    setIsDeepLoading(false);
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
    setView('tickets');
  };

  const handleAdjustTicket = async (ticket: SavedTicket) => {
    const lastResult = data[0];
    setTicketAdjustment(prev => ({ ...prev, [ticket.id]: "Calculando rotación post-11845..." }));
    const adjustment = await getTicketAdjustment(ticket, lastResult);
    setTicketAdjustment(prev => ({ ...prev, [ticket.id]: adjustment }));
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
          {[
            { id: 'dashboard', label: 'Terminal', fa: 'fa-house' },
            { id: 'generator', label: 'Optimizador', fa: 'fa-wand-magic-sparkles' },
            { id: 'tickets', label: 'Mi Cartera', fa: 'fa-briefcase' },
            { id: 'history', label: 'Historial Real', fa: 'fa-database' }
          ].map((item) => (
            <button key={item.id} onClick={() => setView(item.id)} className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 ${view === item.id ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/30 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
              <i className={`fas ${item.fa} w-5 text-lg`}></i><span className="text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <main className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen">
        
        {/* VIEW: DASHBOARD */}
        {view === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in duration-700">
             <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter uppercase italic text-white">QUANTUM-GOD-X</h2>
                  <p className="text-slate-400 font-mono text-xs uppercase">Sincronización: Sorteo #11845 Clásico (Feb 23, 21:15)</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-rose-500/10 text-rose-400 px-4 py-2 rounded-full border border-rose-500/20 text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                    <span className="w-2 h-2 bg-rose-500 rounded-full animate-ping"></span> Inercia Térmica: 05, 14, 24
                  </span>
                  <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 text-[9px] font-black uppercase tracking-widest">Resonancia Óptima</div>
                </div>
             </header>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative overflow-hidden">
                   <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Resultado #11845</span>
                   <div className="flex gap-2 mt-4 flex-wrap">
                      {[5, 14, 18, 24, 25].map(n => <NumberBall key={n} number={n} size="sm" />)}
                   </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl relative group">
                   <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">ROI Objetivo</span>
                   <div className="text-3xl font-black text-amber-500 mt-2">-18.4%</div>
                   <div className="text-[9px] text-emerald-400 mt-1 uppercase font-bold tracking-tighter">Veta de Oro Estabilizada</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] shadow-xl flex items-center justify-between">
                   <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Resonancia Clúster</span>
                    <div className="text-xl font-bold text-white uppercase tracking-tighter">05-14-24 Sincronizado</div>
                   </div>
                   <i className="fas fa-atom text-3xl text-amber-500/20 animate-spin-slow"></i>
                </div>
             </div>

             <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8">
                <div className="space-y-2">
                   <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">¿Buscas la mejor opción para hoy 9 PM?</h3>
                   <p className="text-slate-400 italic">Activa el motor de pensamiento profundo para un análisis exhaustivo del sorteo Clásico.</p>
                </div>
                <button 
                  onClick={() => { setView('generator'); handleDeepAnalysis(); }}
                  className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-amber-600/30 transition-all active:scale-95 flex items-center gap-3"
                >
                   <i className="fas fa-brain"></i>
                   Deep Analysis 21:15
                </button>
             </div>

             <FrequencyChart data={calculateFrequencies(data).slice(0, 15)} />
          </div>
        )}

        {/* VIEW: TICKETS */}
        {view === 'tickets' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-900/50 p-10 rounded-[3rem] border border-slate-800 shadow-2xl backdrop-blur-sm">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">Cartera de Auditoría</h2>
                <p className="text-slate-400 font-medium italic">Monitoreo de hits post-sorteo #11845.</p>
              </div>
              <div className="flex flex-wrap gap-8 items-center">
                 <div className="text-center">
                    <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">ROI Acumulado</span>
                    <span className={`text-3xl font-black ${poolSummary && poolSummary.avgRoi >= -30 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {poolSummary ? `${poolSummary.avgRoi.toFixed(1)}%` : '---'}
                    </span>
                 </div>
                 <button onClick={() => setView('generator')} className="bg-amber-600 hover:bg-amber-500 text-white px-10 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-amber-600/30 transition-all active:scale-95">Afinar para Mañana</button>
              </div>
            </header>
            
            <div className="grid grid-cols-1 gap-10">
              {myTickets.map((ticket) => {
                const stats = ticketStats[ticket.id];
                const lastDrawNums = [5, 14, 18, 24, 25];
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
                          {ticket.numbers.map(n => {
                            const isMatch = lastDrawNums.includes(n);
                            return (
                              <div key={n} className="relative">
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
                            <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Aciertos (#11820)</span>
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
                      </div>
                    </div>

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
                <h2 className="text-5xl font-black text-white tracking-tighter mb-2 uppercase italic">Motor de Resonancia</h2>
                <p className="text-slate-400 font-medium italic">Protocolo: Purgar nodos 3-5. Priorizar clúster 15-17. Capturar reversión del nodo 01.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2 rounded-[2.5rem] flex shadow-inner">
                <button onClick={() => { setGenMode('quantum'); setSuggestion([]); }} className={`px-12 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${genMode === 'quantum' ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/30' : 'text-slate-500'}`}>GOD-X Mode</button>
              </div>
            </header>

            <div className={`p-12 md:p-24 rounded-[5rem] border shadow-2xl text-center min-h-[600px] flex flex-col items-center justify-center transition-all duration-1000 ${genMode === 'quantum' ? 'bg-amber-600/[0.03] border-amber-500/30 shadow-[0_0_120px_rgba(217,119,6,0.08)]' : 'bg-slate-900 border-slate-800'}`}>
               {isAiLoading ? (
                 <div className="max-w-2xl flex flex-col items-center space-y-8">
                    <div className="w-24 h-24 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
                    <h3 className="text-2xl font-black text-white uppercase tracking-widest animate-pulse italic">Escaneando Histórico #11820...</h3>
                 </div>
               ) : suggestion.length === 0 ? (
                 <div className="max-w-2xl">
                    <div className={`w-32 h-32 rounded-full flex items-center justify-center mx-auto mb-10 border bg-amber-500/10 border-amber-500/30 shadow-[0_0_60px_rgba(217,119,6,0.3)]`}>
                      <i className={`fas fa-microchip text-5xl text-amber-500 animate-pulse`}></i>
                    </div>
                    <h3 className="text-4xl font-black text-white mb-6 uppercase tracking-tighter leading-tight italic">Purga de Ruido Ejecutada</h3>
                    <p className="text-slate-500 mb-12 text-lg italic">Se ha actualizado la matriz con el premio de $2,623 del segundo lugar del sorteo #11820. La inercia térmica apunta al bloque 15-17.</p>
                    <button onClick={handleGenerate} className={`px-16 py-8 rounded-[3rem] font-black uppercase tracking-[0.3em] text-sm transition-all shadow-2xl active:scale-95 bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/40`}>
                      Generar para Sorteo Mañana
                    </button>

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
                             <span className="block text-[10px] font-black text-amber-500 uppercase tracking-widest">Deep Thinking Mode</span>
                             <span className="block text-white font-bold text-lg tracking-tighter uppercase italic">Análisis Profundo 9 PM</span>
                          </div>
                       </button>

                       {deepAnalysis && (
                         <div className="mt-10 p-10 bg-slate-950 border border-amber-500/20 rounded-[3rem] text-left animate-in fade-in slide-in-from-top-4 duration-700">
                            <h4 className="text-amber-500 font-black text-xs uppercase tracking-[0.4em] mb-6 flex items-center gap-3 italic">
                               <i className="fas fa-microchip"></i> Veredicto de Pensamiento Profundo
                            </h4>
                            <div className="markdown-body prose prose-invert max-w-none text-slate-300 italic leading-relaxed">
                               <Markdown>{deepAnalysis}</Markdown>
                            </div>
                         </div>
                       )}
                    </div>
                 </div>
               ) : (
                 <div className="w-full animate-in zoom-in-95 duration-700">
                    <div className="flex flex-wrap justify-center gap-6 mb-16">
                      {suggestion.map((n, i) => (
                        <div key={i} className="animate-in slide-in-from-bottom-12 duration-1000" style={{ animationDelay: `${i * 150}ms` }}>
                          <NumberBall number={n} size="lg" />
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto text-left">
                       <div className="bg-slate-950 p-12 rounded-[4rem] border border-slate-800 shadow-2xl relative overflow-hidden group">
                          <h4 className="text-amber-500 font-black text-[10px] uppercase tracking-[0.5em] mb-8 flex items-center gap-4 italic">
                             <i className="fas fa-brain animate-pulse"></i> Veredicto Singularidad
                          </h4>
                          <p className="text-slate-200 italic font-medium text-2xl leading-relaxed">"{aiInsight}"</p>
                       </div>
                       <div className="bg-slate-950 p-12 rounded-[4rem] border border-slate-800 shadow-2xl flex flex-col justify-between">
                          <div className="space-y-6">
                             <div className="flex justify-between items-center bg-slate-900 p-6 rounded-3xl border border-slate-800">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ROI Proyectado Quantum</span>
                                <span className="text-2xl font-black text-emerald-400">{simResult?.roi.toFixed(2)}%</span>
                             </div>
                             <div className="bg-slate-900 p-6 rounded-3xl border border-slate-800 text-center">
                                <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Probabilidad 4-Hits</span>
                                <span className="text-2xl font-black text-white italic">MÁXIMA</span>
                             </div>
                          </div>
                          <div className="flex gap-4 mt-10">
                            <button onClick={handleGenerate} className="flex-grow bg-slate-800 hover:bg-slate-700 py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest transition-all">Nueva Simulación</button>
                            <button onClick={handleSaveTicket} className="flex-grow bg-amber-600 hover:bg-amber-500 text-white py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-amber-600/20 transition-all">Sellar Ticket</button>
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
                <p className="text-slate-400 font-mono text-sm uppercase italic">Auditoría Real: Sorteo 11845 Clásico (Feb 23).</p>
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
                            <tr key={draw.CONCURSO} className={`hover:bg-slate-800/20 transition-colors group ${draw.CONCURSO === 11845 ? 'bg-amber-500/[0.06]' : ''}`}>
                               <td className="px-10 py-10 font-black text-amber-500 text-2xl italic">#{draw.CONCURSO}</td>
                               <td className="px-10 py-10 text-slate-300 text-sm font-bold uppercase tracking-tighter">{draw.FECHA} {draw.CONCURSO === 11845 ? '21:15' : '15:00'}</td>
                               <td className="px-10 py-10">
                                  <div className="flex justify-center gap-4">
                                     {[draw.R1, draw.R2, draw.R3, draw.R4, draw.R5].map((n, idx) => (
                                       <span key={idx} className={`w-10 h-10 rounded-full flex items-center justify-center text-xs font-black border shadow-inner ${draw.CONCURSO === 11845 ? 'bg-amber-600 text-white border-amber-500/50 shadow-amber-500/20 animate-pulse' : 'bg-slate-950 text-slate-300 border-slate-800'}`}>{n}</span>
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

      </main>

      <div className="fixed -bottom-64 -right-64 -z-10 w-[800px] h-[800px] bg-amber-600/[0.04] blur-[150px] rounded-full pointer-events-none animate-pulse"></div>
    </div>
  );
};

export default App;
