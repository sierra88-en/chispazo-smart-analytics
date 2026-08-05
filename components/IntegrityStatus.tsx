import React, { useState, useEffect } from 'react';
import { Shield, Scale, Cpu, Lock, RefreshCw, CloudRain } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCDMXTelemetry, fetchLiveCDMXTelemetry, CDMXTelemetryData } from '../utils/dataHelper';

export const IntegrityStatus: React.FC = () => {
  const [telemetry, setTelemetry] = useState<CDMXTelemetryData>(getCDMXTelemetry());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefreshTelemetry = async () => {
    setIsRefreshing(true);
    const updated = await fetchLiveCDMXTelemetry();
    setTelemetry(updated);
    setIsRefreshing(false);
  };

  useEffect(() => {
    handleRefreshTelemetry();
    const interval = setInterval(handleRefreshTelemetry, 300000); // 5 minutos
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      label: 'Protocolo Markov-X',
      value: 'Sorteo 12169',
      icon: Scale,
      status: 'ACTIVO',
      color: 'text-amber-400',
      desc: 'Transición Continuada'
    },
    {
      label: 'Ingeniería Air-Mix',
      value: 'Halogen V2',
      icon: Cpu,
      status: 'Neumático',
      color: 'text-blue-400',
      desc: 'Mezcla por Aire'
    },
    {
      label: 'Telemetría CDMX',
      value: `${telemetry.surfacePressureHpa} hPa`,
      icon: CloudRain,
      status: telemetry.isLive ? 'EN VIVO' : 'ESTÁTICO',
      color: 'text-cyan-400',
      desc: `${telemetry.pressureAtm} atm | ${telemetry.tempC}°C | ${telemetry.humidityPct}% Hum`
    },
    {
      label: 'Protección de Datos',
      value: 'DocSec',
      icon: Lock,
      status: 'Cifrado',
      color: 'text-purple-400',
      desc: 'SHA-256 Inmutable'
    },
    {
      label: 'Protocolo Bunker',
      value: 'Regla 5/6/7',
      icon: Shield,
      status: 'VERIFICADO',
      color: 'text-emerald-400',
      desc: 'Máx 7 Números'
    }
  ];

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80">Sincronización Temporal & Barométrica Activa</span>
        </div>
        <button 
          onClick={handleRefreshTelemetry}
          disabled={isRefreshing}
          className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 px-2.5 py-1 rounded-lg transition-all cursor-pointer"
          title="Recargar Telemetría Meteorológica CDMX (Open-Meteo)"
        >
          <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-cyan-300' : ''}`} />
          <span>CDMX 2,240m: {telemetry.lastUpdated}</span>
        </button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08 }}
          className="bg-zinc-900/50 border border-zinc-800 p-3.5 rounded-2xl relative overflow-hidden"
        >
          <div className="flex items-center justify-between mb-2">
            <stat.icon className={`w-4 h-4 ${stat.color}`} />
            <span className="text-[9px] font-mono uppercase tracking-widest opacity-60">
              {stat.status}
            </span>
          </div>
          <div className="text-lg font-black tracking-tight mb-0.5">{stat.value}</div>
          <div className="text-[10px] font-bold text-zinc-300">{stat.label}</div>
          <div className="text-[9px] font-mono text-zinc-500 mt-1.5 uppercase truncate">{stat.desc}</div>
        </motion.div>
      ))}
      </div>
    </div>
  );
};
