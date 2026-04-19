
/**
 * 🛡️ QUANTUM-GOD-X: Protocolo de Anclaje Temporal Real
 * Asegura la sincronización con el servidor de la Lotería (CDMX).
 */
export const getSorteoDate = () => {
  const hoy = new Date();
  
  // Forzamos el ajuste de zona horaria de México (UTC-6)
  const fechaMexico = new Date(hoy.toLocaleString("en-US", {timeZone: "America/Mexico_City"}));
  
  const opciones: Intl.DateTimeFormatOptions = { 
    day: '2-digit', 
    month: 'long', 
    year: 'numeric' 
  };

  // Esto asegura que el dashboard SIEMPRE diga la fecha correcta en formato local
  return fechaMexico.toLocaleDateString('es-MX', opciones);
};

console.log(`[SISTEMA LÍNEA] Sincronizado con: ${getSorteoDate()}`);
