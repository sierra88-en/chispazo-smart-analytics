import React from 'react';
import { Shield, Scale, Cpu, Lock } from 'lucide-react';
import { motion } from 'framer-motion';

export const IntegrityStatus: React.FC = () => {
  const stats = [
    {
      label: 'Protocolo Markov-X',
      value: 'Sorteo 11869',
      icon: Scale,
      status: 'PRE-CLÁSICO',
      color: 'text-amber-400',
      desc: 'Preparación 21:15'
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
      value: '2,240 msnm',
      icon: Shield,
      status: 'Baja Presión',
      color: 'text-amber-400',
      desc: 'Sustentación Optimizada'
    },
    {
      label: 'Protección de Datos',
      value: 'DocSec',
      icon: Lock,
      status: 'Cifrado',
      color: 'text-purple-400',
      desc: 'SHA-256 Inmutable'
    }
  ];

  const syncDate = new Date().toLocaleDateString('es-MX', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="space-y-4 mb-8">
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500/80">Sincronización Temporal Activa</span>
        </div>
        <span className="text-[9px] font-mono text-zinc-500">Último Latido: {syncDate}</span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="bg-zinc-900/50 border border-zinc-800 p-4 rounded-2xl"
        >
          <div className="flex items-center justify-between mb-2">
            <stat.icon className={`w-5 h-5 ${stat.color}`} />
            <span className="text-[10px] font-mono uppercase tracking-widest opacity-50">
              {stat.status}
            </span>
          </div>
          <div className="text-xl font-bold tracking-tight mb-1">{stat.value}</div>
          <div className="text-[11px] font-medium text-zinc-400">{stat.label}</div>
          <div className="text-[9px] font-mono text-zinc-600 mt-2 uppercase">{stat.desc}</div>
        </motion.div>
      ))}
      </div>
    </div>
  );
};
