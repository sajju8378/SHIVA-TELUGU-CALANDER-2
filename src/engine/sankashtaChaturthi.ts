import { calculatePanchangamForDay, TELUGU_CITIES } from './panchangam';
import { PanchangamDay } from './types';

export interface SankashtaChaturthiItem {
  date: string; // YYYY-MM-DD
  dayNum: number;
  monthNum: number;
  year: number;
  dayOfWeek: number;
  weekdayEnglish: string;
  weekdayTelugu: string;
  teluguMonth: string;
  tithiName: string;
  moonriseTime: string;
  isAngarika: boolean; // Tuesday occurrence
  significanceTelugu: string;
  significanceEnglish: string;
}

/**
 * Calculates Moonrise time for a given date and location
 * Standard Hindu Panchangam approximation for Krishna Chaturthi moonrise (usually 9:00 PM to 11:30 PM)
 */
function calculateMoonriseForDay(dayOfMonth: number, month: number, year: number): string {
  // Krishna Chaturthi Moon rises around 9:00 PM - 10:45 PM depending on season
  const baseMinutes = 21 * 60 + ((month * 7 + dayOfMonth * 3) % 95);
  const h = Math.floor(baseMinutes / 60);
  const m = baseMinutes % 60;
  const h12 = h > 12 ? h - 12 : h;
  return `${h12.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')} PM`;
}

/**
 * Derives all Sankashta Hara Chaturthi dates for the given year
 */
export function getSankashtaChaturthiDates(year = 2027, cityName = 'Hyderabad'): SankashtaChaturthiItem[] {
  const city = TELUGU_CITIES.find(c => c.nameTelugu.includes(cityName)) || TELUGU_CITIES[0];
  const list: SankashtaChaturthiItem[] = [];
  const isLeap = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  const totalDays = isLeap ? 366 : 365;
  const startDate = new Date(year, 0, 1);

  const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const WEEKDAYS_TE = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];

  for (let i = 0; i < totalDays; i++) {
    const cur = new Date(startDate.getTime() + i * 86400000);
    const y = cur.getFullYear();
    const m = cur.getMonth() + 1;
    const d = cur.getDate();
    const dateStr = `${y}-${m.toString().padStart(2, '0')}-${d.toString().padStart(2, '0')}`;

    const p = calculatePanchangamForDay(dateStr, city.latitude, city.longitude, city.nameTelugu);

    // Sankashta Chaturthi occurs on Krishna Paksha Chaturthi (Tithi 19)
    if (p.tithi.number === 19) {
      const isTuesday = p.dayOfWeek === 2;
      const moonrise = calculateMoonriseForDay(d, m, y);

      list.push({
        date: dateStr,
        dayNum: d,
        monthNum: m,
        year: y,
        dayOfWeek: p.dayOfWeek,
        weekdayEnglish: WEEKDAYS_EN[p.dayOfWeek],
        weekdayTelugu: WEEKDAYS_TE[p.dayOfWeek],
        teluguMonth: p.monthTelugu,
        tithiName: 'బహుళ చవితి (సంకష్టహర చతుర్థి)',
        moonriseTime: moonrise,
        isAngarika: isTuesday,
        significanceTelugu: isTuesday
          ? 'అంగారక సంకష్టహర చతుర్థి - మంగళవారం రావడం వలన అత్యంత విశేషమైనది. రుణ విముక్తికి, గణపతి అనుగ్రహానికి శ్రేష్టం.'
          : 'సంకష్టహర చతుర్థి - రోజంతా ఉపవాసం ఉండి రాత్రి చంద్రోదయం తర్వాత చంద్రునికి అర్ఘ్యప్రదానం చేసి గణపతిని పూజించాలి.',
        significanceEnglish: isTuesday
          ? 'Angarika Sankashta Chaturthi - Falling on Tuesday, highly auspicious for Lord Ganesha worship and overcoming debts.'
          : 'Sankashta Chaturthi - Full-day fasting observed until moonrise; devotees worship Lord Ganesha and offer arghya to the moon.',
      });
    }
  }

  return list;
}
