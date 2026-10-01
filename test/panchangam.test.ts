import { calculatePanchangamForDay, getSamvatsara, SAMVATSARA_NAMES } from '../src/engine/panchangam';
import { getLahiriAyanamsa, gregorianToJD, calculateSunTimes } from '../src/engine/astronomy';

console.log('--- STARTING TELUGU PANCHANGAM TESTS ---');

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, details?: any) {
  if (condition) {
    passCount++;
    console.log(`[PASS] ${testName}`);
  } else {
    failCount++;
    console.error(`[FAIL] ${testName}`, details || '');
  }
}

// TEST 1: Samvatsara 60-year mathematical cycle
console.log('\n--- 1. SAMVATSARA CYCLE TESTS ---');
const samvatsara2024 = getSamvatsara(2024, false);
assert(samvatsara2024.no === 38 && samvatsara2024.english === 'Krodhi', '2024 Ugadi is Krodhi (No 38)');

const samvatsara2025 = getSamvatsara(2025, false);
assert(samvatsara2025.no === 39 && samvatsara2025.english === 'Vishvavasu', '2025 Ugadi is Vishvavasu (No 39)');

const samvatsara2026 = getSamvatsara(2026, false);
assert(samvatsara2026.no === 40 && samvatsara2026.english === 'Parabhava', '2026 Ugadi is Parabhava (No 40)');

const samvatsara2027BeforeUgadi = getSamvatsara(2027, true);
assert(samvatsara2027BeforeUgadi.no === 40 && samvatsara2027BeforeUgadi.telugu === 'పరాభవ', '2027 Before Ugadi is Parabhava (No 40)');

const samvatsara2027AfterUgadi = getSamvatsara(2027, false);
assert(samvatsara2027AfterUgadi.no === 41 && samvatsara2027AfterUgadi.telugu === 'ప్లవంగ', '2027 Ugadi onwards is Plavanga (No 41 - ప్లవంగ)');

// TEST 2: Lahiri Ayanamsa accuracy
console.log('\n--- 2. LAHIRI AYANAMSA TESTS ---');
const j2000 = gregorianToJD(2000, 1, 1, 12, 0, 0);
const ayanamsa2000 = getLahiriAyanamsa(j2000);
assert(Math.abs(ayanamsa2000 - 23.857) < 0.05, `Lahiri Ayanamsa at J2000 is ~23.857° (got ${ayanamsa2000.toFixed(4)}°)`);

const j2027 = gregorianToJD(2027, 1, 1, 0, 0, 0);
const ayanamsa2027 = getLahiriAyanamsa(j2027);
assert(ayanamsa2027 > 24.2 && ayanamsa2027 < 24.3, `Lahiri Ayanamsa in 2027 is ~24.23° (got ${ayanamsa2027.toFixed(4)}°)`);

// TEST 3: Sunrise & Sunset calculations for Hyderabad
console.log('\n--- 3. SUNRISE / SUNSET TESTS (HYDERABAD) ---');
const sunTimes = calculateSunTimes(2027, 1, 15, 17.385, 78.486, 5.5);
assert(sunTimes.sunriseHours >= 6.4 && sunTimes.sunriseHours <= 6.9, `Hyderabad Sankranti Sunrise ~6:40 AM (got ${sunTimes.sunriseHours.toFixed(2)}h)`);
assert(sunTimes.sunsetHours >= 17.9 && sunTimes.sunsetHours <= 18.3, `Hyderabad Sankranti Sunset ~6:05 PM (got ${sunTimes.sunsetHours.toFixed(2)}h)`);

// TEST 4: Golden Date Checks across 2027
console.log('\n--- 4. GOLDEN DATES TESTS (2027) ---');

// Makara Sankranti (Jan 15, 2027)
const pSankranti = calculatePanchangamForDay('2027-01-15');
assert(pSankranti.festivals.some(f => f.id === 'makara-sankranti'), 'Jan 15, 2027 has Makara Sankranti festival');
assert(pSankranti.ayanaTelugu === 'ఉత్తరాయణం', 'Jan 15, 2027 is Uttarayana');

// Ugadi 2027
const pUgadi = calculatePanchangamForDay('2027-04-07');
assert(pUgadi.samvatsaraTelugu === 'ప్లవంగ', 'April 7, 2027 has Plavanga Samvatsaram');
assert(pUgadi.festivals.some(f => f.id === 'ugadi'), 'April 7, 2027 has Ugadi festival (Chaitra Shukla Pratipada)');

// Sri Rama Navami 2027
const pRamaNavami = calculatePanchangamForDay('2027-04-15');
assert(pRamaNavami.festivals.some(f => f.id === 'sri-rama-navami'), 'April 15, 2027 has Sri Rama Navami');

// Vinayaka Chavithi 2027
const pGanesh = calculatePanchangamForDay('2027-09-04');
assert(pGanesh.festivals.some(f => f.id === 'vinayaka-chavithi'), 'Sept 4, 2027 has Vinayaka Chavithi (Bhadrapada Chavithi)');

// Vijayadashami / Dasara 2027
const pDasara = calculatePanchangamForDay('2027-10-10');
assert(pDasara.festivals.some(f => f.id === 'vijayadashami-dasara'), 'Oct 10, 2027 has Vijayadashami / Dasara');

// Deepavali 2027
const pDiwali = calculatePanchangamForDay('2027-10-29');
assert(pDiwali.festivals.some(f => f.id === 'deepavali'), 'Oct 29, 2027 has Deepavali festival');

// TEST 5: Rahu Kalam & Muhurtam Timing Rules
console.log('\n--- 5. RAHU KALAM / YAMAGANDAM TESTS ---');
// Sunday test
const pSunday = calculatePanchangamForDay('2027-01-03'); // Jan 3, 2027 is Sunday
assert(pSunday.dayOfWeek === 0, 'Jan 3, 2027 is Sunday');
// Sunday Rahu Kalam is 8th part (approx 16:30 - 18:00)
assert(pSunday.timings.rahuKalam.start.hour >= 16, `Sunday Rahu Kalam starts after 16:00 (got ${pSunday.timings.rahuKalam.formatted})`);

// Wednesday test: Abhijit Muhurtam should be null (prohibited on Wednesday in Telugu tradition)
const pWednesday = calculatePanchangamForDay('2027-01-06'); // Jan 6, 2027 is Wednesday
assert(pWednesday.dayOfWeek === 3, 'Jan 6, 2027 is Wednesday');
assert(pWednesday.timings.abhijitMuhurtam === null, 'Wednesday Abhijit Muhurtam is properly omitted');

// TEST 6: Full Year Consistency Test across all 365 days of 2027
console.log('\n--- 6. FULL YEAR 2027 CONSISTENCY TEST (365 DAYS) ---');
let invalidDays = 0;
let pournamiCount = 0;
let amavasyaCount = 0;

const startDate = new Date(2027, 0, 1);
for (let d = 0; d < 365; d++) {
  const cur = new Date(startDate.getTime() + d * 86400000);
  const y = cur.getFullYear();
  const m = (cur.getMonth() + 1).toString().padStart(2, '0');
  const dayStr = cur.getDate().toString().padStart(2, '0');
  const dStr = `${y}-${m}-${dayStr}`;

  const p = calculatePanchangamForDay(dStr);

  if (!p.tithi || p.tithi.number < 1 || p.tithi.number > 30) invalidDays++;
  if (!p.nakshatra || p.nakshatra.number < 1 || p.nakshatra.number > 27) invalidDays++;
  if (p.nakshatra.pada < 1 || p.nakshatra.pada > 4) invalidDays++;
  if (!p.timings.rahuKalam || !p.timings.yamagandam || !p.timings.gulikaKalam) invalidDays++;

  if (p.isPournami) pournamiCount++;
  if (p.isAmavasya) amavasyaCount++;
}

assert(invalidDays === 0, `All 365 days of 2027 calculated consistently without errors (invalid: ${invalidDays})`);
assert(pournamiCount >= 12 && pournamiCount <= 13, `Pournamis in 2027 count = ${pournamiCount} (expected 12-13)`);
assert(amavasyaCount >= 12 && amavasyaCount <= 13, `Amavasyas in 2027 count = ${amavasyaCount} (expected 12-13)`);

console.log(`\n========================================`);
console.log(`TOTAL PASS: ${passCount} | TOTAL FAIL: ${failCount}`);
console.log(`========================================`);

if (failCount > 0) {
  process.exit(1);
} else {
  console.log('ALL PANCHANGAM TESTS PASSED SUCCESSFULLY!');
}
