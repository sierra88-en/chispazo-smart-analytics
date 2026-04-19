
import React from 'react';
import { motion } from 'framer-motion';
import { ShannonEntropyProtocol } from '../types';

interface ShannonAuditProps {
  data: ShannonEntropyProtocol | null;
}

export const ShannonAudit: React.FC<ShannonAuditProps> = ({ data }) => {
  if (!data) return null;

  return (
    <div className="bg-zinc-900/80 border border-zinc-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-6">
        <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-full">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Shannon V6.0 Activo</span>
        </div>
      </div>

      <div className="mb-8">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500 mb-1">Auditoría de Entropía</div>
        <h3 className="text-2xl font-black text-white uppercase tracking-tight italic">Protocolo Shannon-Chispazo</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-zinc-950/50 p-6 rounded-3xl border border-zinc-800/50">
            <div className="flex justify-between items-end mb-4">
              <div>
                <span className="block text-[9px] font-black text-zinc-500 uppercase mb-1">Set de Esferas Detectado</span>
                <span className="text-xl font-black text-amber-500 uppercase italic tracking-tighter">{data.detectedSet}</span>
              </div>
              <div className="text-right">
                <span className="block text-[9px] font-black text-zinc-500 uppercase mb-1">Entropía H</span>
                <span className="text-xl font-mono font-bold text-white">{data.entropyBit} bits</span>
              </div>
            </div>
            
            <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: '76%' }}
                className="h-full bg-gradient-to-r from-amber-500 to-emerald-500"
              />
            </div>
            <p className="mt-4 text-[10px] text-zinc-400 leading-relaxed italic">
              "{data.explanation}"
            </p>
          </div>

          <div className="flex items-center gap-4 bg-zinc-950/30 p-4 rounded-2xl border border-zinc-800/30">
            <i className="fas fa-sync-alt text-amber-500 animate-spin-slow"></i>
            <div>
              <span className="block text-[8px] font-black text-zinc-500 uppercase">Patrón de Rotación</span>
              <span className="text-[10px] font-bold text-zinc-300 uppercase">{data.rotationCycle}</span>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-zinc-950/50 p-6 rounded-3xl border border-zinc-800/50 relative overflow-hidden">
            <div className="relative z-10">
              <span className="block text-[9px] font-black text-zinc-500 uppercase mb-4 tracking-widest text-center">Vector de Información Máxima</span>
              <div className="flex justify-center gap-3">
                {data.activeVector.map((n, i) => (
                  <motion.div
                    key={n}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className="w-12 h-12 rounded-2xl bg-zinc-900 border-2 border-amber-500/50 flex items-center justify-center shadow-lg shadow-amber-500/10"
                  >
                    <span className="text-lg font-black text-white">{n.toString().padStart(2, '0')}</span>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 flex justify-center">
                <div className="px-4 py-2 bg-amber-500 text-zinc-950 rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-amber-500/20">
                  Asfixia de Tómbola
                </div>
              </div>
            </div>
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-5 pointer-events-none">
              <div className="grid grid-cols-6 gap-2 p-4">
                {Array.from({ length: 24 }).map((_, i) => (
                  <div key={i} className="h-4 bg-white rounded-sm"></div>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-rose-500/5 border border-rose-500/10 p-4 rounded-2xl">
            <div className="flex items-center gap-3">
              <i className="fas fa-filter text-rose-500 text-xs"></i>
              <div>
                <span className="block text-[8px] font-black text-rose-500 uppercase">Filtro Forense Shannon</span>
                <span className="text-[10px] font-bold text-zinc-400 uppercase">
                  {data.forensicFilter.length > 0 
                    ? `Eliminados por Inercia Muerta: ${data.forensicFilter.join(', ')}`
                    : 'Sin Nodos de Inercia Muerta Detectados'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
