
import { 
  loadHistoricalData, 
  generateAntifragileVector, 
  generateEliteMultiple6, 
  generateEliteMultiple7,
  calculateAntifragility 
} from './utils/dataHelper';

async function main() {
  const data = loadHistoricalData();
  const dateStr = new Date().toLocaleDateString('es-MX', { day: 'numeric', month: 'long' });
  console.log(`--- PROTOCOLO DE DOMINACIÓN 9PM (${dateStr.toUpperCase()}) ---`);
  
  // Antifragile 5
  let best5 = { numbers: [] as number[], score: -Infinity };
  for(let i=0; i<20; i++) {
    const res = generateAntifragileVector(data);
    const anti = calculateAntifragility(res.numbers, data);
    if(anti.score > best5.score) best5 = { numbers: res.numbers, score: anti.score };
  }
  console.log(`\nVECTOR ANTIFRÁGIL (Quantum 5): [${best5.numbers.join(', ')}]`);
  console.log(`Convexidad: +${best5.score.toFixed(4)}`);

  // Multiple 6
  const best6 = generateEliteMultiple6(data);
  console.log(`\nMÚLTIPLE 6 (Sintonizado): [${best6.numbers.join(', ')}]`);
  console.log(`Certeza: ${best6.certeza.toFixed(1)}%`);

  // Multiple 7
  const best7 = generateEliteMultiple7(data);
  console.log(`\nMÚLTIPLE 7 (GOD-X): [${best7.numbers.join(', ')}]`);
  console.log(`Certeza: ${best7.certeza.toFixed(1)}%`);
}

main();
