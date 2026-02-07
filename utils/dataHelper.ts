
import { DrawResult, FrequencyData } from "../types";

export const parseCSV = (text: string): DrawResult[] => {
  const lines = text.trim().split('\n');
  const headers = lines[0].split(',');
  
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

export const generateMockData = (): DrawResult[] => {
  const data: DrawResult[] = [];
  const today = new Date();
  for (let i = 0; i < 100; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}/${date.getFullYear()}`;
    
    // Generate 5 random unique numbers 1-28
    const nums: number[] = [];
    while (nums.length < 5) {
      const n = Math.floor(Math.random() * 28) + 1;
      if (!nums.includes(n)) nums.push(n);
    }
    nums.sort((a, b) => a - b);

    data.push({
      CONCURSO: 9900 + i,
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

  // Logic: 2 Low (1-9), 1 Mid (10-19), 2 High (20-28)
  const suggestion = [
    ...getRandom(1, 9, 2),
    ...getRandom(10, 19, 1),
    ...getRandom(20, 28, 2)
  ].sort((a, b) => a - b);
  
  return suggestion;
};
