
import React from 'react';
import { motion } from 'motion/react';

export const KnowledgeBase: React.FC = () => {
  const specs = [
    {
      title: "Protocolo SGM-PRO-06",
      desc: "Estándar obligatorio de pesaje y calibración de la Lotería Nacional. Exige una tolerancia de dispersión < 0.15g entre esferas.",
      icon: "fa-balance-scale"
    },
    {
      title: "Ingeniería Air-Mix",
      desc: "Tecnología neumática de mezcla por aire. Utiliza sopladores industriales para generar flujos turbulentos aleatorios.",
      icon: "fa-wind"
    },
    {
      title: "Metrología de Esferas",
      desc: "Esferas de polímero diamagnético (inertes a imanes). Peso estándar: 2.2g - 2.9g (Alta Velocidad) o 4.2g - 5.3g (Clásico).",
      icon: "fa-atom"
    },
    {
      title: "Cámara de Mezcla",
      desc: "Fabricada en policarbonato de grado óptico o acrílico fundido. Baja estática y transparencia total para auditoría visual.",
      icon: "fa-cube"
    },
    {
      title: "Diferencial de Presión",
      desc: "La captura de esferas se realiza mediante un tubo de succión superior, eliminando brazos mecánicos que sesguen el azar.",
      icon: "fa-compress-arrows-alt"
    },
    {
      title: "Certificación GLI-11",
      desc: "Estándar internacional para dispositivos de juego. Garantiza que no existen patrones predecibles en el ciclo de mezcla.",
      icon: "fa-certificate"
    },
    {
      title: "Fenómeno de la Puertita",
      desc: "Mecanismo de retención temporal que regula la entrada al ducto. Genera zonas de turbulencia de baja presión.",
      icon: "fa-door-open"
    },
    {
      title: "Surco del 22",
      desc: "Error mecánico de hardware detectado en el carril. El Nodo 22 (4.39g) presenta fatiga estructural crónica.",
      icon: "fa-microchip"
    },
    {
      title: "Vórtice de Selección",
      desc: "Movimiento de precesión en el límite del ducto de succión. Las esferas ligeras 'flotan' antes del arrebato.",
      icon: "fa-sync"
    },
    {
      title: "Pulso de Succión",
      desc: "Variación rítmica de presión (~1.5s) que arrebata esferas de la zona muerta lateral.",
      icon: "fa-heartbeat"
    },
    {
      title: "Efecto Bamba",
      desc: "Sesgo de colisión donde esferas rápidas (ligeras) inyectan a otras directamente en el ducto.",
      icon: "fa-bowling-ball"
    },
    {
      title: "Turbulencia de Borde",
      desc: "Onda de choque en la periferia del rotor que empuja esferas hacia la zona muerta lateral.",
      icon: "fa-water"
    },
    {
      title: "Aspiración de Vacío",
      desc: "Micro-pausa en la turbulencia donde el flujo se vuelve laminar, facilitando la succión inmediata.",
      icon: "fa-wind"
    },
    {
      title: "Colisión Cinética",
      desc: "Transferencia de energía de esferas pesadas a ligeras, dándoles el empuje necesario hacia el ducto.",
      icon: "fa-project-diagram"
    },
    {
      title: "Huella de Masa",
      desc: "Perfil de densidad único de cada set de esferas (Alpha a Epsilon). Define la inercia del sorteo.",
      icon: "fa-fingerprint"
    },
    {
      title: "Nodo de Fuga",
      desc: "Números (22, 07, 11) que tienden a salir primero en sets ligeros debido a su baja resistencia al flujo.",
      icon: "fa-running"
    },
    {
      title: "Nodo de Inercia",
      desc: "Números (15, 20, 25) con mayor masa que requieren mayor presión para ser succionados; típicos de sets pesados.",
      icon: "fa-anchor"
    },
    {
      title: "Efecto Sombra (Kinetic Drag)",
      desc: "Fenómeno donde una esfera ligera succiona a una pesada por arrastre de flujo laminar en el ducto.",
      icon: "fa-ghost"
    },
    {
      title: "Delta de Desgaste",
      desc: "Pérdida de micro-gramos por fricción. Una esfera que 'adelgaza' cambia su coeficiente de arrastre.",
      icon: "fa-chart-line"
    },
    {
      title: "Cobertura Ciega (Blind Strategy)",
      desc: "Técnica de diversificación de vectores para cubrir simultáneamente maletines ligeros y pesados cuando los pesos no son públicos.",
      icon: "fa-mask"
    },
    {
      title: "Nodos Invariantes",
      desc: "Números (como el 22) que aparecen con alta frecuencia independientemente del maletín debido a fallas mecánicas permanentes.",
      icon: "fa-lock"
    },
    {
      title: "Tridente de Masa",
      desc: "Estrategia de triangulación que cubre simultáneamente escenarios ligeros, pesados e híbridos para anular el desconocimiento del maletín.",
      icon: "fa-trident"
    },
    {
      title: "Logística de Rotación",
      desc: "Análisis de la secuencia de uso de maletines por la SEGOB para predecir el cambio de densidad en el siguiente sorteo.",
      icon: "fa-sync"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <div className="bg-slate-900/50 border border-slate-800 p-10 rounded-[3rem] backdrop-blur-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <i className="fas fa-book-open text-9xl text-white"></i>
        </div>
        
        <header className="mb-12">
          <h2 className="text-4xl font-black text-white tracking-tighter uppercase italic">
            Base de <span className="text-amber-500">Conocimiento</span> Técnico
          </h2>
          <p className="text-slate-400 font-mono text-xs uppercase mt-2 tracking-widest">
            Infraestructura y Metrología de Precisión SEGOB
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {specs.map((spec, i) => (
            <div key={i} className="bg-slate-950/50 border border-slate-800/50 p-6 rounded-3xl hover:border-amber-500/30 transition-all group">
              <div className="w-12 h-12 bg-amber-500/10 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-amber-500/20 transition-colors">
                <i className={`fas ${spec.icon} text-amber-500 text-xl`}></i>
              </div>
              <h3 className="text-white font-black uppercase text-sm mb-2 tracking-tight">{spec.title}</h3>
              <p className="text-slate-500 text-[11px] leading-relaxed uppercase font-medium">{spec.desc}</p>
            </div>
          ))}
        </div>

        <div className="mt-12 p-8 bg-amber-500/5 border border-amber-500/10 rounded-[2rem]">
          <h4 className="text-amber-500 font-black uppercase text-xs mb-4 flex items-center gap-2">
            <i className="fas fa-exclamation-triangle"></i>
            Nota de Auditoría Forense
          </h4>
          <p className="text-slate-400 text-[10px] uppercase leading-loose font-bold italic">
            "La integridad del sorteo Chispazo descansa sobre leyes físicas inalterables. El uso de materiales diamagnéticos y el protocolo de pesaje SGM-PRO-06 eliminan cualquier posibilidad de manipulación electromagnética. El azar no es una variable mágica, sino el resultado de una dinámica de fluidos perfectamente calibrada que QUANTUM-GOD-X audita mediante telemetría de precisión."
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-6">Dinámica de Fluidos (Air-Mix)</span>
          <div className="aspect-video bg-slate-950 rounded-3xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
            <div className="absolute inset-0 opacity-20">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-amber-500 blur-[100px] rounded-full animate-pulse"></div>
            </div>
            <div className="text-center z-10">
              <i className="fas fa-wind text-5xl text-amber-500 mb-4 animate-bounce"></i>
              <p className="text-[10px] font-black text-white uppercase tracking-tighter">Simulación de Flujo Turbulento Activa</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800 p-8 rounded-[2.5rem] backdrop-blur-xl">
          <span className="text-[10px] font-black uppercase text-slate-500 tracking-widest block mb-6">Estándares de Certificación</span>
          <div className="space-y-4">
            {[
              { label: 'GLI-11', value: 'Dispositivos de Juego Aleatorios', color: 'bg-emerald-500' },
              { label: 'WLA-SCS', value: 'Control de Seguridad Mundial', color: 'bg-blue-500' },
              { label: 'ISO 9001', value: 'Gestión de Calidad Industrial', color: 'bg-purple-500' },
              { label: 'NOM-001', value: 'Seguridad Eléctrica Mexicana', color: 'bg-rose-500' }
            ].map((cert, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-slate-950/50 rounded-2xl border border-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${cert.color}`}></div>
                  <span className="text-[10px] font-black text-white uppercase">{cert.label}</span>
                </div>
                <span className="text-[9px] font-bold text-slate-500 uppercase">{cert.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};
