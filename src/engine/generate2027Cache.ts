import * as fs from 'fs';
import * as path from 'path';
import { calculatePanchangamForDay } from './panchangam';

console.log('Generating precomputed 2027 Panchangam dataset...');

const days: Record<string, any> = {};
const start = new Date(2027, 0, 1);

for (let i = 0; i < 365; i++) {
  const d = new Date(start.getTime() + i * 86400000);
  const y = d.getFullYear();
  const m = (d.getMonth() + 1).toString().padStart(2, '0');
  const dayStr = d.getDate().toString().padStart(2, '0');
  const dateKey = `${y}-${m}-${dayStr}`;

  const p = calculatePanchangamForDay(dateKey);
  days[dateKey] = p;
}

const outputPath = path.resolve(process.cwd(), 'src/engine/precomputed2027.json');
fs.writeFileSync(outputPath, JSON.stringify(days, null, 2), 'utf-8');
console.log(`Successfully generated 365 days for 2027 at ${outputPath}`);
