import { PanchangamDay } from './types';

/**
 * Sanskrit forms of Tithis, Varas, Months, and Ritus for authentic Hindu Puja Sankalpam.
 */
const TITHI_SANSKRIT: Record<number, string> = {
  1: 'ప్రథమాయాం',
  2: 'ద్వితీయాయాం',
  3: 'తృతీయాయాం',
  4: 'చతుర్థ్యాం',
  5: 'పంచమ్యాం',
  6: 'షష్ఠ్యాం',
  7: 'సప్తమ్యాం',
  8: 'అష్టమ్యాం',
  9: 'నవమ్యాం',
  10: 'దశమ్యాం',
  11: 'ఏకాదశ్యాం',
  12: 'ద్వాదశ్యాం',
  13: 'త్రయోదశ్యాం',
  14: 'చతుర్దశ్యాం',
  15: 'పూర్ణిమాయాం',
  16: 'ప్రథమాయాం',
  17: 'ద్వితీయాయాం',
  18: 'తృతీయాయాం',
  19: 'చతుర్థ్యాం',
  20: 'పంచమ్యాం',
  21: 'షష్ఠ్యాం',
  22: 'సప్తమ్యాం',
  23: 'అష్టమ్యాం',
  24: 'నవమ్యాం',
  25: 'దశమ్యాం',
  26: 'ఏకాదశ్యాం',
  27: 'ద్వాదశ్యాం',
  28: 'త్రయోదశ్యాం',
  29: 'చతుర్దశ్యాం',
  30: 'అమావాస్యాయాం',
};

const VARA_SANSKRIT: Record<number, string> = {
  0: 'భానువాసరే',
  1: 'ఇందువాసరే (సోమవాసరే)',
  2: 'భౌమవాసరే (మంగళవాసరే)',
  3: 'సౌమ్యవాసరే (బుధవాసరే)',
  4: 'బృహస్పతివాసరే (గురువాసరే)',
  5: 'భార్గవవాసరే (శుక్రవాసరే)',
  6: 'స్థిరవాసరే (శనివాసరే)',
};

const NAKSHATRA_SANSKRIT: Record<number, string> = {
  1: 'అశ్వినీ నక్షత్ర యుక్తాయాం',
  2: 'భరణీ నక్షత్ర యుక్తాయాం',
  3: 'కృత్తికా నక్షత్ర యుక్తాయాం',
  4: 'రోహిణీ నక్షత్ర యుక్తాయాం',
  5: 'మృగశిరా నక్షత్ర యుక్తాయాం',
  6: 'ఆర్ద్రా నక్షత్ర యుక్తాయాం',
  7: 'పునర్వసు నక్షత్ర యుక్తాయాం',
  8: 'పుష్యమీ నక్షత్ర యుక్తాయాం',
  9: 'ఆశ్లేషా నక్షత్ర యుక్తాయాం',
  10: 'మఘా నక్షత్ర యుక్తాయాం',
  11: 'పూర్వఫల్గునీ నక్షత్ర యుక్తాయాం',
  12: 'ఉత్తరఫల్గునీ నక్షత్ర యుక్తాయాం',
  13: 'హస్తా నక్షత్ర యుక్తాయాం',
  14: 'చిత్రా నక్షత్ర యుక్తాయాం',
  15: 'స్వాతి నక్షత్ర యుక్తాయాం',
  16: 'విశాఖా నక్షత్ర యుక్తాయాం',
  17: 'అనూరాధా నక్షత్ర యుక్తాయాం',
  18: 'జ్యేష్ఠా నక్షత్ర యుక్తాయాం',
  19: 'మూలా నక్షత్ర యుక్తాయాం',
  20: 'పూర్వాషాఢా నక్షత్ర యుక్తాయాం',
  21: 'ఉత్తరాషాఢా నక్షత్ర యుక్తాయాం',
  22: 'శ్రవణా నక్షత్ర యుక్తాయాం',
  23: 'ధనిష్ఠా నక్షత్ర యుక్తాయాం',
  24: 'శతభిషక్ నక్షత్ర యుక్తాయాం',
  25: 'పూర్వాభాద్రా నక్షత్ర యుక్తాయాం',
  26: 'ఉత్తరాభాద్రా నక్షత్ర యుక్తాయాం',
  27: 'రేవతీ నక్షత్ర యుక్తాయాం',
};

/**
 * Generates traditional Vedic Puja Sankalpam for the given day
 */
export function generateSankalpam(day: PanchangamDay): {
  sanskritTelugu: string;
  simpleTelugu: string;
  english: string;
} {
  const tithiSanskrit = TITHI_SANSKRIT[day.tithi.number] || 'శుభతిథౌ';
  const varaSanskrit = VARA_SANSKRIT[day.dayOfWeek] || 'శుభవాసరే';
  const nakshatraSanskrit = NAKSHATRA_SANSKRIT[day.nakshatra.number] || 'శుభనక్షత్రే';
  const pakshaSanskrit = day.paksha === 'Shukla' ? 'శుక్ల పక్షే' : 'కృష్ణ పక్షే';
  const ayanaSanskrit = day.ayanaTelugu === 'ఉత్తరాయణం' ? 'ఉత్తరాయణే' : 'దక్షిణాయనే';

  const sanskritTelugu = `మమోపాత్త దురితక్షయ ద్వారా శ్రీపరమేశ్వర ప్రీత్యర్థం (శ్రీమన్నారాయణ ప్రీత్యర్థం), శుభే శోభనే ముహూర్తే, శ్రీ మహావిష్ణోరాజ్ఞయా ప్రవర్తమానస్య, అద్య బ్రహ్మణః ద్వితీయ పరార్థే, శ్వేతవరాహ కల్పే, వైవస్వత మన్వంతరే, కలియుగే, ప్రథమ పాదే, జంబూద్వీపే, భరతవర్షే, భరతఖండే, మేరోర్దక్షిణ దిగ్భాగే, శ్రీశైలస్య ఈశాన్య ప్రదేశే (స్వగృహే/పుణ్యప్రదేశే), సమస్త దేవతా బ్రాహ్మణ హరిహర సన్నిధౌ, అస్మిన్ వర్తమానే వ్యావహారిక చాంద్రమానేన:

శ్రీ ${day.samvatsaraTelugu} నామ సంవత్సరే,
${ayanaSanskrit},
${day.rituTelugu.replace('ఋతువు', 'ఋతౌ')},
${day.monthTelugu.replace('ము', 'మాసే')},
${pakshaSanskrit},
${tithiSanskrit} తిథౌ,
${varaSanskrit},
${nakshatraSanskrit},
శుభయోగే, శుభకరణే, ఏవంగుణ విశేషణ విశిష్టాయాం, శుభతిథౌ, శ్రీమాన్ (మీ పేరు) గోత్రస్య (మీ గోత్రం), ధర్మపత్నీ సమేతస్య, మమ సకుటుంబస్య క్షేమ స్థైర్య ధైర్య విజయ అభయ ఆయురారోగ్య ఐశ్వర్యాభివృద్ధ్యర్థం, ధర్మార్ధ కామ మోక్ష చతుర్విధ పురుషార్థ ఫలసిద్ధ్యర్థం, ఇష్టకామ్యార్థ సిద్ధ్యర్థం, శ్రీ దైవ ప్రీత్యర్థం సంకల్పిత పూజాం కరిష్యే.`;

  const simpleTelugu = `నేటి సంకల్ప వివరాలు:
• సంవత్సరం: శ్రీ ${day.samvatsaraTelugu} నామ సంవత్సరం
• అయనం: ${day.ayanaTelugu}
• ఋతువు: ${day.rituTelugu}
• మాసం: ${day.monthTelugu}
• పక్షం: ${day.pakshaTelugu}
• తిథి: ${day.tithi.nameTelugu} (${day.tithi.endTime ? day.tithi.endTime.formatted12 + ' వరకు' : 'రోజంతా'})
• వారం: ${day.varaTelugu}
• నక్షత్రం: ${day.nakshatra.nameTelugu} (${day.nakshatra.pada}వ పాదం)
• యోగం: ${day.yoga.nameTelugu} | కరణం: ${day.karana.nameTelugu}
• సూర్యోదయం: ${day.sunrise.formatted12} | సూర్యాస్తమయం: ${day.sunset.formatted12}`;

  const english = `Daily Puja Sankalpa Summary:
• Samvatsara: ${day.samvatsaraEnglish}
• Ayana: ${day.ayanaEnglish}
• Ritu: ${day.rituEnglish}
• Month: ${day.monthEnglish}
• Paksha: ${day.paksha} Paksha
• Tithi: ${day.tithi.nameEnglish}
• Vara: ${day.varaEnglish}
• Nakshatra: ${day.nakshatra.nameEnglish} (Pada ${day.nakshatra.pada})
• Sunrise: ${day.sunrise.formatted12} | Sunset: ${day.sunset.formatted12}`;

  return { sanskritTelugu, simpleTelugu, english };
}

/**
 * Calculates Tarabalam (9 Taras) based on Janma Nakshatra and Day's Nakshatra
 */
export const TARA_DEFINITIONS = [
  { no: 1, nameTelugu: 'జన్మ తార', nameEnglish: 'Janma Tara', isGood: false, descTelugu: 'శరీర శ్రమ, సున్నితమైన పనులు ఆచితూచి చేయాలి' },
  { no: 2, nameTelugu: 'సంపత్ తార', nameEnglish: 'Sampat Tara', isGood: true, descTelugu: 'ధనలాభం, నూతన కార్యారంభం, శుభప్రదం' },
  { no: 3, nameTelugu: 'విపత్ తార', nameEnglish: 'Vipat Tara', isGood: false, descTelugu: 'విఘ్నాలు, నూతన పనులు వాయిదా వేయాలి' },
  { no: 4, nameTelugu: 'క్షేమ తార', nameEnglish: 'Kshema Tara', isGood: true, descTelugu: 'క్షేమం, ఆరోగ్యం, శుభకార్యాలకు అత్యంత శ్రేష్టం' },
  { no: 5, nameTelugu: 'ప్రత్యక్ తార', nameEnglish: 'Pratyak Tara', isGood: false, descTelugu: 'అవరోధాలు, ప్రయాణాలు విడనాడండి' },
  { no: 6, nameTelugu: 'సాధన తార', nameEnglish: 'Sadhana Tara', isGood: true, descTelugu: 'కార్యసిద్ధి, ఉద్యోగం, విద్య, వ్యాపార జయం' },
  { no: 7, nameTelugu: 'నైధన తార', nameEnglish: 'Naidhana Tara', isGood: false, descTelugu: 'అశుభం, ప్రయాణాలు, ముహూర్తాలు నిషిద్ధం' },
  { no: 8, nameTelugu: 'మిత్ర తార', nameEnglish: 'Mitra Tara', isGood: true, descTelugu: 'సంతోషం, మిత్రుల సహకారం, శుభప్రదం' },
  { no: 9, nameTelugu: 'పరమ మిత్ర తార', nameEnglish: 'Parama Mitra Tara', isGood: true, descTelugu: 'అఖండ విజయం, సకల శుభకార్య ప్రదం' },
];

export function calculateTarabalam(janmaNakshatraNo: number, dayNakshatraNo: number) {
  // Count from Janma Nakshatra to Day Nakshatra inclusive
  let diff = dayNakshatraNo - janmaNakshatraNo + 1;
  if (diff <= 0) diff += 27;

  let taraIndex = diff % 9;
  if (taraIndex === 0) taraIndex = 9;

  return TARA_DEFINITIONS[taraIndex - 1];
}
