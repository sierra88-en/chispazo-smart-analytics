
import { DrawResult, FrequencyData, SimulationResult } from "../types";

export const parseCSV = (text: string): DrawResult[] => {
  const lines = text.trim().split('\n');
  if (lines.length < 2) return [];
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      CONCURSO: parseInt(values[0]),
      FECHA: values[1],
      R1: parseInt(values[2]),
      R2: parseInt(values[3]),
      R3: parseInt(values[4]),
      R4: parseInt(values[5]),
      R5: parseInt(values[6]),
    };
  }).filter(d => !isNaN(d.R1));
};

const generateRandomCombination = (count: number = 5): number[] => {
  const nums: number[] = [];
  while (nums.length < count) {
    const n = Math.floor(Math.random() * 28) + 1;
    if (!nums.includes(n)) nums.push(n);
  }
  return nums.sort((a, b) => a - b);
};

export const generateMockData = (): DrawResult[] => {
  const realHistory: DrawResult[] = [
    { CONCURSO: 11815, FECHA: '08/02/2026', R1: 2, R2: 4, R3: 5, R4: 14, R5: 27 },
    { CONCURSO: 11814, FECHA: '07/02/2026', R1: 8, R2: 10, R3: 12, R4: 17, R5: 24 },
    { CONCURSO: 11813, FECHA: '07/02/2026', R1: 3, R2: 6, R3: 11, R4: 17, R5: 22 },
    { CONCURSO: 11812, FECHA: '06/02/2026', R1: 3, R2: 4, R3: 5, R4: 13, R5: 26 },
    { CONCURSO: 11811, FECHA: '06/02/2026', R1: 4, R2: 5, R3: 11, R4: 15, R5: 24 },
    { CONCURSO: 11810, FECHA: '05/02/2026', R1: 4, R2: 14, R3: 16, R4: 18, R5: 22 },
    { CONCURSO: 11809, FECHA: '05/02/2026', R1: 5, R2: 10, R3: 12, R4: 17, R5: 22 },
    { CONCURSO: 11808, FECHA: '04/02/2026', R1: 5, R2: 14, R3: 21, R4: 22, R5: 24 },
    { CONCURSO: 11807, FECHA: '04/02/2026', R1: 9, R2: 18, R3: 21, R4: 24, R5: 26 },
    { CONCURSO: 11806, FECHA: '03/02/2026', R1: 7, R2: 10, R3: 14, R4: 20, R5: 28 },
    { CONCURSO: 11805, FECHA: '03/02/2026', R1: 8, R2: 11, R3: 17, R4: 19, R5: 26 },
    { CONCURSO: 11804, FECHA: '02/02/2026', R1: 3, R2: 10, R3: 16, R4: 26, R5: 27 },
    { CONCURSO: 11803, FECHA: '02/02/2026', R1: 12, R2: 16, R3: 19, R4: 22, R5: 26 },
    { CONCURSO: 11802, FECHA: '01/02/2026', R1: 1, R2: 2, R3: 6, R4: 12, R5: 16 },
    { CONCURSO: 11801, FECHA: '01/02/2026', R1: 5, R2: 14, R3: 19, R4: 22, R5: 27 },
    { CONCURSO: 11800, FECHA: '31/01/2026', R1: 2, R2: 16, R3: 20, R4: 22, R5: 23 },
  ];

  const data: DrawResult[] = [...realHistory];
  const startConcurso = 11799;
  for (let i = 0; i < 984; i++) {
    const nums = generateRandomCombination();
    data.push({
      CONCURSO: startConcurso - i,
      FECHA: 'Datos_Anteriores',
      R1: nums[0], R2: nums[1], R3: nums[2], R4: nums[3], R5: nums[4]
    });
  }
  return data;
};

export const calculateFrequencies = (data: DrawResult[]): FrequencyData[] => {
  const counts: Record<number, number> = {};
  for (let i = 1; i <= 28; i++) counts[i] = 0;
  data.forEach(draw => {
    [draw.R1, draw.R2, draw.R3, draw.R4, draw.R5].forEach(num => {
      if (counts[num] !== undefined) counts[num]++;
    });
  });
  return Object.entries(counts).map(([num, count]) => ({
    number: parseInt(num),
    count: count
  }));
};

export const runSimulation = (pool: number[], data: DrawResult[]): SimulationResult => {
  let first = 0, second = 0, third = 0, fourth = 0;
  const isMultiple = pool.length === 7;
  const costPerDraw = isMultiple ? 210 : 10;
  
  data.forEach(draw => {
    const winningNumbers = [draw.R1, draw.R2, draw.R3, draw.R4, draw.R5];
    const matches = pool.filter(n => winningNumbers.includes(n)).length;
    if (isMultiple) {
      if (matches === 5) { first += 1; second += 10; third += 10; }
      else if (matches === 4) { second += 3; third += 12; fourth += 6; }
      else if (matches === 3) { third += 6; fourth += 15; }
      else if (matches === 2) { fourth += 10; }
    } else {
      if (matches === 5) first++;
      else if (matches === 4) second++;
      else if (matches === 3) third++;
      else if (matches === 2) fourth++;
    }
  });

  const totalInvestment = data.length * costPerDraw;
  const totalEarnings = (first * 100000) + (second * 800) + (third * 50) + (fourth * 10);
  const roi = totalInvestment > 0 ? ((totalEarnings - totalInvestment) / totalInvestment) * 100 : 0;
  return { firstPlace: first, secondPlace: second, thirdPlace: third, fourthPlace: fourth, totalEarnings, investment: totalInvestment, winRate: 0, roi };
};

/**
 * Optimizador de Probabilidad Cuántica (REFINED)
 * Itera hasta encontrar una combinación de 7 números con ROI entre -15% y -25%, 
 * con al menos un 2do lugar en los últimos 200 sorteos (Ventana de alta confianza).
 */
export const generateEliteMultiple7 = (data: DrawResult[]): { numbers: number[], simulation: SimulationResult } => {
  let bestNumbers: number[] = [];
  let bestSim: SimulationResult | null = null;
  const confidenceWindow = data.slice(0, 200); // 200 draws for higher confidence

  for (let i = 0; i < 7000; i++) {
    const candidate = [];
    while (candidate.length < 7) {
      const n = Math.floor(Math.random() * 28) + 1;
      if (!candidate.includes(n)) candidate.push(n);
    }
    candidate.sort((a, b) => a - b);
    
    const sim = runSimulation(candidate, data);
    const windowSim = runSimulation(candidate, confidenceWindow);

    // Strict God Level Filters
    const satisfiesROI = sim.roi <= -15 && sim.roi >= -25;
    const satisfiesWindowHit = windowSim.secondPlace >= 1; // Al menos un 2do lugar en 200 sorteos

    if (satisfiesROI && satisfiesWindowHit) {
      return { numbers: candidate, simulation: sim };
    }

    if (!bestSim || Math.abs(sim.roi + 20) < Math.abs(bestSim.roi + 20)) {
      bestNumbers = candidate;
      bestSim = sim;
    }
  }

  return { numbers: bestNumbers, simulation: bestSim! };
};

export const generateSmartCombination = (): number[] => {
  const getRandom = (min: number, max: number, count: number) => {
    const res: number[] = [];
    while (res.length < count) {
      const n = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!res.includes(n)) res.push(n);
    }
    return res;
  };
  return [...getRandom(1, 9, 2), ...getRandom(10, 19, 1), ...getRandom(20, 28, 2)].sort((a, b) => a - b);
};
