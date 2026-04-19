import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Scale, Save, AlertTriangle, Info } from 'lucide-react';

interface WeightInput {
  number: number;
  weight: string;
}

interface TiraPesajeInputProps {
  onSync?: (avg: number, weightMap?: Record<number, number>) => void;
}

export const TiraPesajeInput: React.FC<TiraPesajeInputProps> = ({ onSync }) => {
  const [weights, setWeights] = useState<WeightInput[]>(
    Array.from({ length: 28 }, (_, i) => ({ number: i + 1, weight: '' }))
  );
  const [isOpen, setIsOpen] = useState(false);

  const handleWeightChange = (num: number, val: string) => {
    setWeights(prev => prev.map(w => w.number === num ? { ...w, weight: val } : w));
  };

  const handleBulkPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text');
    // Regex to find numbers like 4.42, 4.454.45, etc.
    // We look for patterns like d.dd
    const matches = text.match(/\d\.\d{2}/g);
    
    if (matches) {
      const newWeights = [...weights];
      matches.forEach((val, idx) => {
        if (idx < 28) {
          newWeights[idx] = { ...newWeights[idx], weight: val };
        }
      });
      setWeights(newWeights);
    }
  };

  const calculateStats = () => {
    const activeWeights = weights.map(w => parseFloat(w.weight)).filter(w => !isNaN(w));
    if (activeWeights.length === 0) return null;
    
    const min = Math.min(...activeWeights);
    const max = Math.max(...activeWeights);
    const diff = max - min;
    const avg = activeWeights.reduce((a, b) => a + b, 0) / activeWeights.length;
    
    return { min, max, diff, avg, count: activeWeights.length };
  };

  const stats = calculateStats();
  const isViolatingManual = stats ? stats.diff > 0.15 : false;

  const handleSync = () => {
    if (stats && onSync) {
      const weightMap: Record<number, number> = {};
      weights.forEach(w => {
        const val = parseFloat(w.weight);
        if (!isNaN(val)) weightMap[w.number] = val;
      });
      onSync(stats.avg, weightMap);
    }
  };

  return (
    <div className="mt-10">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-zinc-900 border border-zinc-800 p-6 rounded-[2.5rem] flex items-center justify-between hover:border-amber-500/50 transition-all group"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform">
            <Scale className="text-amber-500" size={24} />
          </div>
          <div className="text-left">
            <h3 className="text-lg font-black text-white uppercase italic leading-none">Auditoría de Pesaje Real</h3>
            <p className="text-[9px] text-zinc-500 uppercase font-bold mt-1 tracking-widest">Manual SGM-P0-6 | Protocolo de Verdad Única</p>
          </div>
        </div>
        <div className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-tighter transition-all ${isOpen ? 'bg-zinc-800 text-white' : 'bg-amber-500 text-zinc-950'}`}>
          {isOpen ? 'Cerrar Panel' : 'Ingresar Tira'}
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-900/50 border-x border-b border-zinc-800 p-8 rounded-b-[2.5rem] space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2 grid grid-cols-4 sm:grid-cols-7 gap-3">
                      {weights.map((w) => (
                        <div key={w.number} className="space-y-1">
                          <label className="text-[8px] font-black text-zinc-600 uppercase block text-center">N{w.number}</label>
                          <input 
                            type="text"
                            placeholder="0.00"
                            value={w.weight}
                            onPaste={handleBulkPaste}
                            onChange={(e) => handleWeightChange(w.number, e.target.value)}
                            className="w-full bg-black border border-zinc-800 rounded-lg p-2 text-center text-xs font-bold text-white focus:border-amber-500 outline-none transition-colors"
                          />
                        </div>
                      ))}
                    </div>

                <div className="space-y-4">
                  <div className="p-6 bg-black rounded-3xl border border-zinc-800 space-y-4">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest flex items-center gap-2">
                      <Info size={12} className="text-amber-500" />
                      Estado del Estuche
                    </h4>
                    
                    {stats ? (
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-zinc-500 uppercase font-bold">Dispersión (Δ)</span>
                          <span className={`text-sm font-black italic ${isViolatingManual ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {stats.diff.toFixed(3)}g
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-zinc-500 uppercase font-bold">Promedio (μ)</span>
                          <span className="text-sm font-black text-white italic">{stats.avg.toFixed(3)}g</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-[9px] text-zinc-500 uppercase font-bold">Muestra</span>
                          <span className="text-sm font-black text-white italic">{stats.count}/28</span>
                        </div>

                        {isViolatingManual && (
                          <div className="p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl flex gap-3 items-start mt-4">
                            <AlertTriangle className="text-rose-500 shrink-0" size={14} />
                            <p className="text-[8px] text-rose-400 uppercase font-bold leading-tight">
                              ALERTA: La dispersión supera los 0.15g del Manual SGM-P0-6. Singularidad mecánica detectada.
                            </p>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p className="text-[9px] text-zinc-600 uppercase font-bold italic">Ingresa los pesos de la tira para iniciar la auditoría forense.</p>
                    )}

                    <button 
                      onClick={handleSync}
                      className="w-full bg-amber-500 text-zinc-950 p-3 rounded-xl font-black text-[10px] uppercase tracking-tighter flex items-center justify-center gap-2 hover:bg-amber-400 transition-colors"
                    >
                      <Save size={14} />
                      Sincronizar con Quantum-X
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
