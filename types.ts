
export interface DrawResult {
  CONCURSO: number;
  FECHA: string;
  R1: number;
  R2: number;
  R3: number;
  R4: number;
  R5: number;
  ordenSalida?: number[];
}

export interface FrequencyData {
  number: number;
  count: number;
}

export type ViewState = 'dashboard' | 'generator' | 'analytics' | 'history' | 'tickets' | 'solar' | 'knowledge' | 'docs' | 'vision' | 'backtesting' | 'weekly';

export interface SmartSuggestion {
  numbers: number[];
  explanation?: string;
}

export interface SimulationResult {
  firstPlace: number;
  secondPlace: number;
  thirdPlace: number;
  fourthPlace: number;
  totalEarnings: number;
  investment: number;
  winRate: number;
  roi: number;
}

export interface SavedTicket {
  id: string;
  date: string;
  numbers: number[];
  type: 'simple' | 'multiple6' | 'multiple7';
  matches?: number[];
}

export interface ShannonEntropyProtocol {
  entropyBit: number;
  detectedSet: 'Set A (Ligeros)' | 'Set B (Medios)' | 'Set C (Pesados)' | 'Set D (Mixtos)';
  rotationCycle: string;
  activeVector: number[];
  forensicFilter: number[];
  explanation: string;
}

export type SwarmNode = 'Density' | 'Thermal' | 'SetRotation' | 'MechanicalFatigue';

export interface SwarmConsciousness {
  activeNode: SwarmNode;
  nodeStatus: Record<SwarmNode, 'Active' | 'Standby' | 'Calibrating'>;
  entropyH: number;
  roiProyectado: number;
  forensicAlert?: string;
  vetaDeOro: boolean;
  cdmxPressure?: number;
  cdmxAltitude?: number;
}

export interface SolarCycleProtocol {
  backpropagation: string;
  bloqueAlfa: {
    multiple7: number[];
    elite5: number[];
    certeza: number;
    justification: string;
  };
  bloqueOmega: {
    multiple7: number[];
    elite5: number[];
    certeza: number;
    justification: string;
  };
}

export interface ResonanceScanResult {
  lastDraw: number[];
  terminalVelocities: Record<number, string>;
  avgWeeklyVelocity: string;
  resonanceDeviation: string;
  verdict: string;
  explanation: string;
}

export interface NonEjectedNodeAnalysis {
  node: number;
  ballWeight: number;
  weightDeltaFromOptimum: number;
  failureReason: string;
  aerodynamicDrag: number;
  suggestedCalibration: string;
}

export interface FailedPredictionLogEntry {
  concurso: number;
  fecha: string;
  predictedVector: number[];
  actualResult: number[];
  hits: number[];
  failedNodes: number[];
  nodeAnalyses: NonEjectedNodeAnalysis[];
  primaryFailureCause: 'EXCESO_MASA_NEUMATICA' | 'VACIO_SUCCION_INSUFICIENTE' | 'TURBULENCIA_ROTOR' | 'DESVIACION_PESAJE_MALETIN' | 'DESPLAZAMIENTO_ENTROPICO';
  suitcaseWeight28?: number;
  learningAdjustmentFactor: number;
}

export interface FailedPredictionAuditResult {
  totalEvaluatedDraws: number;
  totalPredictions: number;
  totalNonEjectedNodes: number;
  averageHitRate: number;
  topFailureCause: string;
  globalCalibrationOffset: number;
  learnedNodePenalties: Record<number, number>;
  discrepancyLogs: FailedPredictionLogEntry[];
}
