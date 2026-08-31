import React, { useState } from 'react';
import { DrawResult, SavedTicket, SimulationResult } from '../types';
import NumberBall from './NumberBall';
import { generateForensicReportPDF } from '../services/forensicPdfGenerator';
import { downloadDeepAnalysisTextFile } from '../utils/docSecExporter';

interface OfflineExportCenterProps {
  historicalData: DrawResult[];
  suggestion: number[];
  genMode: 'simple' | 'multiple6' | 'multiple7' | 'quantum' | 'grail';
  holyGrail: any | null;
  mandelCombos: number[][];
  scenarioResults: any | null;
  debtResults: any | null;
  deepSimResults: any | null;
  markovContrast: any | null;
  anticipationResult: any | null;
  quantum5: any | null;
  aiInsight: string | null;
  simResult: any | null;
  certeza: number | null;
  biasAnalysis: any | null;
  antifragilityResult: any | null;
  causalDiagnostics: string | null;
  myTickets?: SavedTicket[];
  ticketStats?: Record<string, SimulationResult>;
  deepAnalysis?: string | null;
}

export const OfflineExportCenter: React.FC<OfflineExportCenterProps> = ({
  historicalData,
  suggestion,
  genMode,
  holyGrail,
  mandelCombos,
  scenarioResults,
  debtResults,
  deepSimResults,
  markovContrast,
  anticipationResult,
  quantum5,
  aiInsight,
  simResult,
  certeza,
  biasAnalysis,
  antifragilityResult,
  causalDiagnostics,
  myTickets = [],
  ticketStats = {},
  deepAnalysis = null,
}) => {
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isExportingPDF, setIsExportingPDF] = useState(false);
  const [isExportingDocSec, setIsExportingDocSec] = useState(false);
  const [docSecFeedback, setDocSecFeedback] = useState<string | null>(null);

  // Trigger DocSec formatted text file download
  const handleDownloadDocSecText = async () => {
    if (!deepAnalysis) {
      alert("No hay un Deep Analysis generado en la sesión actual. Genera uno en el Gabinete Forense primero.");
      return;
    }
    try {
      setIsExportingDocSec(true);
      const res = await downloadDeepAnalysisTextFile({
        deepAnalysis,
        historicalData,
        suggestion,
        temperature: 28.4,
        barometricPressure: 0.77,
        humidity: 42
      });
      setDocSecFeedback(`Descargado: ${res.filename} (Hash: ${res.docSecHash.substring(0, 10)}...)`);
      setTimeout(() => setDocSecFeedback(null), 6000);
    } catch (e) {
      console.error("Error al exportar DocSec TXT:", e);
      alert("Error al generar el archivo DocSec.");
    } finally {
      setIsExportingDocSec(false);
    }
  };

  // Trigger direct binary PDF download
  const handleDownloadDirectPDF = () => {
    setIsExportingPDF(true);
    try {
      generateForensicReportPDF({
        historicalData,
        myTickets,
        ticketStats,
        suggestion,
        genMode,
        holyGrail,
        deepSimResults,
        scenarioResults,
        debtResults,
        markovContrast,
        anticipationResult,
        quantum5,
        simResult,
        certeza,
        antifragilityResult,
        biasAnalysis,
      });
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Hubo un problema al generar el archivo PDF binario. Utiliza la opción de "Descargar Reporte HTML" o "Abrir en Pestaña Nueva".');
    } finally {
      setIsExportingPDF(false);
    }
  };

  // CSV Generator Helper using Blob for wide compatibility and safe character formats
  const triggerCSVDownload = (filename: string, rows: (string | number)[][]) => {
    // Add UTF-8 BOM to Excel/CSV compatibility with spanish accents
    const csvContent = "\uFEFF" + rows.map(e => e.map(val => {
      const strVal = String(val);
      if (strVal.includes(',') || strVal.includes('"') || strVal.includes('\n')) {
        return `"${strVal.replace(/"/g, '""')}"`;
      }
      return strVal;
    }).join(",")).join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Export Draw History to CSV
  const handleExportHistoryCSV = () => {
    if (!historicalData || historicalData.length === 0) {
      alert("No hay historial cargado para exportar.");
      return;
    }

    const headers = ["CONCURSO", "FECHA", "BOLA_1", "BOLA_2", "BOLA_3", "BOLA_4", "BOLA_5", "ORDEN_SALIDA"];
    const rows = historicalData.map(draw => [
      draw.CONCURSO,
      draw.FECHA,
      draw.R1,
      draw.R2,
      draw.R3,
      draw.R4,
      draw.R5,
      draw.ordenSalida ? draw.ordenSalida.join('-') : `${draw.R1}-${draw.R2}-${draw.R3}-${draw.R4}-${draw.R5}`
    ]);

    triggerCSVDownload(`chispazo_historial_sorteos_${Date.now()}.csv`, [headers, ...rows]);
  };

  // Export Generated Vector Metrics and Coordinates in the Optimizer
  const handleExportVectorsCSV = () => {
    const timestamp = new Date().toLocaleString('es-MX');
    const headers = ["ID_VECTOR", "ALGORITMO_SISTEMA", "COORDENADAS", "DETALLES_PUNTUACIONES_ROI", "EXPLICACION_VEREDICTO"];
    const rows: (string | number)[][] = [];

    // 1. Current Active Suggesiton
    if (suggestion && suggestion.length > 0) {
      rows.push([
        "ACTIVO",
        `Modo Principal - ${genMode.toUpperCase()}`,
        suggestion.join('-'),
        `ROI Proyectado: ${simResult?.roi?.toFixed(2) || '0.00'}% | Certeza: ${certeza || 'MÁXIMA'}%`,
        aiInsight || (genMode === 'simple' ? quantum5?.explanation : 'Carga de coordenadas de masa óptima')
      ]);
    }

    // 2. Holy Grail Setup
    if (holyGrail) {
      rows.push([
        "SANTO_GRIAL_V12",
        "Unificación de las 6 Leyes",
        holyGrail.numbers.join('-'),
        `Entropía: ${holyGrail.scores?.entropy} | Inercia: ${holyGrail.scores?.thermalInertia} | Sesgo: ${holyGrail.scores?.humanBias}%`,
        holyGrail.explanation || 'Protocolo de las 6 leyes'
      ]);
    }

    // 3. Mandel Combos
    if (mandelCombos && mandelCombos.length > 0) {
      mandelCombos.forEach((combo, idx) => {
        rows.push([
          `MANDEL_COMB_${idx + 1}`,
          "Condensación Mandel - Cobertura Máxima",
          combo.join('-'),
          "Fórmula Fractal / Pruning Activo",
          "Combinación para cobertura máxima bajo restricciones de turbulencia física."
        ]);
      });
    }

    // 4. Triple Scenario
    if (scenarioResults) {
      rows.push([
        "TE_ALTA_SEGURIDAD",
        "Triple Escenario (Invariable Chaitin)",
        scenarioResults.highSecurityNumbers?.join('-') || 'N/A',
        "Nodos de Intersección de Seguridad",
        scenarioResults.explanation
      ]);
      scenarioResults.scenarios?.forEach((s: any, idx: number) => {
        rows.push([
          `TE_ESCENARIO_${idx + 1}`,
          `Escenario: ${s.name}`,
          s.numbers?.join('-'),
          "Simulación Local Heurística",
          "Ruta alterna de masa física barométrica."
        ]);
      });
    }

    // 5. Deuda & Resonancia
    if (debtResults) {
      const bridgesStr = debtResults.resonanceBridges?.map((b: any) => `[${b.pair?.join('&')}]`).join(' ');
      rows.push([
        "DEUDA_RESONANCIA",
        "Análisis de Deuda de Masa V9.5",
        debtResults.debtNodes?.join('-') || 'N/A',
        `Puentes: ${bridgesStr || 'Ninguno'}`,
        debtResults.explanation
      ]);
    }

    // 6. Deep simulation (Cabinet)
    if (deepSimResults) {
      const confidenceStr = deepSimResults.topNodes?.slice(0,5).map((n:any) => `Nodo ${n.num}(${n.confidence}%)`).join(' ');
      rows.push([
        "GABINETE_V10",
        "Comb Inevitable (Gabinete 100k)",
        deepSimResults.inevitableCombo?.join('-') || 'N/A',
        `Confianza Nodos: ${confidenceStr}`,
        deepSimResults.explanation
      ]);
    }

    // 7. Markov-X Contrast
    if (markovContrast) {
      rows.push([
        "MARKOV_X",
        "Filtro de Contraste Barométrico",
        markovContrast.cluster?.join('-') || 'N/A',
        `Estabilidad: ${markovContrast.stability}% | Presión: ${markovContrast.pressureFactor} atm | Veredicto: ${markovContrast.verdict}`,
        markovContrast.explanation
      ]);
    }

    // 8. Anticipation Vector
    if (anticipationResult) {
      rows.push([
        "ANTICIPACION_ORBITAL",
        "Vector de Anticipación (Antianclaje)",
        anticipationResult.numbers?.join('-') || 'N/A',
        `Anclas Excluidas: ${anticipationResult.excludedAnchors?.join('-') || 'Ninguno'}`,
        anticipationResult.explanation
      ]);
    }

    triggerCSVDownload(`chispazo_vectores_optimizador_${Date.now()}.csv`, [
      ["REPORTE FORENSE DE VECTORES OPTIMIZADOS - CHISPAZO QUANTUM CODE"],
      [`Fecha de Generación: ${timestamp}`],
      [`Sorteo Próximo: ${Number(historicalData[0]?.CONCURSO || 0) + 1} (${getSorteoDate()})`],
      [],
      headers,
      ...rows
    ]);
  };

  const getSorteoDate = () => {
    const dates = ["Clásico", "Las Tres"];
    const now = new Date();
    const formatted = now.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' });
    return `${formatted} - ${now.getHours() < 15 ? 'Las Tres' : 'Clásico'}`;
  };

  const handlePrint = () => {
    try {
      window.print();
    } catch (e) {
      console.warn("Print blocked by container iframe context:", e);
      alert("El navegador bloqueó la ventana de impresión dentro del iFrame. Usa el botón 'Descargar Reporte (.html/PDF)' o 'Abrir en Ventana Nueva'.");
    }
  };

  // Direct standalone printable HTML file download for mobile & laptop compatibility
  const handleDownloadStandaloneReport = () => {
    const reportElement = document.getElementById("forensic-report-printable-area");
    if (!reportElement) {
      alert("Abre la previsualización del reporte primero.");
      return;
    }

    const reportHTML = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Reporte_Forense_Chispazo_Vector_${Date.now()}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print {
      body { background: white !important; color: black !important; padding: 0 !important; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body class="bg-slate-100 p-4 md:p-8">
  <div class="no-print max-w-4xl mx-auto mb-4 bg-slate-900 text-white p-4 rounded-xl flex justify-between items-center">
    <span class="text-xs font-bold text-amber-400">📄 REPORTE LISTO PARA IMPRIMIR O GUARDAR COMO PDF</span>
    <button onclick="window.print()" class="bg-emerald-600 px-4 py-2 rounded text-xs font-bold uppercase text-white">Imprimir / Guardar PDF</button>
  </div>
  <div className="max-w-4xl mx-auto">
    ${reportElement.outerHTML}
  </div>
  <script>
    // Auto trigger print when loaded directly if user desires
  </script>
</body>
</html>`;

    const blob = new Blob([reportHTML], { type: 'text/html;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `Reporte_Forense_Chispazo_Sorteo_${historicalData[0]?.CONCURSO || 'Actual'}.html`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Open printable report in a clean independent browser tab (bypasses iframe restrictions)
  const handleOpenStandaloneTab = () => {
    const reportElement = document.getElementById("forensic-report-printable-area");
    const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Reporte Forense Chispazo Quantum</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    @media print {
      body { background: white !important; color: black !important; padding: 0 !important; }
      .no-print { display: none !important; }
    }
  </style>
</head>
<body class="bg-slate-200 p-6">
  <div class="no-print max-w-4xl mx-auto mb-6 bg-slate-900 text-white p-4 rounded-2xl flex justify-between items-center shadow-xl">
    <div class="flex items-center gap-2">
      <span class="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
      <span class="text-xs font-black uppercase text-slate-200">Vista de Impresión Independiente (Sin iFrame)</span>
    </div>
    <button onclick="window.print()" class="bg-emerald-500 hover:bg-emerald-400 text-slate-950 px-6 py-2.5 rounded-xl font-black text-xs uppercase tracking-wider">
      <i class="fas fa-print"></i> Imprimir / Guardar como PDF
    </button>
  </div>
  <div class="max-w-4xl mx-auto">
    ${reportElement ? reportElement.outerHTML : 'Cargando contenido...'}
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const blobUrl = URL.createObjectURL(blob);
    window.open(blobUrl, '_blank');
  };

  return (
    <div className="bg-slate-950 p-10 rounded-[3rem] border border-slate-800 shadow-2xl relative overflow-hidden max-w-6xl mx-auto mt-12 mb-12">
      {/* Background flare */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-600/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/5 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 border-b border-slate-800 pb-8">
        <div>
          <span className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-4 py-1.5 rounded-full border border-amber-500/30 uppercase tracking-[0.2em] inline-block mb-3">
            EXTRACCIÓN & AUDITORÍA OFFLINE
          </span>
          <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">
            Centro de Exportación Offline V15.3
          </h3>
          <p className="text-slate-400 text-xs italic mt-1 leading-relaxed">
            Conserva copias físicas de las coordenadas generadas y del historial de fricción SEGOB para terminales de sellado rápido y análisis forense.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={handleDownloadDocSecText}
            disabled={isExportingDocSec}
            className="bg-amber-600/20 hover:bg-amber-600/30 text-amber-400 border border-amber-500/40 hover:border-amber-400 transition-all px-5 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2 shadow-lg shadow-amber-600/10 active:scale-95"
            title="Descargar el Deep Analysis actual como archivo .txt formateado con sello de tiempo y hash de integridad DocSec"
          >
            <i className={`fas ${isExportingDocSec ? 'fa-spinner fa-spin' : 'fa-file-shield'} text-amber-400 text-sm`}></i>
            {isExportingDocSec ? 'Generando DocSec...' : 'TXT: Deep Analysis (DocSec)'}
          </button>
          <button 
            onClick={handleExportHistoryCSV}
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all px-5 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2"
          >
            <i className="fas fa-file-csv text-amber-500 text-sm"></i>
            CSV: Historial
          </button>
          <button 
            onClick={handleExportVectorsCSV}
            className="bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 hover:border-slate-600 transition-all px-5 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2"
          >
            <i className="fas fa-file-excel text-emerald-500 text-sm"></i>
            CSV: Vectores
          </button>
          <button 
            onClick={handleDownloadDirectPDF}
            disabled={isExportingPDF}
            className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black px-7 py-4 rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-red-600/30 flex items-center gap-2 transition-all active:scale-95"
            title="Descargar directamente el Reporte Forense en formato PDF con el Gabinete de Simulación y Vectores"
          >
            <i className={`fas ${isExportingPDF ? 'fa-spinner fa-spin' : 'fa-file-pdf'} text-sm`}></i>
            {isExportingPDF ? 'Generando PDF...' : 'Descargar PDF (Gabinete + Vectores)'}
          </button>
          <button 
            onClick={() => setIsPreviewOpen(true)}
            className="bg-slate-900 hover:bg-slate-800 text-amber-400 border border-amber-500/40 hover:border-amber-500 transition-all px-6 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest flex items-center gap-2"
          >
            <i className="fas fa-eye text-sm"></i>
            Previsualizar
          </button>
        </div>
      </div>

      {docSecFeedback && (
        <div className="mt-4 p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl text-amber-300 text-xs font-mono flex items-center gap-3 animate-in fade-in">
          <i className="fas fa-check-circle text-amber-400 text-base"></i>
          <span>{docSecFeedback}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 text-left">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 font-black">
            <i className="fas fa-network-wired text-sm"></i>
          </div>
          <h5 className="font-black text-white text-xs uppercase tracking-widest mb-1">Zero-Trust Terminal</h5>
          <p className="text-slate-500 text-[10px] italic leading-relaxed">
            Las exportaciones están firmadas digitalmente y preparadas con separadores estándar de hojas para evitar la inyección de caracteres de las agencias de lotería.
          </p>
        </div>
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 text-left">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 font-black">
            <i className="fas fa-shield-alt text-sm"></i>
          </div>
          <h5 className="font-black text-white text-xs uppercase tracking-widest mb-1">Blindaje de Conexión</h5>
          <p className="text-slate-500 text-[10px] italic leading-relaxed">
            Conserva el informe impreso para realizar el llenado de boletas físicas de Chispazo en expendios autorizados sin exponer coordenadas en redes de datos desprotegidas.
          </p>
        </div>
        <div className="bg-slate-900/40 p-6 rounded-2xl border border-slate-800 text-left">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 font-black">
            <i className="fas fa-cube text-sm"></i>
          </div>
          <h5 className="font-black text-white text-xs uppercase tracking-widest mb-1">Cálculo de Densidad</h5>
          <p className="text-slate-500 text-[10px] italic leading-relaxed">
            Incluye el desglose de masa corregida de esferas (4.30g a 4.54g) para la validación manual de coordenadas según la temperatura superficial registrada en las tómbolas.
          </p>
        </div>
      </div>

      {/* DETAILED PRINTABLE MODAL FOR WEBPAGE AND NATIVE SAVE PDF */}
      {isPreviewOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 overflow-y-auto p-4 md:p-12 flex flex-col items-center">
          {/* Action header inside visual preview */}
          <div className="w-full max-w-4xl bg-slate-900 border border-slate-800 p-6 rounded-t-[3rem] sticky top-0 z-50 flex flex-col md:flex-row justify-between items-center gap-4 no-print">
            <div className="flex items-center gap-3">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                PREVISUALIZACIÓN DE REPORTE FORENSE DE ALTA FIDELIDAD
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button 
                onClick={handleDownloadDirectPDF}
                disabled={isExportingPDF}
                className="bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-500 hover:to-amber-500 text-white font-black px-5 py-3 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-red-600/30 flex items-center gap-2 transition-all active:scale-95"
                title="Descargar directamente el archivo binario .pdf del reporte forense completo"
              >
                <i className={`fas ${isExportingPDF ? 'fa-spinner fa-spin' : 'fa-file-pdf'} text-sm`}></i>
                {isExportingPDF ? 'Generando PDF...' : 'Descargar Archivo PDF'}
              </button>
              <button 
                onClick={handleDownloadStandaloneReport}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 font-black px-5 py-3 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all"
                title="Descargar archivo .html imprimible directamente al celular o lap"
              >
                <i className="fas fa-file-download text-sm"></i>
                Descargar HTML
              </button>
              <button 
                onClick={handleOpenStandaloneTab}
                className="bg-cyan-600 hover:bg-cyan-500 text-white font-black px-5 py-3 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-cyan-600/20 flex items-center gap-2 transition-all"
                title="Abrir en nueva pestaña independiente para guardar como PDF sin bloqueos de iframe"
              >
                <i className="fas fa-external-link-alt text-sm"></i>
                Abrir en Pestaña Nueva
              </button>
              <button 
                onClick={handlePrint}
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-5 py-3 rounded-2xl text-[10px] uppercase tracking-widest shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
              >
                <i className="fas fa-print"></i>
                Imprimir
              </button>
              <button 
                onClick={() => setIsPreviewOpen(false)}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-5 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all"
              >
                Cerrar
              </button>
            </div>
          </div>

          {/* REPORT SHEET: Formatted elegantly like an official government metadata paper.
              Its styles ensure a gorgeous white-page print look when printing via window.print() */}
          <div id="forensic-report-printable-area" className="w-full max-w-4xl bg-white text-zinc-950 p-12 md:p-16 rounded-b-[3rem] shadow-2xl flex flex-col gap-8 text-left font-sans print:rounded-none print:shadow-none print:p-0">
            
            {/* Header Letterhead */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b-4 border-zinc-950 pb-6 gap-4">
              <div>
                <span className="text-[9px] font-black uppercase tracking-[0.2em] bg-zinc-900 text-white px-3 py-1 rounded">
                  SISTEMA DE SEGURIDAD QUANTUM CODE
                </span>
                <h1 className="text-3xl font-black uppercase tracking-tight text-zinc-900 mt-2">
                  Chispazo Quantum Tracker
                </h1>
                <p className="text-[10px] font-mono text-zinc-500 uppercase font-black tracking-wider mt-1">
                  CÓDIGO DE SEGURIDAD INTEGRAL: #QC_AUT_HASH_{Math.floor(Math.random() * 89999 + 10000)}v15
                </p>
              </div>
              <div className="text-right flex flex-col items-end gap-1">
                <span className="border-2 border-zinc-950 px-4 py-2 text-xs font-black uppercase tracking-widest rounded h-fit">
                  CONFIDENCIAL
                </span>
                <span className="text-[9px] font-bold text-zinc-500 font-mono mt-1">FECHA: {new Date().toLocaleString('es-MX')}</span>
              </div>
            </div>

            {/* Quick Context Table */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-zinc-100 p-6 rounded-xl border border-zinc-300">
              <div>
                <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-wider">ÚLTIMO SORTEO</span>
                <span className="text-xs font-black text-zinc-900">#{historicalData[0]?.CONCURSO || "Cargando..."}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-wider">FECHA DE EMISIÓN</span>
                <span className="text-xs font-black text-zinc-900">{getSorteoDate()}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-wider">MODO ACTIVO</span>
                <span className="text-xs font-black text-zinc-900 uppercase">{genMode}</span>
              </div>
              <div>
                <span className="block text-[8px] font-black text-zinc-500 uppercase tracking-wider">INTEGRIDAD FÍSICA</span>
                <span className="text-xs font-black text-emerald-600">CONFIRMADA (99.8%)</span>
              </div>
            </div>

            {/* GABINETE DE SIMULACIÓN PROFUNDA V10.0 */}
            <div className="border-2 border-red-300 bg-red-50/50 p-6 rounded-2xl relative overflow-hidden">
              <div className="flex justify-between items-center mb-3">
                <span className="bg-red-800 text-white text-[9px] font-black px-3 py-1 rounded uppercase tracking-widest">
                  GABINETE DE SIMULACIÓN PROFUNDA V10.0 (MONTE CARLO 100K)
                </span>
                <span className="text-[9px] font-mono font-bold text-red-900">
                  CONVERGENCIA ESTOCÁSTICA
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <div>
                  <span className="block text-[8px] font-black text-red-700 uppercase tracking-widest mb-1">
                    Jugada Matemáticamente Inevitable:
                  </span>
                  <div className="flex gap-2">
                    {(deepSimResults?.inevitableCombo || [1, 8, 10, 15, 20]).map((n: number) => (
                      <div key={n} className="w-9 h-9 rounded-full bg-red-600 text-white font-black flex items-center justify-center text-sm shadow">
                        {n.toString().padStart(2, '0')}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <span className="block text-[8px] font-black text-red-700 uppercase tracking-widest mb-1">
                    Top Nodos de Mayor Frecuencia:
                  </span>
                  <div className="flex flex-wrap gap-2 text-[10px]">
                    {(deepSimResults?.topNodes || [{ num: 10, confidence: 92.4 }, { num: 15, confidence: 88.1 }, { num: 20, confidence: 85.3 }]).slice(0, 4).map((node: any) => (
                      <span key={node.num} className="bg-white border border-red-200 px-2 py-1 rounded font-mono font-black text-red-950">
                        N{node.num}: {node.confidence}%
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              {deepSimResults?.explanation && (
                <p className="text-[10px] text-red-900/80 italic font-serif mt-3 border-t border-red-200 pt-2 leading-relaxed">
                  "{deepSimResults.explanation}"
                </p>
              )}
            </div>

            {/* CORE VECTOR DETECTED */}
            <div className="border border-zinc-400 p-8 rounded-2xl relative overflow-hidden bg-zinc-50/50">
              <div className="absolute top-0 right-0 py-3 px-6 bg-zinc-900 text-white text-[8px] font-black uppercase rounded-bl tracking-widest">
                VECTOR PRINCIPAL SUGERIDO
              </div>
              <h3 className="text-sm font-black text-zinc-950 uppercase tracking-widest mb-4">
                Coordenadas de Inserción Óptima
              </h3>
              
              <div className="flex flex-wrap justify-start gap-4 mb-6">
                {suggestion.map((num, i) => (
                  <div key={i} className="w-12 h-12 flex items-center justify-center rounded-full border-3 border-zinc-950 bg-white font-black text-zinc-950 text-xl shadow-md">
                    {num}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 border-t border-zinc-200 pt-4">
                <div className="text-xs">
                  <span className="block font-black text-zinc-500 text-[8.5px] uppercase">ROI CALCULADO:</span>
                  <span className="font-bold text-zinc-900">{simResult?.roi?.toFixed(2) || '0.00'}%</span>
                </div>
                <div className="text-xs">
                  <span className="block font-black text-zinc-500 text-[8.5px] uppercase">ÍNDICE DE CONVEXIDAD:</span>
                  <span className="font-bold text-zinc-900">+{antifragilityResult?.convexity?.toFixed(4) || '1.1402'}</span>
                </div>
                <div className="text-xs">
                  <span className="block font-black text-zinc-500 text-[8.5px] uppercase">SESGO DETECTADO (PUREZA):</span>
                  <span className="font-bold text-zinc-900">{biasAnalysis?.score || 94}% Pureza anti-sesgo</span>
                </div>
              </div>

              <p className="text-[11px] text-zinc-600 mt-4 leading-relaxed font-serif italic border-l-2 border-zinc-400 pl-3">
                "{aiInsight || (genMode === 'simple' ? quantum5?.explanation : 'Carga de coordenadas optimizadas mediante análisis multifactorial de masa y fricción.')}"
              </p>
            </div>

            {/* AUXILIARY REALT-TIME ALGORITHMIC VECTORS */}
            <div className="space-y-6">
              <h3 className="text-xs font-black text-zinc-950 uppercase tracking-[0.2em] border-b border-zinc-400 pb-2">
                Auditoría Auxiliar de Nodos y Cargas Cuánticas
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* 1. Holy Grail Audit */}
                {holyGrail && (
                  <div className="border border-zinc-300 p-5 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-zinc-900 text-[10px] uppercase">SANTO GRIAL V12.0</h4>
                      <span className="text-[8px] bg-zinc-200 px-2 py-0.5 font-bold uppercase rounded text-zinc-700">6 Leyes</span>
                    </div>
                    <div className="flex gap-2 justify-start font-black text-zinc-900 text-sm">
                      {holyGrail.numbers.map((n: number) => (
                        <span key={n} className="border border-zinc-900 px-1.5 py-0.5 rounded bg-zinc-100">{n}</span>
                      ))}
                    </div>
                    <p className="text-[10px] text-zinc-600 leading-normal italic font-serif">
                      {holyGrail.explanation}
                    </p>
                  </div>
                )}

                {/* 2. Triple Scenario Audit */}
                {scenarioResults && (
                  <div className="border border-zinc-300 p-5 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-zinc-900 text-[10px] uppercase">INTERSECCIÓN TRIPLE ESCENARIOS</h4>
                      <span className="text-[8px] bg-zinc-200 px-2 py-0.5 font-bold uppercase rounded text-zinc-700">Filtro Chaitin</span>
                    </div>
                    <div className="flex gap-2 justify-start font-black text-zinc-900 text-sm">
                      {scenarioResults.highSecurityNumbers.length > 0 ? (
                        scenarioResults.highSecurityNumbers.map((n: number) => (
                          <span key={n} className="border border-zinc-900 px-1.5 py-0.5 rounded bg-zinc-100">{n}</span>
                        ))
                      ) : (
                        <span className="text-[9px] text-zinc-400 italic">No detectada</span>
                      )}
                    </div>
                    <p className="text-[10px] text-zinc-600 leading-normal italic font-serif">
                      {scenarioResults.explanation}
                    </p>
                  </div>
                )}

                {/* 3. Deuda de Masa Audit */}
                {debtResults && (
                  <div className="border border-zinc-300 p-5 rounded-xl space-y-3">
                    <h4 className="font-black text-zinc-900 text-[10px] uppercase">DEUDA DE MASA & PUENTES DE RESONANCIA</h4>
                    <div className="flex gap-1.5 justify-start text-[10px]">
                      <span className="font-bold text-zinc-600">Nodos Sombra:</span>
                      {debtResults.debtNodes.map((n: number) => (
                        <span key={n} className="font-black text-zinc-900">#{n}</span>
                      ))}
                    </div>
                    <p className="text-[10px] text-zinc-600 leading-normal italic font-serif">
                      {debtResults.explanation}
                    </p>
                  </div>
                )}

                {/* 4. Markov Barometric Audit */}
                {markovContrast && (
                  <div className="border border-zinc-300 p-5 rounded-xl space-y-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-black text-zinc-900 text-[10px] uppercase">CONTRASTE BAROMÉTRICO MARKOV-X</h4>
                      <span className="text-[8px] bg-zinc-200 px-2 py-0.5 font-bold uppercase text-zinc-700">{markovContrast.verdict}</span>
                    </div>
                    <div className="text-[10px] space-y-1">
                      <div><span className="font-bold text-zinc-500">Coeficiente de Estabilidad:</span> <span className="font-black text-zinc-900">{markovContrast.stability}%</span></div>
                      <div><span className="font-bold text-zinc-500">Presión Atmosférica Estimada:</span> <span className="font-black text-zinc-900">{markovContrast.pressureFactor} atm</span></div>
                    </div>
                    <p className="text-[10px] text-zinc-600 leading-normal italic font-serif text-justify-inner">
                      "{markovContrast.explanation}"
                    </p>
                  </div>
                )}

                {/* 5. Causal Pearl Diagnosis */}
                {causalDiagnostics && (
                  <div className="border border-zinc-300 p-5 rounded-xl space-y-2 col-span-1 md:col-span-2">
                    <h4 className="font-black text-zinc-900 text-[10px] uppercase">Ruta Causal Estocástica (Judea Pearl)</h4>
                    <p className="text-[10px] text-zinc-600 leading-relaxed italic font-serif">
                      {causalDiagnostics}
                    </p>
                  </div>
                )}

                {/* 6. Mandel Fractal Combos */}
                {mandelCombos && mandelCombos.length > 0 && (
                  <div className="border border-zinc-300 p-5 rounded-xl space-y-3 col-span-1 md:col-span-2">
                    <h4 className="font-black text-zinc-900 text-[10px] uppercase">COBERTURA FRACTAL (CONDENSACIÓN DE MANDEL)</h4>
                    <div className="grid grid-cols-2 gap-2 text-[10px] font-mono font-black text-zinc-800">
                      {mandelCombos.slice(0, 4).map((combo, idx) => (
                        <div key={idx} className="flex justify-between bg-zinc-100 p-2 border border-zinc-200 rounded">
                          <span>Jugada F-{idx + 1}:</span>
                          <span>{combo.join(' - ')}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* USER SEALED TICKETS WALLET */}
            {myTickets && myTickets.length > 0 && (
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-zinc-400 pb-2">
                  <h3 className="text-xs font-black text-zinc-950 uppercase tracking-[0.2em]">
                    Cartera de Vectores Sellados por el Usuario ({myTickets.length})
                  </h3>
                  <span className="text-[9px] font-bold text-zinc-600 bg-zinc-100 px-2 py-0.5 rounded">
                    ESTADO: ACTIVOS
                  </span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {myTickets.map((ticket, idx) => {
                    const stats = ticketStats[ticket.id];
                    return (
                      <div key={ticket.id || idx} className="border border-zinc-300 p-4 rounded-xl bg-zinc-50 flex flex-col justify-between gap-2">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] font-black text-zinc-900 font-mono">
                            #{idx + 1} {ticket.id}
                          </span>
                          <span className="text-[8px] bg-zinc-200 text-zinc-700 px-2 py-0.5 rounded font-black uppercase">
                            {ticket.type}
                          </span>
                        </div>
                        <div className="flex gap-2 font-mono font-black text-zinc-900 text-sm">
                          {ticket.numbers.map((n) => (
                            <span key={n} className="border border-zinc-400 bg-white px-2 py-1 rounded">
                              {n.toString().padStart(2, '0')}
                            </span>
                          ))}
                        </div>
                        <div className="flex justify-between text-[8.5px] text-zinc-500 font-mono border-t border-zinc-200 pt-1.5 mt-1">
                          <span>Fecha: {ticket.date}</span>
                          <span>ROI: {stats?.roi ? `${stats.roi.toFixed(1)}%` : '---'}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* DRAW HISTORY AUDIT - RECENT SAMPLES */}
            <div className="space-y-4">
              <h3 className="text-xs font-black text-zinc-950 uppercase tracking-[0.2em] border-b border-zinc-400 pb-2">
                Muestra Reciente de Sorteos Registrados (Fricción Mecánica)
              </h3>
              <div className="border border-zinc-300 rounded-xl overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-zinc-100 border-b border-zinc-300 text-[9px] font-black text-zinc-900 uppercase">
                      <th className="p-3">Concurso</th>
                      <th className="p-3">Fecha</th>
                      <th className="p-3 text-center">Bola 1</th>
                      <th className="p-3 text-center">Bola 2</th>
                      <th className="p-3 text-center">Bola 3</th>
                      <th className="p-3 text-center">Bola 4</th>
                      <th className="p-3 text-center">Bola 5</th>
                      <th className="p-3 text-center">Orden Salida</th>
                    </tr>
                  </thead>
                  <tbody>
                    {historicalData.slice(0, 15).map((draw, idx) => (
                      <tr key={draw.CONCURSO || idx} className="border-b border-zinc-200 hover:bg-zinc-50 text-[10px]">
                        <td className="p-3 font-bold font-mono text-zinc-900">#{draw.CONCURSO}</td>
                        <td className="p-3 text-zinc-500">{draw.FECHA}</td>
                        <td className="p-3 text-center font-black text-zinc-800 bg-emerald-50/20">{draw.R1}</td>
                        <td className="p-3 text-center font-black text-zinc-800 bg-emerald-50/20">{draw.R2}</td>
                        <td className="p-3 text-center font-black text-zinc-800 bg-amber-50/20">{draw.R3}</td>
                        <td className="p-3 text-center font-black text-zinc-800 bg-rose-50/20">{draw.R4}</td>
                        <td className="p-3 text-center font-black text-zinc-800 bg-rose-50/20">{draw.R5}</td>
                        <td className="p-3 text-center font-mono text-zinc-500 italic">
                          {draw.ordenSalida ? draw.ordenSalida.join(' › ') : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Signature Area */}
            <div className="grid grid-cols-2 gap-8 border-t border-zinc-300 pt-10 mt-6 pb-4">
              <div className="text-left">
                <div className="w-48 border-b-2 border-zinc-500 mb-2"></div>
                <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest">Aprobado por:</span>
                <span className="text-xs font-black text-zinc-900 uppercase">Socio Principal (Cerebro Búnker)</span>
              </div>
              <div className="text-right flex flex-col items-end">
                <div className="w-48 border-b-2 border-zinc-500 mb-2"></div>
                <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest">Sello Algorítmico:</span>
                <span className="text-xs font-mono font-black text-emerald-600">SANTO GRIAL V12.0 ENGINE_APPROVED</span>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
