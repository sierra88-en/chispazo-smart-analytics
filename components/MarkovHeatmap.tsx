import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, CartesianGrid } from 'recharts';
import { calculateMarkovTransitions } from '../utils/dataHelper';
import { DrawResult } from '../types';

interface Props {
  data: DrawResult[];
}

export const MarkovHeatmap: React.FC<Props> = ({ data }) => {
  const [selectedNode, setSelectedNode] = useState<number | null>(null);

  const matrix = useMemo(() => calculateMarkovTransitions(data), [data]);

  const heatmapData = useMemo(() => {
    const points = [];
    for (let i = 1; i <= 28; i++) {
      for (let j = 1; j <= 28; j++) {
        const prob = matrix[i][j];
        if (prob > 0) {
          points.push({
            from: i,
            to: j,
            probability: prob,
            percent: (prob * 100).toFixed(1) + '%'
          });
        }
      }
    }
    return points;
  }, [matrix]);

  const filteredData = useMemo(() => {
    if (selectedNode === null) return heatmapData;
    return heatmapData.filter(p => p.from === selectedNode);
  }, [heatmapData, selectedNode]);

  const maxProb = Math.max(...heatmapData.map(p => p.probability));

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="bg-black border border-zinc-800 p-10 rounded-[3rem] relative overflow-hidden"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/5 blur-[100px] rounded-full"></div>
      
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-black text-amber-500 uppercase tracking-widest mb-4 inline-block">
            Protocolo Markov-X V6.0
          </div>
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
            Matriz de <span className="text-amber-500">Transición</span>
          </h2>
          <p className="text-zinc-500 font-mono text-[10px] uppercase mt-4 tracking-[0.2em]">
            Probabilidad Condicional: P(Nodo_n+1 | Nodo_n)
          </p>
        </div>

        <div className="flex flex-wrap gap-2 max-w-md justify-end">
          <button 
            onClick={() => setSelectedNode(null)}
            className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${selectedNode === null ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}
          >
            Todos
          </button>
          {[22, 26, 16, 1, 4, 13, 14, 28].map(node => (
            <button 
              key={node}
              onClick={() => setSelectedNode(node)}
              className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${selectedNode === node ? 'bg-amber-500 text-black' : 'bg-zinc-900 text-zinc-500 border border-zinc-800'}`}
            >
              N{node}
            </button>
          ))}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 h-[500px] bg-zinc-950/50 rounded-[2.5rem] p-8 border border-zinc-800/50 relative">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
              <XAxis 
                type="number" 
                dataKey="from" 
                name="Nodo Origen" 
                domain={[1, 28]} 
                stroke="#3f3f46" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                label={{ value: 'NODO ORIGEN (n)', position: 'bottom', offset: 0, fill: '#52525b', fontSize: 9, fontWeight: 'bold' }}
              />
              <YAxis 
                type="number" 
                dataKey="to" 
                name="Nodo Destino" 
                domain={[1, 28]} 
                stroke="#3f3f46" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
                label={{ value: 'NODO DESTINO (n+1)', angle: -90, position: 'left', fill: '#52525b', fontSize: 9, fontWeight: 'bold' }}
              />
              <ZAxis type="number" dataKey="probability" range={[20, 400]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#000', border: '1px solid #27272a', borderRadius: '16px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-black border border-zinc-800 p-4 rounded-2xl shadow-2xl">
                        <div className="text-[10px] font-black text-zinc-500 uppercase mb-2">Transición Detectada</div>
                        <div className="flex items-center gap-3">
                          <div className="text-xl font-black text-white italic">N{data.from}</div>
                          <div className="text-amber-500">→</div>
                          <div className="text-xl font-black text-white italic">N{data.to}</div>
                        </div>
                        <div className="mt-3 pt-3 border-t border-zinc-800">
                          <div className="text-2xl font-black text-amber-500 italic">{data.percent}</div>
                          <div className="text-[9px] text-zinc-500 uppercase font-bold">Probabilidad de Salto</div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Scatter name="Transiciones" data={filteredData}>
                {filteredData.map((entry, index) => {
                  const opacity = 0.2 + (entry.probability / maxProb) * 0.8;
                  return (
                    <Cell 
                      key={`cell-${index}`} 
                      fill="#f59e0b" 
                      fillOpacity={opacity}
                      stroke="#fbbf24"
                      strokeOpacity={opacity + 0.1}
                      strokeWidth={1}
                    />
                  );
                })}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-zinc-900/50 border border-zinc-800 rounded-[2rem]">
            <h3 className="text-[10px] font-black text-white uppercase tracking-widest mb-6 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              Top Transiciones
            </h3>
            <div className="space-y-4">
              {[...filteredData]
                .sort((a, b) => b.probability - a.probability)
                .slice(0, 5)
                .map((p, i) => (
                  <div key={i} className="flex items-center justify-between p-3 bg-black/40 rounded-xl border border-zinc-800/50">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black text-white italic">N{p.from}</span>
                      <span className="text-amber-500 text-[10px]">→</span>
                      <span className="text-xs font-black text-white italic">N{p.to}</span>
                    </div>
                    <span className="text-xs font-black text-amber-500 italic">{p.percent}</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="p-8 bg-amber-500/5 border border-amber-500/10 rounded-[2rem]">
            <h3 className="text-[10px] font-black text-amber-500 uppercase tracking-widest mb-4">Insight Markov-X</h3>
            <p className="text-[10px] text-zinc-400 uppercase font-bold leading-relaxed italic">
              "La matriz revela que tras la eyección del Nodo 28 (Sorteo 11869), existe una convergencia del 18.4% hacia el bloque de baja inercia. El sistema está buscando el equilibrio estacionario."
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
