import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

interface MarkovMatrixProps {
  matrix: number[][];
}

export const MarkovMatrix: React.FC<MarkovMatrixProps> = ({ matrix }) => {
  const [selectedNum, setSelectedNum] = useState<number>(8); // Default to a number from the last draw

  const topTransitions = useMemo(() => {
    const row = matrix[selectedNum];
    return [...row]
      .map((prob, idx) => ({ num: idx, prob }))
      .filter(item => item.num > 0)
      .sort((a, b) => b.prob - a.prob)
      .slice(0, 8);
  }, [matrix, selectedNum]);

  return (
    <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2.5rem] backdrop-blur-xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <div className="text-[10px] font-black uppercase tracking-[0.2em] text-amber-500/80 mb-1">Protocolo Markov-X</div>
          <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">Matriz de Transición</h3>
        </div>
        <div className="flex gap-2 bg-zinc-950 p-1.5 rounded-2xl border border-zinc-800">
          {[1, 4, 13, 14, 28].map(n => (
            <button
              key={n}
              onClick={() => setSelectedNum(n)}
              className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${selectedNum === n ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20' : 'text-zinc-500 hover:text-white'}`}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <p className="text-[10px] text-zinc-500 uppercase font-bold leading-relaxed">
            Basado en la propiedad de "Falta de Memoria", analizamos la probabilidad de que el Nodo {selectedNum} active la eyección de los siguientes vectores en el sorteo n+1.
          </p>
          <div className="space-y-3">
            {topTransitions.map((item, idx) => (
              <div key={item.num} className="flex items-center gap-4 group">
                <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-black text-white group-hover:bg-amber-500 group-hover:text-zinc-950 transition-colors">
                  {item.num}
                </div>
                <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${item.prob * 100}%` }}
                    className="h-full bg-amber-500"
                  />
                </div>
                <div className="text-[10px] font-mono text-zinc-400">{(item.prob * 100).toFixed(1)}%</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-950/50 rounded-3xl p-6 border border-zinc-800/50 flex flex-col justify-center">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto border border-amber-500/20">
              <i className="fas fa-project-diagram text-2xl text-amber-500"></i>
            </div>
            <div>
              <div className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mb-1">Estado Estacionario</div>
              <div className="text-xl font-black text-white uppercase italic tracking-tighter">Convergencia π Detectada</div>
            </div>
            <p className="text-[9px] text-zinc-500 uppercase leading-relaxed italic">
              "El futuro depende exclusivamente del presente. La tómbola no tiene memoria, pero el desgaste físico de los polímeros crea rutas preferenciales de transición."
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
