import React, { useMemo, useState, memo } from 'react';
import { motion } from 'framer-motion';
import { InfectionOverlay } from './InfectionOverlay';

export interface HeatmapItem {
  num: number;
  score: number;
}

interface TombolaHeatmapProps {
  data: HeatmapItem[];
  activeNumbers?: number[];
  malwareInfections?: HeatmapItem[];
}

// 1. Coordenadas estáticas precalculadas (Estructura Plana Inmutable)
// Evita re-cálculos trigonométricos innecesarios en cada ciclo de render.
const RADIUS = 120;
const CENTER_X = 150;
const CENTER_Y = 150;
const TOTAL_BALLS = 28;

interface FlatNodeCoordinate {
  num: number;
  x: number;
  y: number;
}

const STATIC_NODE_COORDINATES: ReadonlyArray<FlatNodeCoordinate> = Object.freeze(
  Array.from({ length: TOTAL_BALLS }, (_, i) => {
    const num = i + 1;
    const angle = (i / TOTAL_BALLS) * Math.PI * 2 - Math.PI / 2;
    return {
      num,
      x: Number((CENTER_X + RADIUS * Math.cos(angle)).toFixed(2)),
      y: Number((CENTER_Y + RADIUS * Math.sin(angle)).toFixed(2))
    };
  })
);

interface NodeProps {
  num: number;
  x: number;
  y: number;
  intensity: number;
  isActive: boolean;
  isHot: boolean;
  isCold: boolean;
}

// 2. Subcomponente atómico optimizado con React.memo
// Solo se re-renderiza si cambian las props superficiales de ese nodo específico
const HeatmapNode: React.FC<NodeProps> = memo(({
  num,
  x,
  y,
  intensity,
  isActive,
  isHot,
  isCold
}) => {
  const fillColor = isActive 
    ? '#f59e0b' 
    : isHot 
    ? '#ef4444' 
    : isCold 
    ? '#3b82f6' 
    : '#1e293b';

  const fillOpacity = isActive ? 0.85 : Math.max(0.15, intensity / 100);
  const radiusSize = isHot ? 12 : 8;

  return (
    <g id={`tombola-node-${num}`}>
      {/* Círculo de calor */}
      <circle
        cx={x}
        cy={y}
        r={radiusSize}
        fill={fillColor}
        className="transition-all duration-500 ease-out"
        fillOpacity={fillOpacity}
      />
      
      {/* Etiqueta numérica */}
      <text
        x={x}
        y={y}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="8"
        fontWeight="900"
        fill={isActive ? '#000000' : '#ffffff'}
        className="pointer-events-none select-none"
      >
        {num}
      </text>

      {/* Pulso para nodos activos o vacíos críticos de presión */}
      {(isActive || isCold) && (
        <motion.circle
          cx={x}
          cy={y}
          r={15}
          stroke={isActive ? '#f59e0b' : '#3b82f6'}
          strokeWidth="1.5"
          fill="none"
          initial={{ scale: 0.8, opacity: 0.5 }}
          animate={{ scale: 1.5, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeOut' }}
        />
      )}
    </g>
  );
}, (prev, next) => {
  return (
    prev.num === next.num &&
    prev.intensity === next.intensity &&
    prev.isActive === next.isActive &&
    prev.isHot === next.isHot &&
    prev.isCold === next.isCold &&
    prev.x === next.x &&
    prev.y === next.y
  );
});

HeatmapNode.displayName = 'HeatmapNode';

// 3. Componente principal TombolaHeatmap refactorizado
const TombolaHeatmapComponent: React.FC<TombolaHeatmapProps> = ({ 
  data, 
  activeNumbers = [],
  malwareInfections = []
}) => {
  const [showInfectionLayer, setShowInfectionLayer] = useState(true);

  // Mapa plano O(1) de puntuaciones por número
  const scoreLookup = useMemo(() => {
    const map = new Map<number, number>();
    for (let i = 0; i < data.length; i++) {
      const item = data[i];
      map.set(item.num, item.score);
    }
    return map;
  }, [data]);

  // Set plano para búsqueda O(1) de números activos
  const activeNumbersSet = useMemo(() => {
    return new Set(activeNumbers);
  }, [activeNumbers]);

  // Detección de zonas de saturación y vacíos de presión en una sola pasada plana
  const { saturationZones, pressureVoids } = useMemo(() => {
    const sorted = [...STATIC_NODE_COORDINATES].map(coord => ({
      num: coord.num,
      score: scoreLookup.get(coord.num) ?? 0
    })).sort((a, b) => b.score - a.score);

    const topSaturation = sorted.slice(0, 3).map(s => String(s.num).padStart(2, '0')).join(', ');
    const topVoids = sorted.slice(-3).reverse().map(s => String(s.num).padStart(2, '0')).join(', ');

    return {
      saturationZones: topSaturation || '08, 24, 22',
      pressureVoids: topVoids || '16, 02, 11'
    };
  }, [scoreLookup]);

  return (
    <div id="tombola-heatmap-card" className="bg-slate-900/80 border border-slate-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
      <div className="flex flex-col sm:flex-row gap-4 justify-between sm:items-center mb-8 relative z-20">
        <div>
          <h4 className="text-white font-black text-lg tracking-tighter uppercase italic">Mapa de Calor Forense</h4>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest">Distribución de Presión y Rebote (V5.2 Optimizado)</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {malwareInfections && malwareInfections.length > 0 && (
            <button
              id="btn-toggle-malware-layer"
              onClick={() => setShowInfectionLayer(!showInfectionLayer)}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-[9px] font-black uppercase tracking-wider transition-all select-none cursor-pointer relative z-30 ${
                showInfectionLayer 
                  ? 'bg-rose-500/10 border-rose-500/50 text-rose-400 hover:bg-rose-500/20 shadow-[0_0_10px_rgba(244,63,94,0.15)]' 
                  : 'bg-slate-950/40 border-slate-800 text-slate-500 hover:text-slate-300'
              }`}
            >
              <i className={`fas fa-biohazard ${showInfectionLayer ? 'animate-spin' : ''}`} style={{ animationDuration: '4s' }}></i>
              HUD Malware: {showInfectionLayer ? 'ON' : 'OFF'}
            </button>
          )}
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse"></div>
            <span className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Nodo 16 Detectado</span>
          </div>
        </div>
      </div>

      <div className="relative w-full aspect-square max-w-[300px] mx-auto">
        {/* Círculo base de la tómbola */}
        <div className="absolute inset-0 border-4 border-slate-800 rounded-full opacity-20 pointer-events-none"></div>
        <div className="absolute inset-4 border border-slate-800 rounded-full opacity-10 pointer-events-none"></div>
        
        {/* Ejes de presión */}
        <div className="absolute top-1/2 left-0 w-full h-px bg-slate-800 opacity-20 pointer-events-none"></div>
        <div className="absolute top-0 left-1/2 w-px h-full bg-slate-800 opacity-20 pointer-events-none"></div>

        <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-[0_0_15px_rgba(217,119,6,0.1)] relative z-10">
          {STATIC_NODE_COORDINATES.map((coord) => {
            const intensity = scoreLookup.get(coord.num) ?? 0;
            const isActive = activeNumbersSet.has(coord.num);
            const isHot = intensity > 70;
            const isCold = coord.num === 16; // Nodo 16 como vacío de presión

            return (
              <HeatmapNode
                key={coord.num}
                num={coord.num}
                x={coord.x}
                y={coord.y}
                intensity={intensity}
                isActive={isActive}
                isHot={isHot}
                isCold={isCold}
              />
            );
          })}
        </svg>

        {/* Capa de Infección Malware de Red */}
        {malwareInfections && malwareInfections.length > 0 && (
          <InfectionOverlay data={malwareInfections} visible={showInfectionLayer} />
        )}

        {/* Centro de la tómbola */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-slate-900 border border-slate-700 rounded-full flex items-center justify-center shadow-inner z-10 pointer-events-none">
           <i className="fas fa-microchip text-slate-700 text-xs"></i>
        </div>
      </div>

      <div className="mt-8 grid grid-cols-2 gap-4">
        <div id="card-saturation-zones" className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
          <span className="block text-[8px] font-black text-rose-500 uppercase mb-1">Zonas de Saturación</span>
          <span className="text-xs font-bold text-white">{saturationZones}</span>
        </div>
        <div id="card-pressure-voids" className="bg-slate-950/50 p-4 rounded-2xl border border-slate-800">
          <span className="block text-[8px] font-black text-blue-500 uppercase mb-1">Vacíos de Presión</span>
          <span className="text-xs font-bold text-white">{pressureVoids}</span>
        </div>
      </div>
    </div>
  );
};

// 4. Exportación con React.memo para evitar re-renderizados innecesarios del contenedor
export const TombolaHeatmap = memo(TombolaHeatmapComponent, (prevProps, nextProps) => {
  // Comprobación rápida y plana de igualdad
  if (prevProps.data === nextProps.data && 
      prevProps.activeNumbers === nextProps.activeNumbers && 
      prevProps.malwareInfections === nextProps.malwareInfections) {
    return true;
  }

  // Comparar longitud y valores planos de activeNumbers
  const prevActive = prevProps.activeNumbers || [];
  const nextActive = nextProps.activeNumbers || [];
  if (prevActive.length !== nextActive.length) return false;
  for (let i = 0; i < prevActive.length; i++) {
    if (prevActive[i] !== nextActive[i]) return false;
  }

  // Comparar datos si las referencias cambiaron
  if (prevProps.data.length !== nextProps.data.length) return false;
  for (let i = 0; i < prevProps.data.length; i++) {
    if (
      prevProps.data[i].num !== nextProps.data[i].num ||
      prevProps.data[i].score !== nextProps.data[i].score
    ) {
      return false;
    }
  }

  // Comparar malware infections
  const prevMalware = prevProps.malwareInfections || [];
  const nextMalware = nextProps.malwareInfections || [];
  if (prevMalware.length !== nextMalware.length) return false;
  for (let i = 0; i < prevMalware.length; i++) {
    if (
      prevMalware[i].num !== nextMalware[i].num ||
      prevMalware[i].score !== nextMalware[i].score
    ) {
      return false;
    }
  }

  return true;
});

TombolaHeatmap.displayName = 'TombolaHeatmap';
