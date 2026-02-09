
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { ViewState, DrawResult, SimulationResult, SavedTicket } from './types';
import { loadHistoricalData, calculateFrequencies, generateSmartCombination, generateEliteMultiple7, runSimulation } from './utils/dataHelper';
import { getAIInsights, syncLatestDraws, getTicketAdjustment } from './services/geminiService';
import FrequencyChart from './components/FrequencyChart';
import NumberBall from './components/NumberBall';

const App: React.FC = () => {
  const [data, setData] = useState<DrawResult[]>([]);
  const [view, setView] = useState<ViewState>('dashboard');
  const [genMode, setGenMode] = useState<'simple' | 'multiple7' | 'quantum'>('simple');
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState<number[]>([]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [simResult, setSimResult] = useState<SimulationResult | null>(null);
  
  // Estado de Boletos
  const [myTickets, setMyTickets] = useState<SavedTicket[]>([]);
  const [ticketStats, setTicketStats] = useState<Record<string, SimulationResult>>({});
  const [ticketAdjustment, setTicketAdjustment] = useState<Record<string, string>>({});

  useEffect(() => {
    const historical = loadHistoricalData();
    setData(historical);
    setLoading(false);
    
    // Boletos semilla con análisis actualizado al sorteo 11816
    const initialTickets: SavedTicket[] = [
      { id: 'QUANTUM-GOD-X', date: '09/02/2026', numbers: [3, 10, 11, 20, 22, 25, 26], type: 'multiple7' },
      { id: 'VETA-ORO-BETA', date: '08/02/2026', numbers: [2, 4, 5, 12, 14, 21, 27], type: 'multiple7' }
    ];
    setMyTickets(initialTickets);
    
    const stats: Record<string, SimulationResult> = {};
    initialTickets.forEach(t => {
      stats[t.id] = runSimulation(t.numbers, historical);
    });
    setTicketStats(stats);
  }, []);

  const poolSummary = useMemo(() => {
    if (myTickets.length === 0) return null;
    // Fix: Cast stats to SimulationResult[] to resolve Property 'roi'/'firstPlace'/'secondPlace' does not exist on type 'unknown' errors
    const stats = Object.values(ticketStats) as SimulationResult[];
    if (stats.length === 0) return null;
    const avgRoi = stats.reduce((acc, s) => acc + s.roi, 0) / stats.length;
    const totalFirst = stats.reduce((acc, s) => acc + s.firstPlace, 0);
    const totalSecond = stats.reduce((acc, s) => acc + s.secondPlace, 0);
    return { avgRoi, totalFirst, totalSecond };
  }, [ticketStats, myTickets]);

  const handleGenerate = async () => {
    setIsAiLoading(true);
    setAiInsight(null);
    setSimResult(null);

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
    setTicketAdjustment(prev => ({ ...prev, [ticket.id]: "Calculando re-balanceo de zona..." }));
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
          <h1 className="text-xl font-black tracking-tighter uppercase">Quantum <span className="text-amber-500">AI</span></h1>
        </div>
        
        <div className="space-y-2 flex-grow">
          {[
            { id: 'dashboard', label: 'Dashboard', fa: 'fa-house' },
            { id: 'generator', label: 'Optimizador', fa: 'fa-wand-magic-sparkles' },
            { id: 'tickets', label: 'Mi Cartera', fa: 'fa-briefcase' },
            { id: 'history', label: 'Sorteos Reales', fa: 'fa-database' }
          ].map((item) => (
            <button key={item.id} onClick={() => setView(item.id as ViewState)} className={`w-full flex items-center space-x-4 px-5 py-4 rounded-2xl transition-all duration-300 ${view === item.id ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/30 font-bold' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}>
              <i className={`fas ${item.fa} w-5 text-lg`}></i><span className="text-sm tracking-wide">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur-xl border-t border-slate-800 flex justify-around p-4 z-50">
        {[
          { id: 'dashboard', fa: 'fa-house' }, 
          { id: 'generator', fa: 'fa-wand-magic-sparkles' }, 
          { id: 'tickets', fa: 'fa-briefcase' }, 
          { id: 'history', fa: 'fa-database' }
        ].map((item) => (
          <button key={item.id} onClick={() => setView(item.id as ViewState)} className={`p-4 rounded-2xl transition-all duration-300 ${view === item.id ? 'bg-amber-600 text-white' : 'text-slate-500'}`}><i className={`fas ${item.fa} text-xl`}></i></button>
        ))}
      </nav>

      <main className="p-6 md:p-12 max-w-7xl mx-auto min-h-screen">
        
        {/* VIEW: DASHBOARD */}
        {view === 'dashboard' && (
          <div className="space-y-10 animate-in fade-in duration-700">
             <header className="flex justify-between items-center">
                <div>
                  <h2 className="text-4xl font-black tracking-tighter">Terminal Cuántica</h2>
                  <p className="text-slate-400">Datos actualizados al sorteo #{data[0].CONCURSO}</p>
                </div>
                <div className="bg-emerald-500/10 text-emerald-400 px-4 py-2 rounded-full border border-emerald-500/20 text-xs font-black uppercase tracking-widest animate-pulse">En Línea</div>
             </header>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
                   <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Último Resultado (11816)</span>
                   <div className="flex gap-2 mt-4 flex-wrap">
                      {[data[0].R1, data[0].R2, data[0].R3, data[0].R4, data[0].R5].map(n => <NumberBall key={n} number={n} size="sm" />)}
                   </div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem]">
                   <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">ROI Objetivo Cuántico</span>
                   <div className="text-3xl font-black text-amber-500 mt-2">-20.00%</div>
                   <div className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Veta de Oro Activa</div>
                </div>
                <div className="bg-slate-900 border border-slate-800 p-8 rounded-[2.5rem] flex items-center justify-between">
                   <div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest">Inercia de Carteras</span>
                    <div className="text-xl font-bold text-emerald-400">Estable</div>
                   </div>
                   <i className="fas fa-project-diagram text-3xl text-emerald-500/20"></i>
                </div>
             </div>
             <FrequencyChart data={calculateFrequencies(data).slice(0, 15)} />
          </div>
        )}

        {/* VIEW: TICKETS (MI CARTERA) */}
        {view === 'tickets' && (
          <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 bg-slate-900/50 p-10 rounded-[3rem] border border-slate-800 shadow-2xl">
              <div className="space-y-2">
                <h2 className="text-4xl font-black text-white tracking-tighter">Resumen de Performance</h2>
                <p className="text-slate-400 font-medium italic">Simulación histórica sobre base real de sorteos.</p>
              </div>
              <div className="flex flex-wrap gap-8 items-center">
                 <div className="text-center">
                    <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">ROI Promedio</span>
                    <span className={`text-3xl font-black ${poolSummary && poolSummary.avgRoi >= -25 ? 'text-amber-500' : 'text-rose-500'}`}>
                      {poolSummary ? `${poolSummary.avgRoi.toFixed(1)}%` : '---'}
                    </span>
                 </div>
                 <div className="w-[1px] h-12 bg-slate-800"></div>
                 <div className="text-center">
                    <span className="block text-[10px] font-black text-slate-500 uppercase tracking-widest">Premios 2do (Pool)</span>
                    <span className="text-3xl font-black text-white">{poolSummary?.totalSecond || 0}</span>
                 </div>
                 <button onClick={() => setView('generator')} className="bg-amber-600 hover:bg-amber-500 text-white px-8 py-5 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl transition-all active:scale-95">Añadir Jugada</button>
              </div>
            </header>
            
            <div className="grid grid-cols-1 gap-10">
              {myTickets.length === 0 ? (
                <div className="text-center py-20">Sin jugadas activas. Inicia el Optimizador Cuántico.</div>
              ) : (
                myTickets.map((ticket) => {
                  const stats = ticketStats[ticket.id];
                  const lastDrawNums = [data[0].R1, data[0].R2, data[0].R3, data[0].R4, data[0].R5];
                  const hitsLatest = ticket.numbers.filter(n => lastDrawNums.includes(n)).length;

                  return (
                    <div key={ticket.id} className="bg-slate-900/80 p-10 rounded-[4rem] border border-slate-800 relative overflow-hidden group hover:border-amber-500/30 transition-all duration-500 shadow-xl">
                      <div className="flex flex-col lg:flex-row gap-10 items-start lg:items-center justify-between">
                        <div className="space-y-6">
                          <div className="flex items-center gap-4">
                            <h4 className="text-2xl font-black text-white tracking-tighter uppercase">{ticket.id}</h4>
                            <span className="text-[9px] font-black text-slate-500 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800">{ticket.date}</span>
                          </div>
                          <div className="flex flex-wrap gap-4">
                            {ticket.numbers.map(n => (
                              <div key={n} className="relative">
                                <NumberBall number={n} size="md" />
                                {lastDrawNums.includes(n) && (
                                  <div className="absolute -top-3 -right-3 bg-emerald-500 text-slate-950 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black border-2 border-slate-900 shadow-lg animate-bounce">
                                    <i className="fas fa-star"></i>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 w-full lg:w-auto">
                           <div className="bg-slate-950/50 p-5 rounded-3xl border border-slate-800 text-center flex flex-col justify-center">
                              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Aciertos Hoy</span>
                              <span className={`text-2xl font-black ${hitsLatest >= 2 ? 'text-emerald-400' : 'text-slate-600'}`}>{hitsLatest}</span>
                           </div>
                           <div className="bg-slate-950/50 p-5 rounded-3xl border border-slate-800 text-center flex flex-col justify-center">
                              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">ROI Global</span>
                              <span className={`text-2xl font-black ${stats.roi >= -25 ? 'text-amber-500' : 'text-rose-500'}`}>{stats.roi.toFixed(1)}%</span>
                           </div>
                           <div className="bg-slate-950/50 p-5 rounded-3xl border border-slate-800 text-center flex flex-col justify-center">
                              <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Hits 2do L.</span>
                              <span className="text-2xl font-black text-white">{stats.secondPlace}</span>
                           </div>
                           <button onClick={() => handleAdjustTicket(ticket)} className="bg-slate-800 hover:bg-slate-700 text-white rounded-3xl p-5 flex items-center justify-center transition-all shadow-inner border border-slate-700">
                             <i className="fas fa-sync-alt"></i>
                           </button>
                        </div>
                      </div>

                      {ticketAdjustment[ticket.id] && (
                        <div className="mt-8 p-6 bg-amber-600/5 rounded-[2rem] border border-amber-600/20 animate-in fade-in slide-in-from-top-2">
                           <p className="text-slate-300 text-sm italic font-medium leading-relaxed">
                              <i className="fas fa-brain mr-3 text-amber-500"></i>
                              {ticketAdjustment[ticket.id]}
                           </p>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* VIEW: GENERATOR (REFINED) */}
        {view === 'generator' && (
           <div className="space-y-12 animate-in fade-in slide-in-from-bottom-6 duration-700">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-8">
              <div>
                <h2 className="text-5xl font-black text-white tracking-tighter mb-2">Optimizador Elite</h2>
                <p className="text-slate-400 font-medium italic">Filtro Cuántico: ROI [-15%, -25%] y Hits Recientes en ventana de 200.</p>
              </div>
              <div className="bg-slate-900 border border-slate-800 p-2 rounded-[2.5rem] flex shadow-inner">
                <button onClick={() => { setGenMode('simple'); setSuggestion([]); }} className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${genMode === 'simple' ? 'bg-slate-800 text-white shadow-xl' : 'text-slate-500'}`}>Estándar</button>
                <button onClick={() => { setGenMode('quantum'); setSuggestion([]); }} className={`px-10 py-5 rounded-[2rem] text-[11px] font-black uppercase tracking-widest transition-all ${genMode === 'quantum' ? 'bg-amber-600 text-white shadow-xl shadow-amber-600/30' : 'text-slate-500'}`}>Modo Dios</button>
              </div>
            </header>

            <div className={`p-12 md:p-24 rounded-[4rem] border shadow-2xl text-center min-h-[600px] flex flex-col items-center justify-center transition-all duration-1000 ${genMode === 'quantum' ? 'bg-amber-600/[0.02] border-amber-500/20' : 'bg-slate-900 border-slate-800'}`}>
               {suggestion.length === 0 ? (
                 <div className="max-w-2xl">
                    <div className={`w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-10 border transition-all duration-700 ${genMode === 'quantum' ? 'bg-amber-500/10 border-amber-500/30 shadow-[0_0_50px_rgba(217,119,6,0.2)]' : 'bg-slate-800 border-slate-700'}`}>
                      <i className={`fas ${genMode === 'quantum' ? 'fa-bolt-lightning' : 'fa-wand-magic-sparkles'} text-5xl ${genMode === 'quantum' ? 'text-amber-500' : 'text-slate-400'}`}></i>
                    </div>
                    <h3 className="text-3xl font-black text-white mb-6 uppercase tracking-tighter leading-tight">Motor de Probabilidad Activo</h3>
                    <p className="text-slate-500 mb-12 text-lg">Analizando inercia sobre {data.length} sorteos reales del historial de Chispazo.</p>
                    <button onClick={handleGenerate} disabled={isAiLoading} className={`px-16 py-8 rounded-[3rem] font-black uppercase tracking-[0.2em] text-sm transition-all shadow-2xl active:scale-95 disabled:opacity-50 ${genMode === 'quantum' ? 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/30' : 'bg-indigo-600 hover:bg-indigo-500 text-white'}`}>
                      {isAiLoading ? 'Simulando Inercia...' : 'Iniciar Escaneo Cuántico'}
                    </button>
                 </div>
               ) : (
                 <div className="w-full animate-in zoom-in-95 duration-700">
                    <div className="flex flex-wrap justify-center gap-6 mb-16">
                      {suggestion.map((n, i) => (
                        <div key={i} className="animate-in slide-in-from-bottom-8 duration-700" style={{ animationDelay: `${i * 100}ms` }}>
                          <NumberBall number={n} size="lg" />
                        </div>
                      ))}
                    </div>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto text-left">
                       <div className="bg-slate-950/80 p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl relative overflow-hidden">
                          <h4 className="text-amber-500 font-black text-[10px] uppercase tracking-[0.4em] mb-8 flex items-center gap-4">
                             <i className="fas fa-atom animate-spin-slow"></i> Directiva de la IA
                          </h4>
                          <p className="text-slate-300 italic font-medium text-xl leading-relaxed opacity-90">"{aiInsight}"</p>
                       </div>
                       <div className="bg-slate-950/80 p-12 rounded-[3.5rem] border border-slate-800 shadow-2xl flex flex-col justify-between">
                          <div className="space-y-6">
                             <div className="flex justify-between items-center bg-slate-900/50 p-6 rounded-2xl border border-slate-800">
                                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">ROI Histórico Ponderado</span>
                                <span className={`text-2xl font-black ${simResult?.roi && simResult.roi >= -25 ? 'text-emerald-400' : 'text-amber-500'}`}>{simResult?.roi.toFixed(2)}%</span>
                             </div>
                             <div className="grid grid-cols-2 gap-4">
                               <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 text-center">
                                  <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Premios 2do</span>
                                  <span className="text-2xl font-black text-white">{simResult?.secondPlace}</span>
                               </div>
                               <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-800 text-center">
                                  <span className="block text-[8px] font-black text-slate-500 uppercase mb-1">Premios 3er</span>
                                  <span className="text-2xl font-black text-white">{simResult?.thirdPlace}</span>
                               </div>
                             </div>
                          </div>
                          <div className="flex gap-4 mt-8">
                            <button onClick={handleGenerate} className="flex-grow bg-slate-800 hover:bg-slate-700 py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest transition-all">Re-Escanear</button>
                            <button onClick={handleSaveTicket} className="flex-grow bg-amber-600 hover:bg-amber-500 text-white py-6 rounded-3xl font-black uppercase text-[10px] tracking-widest shadow-xl shadow-amber-600/20 transition-all">Añadir a Cartera</button>
                          </div>
                       </div>
                    </div>
                 </div>
               )}
            </div>
           </div>
        )}

        {/* VIEW: HISTORY (SORTEOS REALES) */}
        {view === 'history' && (
           <div className="space-y-10 animate-in fade-in duration-700">
              <header>
                <h2 className="text-5xl font-black tracking-tighter">Historial de Sorteos</h2>
                <p className="text-slate-400">Base de datos de la Lotería Nacional (Real-Time Sync)</p>
              </header>
              <div className="bg-slate-900 border border-slate-800 rounded-[3rem] overflow-hidden shadow-2xl">
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-slate-800/40">
                          <tr>
                             <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Concurso</th>
                             <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Fecha</th>
                             <th className="px-10 py-8 text-[10px] font-black uppercase text-slate-500 tracking-[0.3em] text-center">Números Ganadores</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-slate-800/50">
                          {data.slice(0, 25).map(draw => (
                            <tr key={draw.CONCURSO} className="hover:bg-slate-800/20 transition-colors group">
                               <td className="px-10 py-8 font-black text-amber-500 text-lg group-hover:scale-105 transition-transform duration-300">#{draw.CONCURSO}</td>
                               <td className="px-10 py-8 text-slate-400 text-sm font-medium">{draw.FECHA}</td>
                               <td className="px-10 py-8">
                                  <div className="flex justify-center gap-3">
                                     {[draw.R1, draw.R2, draw.R3, draw.R4, draw.R5].map((n, idx) => (
                                       <span key={idx} className="w-9 h-9 rounded-full bg-slate-950 border border-slate-800 flex items-center justify-center text-xs font-bold text-slate-200 shadow-inner">{n}</span>
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

      <div className="fixed bottom-0 right-0 -z-10 w-[600px] h-[600px] bg-amber-600/[0.04] blur-[150px] rounded-full pointer-events-none"></div>
      <div className="fixed top-0 left-0 -z-10 w-[600px] h-[600px] bg-indigo-600/[0.04] blur-[150px] rounded-full pointer-events-none"></div>
    </div>
  );
};

export default App;
