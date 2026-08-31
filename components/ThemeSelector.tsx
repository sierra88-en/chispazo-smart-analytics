import React from 'react';
import { Moon, Sun, Eye, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export type AppThemeMode = 'forensic-dark' | 'inspection-day';

interface ThemeSelectorProps {
  currentTheme: AppThemeMode;
  onThemeChange: (theme: AppThemeMode) => void;
  variant?: 'full' | 'compact' | 'minimal';
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({
  currentTheme,
  onThemeChange,
  variant = 'full'
}) => {
  const isDark = currentTheme === 'forensic-dark';

  if (variant === 'minimal') {
    return (
      <button
        onClick={() => onThemeChange(isDark ? 'inspection-day' : 'forensic-dark')}
        className={`p-2 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
          isDark
            ? 'bg-slate-900/90 border-slate-800 text-amber-400 hover:bg-slate-800 hover:border-amber-500/40 shadow-sm'
            : 'bg-white border-amber-300 text-amber-600 hover:bg-amber-50 hover:border-amber-500 shadow-md'
        }`}
        title={isDark ? 'Cambiar a Modo de Inspección Diurna (Alto Contraste)' : 'Cambiar a Modo Nocturno Forense'}
        aria-label="Alternar tema visual"
      >
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-400" />
        ) : (
          <Moon className="w-4 h-4 text-slate-800" />
        )}
      </button>
    );
  }

  if (variant === 'compact') {
    return (
      <div className={`flex items-center p-1 rounded-2xl border shadow-inner transition-all ${
        isDark 
          ? 'bg-slate-950/80 border-slate-800/80' 
          : 'bg-slate-100 border-slate-300 shadow-slate-200'
      }`}>
        <button
          onClick={() => onThemeChange('forensic-dark')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
            isDark
              ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
              : 'text-slate-500 hover:text-slate-900'
          }`}
          title="Modo Nocturno Forense (Laboratorio / Baja Luminosidad)"
        >
          <Moon className="w-3 h-3" />
          <span>Nocturno</span>
        </button>

        <button
          onClick={() => onThemeChange('inspection-day')}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all cursor-pointer ${
            !isDark
              ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/30 font-black'
              : 'text-slate-400 hover:text-slate-200'
          }`}
          title="Modo Inspección Diurna (Alto Contraste Solar)"
        >
          <Sun className="w-3 h-3" />
          <span>Diurno</span>
        </button>
      </div>
    );
  }

  return (
    <div className={`p-1.5 rounded-2xl border transition-all flex items-center gap-1 shadow-lg ${
      isDark
        ? 'bg-slate-900/90 border-slate-800 backdrop-blur-xl shadow-black/40'
        : 'bg-white border-slate-300 shadow-slate-200/80'
    }`}>
      {/* Opción 1: Modo Nocturno Forense */}
      <button
        onClick={() => onThemeChange('forensic-dark')}
        className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
          isDark
            ? 'text-slate-950'
            : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
        }`}
      >
        {isDark && (
          <motion.div
            layoutId="activeThemePill"
            className="absolute inset-0 bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 rounded-xl shadow-md shadow-amber-500/25"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <Moon className={`w-3.5 h-3.5 ${isDark ? 'text-slate-950' : 'text-slate-400'}`} />
          <span>Nocturno Forense</span>
        </span>
      </button>

      {/* Opción 2: Modo de Inspección Diurna (Alto Contraste) */}
      <button
        onClick={() => onThemeChange('inspection-day')}
        className={`relative flex items-center gap-2 px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${
          !isDark
            ? 'text-slate-950'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
        }`}
      >
        {!isDark && (
          <motion.div
            layoutId="activeThemePill"
            className="absolute inset-0 bg-amber-400 rounded-xl shadow-md shadow-amber-500/30 border border-amber-300"
            transition={{ type: 'spring', stiffness: 500, damping: 35 }}
          />
        )}
        <span className="relative z-10 flex items-center gap-1.5">
          <Sun className={`w-3.5 h-3.5 ${!isDark ? 'text-slate-950' : 'text-amber-400'}`} />
          <span>Inspección Diurna</span>
          <span className={`text-[8px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
            !isDark ? 'bg-slate-950 text-amber-400' : 'bg-amber-500/20 text-amber-300'
          }`}>
            ALTO CONTRASTE
          </span>
        </span>
      </button>
    </div>
  );
};
