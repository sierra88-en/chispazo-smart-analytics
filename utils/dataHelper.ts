
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

const generateRandomCombination = (): number[] => {
  const nums: number[] = [];
  while (nums.length < 5) {
    const n = Math.floor(Math.random() * 28) + 1;
    if (!nums.includes(n)) nums.push(n);
  }
  return nums.sort((a, b) => a - b);
};

export const generateMockData = (): DrawResult[] => {
  const data: DrawResult[] = [];
  const today = new Date();
  for (let i = 0; i < 1000; i++) { // Increased to 1000 for better simulation
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
    const nums = generateRandomCombination();

    data.push({
      CONCURSO: 10000 - i,
      FECHA: dateStr,
      R1: nums[0],
      R2: nums[1],
      R3: nums[2],
      R4: nums[3],
      R5: nums[4]
    });
  }
  return data;
};

export const generateNewDraw = (lastConcurso: number): DrawResult => {
  const now = new Date();
  const dateStr = `${now.getDate().toString().padStart(2, '0')}/${(now.getMonth() + 1).toString().padStart(2, '0')}/${now.getFullYear()} ${now.getHours()}:${now.getMinutes()}`;
  const nums = generateRandomCombination();
  
  return {
    CONCURSO: lastConcurso + 1,
    FECHA: dateStr,
    R1: nums[0],
    R2: nums[1],
    R3: nums[2],
    R4: nums[3],
    R5: nums[4]
  };
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

export const generateSmartCombination = (): number[] => {
  const getRandom = (min: number, max: number, count: number) => {
    const res: number[] = [];
    while (res.length < count) {
      const n = Math.floor(Math.random() * (max - min + 1)) + min;
      if (!res.includes(n)) res.push(n);
    }
    return res;
  };

  const suggestion = [
    ...getRandom(1, 9, 2),
    ...getRandom(10, 19, 1),
    ...getRandom(20, 28, 2)
  ].sort((a, b) => a - b);
  
  return suggestion;
};

export const generateMultiple7 = (frequencies: FrequencyData[]): number[] => {
  const sortedFreq = [...frequencies].sort((a, b) => b.count - a.count);
  const calientes = sortedFreq.slice(0, 10).map(f => f.number);
  const frios = sortedFreq.slice(-10).map(f => f.number);
  
  const sample = (arr: number[], count: number) => {
    const shuffled = [...arr].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  };

  const pool: number[] = [];
  const selCalientes = sample(calientes, 3);
  pool.push(...selCalientes);
  
  const availableFrios = frios.filter(n => !pool.includes(n));
  const selFrios = sample(availableFrios, 2);
  pool.push(...selFrios);
  
  const allNumbers = Array.from({ length: 28 }, (_, i) => i + 1);
  const availableComodines = allNumbers.filter(n => !pool.includes(n));
  const selComodines = sample(availableComodines, 2);
  pool.push(...selComodines);
  
  return pool.sort((a, b) => a - b);
};

/**
 * Runs a historical simulation.
 * Estimated prizes for Chispazo:
 * 5 hits: $50,000+ (variable, average)
 * 4 hits: $800
 * 3 hits: $50
 * 2 hits: $10 (pays back the line)
 */
export const runSimulation = (pool: number[], data: DrawResult[]): SimulationResult => {
  let first = 0, second = 0, third = 0, fourth = 0;
  const isMultiple = pool.length === 7;
  const costPerDraw = isMultiple ? 210 : 10;
  
  data.forEach(draw => {
    const winningNumbers = [draw.R1, draw.R2, draw.R3, draw.R4, draw.R5];
    const matches = pool.filter(n => winningNumbers.includes(n)).length;

    if (isMultiple) {
      // Multiple 7 has 21 lines. Math for prizes based on matches in the 7-pool:
      if (matches === 5) { first += 1; second += 10; third += 10; }
      else if (matches === 4) { second += 3; third += 12; fourth += 6; }
      else if (matches === 3) { third += 6; fourth += 15; }
      else if (matches === 2) { fourth += 10; }
    } else {
      // Simple play
      if (matches === 5) first++;
      else if (matches === 4) second++;
      else if (matches === 3) third++;
      else if (matches === 2) fourth++;
    }
  });

  const totalInvestment = data.length * costPerDraw;
  // Estimated earnings based on average prize values
  const totalEarnings = (first * 50000) + (second * 800) + (third * 50) + (fourth * 10);
  const wins = first + second + third + fourth;
  const winRate = (wins / (data.length * (isMultiple ? 21 : 1))) * 100;
  const roi = ((totalEarnings - totalInvestment) / totalInvestment) * 100;

  return {
    firstPlace: first,
    secondPlace: second,
    thirdPlace: third,
    fourthPlace: fourth,
    totalEarnings,
    investment: totalInvestment,
    winRate,
    roi
  };
};
