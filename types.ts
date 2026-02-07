
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

export type ViewState = 'dashboard' | 'generator' | 'analytics' | 'history';

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
