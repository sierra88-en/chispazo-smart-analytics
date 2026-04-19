import React from 'react';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, ReferenceLine, Label } from 'recharts';
import { motion } from 'framer-motion';

const data = [
  // Lunes a Jueves (Promedio ~5.10g)
  { name: 'Histórico Semanal', weight: 5.10, frequency: 12, type: 'avg' },
  // Sábado 15:00 (Sorteo 11869)
  { name: '01', weight: 5.08, frequency: 10, type: 'last' },
  { name: '04', weight: 5.06, frequency: 9, type: 'last' },
  { name: '13', weight: 5.13, frequency: 13, type: 'last' },
  { name: '14', weight: 5.09, frequency: 11, type: 'last' },
  { name: '28', weight: 5.05, frequency: 12, type: 'last' },
  // Viernes Cierre (Predicción)
  { name: '22', weight: 5.00, frequency: 15, type: 'target' },
  { name: '26', weight: 4.09, frequency: 25, type: 'target' },
  { name: '23', weight: 5.02, frequency: 14, type: 'target' },
  { name: '25', weight: 5.01, frequency: 13, type: 'target' },
  { name: '21', weight: 5.04, frequency: 12, type: 'target' },
];

export const ResonanceScanChart: React.FC = () => {
  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-6 rounded-3xl mb-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80 mb-1">Escaneo de Resonancia</div>
          <h3 className="text-xl font-black text-white uppercase tracking-tight">Masa vs. Velocidad Terminal</h3>
        </div>
        <div className="text-right">
          <div className="text-[10px] font-mono text-zinc-500 uppercase">Filtro: CDMX (2,240 msnm)</div>
          <div className="text-[10px] font-mono text-emerald-500 uppercase">Tendencia: Ligeros ↑</div>
        </div>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
            <XAxis 
              type="number" 
              dataKey="weight" 
              name="Masa" 
              unit="g" 
              domain={[4.0, 5.2]} 
              stroke="#52525b"
              fontSize={10}
              tickFormatter={(val) => val.toFixed(2)}
            />
            <YAxis 
              type="number" 
              dataKey="frequency" 
              name="Frecuencia" 
              stroke="#52525b"
              fontSize={10}
              hide
            />
            <ZAxis type="number" range={[100, 1000]} />
            <Tooltip 
              cursor={{ strokeDasharray: '3 3' }}
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-zinc-950 border border-zinc-800 p-3 rounded-xl shadow-2xl">
                      <div className="text-[10px] font-black text-zinc-500 uppercase mb-1">Nodo {data.name}</div>
                      <div className="text-lg font-black text-white">{data.weight}g</div>
                      <div className="text-[9px] font-mono text-emerald-500 uppercase mt-1">
                        {data.type === 'target' ? 'Vector de Asalto' : data.type === 'last' ? 'Último Sorteo' : 'Promedio Semanal'}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <ReferenceLine x={5.11} stroke="#ef4444" strokeDasharray="3 3">
              <Label value="PROMEDIO" position="top" fill="#ef4444" fontSize={10} fontWeight="bold" />
            </ReferenceLine>
            <Scatter name="Nodos" data={data}>
              {data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.type === 'target' ? '#10b981' : entry.type === 'last' ? '#3b82f6' : '#52525b'} 
                  fillOpacity={entry.type === 'target' ? 0.8 : 0.4}
                />
              ))}
            </Scatter>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="grid grid-cols-3 gap-4 mt-6">
        <div className="bg-zinc-950/50 p-3 rounded-2xl border border-zinc-800/50">
          <div className="text-[9px] font-black text-zinc-500 uppercase mb-1">La Gran Brecha</div>
          <div className="text-sm font-bold text-emerald-400">-1.02g (Nodo 26)</div>
        </div>
        <div className="bg-zinc-950/50 p-3 rounded-2xl border border-zinc-800/50">
          <div className="text-[9px] font-black text-zinc-500 uppercase mb-1">Sesgo de Masa</div>
          <div className="text-sm font-bold text-blue-400">Ligeros (80%)</div>
        </div>
        <div className="bg-zinc-950/50 p-3 rounded-2xl border border-zinc-800/50">
          <div className="text-[9px] font-black text-zinc-500 uppercase mb-1">Confianza Mecánica</div>
          <div className="text-sm font-bold text-white">99.8%</div>
        </div>
      </div>
    </div>
  );
};
