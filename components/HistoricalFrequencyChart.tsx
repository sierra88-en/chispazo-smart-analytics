import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { DrawResult } from '../types';

interface Props {
  data: DrawResult[];
}

export const HistoricalFrequencyChart: React.FC<Props> = ({ data }) => {
  const frequencyData = useMemo(() => {
    const counts: Record<number, number> = {};
    for (let i = 1; i <= 28; i++) counts[i] = 0;

    // Tomamos los últimos 50 sorteos
    const last50 = data.slice(0, 50);
    
    last50.forEach(draw => {
      [draw.R1, draw.R2, draw.R3, draw.R4, draw.R5].forEach(n => {
        if (counts[n] !== undefined) counts[n]++;
      });
    });

    return Object.entries(counts).map(([num, count]) => ({
      number: parseInt(num),
      frequency: count
    })).sort((a, b) => a.number - b.number);
  }, [data]);

  const maxFreq = Math.max(...frequencyData.map(d => d.frequency));

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] overflow-hidden"
    >
      <header className="mb-8 flex justify-between items-end">
        <div>
          <div className="px-3 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[9px] font-black text-amber-500 uppercase tracking-widest mb-3 inline-block">
            Análisis de Densidad Histórica
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic leading-none">
            Frecuencia <span className="text-amber-500">Últimos 50</span>
          </h2>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Muestra</div>
          <div className="text-xl font-black text-white italic">N=50</div>
        </div>
      </header>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={frequencyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
            <XAxis 
              dataKey="number" 
              stroke="#3f3f46" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#71717a', fontWeight: 'bold' }}
            />
            <YAxis 
              stroke="#3f3f46" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#71717a', fontWeight: 'bold' }}
            />
            <Tooltip 
              cursor={{ fill: 'rgba(255,255,255,0.05)' }}
              contentStyle={{ backgroundColor: '#000', border: '1px solid #27272a', borderRadius: '12px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold', color: '#f59e0b' }}
              labelStyle={{ color: '#fff', marginBottom: '4px', fontWeight: 'black' }}
              labelFormatter={(label) => `NODO ${label}`}
            />
            <Bar dataKey="frequency" radius={[4, 4, 0, 0]}>
              {frequencyData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.frequency === maxFreq ? '#f59e0b' : '#27272a'} 
                  className="transition-all duration-500 hover:fill-amber-400"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 flex items-center gap-4 p-4 bg-black/40 rounded-2xl border border-zinc-800/50">
        <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></div>
        <p className="text-[9px] text-zinc-500 uppercase font-bold tracking-wider leading-relaxed">
          Los nodos resaltados en <span className="text-amber-500">ámbar</span> representan la frecuencia máxima detectada en la ventana de 50 sorteos.
        </p>
      </div>
    </motion.div>
  );
};
