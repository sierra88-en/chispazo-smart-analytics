import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { DrawResult, FailedPredictionAuditResult, FailedPredictionLogEntry } from '../types';
import { generateFailedPredictionAudit } from '../utils/dataHelper';
import NumberBall from './NumberBall';

interface FailedPredictionsLogProps {
  draws: DrawResult[];
  onApplyCalibration?: (penalties: Record<number, number>) => void;
}

export const FailedPredictionsLog: React.FC<FailedPredictionsLogProps> = ({ draws, onApplyCalibration }) => {
  const [limit, setLimit] = useState<number>(10);
  const [selectedLog, setSelectedLog] = useState<FailedPredictionLogEntry | null>(null);
  const [calibrationApplied, setCalibrationApplied] = useState<boolean>(false);

  // Generar la auditoría automáticamente
  const auditResult: FailedPredictionAuditResult = useMemo(() => {
    return generateFailedPredictionAudit(draws, limit);
  }, [draws, limit]);

  const handleApplyCalibration = () => {
    setCalibrationApplied(true);
    if (onApplyCalibration) {
      onApplyCalibration(auditResult.learnedNodePenalties);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-[3rem] p-8 md:p-10 shadow-2xl space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
        <i className="fas fa-balance-scale text-9xl text-amber-500"></i>
      </div>

      {/* HEADER SECTION */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 border-b border-slate-800 pb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="px-3 py-1 bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black text-[9px] uppercase tracking-widest rounded-full">
              Protocolo Aprendizaje Automático
            </span>
            <span className="px-3 py-1 bg-rose-500/10 border border-rose-500/30 text-rose-400 font-black text-[9px] uppercase tracking-widest rounded-full">
              Discrepancias de Pesaje
            </span>
          </div>
          <h3 className="text-3xl font-black text-white uppercase italic tracking-tighter flex items-center gap-3">
            <i className="fas fa-file-excel text-rose-500"></i>
            Registro de Predicciones Fallidas y Nodos No Eyectados
          </h3>
          <p className="text-slate-400 text-xs italic mt-2 leading-relaxed">
            Diagnóstico físico e inercial de por qué ciertos nodos predichos no salieron por la boquilla de succión en relación a las variaciones del maletín.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-950 p-2 rounded-2xl border border-slate-800">
            <span className="text-[9px] font-black uppercase text-slate-500 px-2">Evaluados:</span>
            {[5, 10, 15, 20].map(val => (
              <button
                key={val}
                onClick={() => setLimit(val)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                  limit === val
                    ? 'bg-amber-600 text-white shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {val}
              </button>
            ))}
          </div>

          <button
            onClick={handleApplyCalibration}
            disabled={calibrationApplied}
            className={`px-6 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg flex items-center gap-2 ${
              calibrationApplied
                ? 'bg-emerald-600/30 border border-emerald-500/40 text-emerald-400 cursor-default'
                : 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-600/20 active:scale-95'
            }`}
          >
            <i className={`fas ${calibrationApplied ? 'fa-check-circle' : 'fa-brain'}`}></i>
            {calibrationApplied ? 'Recalibración Inyectada' : 'Aprender y Recalibrar Pesos'}
          </button>
        </div>
      </div>

      {/* KPI METRICS BAR */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Total Sorteos Re-simulados</span>
          <span className="text-2xl font-black text-white">{auditResult.totalEvaluatedDraws}</span>
        </div>

        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Nodos No Eyectados (Fallos)</span>
          <span className="text-2xl font-black text-rose-500">{auditResult.totalNonEjectedNodes}</span>
        </div>

        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Precisión de Retro-Auditoría</span>
          <span className="text-2xl font-black text-emerald-400">{auditResult.averageHitRate}%</span>
        </div>

        <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 text-center">
          <span className="block text-[8px] font-black text-slate-500 uppercase tracking-widest mb-1">Causa Raíz Predominante</span>
          <span className="text-xs font-black text-amber-500 uppercase truncate block mt-1">
            {auditResult.topFailureCause.replace(/_/g, ' ')}
          </span>
        </div>
      </div>

      {/* CALIBRATION ALERT IF APPLIED */}
      {calibrationApplied && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-5 bg-emerald-950/30 border border-emerald-500/30 rounded-2xl flex items-center justify-between text-xs text-emerald-300 font-medium"
        >
          <div className="flex items-center gap-3">
            <i className="fas fa-microchip text-emerald-400 text-lg"></i>
            <span>
              <strong>¡Aprendizaje Exitoso!</strong> Se han reajustado las matrices de peso para los 28 nodos en base a los fallos detectados. Compensación global: <strong>{auditResult.globalCalibrationOffset}g</strong>.
            </span>
          </div>
          <span className="bg-emerald-500/20 px-3 py-1 rounded-full text-[9px] font-black text-emerald-400 uppercase">
            MODELO ACTUALIZADO
          </span>
        </motion.div>
      )}

      {/* DISCREPANCY LOGS TABLE */}
      <div className="bg-slate-950/60 rounded-3xl border border-slate-800 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/40 text-[9px] font-black uppercase text-slate-400 tracking-wider">
                <th className="p-4 pl-6">Sorteo #</th>
                <th className="p-4">Fecha</th>
                <th className="p-4 text-center">Vector Predicho</th>
                <th className="p-4 text-center">Resultado Real</th>
                <th className="p-4 text-center">Nodos No Eyectados</th>
                <th className="p-4">Causa de Fricción</th>
                <th className="p-4 text-right pr-6">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40 text-xs">
              {auditResult.discrepancyLogs.map((log) => {
                const isSelected = selectedLog?.concurso === log.concurso;
                return (
                  <React.Fragment key={log.concurso}>
                    <tr
                      onClick={() => setSelectedLog(isSelected ? null : log)}
                      className={`hover:bg-slate-800/30 transition-colors cursor-pointer ${
                        isSelected ? 'bg-slate-800/50' : ''
                      }`}
                    >
                      <td className="p-4 pl-6 font-black text-amber-500">#{log.concurso}</td>
                      <td className="p-4 text-slate-400 font-bold">{log.fecha}</td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-1.5">
                          {log.predictedVector.map((n) => {
                            const isHit = log.hits.includes(n);
                            return (
                              <span
                                key={n}
                                className={`w-7 h-7 rounded-full flex items-center justify-center font-black text-[10px] border ${
                                  isHit
                                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-md'
                                    : 'bg-rose-950/60 text-rose-300 border-rose-800/60'
                                }`}
                              >
                                {n}
                              </span>
                            );
                          })}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-1.5">
                          {log.actualResult.map((n) => (
                            <span
                              key={n}
                              className="w-7 h-7 rounded-full bg-slate-900 text-slate-300 border border-slate-700 flex items-center justify-center font-bold text-[10px]"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="flex justify-center gap-1.5">
                          {log.failedNodes.map((n) => (
                            <span
                              key={n}
                              className="w-7 h-7 rounded-full bg-rose-600 text-white font-black text-[10px] flex items-center justify-center shadow-md animate-pulse"
                            >
                              {n}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-[9px] font-black uppercase">
                          {log.primaryFailureCause.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="p-4 text-right pr-6">
                        <button className="text-amber-500 hover:text-amber-400 text-[10px] font-black uppercase tracking-wider flex items-center gap-1 ml-auto">
                          <span>{isSelected ? 'Ocultar' : 'Detalles'}</span>
                          <i className={`fas fa-chevron-${isSelected ? 'up' : 'down'}`}></i>
                        </button>
                      </td>
                    </tr>

                    {/* EXPANDED DETAILED ANALYSIS FOR SELECTED DRAW */}
                    {isSelected && (
                      <tr>
                        <td colSpan={7} className="p-6 bg-slate-950/90 border-t border-b border-amber-500/20">
                          <div className="space-y-4">
                            <h4 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                              <i className="fas fa-microscope text-amber-500"></i>
                              Desglose de Nodos No Eyectados en Sorteo #{log.concurso} ({log.fecha})
                            </h4>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                              {log.nodeAnalyses.map((nodeAnalysis) => (
                                <div
                                  key={nodeAnalysis.node}
                                  className="p-4 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2 text-xs"
                                >
                                  <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                                    <div className="flex items-center gap-2">
                                      <NumberBall number={nodeAnalysis.node} size="sm" />
                                      <span className="font-black text-white">Nodo {nodeAnalysis.node}</span>
                                    </div>
                                    <span className="text-[10px] font-mono text-slate-400">
                                      Peso: <strong className="text-amber-400">{nodeAnalysis.ballWeight}g</strong>
                                    </span>
                                  </div>

                                  <div className="space-y-1 text-[11px]">
                                    <div className="flex justify-between text-slate-400">
                                      <span>Desviación del Óptimo:</span>
                                      <span
                                        className={`font-bold ${
                                          nodeAnalysis.weightDeltaFromOptimum > 0
                                            ? 'text-rose-400'
                                            : 'text-cyan-400'
                                        }`}
                                      >
                                        {nodeAnalysis.weightDeltaFromOptimum > 0 ? '+' : ''}
                                        {nodeAnalysis.weightDeltaFromOptimum}g
                                      </span>
                                    </div>
                                    <div className="flex justify-between text-slate-400">
                                      <span>Arrastre Aerodinámico:</span>
                                      <span className="font-bold text-slate-200">
                                        {(nodeAnalysis.aerodynamicDrag * 100).toFixed(0)}%
                                      </span>
                                    </div>
                                  </div>

                                  <p className="text-[10px] text-slate-300 italic bg-slate-950 p-2.5 rounded-xl border border-slate-800/80 leading-relaxed">
                                    <i className="fas fa-exclamation-circle text-rose-400 mr-1.5"></i>
                                    {nodeAnalysis.failureReason}
                                  </p>

                                  <div className="pt-1 text-[9px] font-bold text-emerald-400 flex items-center gap-1">
                                    <i className="fas fa-tools text-emerald-500"></i>
                                    <span>{nodeAnalysis.suggestedCalibration}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
