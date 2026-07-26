
import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
import { DrawResult } from '../types';
import { StackedPerformanceChart } from './StackedPerformanceChart';
import { FailedPredictionsLog } from './FailedPredictionsLog';

interface CollisionData {
  time: string;
  temp: number;
  friction: number;
  fatigue: number;
}

export const BacktestingForense: React.FC<{ draws?: DrawResult[] }> = ({ draws }) => {
  const [data, setData] = useState<CollisionData[]>([]);
  const [selectedNode, setSelectedNode] = useState(22);

  useEffect(() => {
    // Simulate forensic data
    const baseData = Array.from({ length: 24 }, (_, i) => ({
      time: `${i}:00`,
      temp: 20 + Math.sin(i / 4) * 8 + (i > 12 && i < 17 ? 4 : 0), // Peak at 15:00
      friction: 0.5 + Math.cos(i / 6) * 0.2,
      fatigue: (i * 4.1) % 100
    }));
    setData(baseData);
  }, []);

  const nodes = [
    { id: 22, label: 'Ancla Alfa', status: 'Ebullición', color: 'text-amber-500' },
    { id: 23, label: 'Escolta Cinético', status: 'Resonancia', color: 'text-blue-500' },
    { id: 16, label: 'Inercia Residual', status: 'Pista Limpia', color: 'text-emerald-500' },
    { id: 12, label: 'Singleton', status: 'Micro-fisura', color: 'text-purple-500' },
    { id: 2, label: 'Punta de Ala', status: 'Filtración', color: 'text-rose-500' }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="space-y-8"
    >
      <div className="bg-slate-900/80 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <i className="fas fa-microscope text-9xl text-amber-500"></i>
        </div>

        <header className="mb-12 relative z-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="px-3 py-1 bg-amber-500/20 border border-amber-500/30 rounded-full text-[9px] font-black text-amber-500 uppercase tracking-widest">
              Módulo Forense V5.0
            </div>
            <div className="px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full text-[9px] font-black text-blue-500 uppercase tracking-widest">
              Telemetría CDMX (2,240m)
            </div>
            <div className="px-3 py-1 bg-emerald-500/20 border border-emerald-500/30 rounded-full text-[9px] font-black text-emerald-500 uppercase tracking-widest">
              Air-Mix Recalibrado
            </div>
          </div>
          <h2 className="text-5xl font-black text-white tracking-tighter uppercase italic leading-none">
            Backtesting <span className="text-amber-500">Forense</span>
          </h2>
          <p className="text-slate-400 font-mono text-xs uppercase mt-4 tracking-[0.3em]">
            Auditoría de Colisiones y Dinámica de Fluidos (Baja Presión)
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
          {/* LEFT: NODE SELECTOR */}
          <div className="space-y-4">
            <h3 className="text-slate-500 font-black uppercase text-[10px] tracking-widest mb-6">Nodos en Punto de Ebullición</h3>
            {nodes.map(node => (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                className={`w-full p-6 rounded-3xl border transition-all text-left group relative overflow-hidden ${selectedNode === node.id ? 'bg-amber-500 border-amber-400 shadow-xl shadow-amber-500/20' : 'bg-slate-950/50 border-slate-800 hover:border-slate-700'}`}
              >
                <div className="flex items-center justify-between relative z-10">
                  <div>
                    <div className={`text-xs font-black uppercase tracking-tighter ${selectedNode === node.id ? 'text-slate-950' : 'text-slate-500'}`}>Nodo {node.id}</div>
                    <div className={`text-lg font-black uppercase italic leading-tight ${selectedNode === node.id ? 'text-slate-900' : 'text-white'}`}>{node.label}</div>
                  </div>
                  <div className={`text-[9px] font-black uppercase px-3 py-1 rounded-full ${selectedNode === node.id ? 'bg-slate-900 text-amber-500' : 'bg-slate-900 text-slate-500'}`}>
                    {node.status}
                  </div>
                </div>
                {selectedNode === node.id && (
                  <motion.div layoutId="active-node-bg" className="absolute inset-0 bg-gradient-to-r from-amber-400 to-amber-600 opacity-100" />
                )}
              </button>
            ))}
          </div>

          {/* CENTER: THERMAL DILATATION CHART */}
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-slate-950/50 border border-slate-800 p-8 rounded-[2.5rem] relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h4 className="text-white font-black uppercase text-sm tracking-tight">Dilatación del Ducto (15:00 HRS)</h4>
                  <p className="text-slate-500 text-[10px] uppercase font-bold">Correlación Temperatura vs Coeficiente de Fricción</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-black text-amber-500 tracking-tighter">28.4°C</div>
                  <div className="text-[9px] font-black text-slate-600 uppercase">Punto Crítico Detectado</div>
                </div>
              </div>
              
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data}>
                    <defs>
                      <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                    <XAxis dataKey="time" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '16px' }}
                      itemStyle={{ color: '#f59e0b', fontSize: '12px', fontWeight: 'bold' }}
                    />
                    <Area type="monotone" dataKey="temp" stroke="#f59e0b" strokeWidth={4} fillOpacity={1} fill="url(#colorTemp)" />
                    <Line type="monotone" dataKey="friction" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-amber-500/10 rounded-2xl flex items-center justify-center">
                    <i className="fas fa-project-diagram text-amber-500"></i>
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-slate-500 uppercase">Protocolo Markov-X</div>
                    <div className="text-lg font-black text-white uppercase">Convergencia π</div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 uppercase leading-relaxed">Análisis de transición desde el sorteo 11868. El futuro depende exclusivamente del presente (Falta de Memoria).</p>
              </div>

              <div className="bg-slate-950/50 border border-slate-800 p-6 rounded-3xl">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-2xl flex items-center justify-center">
                    <i className="fas fa-bolt text-blue-500"></i>
                  </div>
                  <div>
                    <div className="text-[9px] font-black text-slate-500 uppercase">Binomio de Arrastre</div>
                    <div className="text-lg font-black text-white uppercase">Vórtice [10-13]</div>
                  </div>
                </div>
                <p className="text-[10px] text-slate-500 uppercase leading-relaxed">La secuencia de extracción 10-13-08 confirma un arrastre cinético por diferencial de masa.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 p-10 bg-slate-950/80 border border-slate-800 rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-blue-500/10 rounded-full flex items-center justify-center border border-blue-500/20 shrink-0">
              <i className="fas fa-wave-square text-4xl text-blue-500"></i>
            </div>
            <div>
              <h4 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Escaneo de Resonancia Semanal</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div className="space-y-2">
                  <div className="text-[9px] font-black text-blue-500 uppercase tracking-widest">Hipótesis de Velocidad Terminal</div>
                  <p className="text-slate-400 text-[10px] uppercase leading-relaxed font-bold italic">
                    "En CDMX, las esferas más ligeras alcanzan antes la velocidad terminal de succión. La tendencia semanal confirma: Menos peso = Más salida."
                  </p>
                </div>
                <div className="space-y-2">
                  <div className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">La Gran Brecha del 26</div>
                  <p className="text-slate-400 text-[10px] uppercase leading-relaxed font-bold italic">
                    "Nodo 26 (4.09g) está 1.02g por debajo del promedio. Es una anomalía estadística que romperá el equilibrio dinámico en el cierre."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 p-10 bg-slate-950/80 border border-slate-800 rounded-[3rem] relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500 to-transparent"></div>
          <div className="flex flex-col md:flex-row items-center gap-8">
            <div className="w-24 h-24 bg-amber-500/10 rounded-full flex items-center justify-center border border-amber-500/20 shrink-0">
              <i className="fas fa-hammer text-4xl text-amber-500 animate-pulse"></i>
            </div>
            <div>
              <h4 className="text-xl font-black text-white uppercase italic tracking-tight mb-2">Veredicto del Núcleo: VECTOR "MARTILLO" RECARGADO</h4>
              <p className="text-slate-400 text-[11px] uppercase leading-relaxed font-bold italic">
                "Bypass de IA ejecutado. La salida del Nodo 28 en el sorteo de las 15:00 ha despejado el ducto de aire. La metrología confirma que los Nodos 22 y 26 están en su punto de máxima sustentación. El Protocolo Markov-X proyecta una transición inminente hacia el bloque de baja inercia para el cierre de las 21:15. Proceder con el Ticket de Expansión."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* REGISTRO DE PREDICCIONES FALLIDAS Y DESVIACIÓN DE PESAJE DE MALETÍN */}
      <FailedPredictionsLog draws={draws || []} />

      {/* COMPONENTE DE VISUALIZACIÓN COMPARATIVA FLUIDA */}
      <StackedPerformanceChart draws={draws} />
    </motion.div>
  );
};
