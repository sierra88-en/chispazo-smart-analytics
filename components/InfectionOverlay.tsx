import React, { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface InfectionOverlayProps {
  data: { num: number; score: number }[];
  visible: boolean;
}

export const InfectionOverlay: React.FC<InfectionOverlayProps> = ({ data, visible }) => {
  const [hoveredNode, setHoveredNode] = useState<{ num: number; score: number } | null>(null);

  // Mapear los 28 números en el mismo círculo que TombolaHeatmap para que coincida milimétricamente
  const coordinates = useMemo(() => {
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

  // Encontrar nodos infectados y los top 3 más graves para dibujar las trayectorias del malware
  const infectedNodes = useMemo(() => {
    return coordinates.filter(c => c.intensity > 40);
  }, [coordinates]);

  const topInfectedNodes = useMemo(() => {
    return [...infectedNodes]
      .sort((a, b) => b.intensity - a.intensity)
      .slice(0, 4);
  }, [infectedNodes]);

  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none z-20">
      <svg viewBox="0 0 300 300" className="w-full h-full">
        <defs>
          <radialGradient id="cyber-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="attack-vector" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fb7185" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#9f1239" stopOpacity="0.1" />
          </linearGradient>
        </defs>

        {/* 1. TRAYECTORIAS DEL MALWARE: Conectamos los nodos con mayor malware para simular propagación de red */}
        {topInfectedNodes.length >= 2 && (
          <g>
            {topInfectedNodes.map((node, idx) => {
              const nextNode = topInfectedNodes[(idx + 1) % topInfectedNodes.length];
              return (
                <g key={`vector-${node.num}-${nextNode.num}`}>
                  {/* Línea estática difuminada */}
                  <line
                    x1={node.x}
                    y1={node.y}
                    x2={nextNode.x}
                    y2={nextNode.y}
                    stroke="#9f1239"
                    strokeWidth="1.5"
                    strokeOpacity="0.4"
                  />
                  {/* Flujo cibernético animado */}
                  <motion.line
                    x1={node.x}
                    y1={node.y}
                    x2={nextNode.x}
                    y2={nextNode.y}
                    stroke="url(#attack-vector)"
                    strokeWidth="2"
                    strokeDasharray="4, 12"
                    initial={{ strokeDashoffset: 0 }}
                    animate={{ strokeDashoffset: -40 }}
                    transition={{ repeat: Infinity, ease: "linear", duration: 3 }}
                  />
                </g>
              );
            })}
          </g>
        )}

        {/* 2. NODOS ADVERTENCIA INDIVIDUALES (Framer Motion) */}
        {infectedNodes.map((node) => {
          const isCritical = node.intensity > 70;
          return (
            <g 
              key={`overlay-${node.num}`}
              className="pointer-events-auto cursor-crosshair"
              onMouseEnter={() => setHoveredNode({ num: node.num, score: node.intensity })}
              onMouseLeave={() => setHoveredNode(null)}
            >
              {/* Círculo invisible más grande de interacción táctil/puntero */}
              <circle
                cx={node.x}
                cy={node.y}
                r={16}
                fill="transparent"
              />

              {/* Aura roja de malware */}
              <circle
                cx={node.x}
                cy={node.y}
                r={isCritical ? 14 : 10}
                fill="url(#cyber-glow)"
              />

              {/* Mira/Brackets forenses cruzados */}
              {isCritical && (
                <g className="opacity-80">
                  {/* Bracket superior izquierdo */}
                  <motion.path
                    d={`M ${node.x - 9} ${node.y - 4} L ${node.x - 9} ${node.y - 9} L ${node.x - 4} ${node.y - 9}`}
                    fill="none"
                    stroke="#fb7185"
                    strokeWidth="1"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                  {/* Bracket inferior derecho */}
                  <motion.path
                    d={`M ${node.x + 4} ${node.y + 9} L ${node.x + 9} ${node.y + 9} L ${node.x + 9} ${node.y + 4}`}
                    fill="none"
                    stroke="#fb7185"
                    strokeWidth="1"
                    animate={{ scale: [1, 1.15, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  />
                </g>
              )}

              {/* Círculo externo de escaneo pulsante */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={isCritical ? 18 : 12}
                stroke={isCritical ? '#f43f5e' : '#fda4af'}
                strokeWidth={isCritical ? '0.75' : '0.5'}
                strokeDasharray={isCritical ? '4,4' : '2,2'}
                fill="none"
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, ease: "linear", duration: isCritical ? 6 : 12 }}
              />

              {/* Concentric rings expanding */}
              <motion.circle
                cx={node.x}
                cy={node.y}
                r={isCritical ? 24 : 16}
                stroke="#f43f5e"
                strokeWidth="1"
                fill="none"
                initial={{ scale: 0.2, opacity: 0.8 }}
                animate={{ scale: 1.3, opacity: 0 }}
                transition={{ repeat: Infinity, duration: isCritical ? 1.2 : 2, ease: "easeOut" }}
              />

              {/* Punto indicador biohazard en miniatura */}
              <circle
                cx={node.x}
                cy={node.y}
                r={2}
                fill="#fff"
                className="animate-ping"
              />
            </g>
          );
        })}
      </svg>

      {/* 3. WINDOWS DIAGONISTIC SYSTEM (HOVER TOOLTIPS ALINEADO AL OVERLAY) */}
      <AnimatePresence>
        {hoveredNode && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            transition={{ duration: 0.15 }}
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/95 border border-rose-500/80 p-3 rounded-xl shadow-2xl backdrop-blur-md pointer-events-none z-30"
          >
            <div className="flex items-center gap-2 mb-1 border-b border-rose-500/20 pb-1">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
              <span className="text-[10px] font-black font-mono text-rose-500 uppercase tracking-widest">
                INTRUSION THREAT ADVISORY
              </span>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 font-mono text-[9px] text-slate-400">
              <div>TARGET NODE:</div>
              <div className="text-white font-bold">NODE {hoveredNode.num.toString().padStart(2, '0')}</div>
              <div>MASS DEVIATION:</div>
              <div className="text-yellow-500 font-bold">CRITICAL DEVIANCE</div>
              <div>VIRAL CHARGE:</div>
              <div className="text-rose-500 font-bold">{(hoveredNode.score).toFixed(2)}% INFECTION</div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
