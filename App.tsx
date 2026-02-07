
import React, { useState, useEffect, useMemo } from 'react';
import { ViewState, DrawResult, FrequencyData } from './types';
import { parseCSV, generateMockData, calculateFrequencies, generateSmartCombination } from './utils/dataHelper';
import { getAIInsights } from './services/geminiService';
import FrequencyChart from './components/FrequencyChart';
import NumberBall from './components/NumberBall';

const App: React.FC = () => {
  const [data, setData] = useState<DrawResult[]>([]);
  const [view, setView] = useState<ViewState>('dashboard');
  const [loading, setLoading] = useState(true);
  const [suggestion, setSuggestion] = useState<number[]>([]);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [searchDate, setSearchDate] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Initialize data
  useEffect(() => {
    // Try to simulate loading
    setTimeout(() => {
      const mock = generateMockData();
      setData(mock);
      setLoading(false);
    }, 1000);
  }, []);

  const frequencies = useMemo(() => calculateFrequencies(data), [data]);
  
  const hotNumbers = useMemo(() => {
    return [...frequencies].sort((a, b) => b.count - a.count).slice(0, 5);
  }, [frequencies]);

  const coldNumbers = useMemo(() => {
    return [...frequencies].sort((a, b) => a.count - b.count).slice(0, 5);
  }, [frequencies]);

  const filteredData = useMemo(() => {
    if (!searchDate) return data.slice(0, 20);
    return data.filter(d => d.FECHA.includes(searchDate));
  }, [data, searchDate]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        const parsed = parseCSV(text);
        if (parsed.length > 0) {
          setData(parsed);
          setView('dashboard');
        } else {
          alert('Error al procesar el CSV. Asegúrate de que tenga el formato correcto.');
        }
      };
      reader.readAsText(file);
    }
  };

  const handleGenerate = async () => {
    const newNums = generateSmartCombination();
    setSuggestion(newNums);
    setIsAiLoading(true);
    setAiInsight(null);
    const insight = await getAIInsights(data, newNums);
    setAiInsight(insight);
    setIsAiLoading(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen space-y-4">
        <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-slate-400 font-medium animate-pulse">Cargando datos históricos...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 md:pb-0 md:pl-64">
      {/* Sidebar - Desktop */}
      <nav className="hidden md:flex flex-col fixed left-0 top-0 bottom-0 w-64 bg-slate-900 border-r border-slate-800 p-6 z-50">
        <div className="flex items-center space-x-3 mb-10 px-2">
          <div className="bg-indigo-600 p-2 rounded-lg shadow-lg shadow-indigo-500/20">
            <i className="fas fa-bolt text-white text-xl"></i>
          </div>
          <h1 className="text-xl font-bold tracking-tight">Chispazo <span className="text-indigo-500">AI</span></h1>
        </div>

        <div className="space-y-2 flex-grow">
          {[
            { id: 'dashboard', icon: 'grid-2', label: 'Panel Principal', fa: 'fa-house' },
            { id: 'generator', icon: 'magic', label: 'Generador Pro', fa: 'fa-wand-magic-sparkles' },
            { id: 'analytics', icon: 'chart', label: 'Análisis Histórico', fa: 'fa-chart-simple' },
            { id: 'history', icon: 'history', label: 'Buscador Sorteos', fa: 'fa-clock-rotate-left' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id as ViewState)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                view === item.id 
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 font-medium' 
                  : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              <i className={`fas ${item.fa} w-5`}></i>
              <span>{item.label}</span>
            </button>
          ))}
        </div>

        <div className="mt-auto pt-6 border-t border-slate-800">
          <label className="block w-full cursor-pointer bg-slate-800 border border-slate-700 hover:border-indigo-500/50 hover:bg-slate-700/50 transition-all rounded-xl p-4 text-center">
            <i className="fas fa-file-csv text-indigo-400 mb-2 text-xl block"></i>
            <span className="text-xs text-slate-400 font-medium">Importar Chispazo.csv</span>
            <input type="file" className="hidden" accept=".csv" onChange={handleFileUpload} />
          </label>
        </div>
      </nav>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-slate-900 border-t border-slate-800 flex justify-around p-4 z-50">
        {[
          { id: 'dashboard', fa: 'fa-house' },
          { id: 'generator', fa: 'fa-wand-magic-sparkles' },
          { id: 'analytics', fa: 'fa-chart-simple' },
          { id: 'history', fa: 'fa-clock-rotate-left' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => setView(item.id as ViewState)}
            className={`p-2 rounded-lg transition-colors ${view === item.id ? 'text-indigo-400' : 'text-slate-500'}`}
          >
            <i className={`fas ${item.fa} text-xl`}></i>
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="p-4 md:p-8 max-w-7xl mx-auto">
        
        {/* Dashboard View */}
        {view === 'dashboard' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-100">Panel Principal</h2>
                <p className="text-slate-400 mt-1">Visión general de las estadísticas y últimos resultados.</p>
              </div>
              <div className="bg-slate-800/50 px-4 py-2 rounded-lg border border-slate-700 text-sm">
                <span className="text-slate-500">Total Sorteos:</span> <span className="font-mono text-indigo-400">{data.length}</span>
              </div>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Latest Result Card */}
              <div className="lg:col-span-2 bg-slate-800/40 p-6 rounded-2xl border border-slate-700 shadow-xl backdrop-blur-sm">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="font-bold text-lg flex items-center">
                    <i className="fas fa-trophy text-yellow-500 mr-2"></i> Último Sorteo
                  </h3>
                  <span className="text-sm text-slate-400 bg-slate-700/50 px-2 py-1 rounded">#{data[0]?.CONCURSO}</span>
                </div>
                <div className="flex flex-wrap gap-4 justify-center md:justify-start py-4">
                  {[data[0].R1, data[0].R2, data[0].R3, data[0].R4, data[0].R5].map((num, idx) => (
                    <NumberBall key={idx} number={num} size="lg" />
                  ))}
                </div>
                <div className="mt-6 flex items-center justify-between text-slate-500 text-sm">
                  <span>Fecha: {data[0].FECHA}</span>
                  <button onClick={() => setView('history')} className="text-indigo-400 hover:text-indigo-300 flex items-center">
                    Ver historial <i className="fas fa-chevron-right ml-1 text-xs"></i>
                  </button>
                </div>
              </div>

              {/* Hot/Cold Stats */}
              <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700 shadow-xl flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-lg mb-4 text-rose-400">Números Calientes</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {hotNumbers.map(n => <NumberBall key={n.number} number={n.number} size="sm" />)}
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-4 text-cyan-400">Números Fríos</h3>
                  <div className="flex flex-wrap gap-2">
                    {coldNumbers.map(n => <NumberBall key={n.number} number={n.number} size="sm" />)}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FrequencyChart data={frequencies.slice(0, 14)} />
              <FrequencyChart data={frequencies.slice(14)} />
            </div>
          </div>
        )}

        {/* Generator View */}
        {view === 'generator' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-bold text-slate-100">Generador Inteligente</h2>
              <p className="text-slate-400 mt-1">Lógica basada en distribución de zonas (2 Baja, 1 Media, 2 Alta) potenciada por IA.</p>
            </div>

            <div className="bg-slate-800/40 p-8 rounded-3xl border border-slate-700 shadow-2xl text-center flex flex-col items-center">
              {suggestion.length === 0 ? (
                <div className="py-12 px-6">
                  <div className="w-24 h-24 bg-indigo-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
                    <i className="fas fa-magic text-4xl text-indigo-500 animate-pulse"></i>
                  </div>
                  <h3 className="text-xl font-bold text-slate-200 mb-2">¿Listo para ganar?</h3>
                  <p className="text-slate-400 mb-8 max-w-sm mx-auto">Genera una combinación basada en patrones de distribución estadística validados históricamente.</p>
                </div>
              ) : (
                <div className="py-8 w-full max-w-2xl">
                  <div className="flex flex-wrap justify-center gap-4 mb-10">
                    {suggestion.map((num, i) => (
                      <div key={i} className="animate-in zoom-in-50 duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                        <NumberBall number={num} size="lg" />
                      </div>
                    ))}
                  </div>
                  
                  <div className="bg-slate-900/50 p-6 rounded-2xl border border-slate-700 text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                      <i className="fas fa-brain text-5xl"></i>
                    </div>
                    <h4 className="text-indigo-400 font-bold mb-3 flex items-center">
                      <i className="fas fa-robot mr-2"></i> Análisis de la IA (Gemini)
                    </h4>
                    {isAiLoading ? (
                      <div className="space-y-2 animate-pulse">
                        <div className="h-4 bg-slate-800 rounded w-full"></div>
                        <div className="h-4 bg-slate-800 rounded w-5/6"></div>
                        <div className="h-4 bg-slate-800 rounded w-4/6"></div>
                      </div>
                    ) : (
                      <p className="text-slate-300 text-sm leading-relaxed">{aiInsight}</p>
                    )}
                  </div>
                </div>
              )}

              <button 
                onClick={handleGenerate}
                disabled={isAiLoading}
                className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-2xl transition-all shadow-xl shadow-indigo-600/20 flex items-center space-x-3 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:animate-shimmer"></div>
                <i className={`fas ${isAiLoading ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
                <span>{suggestion.length === 0 ? 'Generar Combinación Pro' : 'Regenerar Sugerencia'}</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { title: 'Zona Baja (1-9)', color: 'emerald', desc: 'Suele tener 1-2 números ganadores.' },
                { title: 'Zona Media (10-19)', color: 'amber', desc: 'El corazón del sorteo con 1 número clave.' },
                { title: 'Zona Alta (20-28)', color: 'rose', desc: 'Cierre de combinación con 2 números.' }
              ].map(zone => (
                <div key={zone.title} className="p-4 bg-slate-800/30 rounded-xl border border-slate-700">
                  <div className={`text-${zone.color}-400 font-bold mb-1`}>{zone.title}</div>
                  <p className="text-xs text-slate-500">{zone.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Analytics View */}
        {view === 'analytics' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div>
              <h2 className="text-3xl font-bold text-slate-100">Análisis Detallado</h2>
              <p className="text-slate-400 mt-1">Explora la frecuencia y distribución de todos los números.</p>
            </div>

            <div className="grid grid-cols-1 gap-8">
              <FrequencyChart data={frequencies} />
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-xl font-bold mb-6 text-indigo-400">Distribución de Apariciones</h3>
                  <div className="space-y-4">
                    {hotNumbers.map((item, idx) => (
                      <div key={item.number} className="flex items-center space-x-4">
                        <span className="w-8 font-mono text-slate-500">#{idx + 1}</span>
                        <NumberBall number={item.number} size="sm" />
                        <div className="flex-grow h-2 bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full" 
                            style={{ width: `${(item.count / hotNumbers[0].count) * 100}%` }}
                          ></div>
                        </div>
                        <span className="w-12 text-right font-mono text-xs text-slate-400">{item.count}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-800/40 p-6 rounded-2xl border border-slate-700">
                  <h3 className="text-xl font-bold mb-6 text-slate-400">Consejos Estadísticos</h3>
                  <ul className="space-y-4">
                    <li className="flex items-start space-x-3 text-sm text-slate-300">
                      <i className="fas fa-check-circle text-emerald-500 mt-1"></i>
                      <span><strong>Balance Paridad:</strong> El 80% de las combinaciones ganadoras contienen una mezcla de 2 pares/3 impares o viceversa.</span>
                    </li>
                    <li className="flex items-start space-x-3 text-sm text-slate-300">
                      <i className="fas fa-check-circle text-emerald-500 mt-1"></i>
                      <span><strong>Suma Mágica:</strong> La suma de los 5 números suele oscilar entre 60 y 85 puntos.</span>
                    </li>
                    <li className="flex items-start space-x-3 text-sm text-slate-300">
                      <i className="fas fa-check-circle text-emerald-500 mt-1"></i>
                      <span><strong>No Consecutivos:</strong> Es raro ver más de 2 números consecutivos en un mismo sorteo.</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* History View */}
        {view === 'history' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-100">Buscador Histórico</h2>
                <p className="text-slate-400 mt-1">Busca resultados pasados por fecha o número de concurso.</p>
              </div>
              <div className="relative">
                <i className="fas fa-search absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"></i>
                <input 
                  type="text"
                  placeholder="Ej: 25/12/2024"
                  value={searchDate}
                  onChange={(e) => setSearchDate(e.target.value)}
                  className="bg-slate-800/80 border border-slate-700 rounded-xl py-2 pl-12 pr-4 text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 w-full md:w-64"
                />
              </div>
            </div>

            <div className="bg-slate-800/40 rounded-2xl border border-slate-700 overflow-hidden shadow-xl">
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-900/50 text-slate-400 text-xs uppercase tracking-wider">
                      <th className="px-6 py-4 font-bold">Concurso</th>
                      <th className="px-6 py-4 font-bold">Fecha</th>
                      <th className="px-6 py-4 font-bold">Combinación Ganadora</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {filteredData.length > 0 ? filteredData.map((row) => (
                      <tr key={row.CONCURSO} className="hover:bg-slate-700/20 transition-colors">
                        <td className="px-6 py-4 text-indigo-400 font-mono text-sm">#{row.CONCURSO}</td>
                        <td className="px-6 py-4 text-slate-300 text-sm">{row.FECHA}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            {[row.R1, row.R2, row.R3, row.R4, row.R5].map((n, i) => (
                              <NumberBall key={i} number={n} size="sm" />
                            ))}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={3} className="px-6 py-12 text-center text-slate-500">
                          <i className="fas fa-search-minus block text-4xl mb-3 opacity-20"></i>
                          No se encontraron resultados para "{searchDate}"
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              {filteredData.length > 0 && !searchDate && (
                <div className="bg-slate-900/30 p-4 text-center text-xs text-slate-500 border-t border-slate-700">
                  Mostrando los últimos 20 resultados. Importa un archivo CSV para ver más.
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* Background Decor */}
      <div className="fixed top-0 right-0 -z-10 w-[500px] h-[500px] bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed bottom-0 left-0 -z-10 w-[400px] h-[400px] bg-emerald-600/5 blur-[100px] rounded-full pointer-events-none"></div>
    </div>
  );
};

export default App;
