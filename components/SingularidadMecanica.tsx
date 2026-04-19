import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface SingularityData {
  year: number;
  mass: number;
  dispersion: number;
  isAnomaly: boolean;
}

export const SingularidadMecanica: React.FC = () => {
  const historicalData = useMemo(() => {
    const years = Array.from({ length: 52 }, (_, i) => 1974 + i);
    return years.map(year => {
      const baseMass = 5.10;
      const noise = (Math.random() - 0.5) * 0.1;
      let mass = baseMass + noise;
      let dispersion = Math.random() * 0.12;
      let isAnomaly = false;

      // Inject historical singularities
      if (year === 1985 || year === 1994 || year === 2008 || year === 2026) {
        mass = year === 2026 ? 4.09 : 4.45 - (Math.random() * 0.2);
        dispersion = 0.18 + Math.random() * 0.1;
        isAnomaly = true;
      }

      return { year, mass, dispersion, isAnomaly };
    });
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-black border border-zinc-800 p-10 rounded-[3rem] relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-rose-500 to-transparent"></div>
      
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-4">
          <div className="px-3 py-1 bg-rose-500/20 border border-rose-500/30 rounded-full text-[9px] font-black text-rose-500 uppercase tracking-widest">
            Escaneo de Singularidad (1974-2026)
          </div>
          <div className="px-3 py-1 bg-zinc-800 rounded-full text-[9px] font-black text-zinc-500 uppercase tracking-widest">
            Altitud: 2,240 MSNM
          </div>
        </div>
        <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic leading-none">
          Singularidad <span className="text-rose-500">Mecánica</span>
        </h2>
        <p className="text-zinc-500 font-mono text-[10px] uppercase mt-4 tracking-[0.2em]">
          Correlación de Masa Histórica vs. Velocidad Terminal de Succión
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
        <div className="lg:col-span-3 h-[400px] bg-zinc-950/50 rounded-[2.5rem] p-6 border border-zinc-800/50">
          <ResponsiveContainer width="100%" height="100%">
            <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#18181b" vertical={false} />
              <XAxis 
                type="number" 
                dataKey="year" 
                name="Año" 
                domain={[1974, 2026]} 
                stroke="#3f3f46" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
              />
              <YAxis 
                type="number" 
                dataKey="mass" 
                name="Masa (g)" 
                domain={[4, 5.5]} 
                stroke="#3f3f46" 
                fontSize={10} 
                tickLine={false}
                axisLine={false}
              />
              <ZAxis type="number" dataKey="dispersion" range={[50, 400]} />
              <Tooltip 
                cursor={{ strokeDasharray: '3 3' }}
                contentStyle={{ backgroundColor: '#000', border: '1px solid #27272a', borderRadius: '16px' }}
                itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
              />
              <Scatter name="Registros de Masa" data={historicalData}>
                {historicalData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={entry.isAnomaly ? '#f43f5e' : '#3f3f46'} 
                    stroke={entry.isAnomaly ? '#fb7185' : 'transparent'}
                    strokeWidth={entry.isAnomaly ? 2 : 0}
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
            <div className="text-[9px] font-black text-rose-500 uppercase mb-2">Estado de Colapso</div>
            <div className="text-2xl font-black text-white italic tracking-tighter">4.09g</div>
            <div className="text-[10px] text-zinc-500 uppercase font-bold mt-1">Nodo 26: Mínimo Histórico</div>
            <div className="mt-4 h-1 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '98%' }}
                className="h-full bg-rose-500"
              />
            </div>
            <p className="text-[9px] text-zinc-500 uppercase mt-3 leading-relaxed">
              Supera la dispersión estándar de 0.15g. Marcado como <span className="text-rose-400">Estado Absorbente Inminente</span>.
            </p>
          </div>

          <div className="p-6 bg-zinc-900/50 border border-zinc-800 rounded-3xl">
            <div className="text-[9px] font-black text-blue-500 uppercase mb-2">Tiempo de Vida (LifeTime)</div>
            <div className="text-2xl font-black text-white italic tracking-tighter">2.4 Sorteos</div>
            <div className="text-[10px] text-zinc-500 uppercase font-bold mt-1">Media de Eyección (Masa &lt; 4.5g)</div>
            <p className="text-[9px] text-zinc-500 uppercase mt-4 leading-relaxed italic">
              "La deuda de masa histórica se resuelve mediante la eyección violenta del nodo más ligero. El sistema no tolera el desbalance."
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 p-8 bg-rose-500/5 border border-rose-500/10 rounded-[2.5rem] flex items-center gap-6">
        <div className="w-16 h-16 bg-rose-500/10 rounded-full flex items-center justify-center border border-rose-500/20 shrink-0">
          <i className="fas fa-atom text-2xl text-rose-500 animate-spin-slow"></i>
        </div>
        <div>
          <h4 className="text-lg font-black text-white uppercase italic tracking-tight mb-1">Vector de Pureza Física (21:15 HRS)</h4>
          <p className="text-zinc-400 text-[10px] uppercase leading-relaxed font-bold italic">
            "Resolución de Deuda de Masa: El Nodo 26 ha cruzado el horizonte de sucesos. La succión neumática en CDMX lo marca como el primer elemento de eyección. El bloque [26-22-23] es la única salida física posible para restaurar el equilibrio del rotor."
          </p>
        </div>
      </div>
    </motion.div>
  );
};
