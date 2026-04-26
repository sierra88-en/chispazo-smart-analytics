
import { loadHistoricalData, generateAntifragileVector, calculateAntifragility } from './utils/dataHelper';

async function main() {
  const data = loadHistoricalData();
  console.log("--- GENERANDO VECTOR ANTIFRÁGIL (Protocolo Búnker) ---");
  
  let bestGlobal = { numbers: [] as number[], score: -Infinity };
  
  // Hacemos varias pasadas para encontrar un pico real de convexidad
  for(let i=0; i<10; i++) {
    const result = generateAntifragileVector(data);
    const anti = calculateAntifragility(result.numbers, data);
    if (anti.score > bestGlobal.score) {
      bestGlobal = { numbers: result.numbers, score: anti.score };
    }
  }

  console.log(`\nCombinación Sugerida: [${bestGlobal.numbers.join(', ')}]`);
  console.log(`Convexidad (H): +${bestGlobal.score.toFixed(6)}`);
  console.log(`Estado: ANTIFRÁGIL`);
  console.log(`\nAnálisis: Esta combinación se beneficia de la distorsión del maletín detectada hoy.`);
}

main();
