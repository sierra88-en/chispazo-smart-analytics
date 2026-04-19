
import React from 'react';
import { motion } from 'framer-motion';

interface BacktestingAuditProps {
  wearFactor: number; // 0-100
  historicalHits: number;
  simulatedHits: number;
}

export const BacktestingAudit: React.FC<BacktestingAuditProps> = ({ wearFactor, historicalHits, simulatedHits }) => {
  const improvement = ((simulatedHits - historicalHits) / (historicalHits || 1)) * 100;
  
  return (
    <div className="bg-slate-900/80 border border-slate-800 p-8 rounded-[3rem] shadow-2xl relative overflow-hidden group">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h4 className="text-white font-black text-lg tracking-tighter uppercase italic">Backtesting de Fallos</h4>
          <p className="text-slate-500 text-[10px] uppercase tracking-widest">Simulación de Desgaste Mecánico (V5.0)</p>
        </div>
        <div className="bg-amber-600/10 text-amber-500 px-4 py-1 rounded-full border border-amber-500/30 text-[9px] font-black uppercase tracking-widest">
           Validación Científica
        </div>
      </div>

      <div className="space-y-8">
        <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800">
           <div className="flex justify-between items-center mb-4">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Factor de Desgaste (Nodo 16)</span>
              <span className="text-amber-500 font-black text-lg">{wearFactor}%</span>
           </div>
           <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-amber-600"
                initial={{ width: 0 }}
                animate={{ width: `${wearFactor}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
           </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
           <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 text-center">
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-2">Aciertos Reales (Mes Ant.)</span>
              <span className="text-2xl font-black text-slate-400">{historicalHits}</span>
           </div>
           <div className="bg-slate-950/50 p-6 rounded-3xl border border-slate-800 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-emerald-500 text-slate-950 text-[7px] font-black px-2 py-0.5 rounded-bl-lg uppercase">Simulado</div>
              <span className="block text-[8px] font-black text-slate-500 uppercase mb-2">Aciertos con Desgaste</span>
              <span className="text-2xl font-black text-emerald-400">{simulatedHits}</span>
           </div>
        </div>

        <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center shadow-lg shadow-emerald-600/20">
                 <i className="fas fa-chart-line text-white"></i>
              </div>
              <div>
                 <span className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest">Incremento de Precisión</span>
                 <span className="block text-white font-bold text-lg tracking-tighter uppercase italic">+{improvement.toFixed(1)}% Eficiencia</span>
              </div>
           </div>
           <i className="fas fa-check-circle text-emerald-500 text-xl"></i>
        </div>

        <p className="text-slate-500 text-[10px] leading-relaxed italic text-center px-4">
           "Si la tómbola hubiera tenido este desgaste el mes pasado, habríamos acertado {simulatedHits} veces. Esto valida científicamente la hipótesis de las micro-fisuras."
        </p>
      </div>
    </div>
  );
};
