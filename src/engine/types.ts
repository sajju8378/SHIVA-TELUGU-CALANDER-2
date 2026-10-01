export type Paksha = 'Shukla' | 'Krishna';

export interface TimeString {
  hour: number;
  minute: number;
  second: number;
  formatted12: string; // e.g. "06:14 AM"
  formatted24: string; // e.g. "06:14"
}

export interface Period {
  start: TimeString;
  end: TimeString;
  formatted: string; // e.g. "07:30 AM - 09:00 AM"
}

export interface TithiInfo {
  number: number; // 1 to 30 (1-15 Shukla, 16-30 Krishna)
  nameTelugu: string;
  nameEnglish: string;
  paksha: Paksha;
  pakshaTelugu: string;
  endTime?: TimeString;
  nextTithi?: {
    number: number;
    nameTelugu: string;
    nameEnglish: string;
  };
  isKshaya?: boolean;
  isVriddhi?: boolean;
}

export interface NakshatraInfo {
  number: number; // 1 to 27
  nameTelugu: string;
  nameEnglish: string;
  pada: number; // 1 to 4
  endTime?: TimeString;
}

export interface YogaInfo {
  number: number; // 1 to 27
  nameTelugu: string;
  nameEnglish: string;
  endTime?: TimeString;
}

export interface KaranaInfo {
  number: number; // 1 to 60 (or 1 to 11 name index)
  nameTelugu: string;
  nameEnglish: string;
  endTime?: TimeString;
}

export interface MuhurtamTimings {
  rahuKalam: Period;
  yamagandam: Period;
  gulikaKalam: Period;
  durmuhurtam: Period[];
  varjyam: Period[];
  abhijitMuhurtam: Period | null;
  amritaKalam: Period | null;
  brahmaMuhurtam: Period;
}

export interface FestivalItem {
  id: string;
  nameTelugu: string;
  nameEnglish: string;
  category: 'major' | 'vratam' | 'ekadashi' | 'jayanti' | 'other';
  ruleDescriptionTelugu: string;
  ruleDescriptionEnglish: string;
  date: string; // YYYY-MM-DD
  tithi?: string;
  significanceTelugu?: string;
  significanceEnglish?: string;
}

export interface PanchangamDay {
  date: string; // YYYY-MM-DD
  dayOfWeek: number; // 0 = Sunday, 1 = Monday, ...
  varaTelugu: string;
  varaEnglish: string;
  samvatsaraTelugu: string;
  samvatsaraEnglish: string;
  samvatsaraNumber: number; // 1 to 60
  ayanaTelugu: string;
  ayanaEnglish: string;
  rituTelugu: string;
  rituEnglish: string;
  monthTelugu: string;
  monthEnglish: string;
  isAdhikaMonth?: boolean;
  paksha: Paksha;
  pakshaTelugu: string;
  teluguDateDisplay: string; // e.g. "ప్లవంగ నామ సం॥ చైత్ర శుద్ధ పాడ్యమి"
  
  // Astronomical Sun/Moon
  sunrise: TimeString;
  sunset: TimeString;
  moonrise?: TimeString;
  moonset?: TimeString;
  sunSignTelugu: string;
  sunSignEnglish: string;
  moonSignTelugu: string;
  moonSignEnglish: string;
  
  // Pancha Angas (5 limbs)
  tithi: TithiInfo;
  nakshatra: NakshatraInfo;
  yoga: YogaInfo;
  karana: KaranaInfo;
  
  // Auspicious / Inauspicious
  timings: MuhurtamTimings;
  
  // Markers & Special Events
  isPournami: boolean;
  isAmavasya: boolean;
  festivals: FestivalItem[];
  
  // Location and Settings
  location: {
    cityName: string;
    latitude: number;
    longitude: number;
    timezone: string;
  };
  settings: {
    ayanamsa: string;
    ayanamsaValueDeg: number;
    monthSystem: 'Amanta';
    dayStartConvention: 'Sunrise';
  };
}

export interface CityOption {
  id: string;
  nameTelugu: string;
  nameEnglish: string;
  state: string;
  latitude: number;
  longitude: number;
}
