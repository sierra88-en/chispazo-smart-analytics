import React, { useState, useEffect } from 'react';
import { Shield, Scale, Cpu, Lock, RefreshCw, CloudRain, Database } from 'lucide-react';
import { motion } from 'framer-motion';
import { getCDMXTelemetry, fetchLiveCDMXTelemetry, CDMXTelemetryData } from '../utils/dataHelper';
import { ThemeSelector, AppThemeMode } from './ThemeSelector';

interface IntegrityStatusProps {
  onForceSyncFirestore?: () => Promise<void>;
  isFirestoreSyncing?: boolean;
  lastSyncTime?: string | null;
  totalDrawsCount?: number;
  latestDrawNumber?: number;
  currentTheme?: AppThemeMode;
  onThemeChange?: (theme: AppThemeMode) => void;
}

export const IntegrityStatus: React.FC<IntegrityStatusProps> = ({
  onForceSyncFirestore,
  isFirestoreSyncing = false,
  lastSyncTime,
  totalDrawsCount = 118,
  latestDrawNumber = 12206,
  currentTheme = 'forensic-dark',
  onThemeChange
}) => {
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
      value: `Sorteo #${latestDrawNumber}`,
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
      label: 'Base Firestore',
      value: `${totalDrawsCount} Sorteos`,
      icon: Database,
      status: isFirestoreSyncing ? 'SINCRONIZANDO' : 'EN LÍNEA',
      color: 'text-emerald-400',
      desc: lastSyncTime ? `Sync: ${lastSyncTime}` : 'En tiempo real'
    },
    {
      label: 'Protocolo Bunker',
      value: 'Regla 5/6/7',
      icon: Shield,
      status: 'VERIFICADO',
      color: 'text-purple-400',
      desc: 'Máx 7 Números'
    }
  ];

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-2 px-2">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${isFirestoreSyncing ? 'bg-amber-400 animate-ping' : 'bg-emerald-500 animate-pulse'}`}></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80">
            {isFirestoreSyncing ? 'Sincronizando con Firestore...' : 'Sincronización Temporal & Firestore Activa'}
          </span>
          {lastSyncTime && (
            <span className="text-[9px] font-mono text-slate-500">
              (Última sync: {lastSyncTime})
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {onThemeChange && (
            <ThemeSelector 
              currentTheme={currentTheme} 
              onThemeChange={onThemeChange} 
              variant="compact" 
            />
          )}

          {onForceSyncFirestore && (
            <button
              onClick={onForceSyncFirestore}
              disabled={isFirestoreSyncing}
              className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-wider text-amber-400 hover:text-amber-300 bg-amber-950/50 hover:bg-amber-900/60 border border-amber-500/50 hover:border-amber-400 px-3 py-1.5 rounded-xl transition-all cursor-pointer shadow-lg shadow-amber-500/10 active:scale-95 disabled:opacity-50"
              title="Forzar actualización inmediata desde base de datos Firestore"
            >
              <Database className={`w-3.5 h-3.5 ${isFirestoreSyncing ? 'animate-bounce text-amber-300' : 'text-amber-400'}`} />
              <RefreshCw className={`w-3 h-3 ${isFirestoreSyncing ? 'animate-spin text-amber-300' : ''}`} />
              <span>{isFirestoreSyncing ? 'Sincronizando...' : 'Forzar Sync Firestore'}</span>
            </button>
          )}

          <button 
            onClick={handleRefreshTelemetry}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 text-[10px] font-mono text-cyan-400 hover:text-cyan-300 bg-cyan-950/40 border border-cyan-800/50 px-2.5 py-1.5 rounded-xl transition-all cursor-pointer hover:bg-cyan-900/30"
            title="Recargar Telemetría Meteorológica CDMX (Open-Meteo)"
          >
            <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-cyan-300' : ''}`} />
            <span>CDMX 2,240m: {telemetry.lastUpdated}</span>
          </button>
        </div>
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
