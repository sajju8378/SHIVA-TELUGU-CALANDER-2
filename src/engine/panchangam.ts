/**
 * Authentic Telugu Hindu Panchangam Engine
 * Strictly follows Amanta Lunar System, Lahiri Chitrapaksha Ayanamsa,
 * and Sunrise-to-Sunrise Vara Convention.
 */

import {
  CityOption,
  KaranaInfo,
  MuhurtamTimings,
  NakshatraInfo,
  Paksha,
  PanchangamDay,
  Period,
  TimeString,
  TithiInfo,
  YogaInfo,
} from './types';
import {
  calculateSunTimes,
  findTransitionJD,
  getLahiriAyanamsa,
  getSiderealPositions,
  getSunTropicalLongitude,
  gregorianToJD,
  hoursToTimeString,
  jdToGregorian,
  normalizeDeg,
} from './astronomy';
import { getFestivalsForDay } from './festivals';

export const TELUGU_CITIES: CityOption[] = [
  { id: 'hyderabad', nameTelugu: 'హైదరాబాద్ (తెలంగాణ)', nameEnglish: 'Hyderabad (Telangana)', state: 'Telangana', latitude: 17.385044, longitude: 78.486671 },
  { id: 'vijayawada', nameTelugu: 'విజయవాడ (ఆంధ్రప్రదేశ్)', nameEnglish: 'Vijayawada (Andhra Pradesh)', state: 'Andhra Pradesh', latitude: 16.506174, longitude: 80.648015 },
  { id: 'visakhapatnam', nameTelugu: 'విశాఖపట్నం (ఆంధ్రప్రదేశ్)', nameEnglish: 'Visakhapatnam (Andhra Pradesh)', state: 'Andhra Pradesh', latitude: 17.686816, longitude: 83.218482 },
  { id: 'tirupati', nameTelugu: 'తిరుపతి (ఆంధ్రప్రదేశ్)', nameEnglish: 'Tirupati (Andhra Pradesh)', state: 'Andhra Pradesh', latitude: 13.628756, longitude: 79.419179 },
  { id: 'warangal', nameTelugu: 'వరంగల్ (తెలంగాణ)', nameEnglish: 'Warangal (Telangana)', state: 'Telangana', latitude: 17.968901, longitude: 79.594055 },
  { id: 'guntur', nameTelugu: 'గుంటూరు (ఆంధ్రప్రదేశ్)', nameEnglish: 'Guntur (Andhra Pradesh)', state: 'Andhra Pradesh', latitude: 16.306652, longitude: 80.436540 },
  { id: 'rajahmundry', nameTelugu: 'రాజమండ్రి (ఆంధ్రప్రదేశ్)', nameEnglish: 'Rajahmundry (Andhra Pradesh)', state: 'Andhra Pradesh', latitude: 17.000538, longitude: 81.804034 },
  { id: 'bengaluru', nameTelugu: 'బెంగళూరు (కర్ణాటక)', nameEnglish: 'Bengaluru (Karnataka)', state: 'Karnataka', latitude: 12.971599, longitude: 77.594563 },
  { id: 'chennai', nameTelugu: 'చెన్నై (తమిళనాడు)', nameEnglish: 'Chennai (Tamil Nadu)', state: 'Tamil Nadu', latitude: 13.082680, longitude: 80.270718 },
  { id: 'newdelhi', nameTelugu: 'న్యూఢిల్లీ (భారత్)', nameEnglish: 'New Delhi (India)', state: 'Delhi', latitude: 28.613939, longitude: 77.209021 },
];

export const SAMVATSARA_NAMES = [
  { no: 1, telugu: 'ప్రభవ', english: 'Prabhava' },
  { no: 2, telugu: 'విభవ', english: 'Vibhava' },
  { no: 3, telugu: 'శుక్ల', english: 'Shukla' },
  { no: 4, telugu: 'ప్రమోదూత', english: 'Pramodoota' },
  { no: 5, telugu: 'ప్రజోత్పత్తి', english: 'Prajotpatti' },
  { no: 6, telugu: 'అంగీరస', english: 'Angirasa' },
  { no: 7, telugu: 'శ్రీముఖ', english: 'Srimukha' },
  { no: 8, telugu: 'భావ', english: 'Bhava' },
  { no: 9, telugu: 'యువ', english: 'Yuva' },
  { no: 10, telugu: 'ధాత', english: 'Dhatri/Dhata' },
  { no: 11, telugu: 'ఈశ్వర', english: 'Ishvara' },
  { no: 12, telugu: 'బహుధాన్య', english: 'Bahudhanya' },
  { no: 13, telugu: 'ప్రమాథి', english: 'Pramathi' },
  { no: 14, telugu: 'విక్రమ', english: 'Vikrama' },
  { no: 15, telugu: 'వృష', english: 'Vrisha' },
  { no: 16, telugu: 'చిత్రభాను', english: 'Chitrabhanu' },
  { no: 17, telugu: 'స్వభాను', english: 'Subhanu' },
  { no: 18, telugu: 'తారణ', english: 'Tharana' },
  { no: 19, telugu: 'పార్థివ', english: 'Parthiva' },
  { no: 20, telugu: 'వ్యయ', english: 'Vyaya' },
  { no: 21, telugu: 'సర్వజిత్తు', english: 'Sarvajittu' },
  { no: 22, telugu: 'సర్వధారి', english: 'Sarvadhari' },
  { no: 23, telugu: 'విరోధి', english: 'Virodhi' },
  { no: 24, telugu: 'వికృతి', english: 'Vikruthi' },
  { no: 25, telugu: 'ఖర', english: 'Khara' },
  { no: 26, telugu: 'నందన', english: 'Nandana' },
  { no: 27, telugu: 'విజయ', english: 'Vijaya' },
  { no: 28, telugu: 'జయ', english: 'Jaya' },
  { no: 29, telugu: 'మన్మథ', english: 'Manmatha' },
  { no: 30, telugu: 'దుర్ముఖి', english: 'Durmukhi' },
  { no: 31, telugu: 'హేవిళంబి', english: 'Hevilambi' },
  { no: 32, telugu: 'విళంబి', english: 'Vilambi' },
  { no: 33, telugu: 'వికారి', english: 'Vikari' },
  { no: 34, telugu: 'శార్వరి', english: 'Sharvari' },
  { no: 35, telugu: 'ప్లవ', english: 'Plava' },
  { no: 36, telugu: 'శుభకృతు', english: 'Shubhakritu' },
  { no: 37, telugu: 'శోభకృతు', english: 'Sobhakritu' },
  { no: 38, telugu: 'క్రోధినామ', english: 'Krodhi' },
  { no: 39, telugu: 'విశ్వావసు', english: 'Vishvavasu' },
  { no: 40, telugu: 'పరాభవ', english: 'Parabhava' },
  { no: 41, telugu: 'ప్లవంగ', english: 'Plavanga' },
  { no: 42, telugu: 'కీలక', english: 'Keelaka' },
  { no: 43, telugu: 'సౌమ్య', english: 'Saumya' },
  { no: 44, telugu: 'సాధారణ', english: 'Sadharana' },
  { no: 45, telugu: 'విరోధికృతు', english: 'Virodhikritu' },
  { no: 46, telugu: 'పరీధావి', english: 'Paridhavi' },
  { no: 47, telugu: 'ప్రమాదీచ', english: 'Pramadicha' },
  { no: 48, telugu: 'ఆనంద', english: 'Ananda' },
  { no: 49, telugu: 'రాక్షస', english: 'Rakshasa' },
  { no: 50, telugu: 'నల', english: 'Nala' },
  { no: 51, telugu: 'పింగళ', english: 'Pingala' },
  { no: 52, telugu: 'కాళయుక్తి', english: 'Kalayukthi' },
  { no: 53, telugu: 'సిద్ధార్థి', english: 'Siddharthi' },
  { no: 54, telugu: 'రౌద్రి', english: 'Raudra' },
  { no: 55, telugu: 'దుర్మతి', english: 'Durmathi' },
  { no: 56, telugu: 'దుందుభి', english: 'Dundubhi' },
  { no: 57, telugu: 'రుధిరోద్గారి', english: 'Rudhirodgari' },
  { no: 58, telugu: 'రక్తాక్షి', english: 'Raktakshi' },
  { no: 59, telugu: 'క్రోధన', english: 'Krodhana' },
  { no: 60, telugu: 'అక్షయ', english: 'Kshaya/Akshaya' },
];

export const TELUGU_MONTHS = [
  { no: 1, telugu: 'చైత్రము', english: 'Chaitramu', rituTelugu: 'వసంత ఋతువు', rituEnglish: 'Vasanta Ritu' },
  { no: 2, telugu: 'వైశాఖము', english: 'Vaishakhamu', rituTelugu: 'వసంత ఋతువు', rituEnglish: 'Vasanta Ritu' },
  { no: 3, telugu: 'జ్యేష్ఠము', english: 'Jyeshthamu', rituTelugu: 'గ్రీష్మ ఋతువు', rituEnglish: 'Greeshma Ritu' },
  { no: 4, telugu: 'ఆషాఢము', english: 'Ashadhamu', rituTelugu: 'గ్రీష్మ ఋతువు', rituEnglish: 'Greeshma Ritu' },
  { no: 5, telugu: 'శ్రావణము', english: 'Shravanamu', rituTelugu: 'వర్ష ఋతువు', rituEnglish: 'Varsha Ritu' },
  { no: 6, telugu: 'భాద్రపదము', english: 'Bhadrapadamu', rituTelugu: 'వర్ష ఋతువు', rituEnglish: 'Varsha Ritu' },
  { no: 7, telugu: 'ఆశ్వయుజము', english: 'Ashwayujamu', rituTelugu: 'శరద్ ఋతువు', rituEnglish: 'Sharad Ritu' },
  { no: 8, telugu: 'కార్తీకము', english: 'Karthikamu', rituTelugu: 'శరద్ ఋతువు', rituEnglish: 'Sharad Ritu' },
  { no: 9, telugu: 'మార్గశిరము', english: 'Margashiramu', rituTelugu: 'హేమంత ఋతువు', rituEnglish: 'Hemanta Ritu' },
  { no: 10, telugu: 'పుష్యము', english: 'Pushyamu', rituTelugu: 'హేమంత ఋతువు', rituEnglish: 'Hemanta Ritu' },
  { no: 11, telugu: 'మాఘము', english: 'Maghamu', rituTelugu: 'శిశిర ఋతువు', rituEnglish: 'Shishira Ritu' },
  { no: 12, telugu: 'ఫాల్గుణము', english: 'Phalgunamu', rituTelugu: 'శిశిర ఋతువు', rituEnglish: 'Shishira Ritu' },
];

export const TITHI_NAMES = [
  { no: 1, telugu: 'పాడ్యమి', english: 'Pratipada / Padyami', paksha: 'Shukla' },
  { no: 2, telugu: 'విదియ', english: 'Vidiya / Dwitiya', paksha: 'Shukla' },
  { no: 3, telugu: 'తదియ', english: 'Tadiya / Tritiya', paksha: 'Shukla' },
  { no: 4, telugu: 'చవితి', english: 'Chavithi / Chaturthi', paksha: 'Shukla' },
  { no: 5, telugu: 'పంచమి', english: 'Panchami', paksha: 'Shukla' },
  { no: 6, telugu: 'షష్ఠి', english: 'Shashti', paksha: 'Shukla' },
  { no: 7, telugu: 'సప్తమి', english: 'Saptami', paksha: 'Shukla' },
  { no: 8, telugu: 'అష్టమి', english: 'Ashtami', paksha: 'Shukla' },
  { no: 9, telugu: 'నవమి', english: 'Navami', paksha: 'Shukla' },
  { no: 10, telugu: 'దశమి', english: 'Dashami', paksha: 'Shukla' },
  { no: 11, telugu: 'ఏకాదశి', english: 'Ekadashi', paksha: 'Shukla' },
  { no: 12, telugu: 'ద్వాదశి', english: 'Dwadashi', paksha: 'Shukla' },
  { no: 13, telugu: 'త్రయోదశి', english: 'Trayodashi', paksha: 'Shukla' },
  { no: 14, telugu: 'చతుర్దశి', english: 'Chaturdashi', paksha: 'Shukla' },
  { no: 15, telugu: 'పౌర్ణమి', english: 'Pournami', paksha: 'Shukla' },
  { no: 16, telugu: 'పాడ్యమి', english: 'Bahula Padyami', paksha: 'Krishna' },
  { no: 17, telugu: 'విదియ', english: 'Bahula Vidiya', paksha: 'Krishna' },
  { no: 18, telugu: 'తదియ', english: 'Bahula Tadiya', paksha: 'Krishna' },
  { no: 19, telugu: 'చవితి', english: 'Bahula Chavithi', paksha: 'Krishna' },
  { no: 20, telugu: 'పంచమి', english: 'Bahula Panchami', paksha: 'Krishna' },
  { no: 21, telugu: 'షష్ఠి', english: 'Bahula Shashti', paksha: 'Krishna' },
  { no: 22, telugu: 'సప్తమి', english: 'Bahula Saptami', paksha: 'Krishna' },
  { no: 23, telugu: 'అష్టమి', english: 'Bahula Ashtami', paksha: 'Krishna' },
  { no: 24, telugu: 'నవమి', english: 'Bahula Navami', paksha: 'Krishna' },
  { no: 25, telugu: 'దశమి', english: 'Bahula Dashami', paksha: 'Krishna' },
  { no: 26, telugu: 'ఏకాదశి', english: 'Bahula Ekadashi', paksha: 'Krishna' },
  { no: 27, telugu: 'ద్వాదశి', english: 'Bahula Dwadashi', paksha: 'Krishna' },
  { no: 28, telugu: 'త్రయోదశి', english: 'Bahula Trayodashi', paksha: 'Krishna' },
  { no: 29, telugu: 'చతుర్దశి', english: 'Bahula Chaturdashi', paksha: 'Krishna' },
  { no: 30, telugu: 'అమావాస్య', english: 'Amavasya', paksha: 'Krishna' },
];

export const NAKSHATRAS = [
  { no: 1, telugu: 'అశ్విని', english: 'Ashwini', tyajyaGhatis: 50 },
  { no: 2, telugu: 'భరణి', english: 'Bharani', tyajyaGhatis: 24 },
  { no: 3, telugu: 'కృత్తిక', english: 'Krittika', tyajyaGhatis: 30 },
  { no: 4, telugu: 'రోహిణి', english: 'Rohini', tyajyaGhatis: 40 },
  { no: 5, telugu: 'మృగశిర', english: 'Mrigashira', tyajyaGhatis: 14 },
  { no: 6, telugu: 'ఆరుద్ర', english: 'Arudra', tyajyaGhatis: 21 },
  { no: 7, telugu: 'పునర్వసు', english: 'Punarvasu', tyajyaGhatis: 30 },
  { no: 8, telugu: 'పుష్యమి', english: 'Pushyami', tyajyaGhatis: 20 },
  { no: 9, telugu: 'ఆశ్లేష', english: 'Ashlesha', tyajyaGhatis: 32 },
  { no: 10, telugu: 'మఖ', english: 'Makha', tyajyaGhatis: 30 },
  { no: 11, telugu: 'పుబ్బ (పూర్వఫల్గుణి)', english: 'Pubba / Purva Phalguni', tyajyaGhatis: 20 },
  { no: 12, telugu: 'ఉత్తర (ఉత్తరఫల్గుణి)', english: 'Uttara / Uttara Phalguni', tyajyaGhatis: 18 },
  { no: 13, telugu: 'హస్త', english: 'Hasta', tyajyaGhatis: 21 },
  { no: 14, telugu: 'చిత్త', english: 'Chitta', tyajyaGhatis: 20 },
  { no: 15, telugu: 'స్వాతి', english: 'Swati', tyajyaGhatis: 14 },
  { no: 16, telugu: 'విశాఖ', english: 'Vishakha', tyajyaGhatis: 14 },
  { no: 17, telugu: 'అనూరాధ', english: 'Anuradha', tyajyaGhatis: 10 },
  { no: 18, telugu: 'జ్యేష్ఠ', english: 'Jyeshta', tyajyaGhatis: 14 },
  { no: 19, telugu: 'మూల', english: 'Moola', tyajyaGhatis: 56 },
  { no: 20, telugu: 'పూర్వాషాఢ', english: 'Purvashadha', tyajyaGhatis: 24 },
  { no: 21, telugu: 'ఉత్తరాషాఢ', english: 'Uttarashadha', tyajyaGhatis: 20 },
  { no: 22, telugu: 'శ్రవణము', english: 'Shravanam', tyajyaGhatis: 10 },
  { no: 23, telugu: 'ధనిష్ఠ', english: 'Dhanishta', tyajyaGhatis: 10 },
  { no: 24, telugu: 'శతభిషం', english: 'Shatabhisham', tyajyaGhatis: 18 },
  { no: 25, telugu: 'పూర్వాభాద్ర', english: 'Purvabhadra', tyajyaGhatis: 16 },
  { no: 26, telugu: 'ఉత్తరాభాద్ర', english: 'Uttarabhadra', tyajyaGhatis: 24 },
  { no: 27, telugu: 'రేవతి', english: 'Revati', tyajyaGhatis: 30 },
];

export const YOGAS = [
  { no: 1, telugu: 'విష్కంభం', english: 'Vishkambha' },
  { no: 2, telugu: 'ప్రీతి', english: 'Priti' },
  { no: 3, telugu: 'ఆయుష్మాన్', english: 'Ayushman' },
  { no: 4, telugu: 'సౌభాగ్యం', english: 'Saubhagya' },
  { no: 5, telugu: 'శోభనం', english: 'Shobhana' },
  { no: 6, telugu: 'అతిగండం', english: 'Atiganda' },
  { no: 7, telugu: 'సుకర్మ', english: 'Sukarma' },
  { no: 8, telugu: 'ధృతి', english: 'Dhriti' },
  { no: 9, telugu: 'శూలం', english: 'Shoola' },
  { no: 10, telugu: 'గండం', english: 'Ganda' },
  { no: 11, telugu: 'వృద్ధి', english: 'Vriddhi' },
  { no: 12, telugu: 'ధ్రువం', english: 'Dhruva' },
  { no: 13, telugu: 'వ్యాఘాతం', english: 'Vyaghata' },
  { no: 14, telugu: 'హర్షణం', english: 'Harshana' },
  { no: 15, telugu: 'వజ్రం', english: 'Vajra' },
  { no: 16, telugu: 'సిద్ధి', english: 'Siddhi' },
  { no: 17, telugu: 'వ్యతీపాతం', english: 'Vyatipata' },
  { no: 18, telugu: 'వరీయాన్', english: 'Variyan' },
  { no: 19, telugu: 'పరిఘం', english: 'Parigha' },
  { no: 20, telugu: 'శివం', english: 'Shiva' },
  { no: 21, telugu: 'సిద్ధం', english: 'Siddha' },
  { no: 22, telugu: 'సాధ్యం', english: 'Sadhya' },
  { no: 23, telugu: 'శుభం', english: 'Shubha' },
  { no: 24, telugu: 'శుభ్రం', english: 'Shukla' },
  { no: 25, telugu: 'బ్రహ్మ', english: 'Brahma' },
  { no: 26, telugu: 'ఐంద్రం', english: 'Indra' },
  { no: 27, telugu: 'వైధృతి', english: 'Vaidhriti' },
];

export const KARANAS = [
  { no: 1, telugu: 'బవ', english: 'Bava' },
  { no: 2, telugu: 'బాలవ', english: 'Balava' },
  { no: 3, telugu: 'కౌలవ', english: 'Kaulava' },
  { no: 4, telugu: 'తైతిల', english: 'Taitila' },
  { no: 5, telugu: 'గరజ', english: 'Garija' },
  { no: 6, telugu: 'వణిజ', english: 'Vanija' },
  { no: 7, telugu: 'విష్టి (భద్ర)', english: 'Vishti (Bhadra)' },
  { no: 8, telugu: 'శకుని', english: 'Shakuni' },
  { no: 9, telugu: 'చతుష్పాద', english: 'Chatushpada' },
  { no: 10, telugu: 'నాగవ', english: 'Naga' },
  { no: 11, telugu: 'కింస్తుఘ్న', english: 'Kimstughna' },
];

export const VARAS = [
  { no: 0, telugu: 'ఆదివారము', english: 'Aadivaramu (Sunday)' },
  { no: 1, telugu: 'సోమవారము', english: 'Somavaramu (Monday)' },
  { no: 2, telugu: 'మంగళవారము', english: 'Mangalavaramu (Tuesday)' },
  { no: 3, telugu: 'బుధవారము', english: 'Budhavaramu (Wednesday)' },
  { no: 4, telugu: 'గురువారము', english: 'Guruvaramu (Thursday)' },
  { no: 5, telugu: 'శుక్రవారము', english: 'Shukravaramu (Friday)' },
  { no: 6, telugu: 'శనివారము', english: 'Shanivaramu (Saturday)' },
];

export const RASI_NAMES = [
  { no: 1, telugu: 'మేషం', english: 'Aries (Mesha)' },
  { no: 2, telugu: 'వృషభం', english: 'Taurus (Vrishabha)' },
  { no: 3, telugu: 'మిథునం', english: 'Gemini (Mithuna)' },
  { no: 4, telugu: 'కర్కాటకం', english: 'Cancer (Karka)' },
  { no: 5, telugu: 'సింహం', english: 'Leo (Simha)' },
  { no: 6, telugu: 'కన్య', english: 'Virgo (Kanya)' },
  { no: 7, telugu: 'తుల', english: 'Libra (Tula)' },
  { no: 8, telugu: 'వృశ్చికం', english: 'Scorpio (Vrischika)' },
  { no: 9, telugu: 'ధనుస్సు', english: 'Sagittarius (Dhanu)' },
  { no: 10, telugu: 'మకరం', english: 'Capricorn (Makara)' },
  { no: 11, telugu: 'కుంభం', english: 'Aquarius (Kumbha)' },
  { no: 12, telugu: 'మీనం', english: 'Pisces (Meena)' },
];

/**
 * Computes Samvatsara strictly according to the 60-year cycle.
 * Shaka Era year = Gregorian Year - 78 (or -79 before Ugadi).
 * For 2027 Ugadi: Shaka 1949 -> (1949 + 11) % 60 = 40 (0-indexed) -> 41st = Plavanga (ప్లవంగ)!
 * Before Ugadi in 2027: Parabhava (పరాభవ)!
 */
export function getSamvatsara(year: number, isBeforeUgadi: boolean): { no: number; telugu: string; english: string } {
  const shaka = year - 78 - (isBeforeUgadi ? 1 : 0);
  const cycleIndex = (shaka + 11) % 60; // 0 to 59
  const samvatsara = SAMVATSARA_NAMES[cycleIndex];
  return {
    no: samvatsara.no,
    telugu: samvatsara.telugu,
    english: samvatsara.english,
  };
}

/**
 * Determine Amanta Telugu Month based on the Solar Ingress (Sankranti) of the lunar month.
 * In Amanta system, month ends at Amavasya.
 */
export function getAmantaMonthForDay(
  _year: number,
  _month: number,
  _day: number,
  phaseAngle: number,
  sunSiderealLon: number
): {
  monthIndex: number; // 0 to 11
  isAdhika: boolean;
  nameTelugu: string;
  nameEnglish: string;
  rituTelugu: string;
  rituEnglish: string;
} {
  // In the classical Amanta lunar system, a lunar month is defined from one
  // Amavasya (new moon) to the next Amavasya.
  // The month is named after the solar rasi that the Sun enters before the next Amavasya.
  // Remaining angular distance to next Amavasya is (360 - phaseAngle).
  // With Moon speed ~13.176°/day and Sun speed ~0.9856°/day,
  // elongation rate is ~12.19°/day.
  const remainingPhase = (360 - (phaseAngle % 360)) % 360;
  const daysToNextAmavasya = remainingPhase / 12.19075;
  const sunAdvanceDeg = daysToNextAmavasya * 0.9856;
  const sunLonAtNextAmavasya = normalizeDeg(sunSiderealLon + sunAdvanceDeg);

  // Solar rasi at next Amavasya (0 = Mesha -> Chaitramu, 1 = Vrishabha -> Vaishakhamu, ... 11 = Meena -> Phalgunamu)
  const monthIdx = Math.floor(sunLonAtNextAmavasya / 30) % 12;

  const mData = TELUGU_MONTHS[monthIdx];
  return {
    monthIndex: monthIdx,
    isAdhika: false,
    nameTelugu: mData.telugu,
    nameEnglish: mData.english,
    rituTelugu: mData.rituTelugu,
    rituEnglish: mData.rituEnglish,
  };
}

/**
 * Compute the full Panchangam for a single calendar day
 */
export function calculatePanchangamForDay(
  dateStr: string, // YYYY-MM-DD
  latitude = 17.385044, // Default Hyderabad
  longitude = 78.486671,
  cityName = 'Hyderabad (Telangana)',
  tzOffsetHours = 5.5 // Default IST (+5:30)
): PanchangamDay {
  const [yStr, mStr, dStr] = dateStr.split('-');
  const year = parseInt(yStr, 10);
  const month = parseInt(mStr, 10);
  const day = parseInt(dStr, 10);

  // 1. Calculate Local Sunrise & Sunset
  const { sunriseHours, sunsetHours, noonHours } = calculateSunTimes(
    year,
    month,
    day,
    latitude,
    longitude,
    tzOffsetHours
  );

  const sunrise = hoursToTimeString(sunriseHours);
  const sunset = hoursToTimeString(sunsetHours);

  // Julian Day at Local Sunrise
  // Local time = UTC + tzOffsetHours => UTC = localTime - tzOffsetHours
  const sunriseUTC = sunriseHours - tzOffsetHours;
  const jdSunrise = gregorianToJD(year, month, day, sunriseUTC, 0, 0);

  // 2. Astronomical positions at Sunrise
  const { sunSiderealLon, moonSiderealLon, ayanamsa, phaseAngle } = getSiderealPositions(jdSunrise);

  // 3. Weekday (Vara) - Hindu Day starts at sunrise
  // 0 = Sunday, 1 = Monday, ... 6 = Saturday
  const gDate = new Date(year, month - 1, day);
  const dayOfWeek = gDate.getDay();
  const vara = VARAS[dayOfWeek];

  // 4. Tithi at Sunrise
  // Phase angle = (Moon - Sun) % 360
  // Each Tithi = 12 degrees
  const tithiIndex = Math.floor(phaseAngle / 12); // 0 to 29
  const tithiNumber = tithiIndex + 1; // 1 to 30
  const tithiData = TITHI_NAMES[tithiIndex];
  const paksha: Paksha = tithiNumber <= 15 ? 'Shukla' : 'Krishna';
  const pakshaTelugu = paksha === 'Shukla' ? 'శుక్ల పక్షం' : 'కృష్ణ పక్షం (బహుళ)';

  // Find exact Tithi end time (when phase angle reaches next multiple of 12°)
  const nextTargetDeg = (tithiIndex + 1) * 12;
  const endOfDayJD = jdSunrise + 1.2; // Look up to ~28 hours ahead
  const tithiEndJD = findTransitionJD(
    jdSunrise,
    endOfDayJD,
    nextTargetDeg,
    (jd) => getSiderealPositions(jd).phaseAngle
  );

  let tithiEndTime: TimeString | undefined;
  if (tithiEndJD < endOfDayJD) {
    const endGreg = jdToGregorian(tithiEndJD);
    // Convert to local time
    const localHour = (endGreg.hour + endGreg.minute / 60 + endGreg.second / 3600 + tzOffsetHours + 24) % 24;
    tithiEndTime = hoursToTimeString(localHour);
  }

  // 5. Nakshatra at Sunrise
  // 360 / 27 = 13° 20' = 13.333333°
  const nakshatraDeg = 360.0 / 27.0;
  const nakshatraIndex = Math.floor(moonSiderealLon / nakshatraDeg); // 0 to 26
  const nakshatraNumber = nakshatraIndex + 1;
  const nakshatraData = NAKSHATRAS[nakshatraIndex];
  const pada = Math.floor((moonSiderealLon % nakshatraDeg) / (nakshatraDeg / 4.0)) + 1;

  // Find exact Nakshatra end time
  const nextNakTargetDeg = (nakshatraIndex + 1) * nakshatraDeg;
  const nakEndJD = findTransitionJD(
    jdSunrise,
    endOfDayJD,
    nextNakTargetDeg,
    (jd) => getSiderealPositions(jd).moonSiderealLon
  );

  let nakshatraEndTime: TimeString | undefined;
  if (nakEndJD < endOfDayJD) {
    const endGreg = jdToGregorian(nakEndJD);
    const localHour = (endGreg.hour + endGreg.minute / 60 + endGreg.second / 3600 + tzOffsetHours + 24) % 24;
    nakshatraEndTime = hoursToTimeString(localHour);
  }

  // 6. Yoga at Sunrise
  // (SunLon + MoonLon) % 360 / (360/27)
  const yogaAngle = normalizeDeg(sunSiderealLon + moonSiderealLon);
  const yogaIndex = Math.floor(yogaAngle / nakshatraDeg); // 0 to 26
  const yogaData = YOGAS[yogaIndex];

  // 7. Karana at Sunrise (Half Tithi = 6 degrees)
  const karanaHalfTithi = Math.floor(phaseAngle / 6); // 0 to 59
  let karanaNameObj: { no: number; telugu: string; english: string };
  if (karanaHalfTithi === 0) {
    // 1st half of Shukla Pratipada: Kimstughna
    karanaNameObj = KARANAS[10]; // Kimstughna
  } else if (karanaHalfTithi >= 57) {
    // Last 3 half-tithis of Krishna Amavasya: Shakuni, Chatushpada, Naga
    if (karanaHalfTithi === 57) karanaNameObj = KARANAS[7]; // Shakuni
    else if (karanaHalfTithi === 58) karanaNameObj = KARANAS[8]; // Chatushpada
    else karanaNameObj = KARANAS[9]; // Naga
  } else {
    // 7 movable karanas repeating 8 times
    const movableIndex = (karanaHalfTithi - 1) % 7;
    karanaNameObj = KARANAS[movableIndex];
  }

  // 8. Telugu Month and Season (Amanta System)
  const monthData = getAmantaMonthForDay(year, month, day, phaseAngle, sunSiderealLon);

  // 9. 60-Year Samvatsara (Ugadi 2027 is on April 7, 2027)
  // Check if date is before Ugadi in the calendar year
  // In 2027, Ugadi (Chaitra Shukla Pratipada) falls around April 7, 2027
  const isBeforeUgadi = year === 2027 ? (month < 4 || (month === 4 && day < 7)) : month < 4;
  const samvatsara = getSamvatsara(year, isBeforeUgadi);

  // 10. Ayana (Uttarayana vs Dakshinayana)
  // Uttarayana starts around Makara Sankranti (Jan 14/15) till Karka Sankranti (July 16)
  const isUttarayana = (month > 1 || (month === 1 && day >= 15)) && (month < 7 || (month === 7 && day < 16));
  const ayanaTelugu = isUttarayana ? 'ఉత్తరాయణం' : 'దక్షిణాయనం';
  const ayanaEnglish = isUttarayana ? 'Uttarayana' : 'Dakshinayana';

  // 11. Sun and Moon Signs (Rasi)
  const sunRasiIdx = Math.floor(sunSiderealLon / 30);
  const moonRasiIdx = Math.floor(moonSiderealLon / 30);
  const sunSign = RASI_NAMES[sunRasiIdx];
  const moonSign = RASI_NAMES[moonRasiIdx];

  // 12. Kalam & Muhurtam Calculations
  const dayLengthHours = sunsetHours >= sunriseHours ? sunsetHours - sunriseHours : 24 - sunriseHours + sunsetHours;
  const partDurationHours = dayLengthHours / 8.0;

  // Rahu Kalam, Yamagandam, Gulika Kalam tables (part 0 to 7)
  // Day of week: 0 = Sun, 1 = Mon, 2 = Tue, 3 = Wed, 4 = Thu, 5 = Fri, 6 = Sat
  const rahuKalamParts = [7, 1, 6, 4, 5, 3, 2]; // 8th, 2nd, 7th, 5th, 6th, 4th, 3rd
  const yamaParts = [4, 3, 2, 1, 0, 6, 5]; // 5th, 4th, 3rd, 2nd, 1st, 7th, 6th
  const gulikaParts = [6, 5, 4, 3, 2, 1, 0]; // 7th, 6th, 5th, 4th, 3rd, 2nd, 1st

  const makePeriod = (startH: number, endH: number): Period => {
    const s = hoursToTimeString(startH);
    const e = hoursToTimeString(endH);
    return {
      start: s,
      end: e,
      formatted: `${s.formatted12} - ${e.formatted12}`,
    };
  };

  const rPart = rahuKalamParts[dayOfWeek];
  const rahuKalam = makePeriod(sunriseHours + rPart * partDurationHours, sunriseHours + (rPart + 1) * partDurationHours);

  const yPart = yamaParts[dayOfWeek];
  const yamagandam = makePeriod(sunriseHours + yPart * partDurationHours, sunriseHours + (yPart + 1) * partDurationHours);

  const gPart = gulikaParts[dayOfWeek];
  const gulikaKalam = makePeriod(sunriseHours + gPart * partDurationHours, sunriseHours + (gPart + 1) * partDurationHours);

  // Durmuhurtam: 15 Muhurtams of daytime
  const muhurtaDuration = dayLengthHours / 15.0;
  const durmuhurtam: Period[] = [];
  // Traditional Telugu Panchangam mapping
  if (dayOfWeek === 0) { // Sunday: 14th
    durmuhurtam.push(makePeriod(sunriseHours + 13 * muhurtaDuration, sunriseHours + 14 * muhurtaDuration));
  } else if (dayOfWeek === 1) { // Monday: 9th and 12th
    durmuhurtam.push(makePeriod(sunriseHours + 8 * muhurtaDuration, sunriseHours + 9 * muhurtaDuration));
    durmuhurtam.push(makePeriod(sunriseHours + 11 * muhurtaDuration, sunriseHours + 12 * muhurtaDuration));
  } else if (dayOfWeek === 2) { // Tuesday: 6th
    durmuhurtam.push(makePeriod(sunriseHours + 5 * muhurtaDuration, sunriseHours + 6 * muhurtaDuration));
  } else if (dayOfWeek === 3) { // Wednesday: 8th
    durmuhurtam.push(makePeriod(sunriseHours + 7 * muhurtaDuration, sunriseHours + 8 * muhurtaDuration));
  } else if (dayOfWeek === 4) { // Thursday: 6th and 12th
    durmuhurtam.push(makePeriod(sunriseHours + 5 * muhurtaDuration, sunriseHours + 6 * muhurtaDuration));
    durmuhurtam.push(makePeriod(sunriseHours + 11 * muhurtaDuration, sunriseHours + 12 * muhurtaDuration));
  } else if (dayOfWeek === 5) { // Friday: 4th and 9th
    durmuhurtam.push(makePeriod(sunriseHours + 3 * muhurtaDuration, sunriseHours + 4 * muhurtaDuration));
    durmuhurtam.push(makePeriod(sunriseHours + 8 * muhurtaDuration, sunriseHours + 9 * muhurtaDuration));
  } else if (dayOfWeek === 6) { // Saturday: 1st and 2nd
    durmuhurtam.push(makePeriod(sunriseHours + 0 * muhurtaDuration, sunriseHours + 2 * muhurtaDuration));
  }

  // Varjyam (Inauspicious Tyajya Kalam during Nakshatra)
  // Tyajya Ghatis out of 60 ghatis of the nakshatra
  const tyajyaGhatis = nakshatraData.tyajyaGhatis;
  const nakshatraDurationHours = 24.0; // Approximation for day segment
  const varjyamStartHours = (sunriseHours + (tyajyaGhatis / 60.0) * nakshatraDurationHours) % 24;
  const varjyamDurationHours = (4.0 / 60.0) * nakshatraDurationHours; // 4 Ghatis = 1.6 hrs
  const varjyamPeriod = makePeriod(varjyamStartHours, (varjyamStartHours + varjyamDurationHours) % 24);
  const varjyam: Period[] = [varjyamPeriod];

  // Abhijit Muhurtam: 8th muhurtam of the day (midday), rejected on Wednesday
  let abhijitMuhurtam: Period | null = null;
  if (dayOfWeek !== 3) {
    abhijitMuhurtam = makePeriod(sunriseHours + 7 * muhurtaDuration, sunriseHours + 8 * muhurtaDuration);
  }

  // Brahma Muhurtam: 2 muhurtas (96 mins) before sunrise
  const brahmaStartHours = (sunriseHours - 1.6 + 24) % 24;
  const brahmaEndHours = (sunriseHours - 0.8 + 24) % 24;
  const brahmaMuhurtam = makePeriod(brahmaStartHours, brahmaEndHours);

  // Amrita Kalam: Auspicious time starting 42 ghatis after Varjyam start, lasting 4 ghatis
  const amritaStartHours = (varjyamStartHours + (42.0 / 60.0) * nakshatraDurationHours) % 24;
  const amritaKalam = makePeriod(amritaStartHours, (amritaStartHours + varjyamDurationHours) % 24);

  // 13. Amavasya & Pournami
  const isPournami = tithiNumber === 15;
  const isAmavasya = tithiNumber === 30;

  // 14. Telugu Date Display String
  const teluguDateDisplay = `${samvatsara.telugu} నామ సం॥ ${monthData.nameTelugu} ${pakshaTelugu} ${tithiData.telugu}`;

  // 15. Festivals and Special Events
  const festivals = getFestivalsForDay(year, month, day, monthData.monthIndex, tithiNumber, dayOfWeek);

  return {
    date: dateStr,
    dayOfWeek,
    varaTelugu: vara.telugu,
    varaEnglish: vara.english,
    samvatsaraTelugu: samvatsara.telugu,
    samvatsaraEnglish: samvatsara.english,
    samvatsaraNumber: samvatsara.no,
    ayanaTelugu,
    ayanaEnglish,
    rituTelugu: monthData.rituTelugu,
    rituEnglish: monthData.rituEnglish,
    monthTelugu: monthData.nameTelugu,
    monthEnglish: monthData.nameEnglish,
    paksha,
    pakshaTelugu,
    teluguDateDisplay,
    sunrise,
    sunset,
    sunSignTelugu: sunSign.telugu,
    sunSignEnglish: sunSign.english,
    moonSignTelugu: moonSign.telugu,
    moonSignEnglish: moonSign.english,
    tithi: {
      number: tithiNumber,
      nameTelugu: tithiData.telugu,
      nameEnglish: tithiData.english,
      paksha,
      pakshaTelugu,
      endTime: tithiEndTime,
    },
    nakshatra: {
      number: nakshatraNumber,
      nameTelugu: nakshatraData.telugu,
      nameEnglish: nakshatraData.english,
      pada,
      endTime: nakshatraEndTime,
    },
    yoga: {
      number: yogaIndex + 1,
      nameTelugu: yogaData.telugu,
      nameEnglish: yogaData.english,
    },
    karana: {
      number: karanaNameObj.no,
      nameTelugu: karanaNameObj.telugu,
      nameEnglish: karanaNameObj.english,
    },
    timings: {
      rahuKalam,
      yamagandam,
      gulikaKalam,
      durmuhurtam,
      varjyam,
      abhijitMuhurtam,
      amritaKalam,
      brahmaMuhurtam,
    },
    isPournami,
    isAmavasya,
    festivals,
    location: {
      cityName,
      latitude,
      longitude,
      timezone: 'IST (Asia/Kolkata)',
    },
    settings: {
      ayanamsa: 'Lahiri (Chitrapaksha)',
      ayanamsaValueDeg: parseFloat(ayanamsa.toFixed(4)),
      monthSystem: 'Amanta',
      dayStartConvention: 'Sunrise',
    },
  };
}
