
export interface DrawResult {
  CONCURSO: number;
  FECHA: string;
  R1: number;
  R2: number;
  R3: number;
  R4: number;
  R5: number;
}

export interface FrequencyData {
  number: number;
  count: number;
}

export type ViewState = 'dashboard' | 'generator' | 'analytics' | 'history' | 'tickets' | 'solar' | 'knowledge' | 'docs' | 'vision' | 'backtesting';

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
