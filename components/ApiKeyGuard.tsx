
import React, { useState, useEffect } from 'react';

interface ApiKeyGuardProps {
  children: React.ReactNode;
}

export const ApiKeyGuard: React.FC<ApiKeyGuardProps> = ({ children }) => {
  const [hasKey, setHasKey] = useState<boolean | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const checkKey = async () => {
    setIsChecking(true);
    
    // 1. Check environment variable
    const envKey = process.env.GEMINI_API_KEY;
    const isEnvKeyValid = envKey && envKey !== 'undefined' && envKey.length > 10;
    
    // 2. Check platform key selection
    if (window.aistudio) {
      const selected = await window.aistudio.hasSelectedApiKey();
      setHasKey(selected || isEnvKeyValid);
    } else {
      setHasKey(isEnvKeyValid);
    }
    
    setIsChecking(false);
  };

  useEffect(() => {
    checkKey();
  }, []);

  const handleOpenKeySelector = async () => {
    if (window.aistudio) {
      await window.aistudio.openSelectKey();
      // Re-check after a short delay or assume success and re-check
      setTimeout(checkKey, 1000);
    }
  };

  if (isChecking) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex flex-col items-center justify-center z-[9999]">
        <div className="w-16 h-16 border-4 border-amber-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-amber-500 font-black uppercase tracking-[0.3em] text-xs animate-pulse">
          Validando Protocolos de IA...
        </p>
      </div>
    );
  }

  if (hasKey === false) {
    return (
      <div className="fixed inset-0 bg-slate-950 flex items-center justify-center z-[9999] p-6">
        <div className="max-w-md w-full bg-slate-900 border border-rose-500/30 rounded-[3rem] p-10 shadow-2xl shadow-rose-500/10 text-center relative overflow-hidden">
          {/* Decorative background element */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl"></div>
          
          <div className="bg-rose-500 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl shadow-rose-500/20 rotate-3">
            <i className="fas fa-key text-white text-3xl"></i>
          </div>
          
          <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic mb-4">
            Acceso Denegado
          </h2>
          
          <p className="text-slate-400 mb-10 leading-relaxed italic">
            El núcleo de inteligencia <span className="text-rose-400 font-bold">QUANTUM-GOD-X</span> requiere una API Key de Gemini válida para operar. Sin esta clave, los protocolos de auditoría y predicción no pueden ser inicializados.
          </p>
          
          <div className="space-y-4">
            {window.aistudio && (
              <button 
                onClick={handleOpenKeySelector}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white py-5 rounded-2xl font-black uppercase text-xs tracking-widest shadow-xl shadow-rose-600/30 transition-all active:scale-95 flex items-center justify-center gap-3"
              >
                <i className="fas fa-plug"></i>
                Conectar API Key
              </button>
            )}
            
            <div className="pt-6 border-t border-slate-800">
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-4">Requisitos del Sistema</p>
              <ul className="text-left space-y-2">
                <li className="flex items-center gap-3 text-[10px] text-slate-400 uppercase tracking-tight">
                  <i className="fas fa-check-circle text-rose-500"></i>
                  Cuenta de Google AI Studio Activa
                </li>
                <li className="flex items-center gap-3 text-[10px] text-slate-400 uppercase tracking-tight">
                  <i className="fas fa-check-circle text-rose-500"></i>
                  Proyecto con Facturación Habilitada
                </li>
              </ul>
            </div>
            
            <a 
              href="https://ai.google.dev/gemini-api/docs/billing" 
              target="_blank" 
              rel="noopener noreferrer"
              className="block text-[9px] text-slate-500 hover:text-amber-500 transition-colors uppercase font-black tracking-widest mt-6"
            >
              Documentación de Facturación <i className="fas fa-external-link-alt ml-1"></i>
            </a>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
