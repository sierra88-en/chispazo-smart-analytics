
import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface TombolaHeatmapProps {
  data: { num: number; score: number }[];
  activeNumbers?: number[];
}

export const TombolaHeatmap: React.FC<TombolaHeatmapProps> = ({ data, activeNumbers = [] }) => {
  // Mapear los 28 números en un círculo (simulando la tómbola)
  const layout = useMemo(() => {
    const radius = 120;
    const centerX = 150;
    const centerY = 150;
    
    return Array.from({ length: 28 }, (_, i) => {
      const num = i + 1;
      const angle = (i / 28) * Math.PI * 2 - Math.PI / 2;
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      const scoreData = data.find(d => d.num === num);
      const intensity = scoreData ? scoreData.score : 0;
      
      return { num, x, y, intensity };
    });
  }, [data]);

  return (
    <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h4 className="text-white font-black text-lg tracking-tighter uppercase italic">Mapa de Calor Forense</h4>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest">Distribución de Presión y Rebote (V5.0)</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
          <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Nodo 16 Detectado</span>
        </div>
      </div>

      <div className="relative w-full aspect-square max-w-[300px] mx-auto">
        {/* Círculo base de la tómbola */}
        <div className="absolute inset-0 border-4 border-slate-800 rounded-full opacity-20"></div>
        <div className="absolute inset-4 border border-slate-800 rounded-full opacity-10"></div>
        
        {/* Ejes de presión */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-slate-800 opacity-20"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-slate-800 opacity-20"></div>

        <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_0_15px_rgba(217,119,6,0.1)]">
          {layout.map((point) => {
            const isActive = activeNumbers.includes(point.num);
            const isHot = point.intensity > 70;
            const isCold = point.num === 16; // Nodo 16 como vacío de presión
            
            return (
              <g key={point.num}>
                {/* Glow effect for intensity */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isHot ? 12 : 8}
                  fill={isActive ? '#f59e0b' : isHot ? '#ef4444' : isCold ? '#3b82f6' : '#1e293b'}
                  className="transition-all duration-1000"
                  fillOpacity={isActive ? 0.8 : point.intensity / 100}
                />
                
                {/* Number label */}
                <text
                  x={point.x}
                  y={point.y}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize="8"
                  fontWeight="900"
                  fill={isActive ? '#000' : '#fff'}
                  className="pointer-events-none"
                >
                  {point.num}
                </text>

                {/* Pulse for active or critical nodes */}
                {(isActive || isCold) && (
                  <motion.circle
                    cx={point.x}
                    cy={point.y}
                    r={15}
                    stroke={isActive ? '#f59e0b' : '#3b82f6'}
                    strokeWidth="1"
                    fill="none"
                    initial={{ scale: 0.8, opacity: 0.5 }}
                    animate={{ scale: 1.5, opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 2 }}
                  />
                )}
              </g>
            );
          })}
        </svg>

        {/* Centro de la tómbola */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center shadow-inner">
           <i className="fas fa-microchip text-slate-700 text-xs"></i>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
          <span className="block text-[8px] font-black text-rose-500 uppercase mb-1">Zonas de Saturación</span>
          <span className="text-xs font-bold text-white">08, 24, 22</span>
        </div>
        <div className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
          <span className="block text-[8px] font-black text-blue-500 uppercase mb-1">Vacíos de Presión</span>
          <span className="text-xs font-bold text-white">16, 02, 11</span>
        </div>
      </div>
    </div>
  );
};
