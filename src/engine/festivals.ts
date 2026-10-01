import { FestivalItem } from './types';

export interface FestivalRule {
  id: string;
  nameTelugu: string;
  nameEnglish: string;
  category: 'major' | 'vratam' | 'ekadashi' | 'jayanti' | 'other';
  ruleDescriptionTelugu: string;
  ruleDescriptionEnglish: string;
  significanceTelugu: string;
  significanceEnglish: string;
  // Match condition
  matchMonth?: number; // 0 = Chaitra, 1 = Vaishakha, ... 11 = Phalguna
  matchTithi?: number; // 1 to 30
  matchGregorian?: (year: number, month: number, day: number) => boolean;
  customMatch?: (year: number, month: number, day: number, monthIdx: number, tithiNum: number, dayOfWeek: number) => boolean;
}

export const FESTIVAL_DEFINITIONS: FestivalRule[] = [
  // 1. Solar Festivals (Sankranti cycle)
  {
    id: 'bhogi',
    nameTelugu: 'భోగి పండుగ',
    nameEnglish: 'Bhogi Festival',
    category: 'major',
    ruleDescriptionTelugu: 'మకర సంక్రాంతి ముందు రోజు (సూర్యుడు ధనుస్సు రాశి ముగింపు)',
    ruleDescriptionEnglish: 'Day preceding Makara Sankranti',
    significanceTelugu: 'పాత వస్తువులను మంటల్లో వేసి కొత్తదనాన్ని ఆహ్వానించే పర్వదినం.',
    significanceEnglish: 'First day of the 4-day Sankranti harvest festival; bonfire at dawn.',
    matchGregorian: (_y, m, d) => m === 1 && d === 14,
  },
  {
    id: 'makara-sankranti',
    nameTelugu: 'మకర సంక్రాంతి / పెద్ద పండుగ',
    nameEnglish: 'Makara Sankranti / Pedda Panduga',
    category: 'major',
    ruleDescriptionTelugu: 'సూర్యుడు మకర రాశిలోకి ప్రవేశించే పుణ్యకాలం (జనవరి 15)',
    ruleDescriptionEnglish: 'Solar ingress of Sun into Capricorn (Makara Rasi)',
    significanceTelugu: 'సూర్యుడు ఉత్తరాయణ ప్రయాణం ప్రారంభించే సంక్రాంతి మహాపర్వదినం.',
    significanceEnglish: 'The great harvest festival celebrating the Sun’s northward journey (Uttarayana).',
    matchGregorian: (_y, m, d) => m === 1 && d === 15,
  },
  {
    id: 'kanuma',
    nameTelugu: 'కనుమ పండుగ (పశువుల పండుగ)',
    nameEnglish: 'Kanuma Panduga (Cattle Festival)',
    category: 'major',
    ruleDescriptionTelugu: 'మకర సంక్రాంతి మరుసటి రోజు (జనవరి 16)',
    ruleDescriptionEnglish: 'Day immediately following Makara Sankranti',
    significanceTelugu: 'వ్యవసాయానికి తోడ్పడే పశువులను పూజించే సంప్రదాయ దినం.',
    significanceEnglish: 'Thanksgiving to cattle and agriculture; family gatherings.',
    matchGregorian: (_y, m, d) => m === 1 && d === 16,
  },
  {
    id: 'mukkanuma',
    nameTelugu: 'ముక్కనుమ',
    nameEnglish: 'Mukkanuma',
    category: 'other',
    ruleDescriptionTelugu: 'కనుమ మరుసటి రోజు (జనవరి 17)',
    ruleDescriptionEnglish: 'Fourth day of Sankranti celebrations',
    significanceTelugu: 'సంక్రాంతి ఉత్సవాల ముగింపు సంబరాలు.',
    significanceEnglish: 'Conclusion of the Sankranti harvest festivities.',
    matchGregorian: (_y, m, d) => m === 1 && d === 17,
  },

  // 2. Chaitra Masam (Month 0)
  {
    id: 'ugadi',
    nameTelugu: 'ఉగాది (తెలుగు సంవత్సరాది)',
    nameEnglish: 'Ugadi (Telugu New Year)',
    category: 'major',
    ruleDescriptionTelugu: 'చైత్ర శుద్ధ పాడ్యమి (వసంత నవరాత్రుల ప్రారంభం)',
    ruleDescriptionEnglish: 'Chaitra Shukla Pratipada (Amanta lunar month 1, tithi 1)',
    significanceTelugu: 'నూతన సంవత్సర ఆరంభం, ఉగాది పచ్చడి సేవనం, పంచాంగ శ్రవణం.',
    significanceEnglish: 'Telugu New Year day; sharing Shadruchula Ugadi Pachadi and listening to Panchanga Sravanam.',
    matchMonth: 0,
    matchTithi: 1,
  },
  {
    id: 'sri-rama-navami',
    nameTelugu: 'శ్రీరామ నవమి',
    nameEnglish: 'Sri Rama Navami',
    category: 'major',
    ruleDescriptionTelugu: 'చైత్ర శుద్ధ నవమి (శ్రీరామ చంద్రుని అవతార దినం)',
    ruleDescriptionEnglish: 'Chaitra Shukla Navami',
    significanceTelugu: 'సీతారాముల కళ్యాణ మహోత్సవం, వడపప్పు మరియు పానకం సమర్పణ.',
    significanceEnglish: 'Celebration of Lord Rama’s birth and Sita Rama Kalyanam across temples.',
    matchMonth: 0,
    matchTithi: 9,
  },
  {
    id: 'hanuman-jayanti-chaitra',
    nameTelugu: 'హనుమాన్ జయంతి (చైత్ర పౌర్ణమి)',
    nameEnglish: 'Hanuman Jayanti (Chaitra)',
    category: 'jayanti',
    ruleDescriptionTelugu: 'చైత్ర శుద్ధ పౌర్ణమి',
    ruleDescriptionEnglish: 'Chaitra Shukla Pournami',
    significanceTelugu: 'భక్త ఆంజనేయ స్వామి జన్మదినం.',
    significanceEnglish: 'Celebration of Lord Hanuman’s appearance.',
    matchMonth: 0,
    matchTithi: 15,
  },

  // 3. Vaishakha Masam (Month 1)
  {
    id: 'akshaya-tritiya',
    nameTelugu: 'అక్షయ తృతీయ',
    nameEnglish: 'Akshaya Tritiya',
    category: 'vratam',
    ruleDescriptionTelugu: 'వైశాఖ శుద్ధ తృతీయ',
    ruleDescriptionEnglish: 'Vaishakha Shukla Tritiya',
    significanceTelugu: 'ఏది చేసినా అక్షయమైన పుణ్యఫలాన్నిచ్చే అతి పవిత్రమైన తిథి.',
    significanceEnglish: 'Auspicious day for new beginnings, charity, and lasting prosperity.',
    matchMonth: 1,
    matchTithi: 3,
  },
  {
    id: 'narasimha-jayanti',
    nameTelugu: 'శ్రీ నృసింహ జయంతి',
    nameEnglish: 'Sri Narasimha Jayanti',
    category: 'jayanti',
    ruleDescriptionTelugu: 'వైశాఖ శుద్ధ చతుర్దశి',
    ruleDescriptionEnglish: 'Vaishakha Shukla Chaturdashi',
    significanceTelugu: 'ప్రహ్లాద రక్షణార్థం శ్రీ మహావిష్ణువు నరసింహ స్వామిగా అవతరించిన పుణ్యదినం.',
    significanceEnglish: 'Lord Vishnu’s appearance as Narasimha to protect Prahlada.',
    matchMonth: 1,
    matchTithi: 14,
  },
  {
    id: 'hanuman-jayanti-telugu',
    nameTelugu: 'తెలుగు హనుమాన్ జయంతి (దీక్షా విరమణ)',
    nameEnglish: 'Telugu Hanuman Jayanti (Deeksha Samapti)',
    category: 'jayanti',
    ruleDescriptionTelugu: 'వైశాఖ బహుళ దశమి (ఉగాది నాటి నుండి 41 రోజుల దీక్ష ముగింపు)',
    ruleDescriptionEnglish: 'Vaishakha Krishna Dashami (traditional Telugu Hanuman Jayanti)',
    significanceTelugu: 'ఆంధ్ర మరియు తెలంగాణాల్లో 41 రోజుల మండల హనుమాన్ దీక్ష విరమించే ప్రధాన పర్వదినం.',
    significanceEnglish: 'Telugu regional Hanuman Jayanti marking conclusion of 41-day Hanuman Deeksha.',
    matchMonth: 1,
    matchTithi: 25,
  },

  // 4. Jyeshtha Masam (Month 2)
  {
    id: 'ganga-avatarana',
    nameTelugu: 'గంగా అవతరణం (గంగా దసరా)',
    nameEnglish: 'Ganga Avatarana / Ganga Dussehra',
    category: 'vratam',
    ruleDescriptionTelugu: 'జ్యేష్ఠ శుద్ధ దశమి',
    ruleDescriptionEnglish: 'Jyeshtha Shukla Dashami',
    significanceTelugu: 'గంగా నది స్వర్గం నుండి భువికి అవతరించిన పవిత్ర దినం.',
    significanceEnglish: 'Descent of holy river Ganga to Earth.',
    matchMonth: 2,
    matchTithi: 10,
  },
  {
    id: 'vata-savitri-vratam',
    nameTelugu: 'వట సావిత్రి వ్రతం',
    nameEnglish: 'Vata Savitri Vratam',
    category: 'vratam',
    ruleDescriptionTelugu: 'జ్యేష్ఠ పూర్ణిమ',
    ruleDescriptionEnglish: 'Jyeshtha Pournami',
    significanceTelugu: 'భర్త ఆయురారోగ్యాలకై స్త్రీలు వటవృక్షాన్ని పూజించే విశేష వ్రతం.',
    significanceEnglish: 'Married women worship the banyan tree for spouse’s longevity.',
    matchMonth: 2,
    matchTithi: 15,
  },

  // 5. Ashadha Masam (Month 3)
  {
    id: 'puri-jagannath-ratha-yatra',
    nameTelugu: 'జగన్నాథ రథయాత్ర',
    nameEnglish: 'Puri Jagannath Ratha Yatra',
    category: 'major',
    ruleDescriptionTelugu: 'ఆషాఢ శుద్ధ విదియ',
    ruleDescriptionEnglish: 'Ashadha Shukla Vidiya',
    significanceTelugu: 'పూరీ జగన్నాథ స్వామి వార్షిక రథయాత్ర.',
    significanceEnglish: 'World-famous chariot procession of Lord Jagannath, Balabhadra, and Subhadra.',
    matchMonth: 3,
    matchTithi: 2,
  },
  {
    id: 'guru-pournami',
    nameTelugu: 'గురు పౌర్ణమి / వ్యాస పూర్ణిమ',
    nameEnglish: 'Guru Pournami / Vyasa Pournami',
    category: 'major',
    ruleDescriptionTelugu: 'ఆషాఢ శుద్ధ పూర్ణిమ',
    ruleDescriptionEnglish: 'Ashadha Shukla Pournami',
    significanceTelugu: 'వేదవ్యాస మహర్షి జయంతి; గురువులను పూజించి ఆశీస్సులు పొందే దినం.',
    significanceEnglish: 'Birthday of Sage Veda Vyasa; reverence and gratitude to spiritual masters/gurus.',
    matchMonth: 3,
    matchTithi: 15,
  },
  {
    id: 'bonalu-telangana',
    nameTelugu: 'తెలంగాణ బోనాల పండుగ',
    nameEnglish: 'Telangana Bonalu Jathara',
    category: 'major',
    ruleDescriptionTelugu: 'ఆషాఢ మాసపు ఆదివారాలు (తెలంగాణ సంస్కృతి)',
    ruleDescriptionEnglish: 'Ashadha month Sundays (Telangana tradition)',
    significanceTelugu: 'మహంకాళి అమ్మవారికి నైవేద్యం సమర్పించి చల్లగా చూడాలని వేడుకునే పండుగ.',
    significanceEnglish: 'Traditional Telangana festival honoring Mother Goddess Mahankali.',
    customMatch: (_y, _m, _d, mIdx, _tithi, dow) => mIdx === 3 && dow === 0,
  },

  // 6. Shravana Masam (Month 4)
  {
    id: 'naga-panchami',
    nameTelugu: 'నాగ పంచమి',
    nameEnglish: 'Naga Panchami',
    category: 'vratam',
    ruleDescriptionTelugu: 'శ్రావణ శుద్ధ పంచమి',
    ruleDescriptionEnglish: 'Shravana Shukla Panchami',
    significanceTelugu: 'నాగదేవతలకు పాలు సమర్పించి పూజించే పర్వదినం.',
    significanceEnglish: 'Worship of serpent deities (Nagas) with milk and prayers.',
    matchMonth: 4,
    matchTithi: 5,
  },
  {
    id: 'varalakshmi-vratam',
    nameTelugu: 'వరలక్ష్మీ వ్రతం',
    nameEnglish: 'Varalakshmi Vratam',
    category: 'vratam',
    ruleDescriptionTelugu: 'శ్రావణ పూర్ణిమకు ముందు వచ్చే శుక్రవారము',
    ruleDescriptionEnglish: 'Friday preceding Shravana Pournami',
    significanceTelugu: 'సకల సౌభాగ్యాలు ప్రసాదించే వరలక్ష్మీ దేవి ఆరాధన.',
    significanceEnglish: 'Grand worship of Goddess Varalakshmi by married women for family well-being.',
    customMatch: (_y, _m, _d, mIdx, tithi, dow) => mIdx === 4 && dow === 5 && tithi >= 8 && tithi <= 15,
  },
  {
    id: 'rakhi-pournami',
    nameTelugu: 'రాఖీ పౌర్ణమి / జంధ్యాల పౌర్ణమి',
    nameEnglish: 'Raksha Bandhan / Jandhyala Pournami',
    category: 'major',
    ruleDescriptionTelugu: 'శ్రావణ పూర్ణిమ (యజ్ఞోపవీత ధారణ / రాఖీ కట్టుట)',
    ruleDescriptionEnglish: 'Shravana Shukla Pournami',
    significanceTelugu: 'అన్నాచెల్లెళ్ల అనురాగానికి ప్రతీక రాఖీ పండుగ మరియు ఉపాకర్మ.',
    significanceEnglish: 'Bond of protection between siblings; sacred thread changing (Upakarma).',
    matchMonth: 4,
    matchTithi: 15,
  },
  {
    id: 'sri-krishna-janmashtami',
    nameTelugu: 'శ్రీకృష్ణ జన్మాష్టమి (గోకులాష్టమి)',
    nameEnglish: 'Sri Krishna Janmashtami (Gokulashtami)',
    category: 'major',
    ruleDescriptionTelugu: 'శ్రావణ బహుళ అష్టమి (శ్రీకృష్ణుని జన్మదినం)',
    ruleDescriptionEnglish: 'Shravana Krishna Ashtami',
    significanceTelugu: 'రోహిణీ నక్షత్ర యుక్త అష్టమి యందు పరమాత్ముడు శ్రీకృష్ణుని జననం.',
    significanceEnglish: 'Appearance day of Lord Krishna; midnight puja and butter offerings.',
    matchMonth: 4,
    matchTithi: 23,
  },

  // 7. Bhadrapada Masam (Month 5)
  {
    id: 'vinayaka-chavithi',
    nameTelugu: 'వినాయక చవితి (గణేష్ చతుర్థి)',
    nameEnglish: 'Vinayaka Chavithi (Ganesh Chaturthi)',
    category: 'major',
    ruleDescriptionTelugu: 'భాద్రపద శుద్ధ చవితి (మధ్యాహ్న వ్యాపిని చతుర్థి)',
    ruleDescriptionEnglish: 'Bhadrapada Shukla Chavithi',
    significanceTelugu: 'విఘ్నేశ్వరుని ఆరాధన, మట్టి వినాయక ప్రతిష్ఠాపన, పాలవెల్లి, కుడుములు-ఉండ్రాళ్ళు.',
    significanceEnglish: 'Grand birthday of Lord Ganesha, remover of all obstacles.',
    matchMonth: 5,
    matchTithi: 4,
  },
  {
    id: 'ananta-chaturdashi',
    nameTelugu: 'అనంత పద్మనాభ చతుర్దశి',
    nameEnglish: 'Ananta Chaturdashi',
    category: 'vratam',
    ruleDescriptionTelugu: 'భాద్రపద శుద్ధ చతుర్దశి (వినాయక నిమజ్జనం)',
    ruleDescriptionEnglish: 'Bhadrapada Shukla Chaturdashi',
    significanceTelugu: 'అనంత పద్మనాభ స్వామి వ్రతం మరియు గణపతి నిమజ్జనోత్సవం.',
    significanceEnglish: 'Ananta Padmanabha Vratam and grand Ganesh Visarjan.',
    matchMonth: 5,
    matchTithi: 14,
  },
  {
    id: 'mahalaya-amavasya',
    nameTelugu: 'మహాలయ అమావాస్య (పితృ పక్ష సమాప్తి)',
    nameEnglish: 'Mahalaya Amavasya (Peddala Panduga)',
    category: 'major',
    ruleDescriptionTelugu: 'భాద్రపద బహుళ అమావాస్య',
    ruleDescriptionEnglish: 'Bhadrapada Krishna Amavasya',
    significanceTelugu: 'పితృదేవతలకు తర్పణాలు అర్పించి ఆశీస్సులు పొందే అత్యంత పుణ్యదినం; ఎంగిలిపూల బతుకమ్మ ప్రారంభం.',
    significanceEnglish: 'Honoring ancestors (Pitrus) with tarpanam; start of Telangana Bathukamma festival.',
    matchMonth: 5,
    matchTithi: 30,
  },

  // 8. Ashwayuja Masam (Month 6)
  {
    id: 'devi-navaratri-start',
    nameTelugu: 'దేవీ శరన్నవరాత్రుల ప్రారంభం',
    nameEnglish: 'Devi Sharad Navaratri Begins',
    category: 'major',
    ruleDescriptionTelugu: 'ఆశ్వయుజ శుద్ధ పాడ్యమి (కలశ స్థాపన)',
    ruleDescriptionEnglish: 'Ashwayuja Shukla Pratipada',
    significanceTelugu: 'కనకదుర్గమ్మ, జగన్మాత అమ్మవార్ల నవరాత్రుల అలంకారాల ప్రారంభం.',
    significanceEnglish: 'First day of the 9-night celebration honoring Divine Mother Durga.',
    matchMonth: 6,
    matchTithi: 1,
  },
  {
    id: 'saddula-bathukamma',
    nameTelugu: 'సద్దుల బతుకమ్మ (దుర్గాష్టమి)',
    nameEnglish: 'Saddula Bathukamma / Durgashtami',
    category: 'major',
    ruleDescriptionTelugu: 'ఆశ్వయుజ శుద్ధ అష్టమి (తెలంగాణ పూల పండుగ మహా వేడుక)',
    ruleDescriptionEnglish: 'Ashwayuja Shukla Ashtami',
    significanceTelugu: 'తెలంగాణ స్త్రీల మహా వైభవ పూల పండుగ ముగింపు, సద్దులు సమర్పణ.',
    significanceEnglish: 'Grand finale of the floral Bathukamma festival in Telangana on Durgashtami.',
    matchMonth: 6,
    matchTithi: 8,
  },
  {
    id: 'vijayadashami-dasara',
    nameTelugu: 'విజయదశమి / దసరా',
    nameEnglish: 'Vijayadashami / Dasara',
    category: 'major',
    ruleDescriptionTelugu: 'ఆశ్వయుజ శుద్ధ దశమి (శమీ పూజ, అపరాజిత పూజ)',
    ruleDescriptionEnglish: 'Ashwayuja Shukla Dashami',
    significanceTelugu: 'మహిషాసురమర్దిని దుర్గాదేవి విజయం, జమ్మి చెట్టు పూజ, ఆయుధ పూజ.',
    significanceEnglish: 'Triumph of Good over Evil; worship of Shami tree and Ayudha Puja.',
    matchMonth: 6,
    matchTithi: 10,
  },
  {
    id: 'atla-tadde',
    nameTelugu: 'అట్ల తద్దె (తెలుగు సంప్రదాయ పండుగ)',
    nameEnglish: 'Atla Tadde',
    category: 'vratam',
    ruleDescriptionTelugu: 'ఆశ్వయుజ బహుళ తదియ (స్త్రీల ప్రత్యేక పర్వదినం)',
    ruleDescriptionEnglish: 'Ashwayuja Krishna Tadiya',
    significanceTelugu: 'ఆంధ్రప్రదేశ్ లో స్త్రీలు, కన్యలు గౌరీదేవిని పూజించి అట్లు నైవేద్యం పెట్టే పండుగ.',
    significanceEnglish: 'Traditional Andhra festival for married and unmarried women praying to Goddess Gauri.',
    matchMonth: 6,
    matchTithi: 18,
  },
  {
    id: 'naraka-chaturdashi',
    nameTelugu: 'నరక చతుర్దశి',
    nameEnglish: 'Naraka Chaturdashi',
    category: 'major',
    ruleDescriptionTelugu: 'ఆశ్వయుజ బహుళ చతుర్దశి (తైలాభ్యంగన స్నానం)',
    ruleDescriptionEnglish: 'Ashwayuja Krishna Chaturdashi',
    significanceTelugu: 'సత్యభామా సమేత శ్రీకృష్ణుడు నరకాసురుని వధించిన దినం; వేకువజామున అభ్యంగన స్నానం.',
    significanceEnglish: 'Victory of Satyabhama and Krishna over Narakasura; dawn oil bath.',
    matchMonth: 6,
    matchTithi: 29,
  },
  {
    id: 'deepavali',
    nameTelugu: 'దీపావళి (లక్ష్మీ పూజ)',
    nameEnglish: 'Deepavali / Diwali (Lakshmi Puja)',
    category: 'major',
    ruleDescriptionTelugu: 'ఆశ్వయుజ బహుళ అమావాస్య (సాయంకాల ప్రదోష వేళ లక్ష్మీ పూజ)',
    ruleDescriptionEnglish: 'Ashwayuja Krishna Amavasya',
    significanceTelugu: 'దీపాలు వెలిగించి ధనలక్ష్మిని పూజించే చీకటిపై వెలుగుల విజయోత్సవం.',
    significanceEnglish: 'Festival of Lights; evening Lakshmi Kubera puja and fireworks.',
    matchMonth: 6,
    matchTithi: 30,
  },

  // 9. Karthika Masam (Month 7)
  {
    id: 'karthika-masam-start',
    nameTelugu: 'కార్తీక మాసారంభం',
    nameEnglish: 'Karthika Masam Begins',
    category: 'vratam',
    ruleDescriptionTelugu: 'కార్తీక శుద్ధ పాడ్యమి (శివకేశవ పూజలు, దీపారాధన)',
    ruleDescriptionEnglish: 'Karthika Shukla Pratipada',
    significanceTelugu: 'పరమ పవిత్రమైన కార్తీక మాస స్నానాలు మరియు నిత్య దీపారాధనల ప్రారంభం.',
    significanceEnglish: 'Commencement of the holy Karthika month of Shiva worship and lighting daily lamps.',
    matchMonth: 7,
    matchTithi: 1,
  },
  {
    id: 'nagula-chavithi-karthika',
    nameTelugu: 'నాగుల చవితి',
    nameEnglish: 'Nagula Chavithi',
    category: 'vratam',
    ruleDescriptionTelugu: 'కార్తీక శుద్ధ చవితి',
    ruleDescriptionEnglish: 'Karthika Shukla Chavithi',
    significanceTelugu: 'తెలుగు లోగిళ్లలో పుట్టలో పాలు పోసి నాగదేవతను భక్తితో కొలిచే పర్వదినం.',
    significanceEnglish: 'Devotees offer milk and chalimidi to snake mounds in Telugu states.',
    matchMonth: 7,
    matchTithi: 4,
  },
  {
    id: 'ksheerabdi-dwadashi',
    nameTelugu: 'క్షీరాబ్ధి ద్వాదశి / చిలుక ద్వాదశి',
    nameEnglish: 'Ksheerabdi Dwadashi / Chiluka Dwadashi',
    category: 'vratam',
    ruleDescriptionTelugu: 'కార్తీక శుద్ధ ద్వాదశి (తులసీ ధాత్రీ సమేత దామోదర పూజ)',
    ruleDescriptionEnglish: 'Karthika Shukla Dwadashi',
    significanceTelugu: 'తులసి కోట వద్ద ఉసిరి కొమ్మను ఉంచి శ్రీమహావిష్ణువునకు దీపాలు వెలిగించే పుణ్యదినం.',
    significanceEnglish: 'Sacred worship of Tulasi and Amla tree representing Lakshmi and Damodara.',
    matchMonth: 7,
    matchTithi: 12,
  },
  {
    id: 'karthika-pournami',
    nameTelugu: 'కార్తీక పౌర్ణమి / జ్వాలా తోరణం',
    nameEnglish: 'Karthika Pournami / Jwala Thoranam',
    category: 'major',
    ruleDescriptionTelugu: 'కార్తీక శుద్ధ పూర్ణిమ (365 వత్తుల దీపారాధన)',
    ruleDescriptionEnglish: 'Karthika Shukla Pournami',
    significanceTelugu: 'శివాలయాల్లో జ్వాలాతోరణం, నదీ స్నానాలు, 365 వత్తుల దీపాలు వెలిగించే మహా పర్వదినం.',
    significanceEnglish: 'Lighting 365 wicks, temple Jwala Thoranam, and sacred river baths.',
    matchMonth: 7,
    matchTithi: 15,
  },

  // 10. Margashira Masam (Month 8)
  {
    id: 'subramanya-shashti',
    nameTelugu: 'సుబ్రహ్మణ్య షష్ఠి (స్కంద షష్ఠి)',
    nameEnglish: 'Subramanya Shashti (Skanda Shashti)',
    category: 'vratam',
    ruleDescriptionTelugu: 'మార్గశిర శుద్ధ షష్ఠి',
    ruleDescriptionEnglish: 'Margashira Shukla Shashti',
    significanceTelugu: 'శ్రీ సుబ్రహ్మణ్యేశ్వర స్వామి జన్మదిన ఆరాధన.',
    significanceEnglish: 'Celebration and worship of Lord Subramanya (Murugan).',
    matchMonth: 8,
    matchTithi: 6,
  },
  {
    id: 'gita-jayanti',
    nameTelugu: 'గీతా జయంతి (మోక్షదా ఏకాదశి)',
    nameEnglish: 'Bhagavad Gita Jayanti',
    category: 'jayanti',
    ruleDescriptionTelugu: 'మార్గశిర శుద్ధ ఏకాదశి (కురుక్షేత్ర రణరంగంలో గీతోపదేశం)',
    ruleDescriptionEnglish: 'Margashira Shukla Ekadashi',
    significanceTelugu: 'భగవాన్ శ్రీకృష్ణుడు అర్జునునికి భగవద్గీతను ఉపదేశించిన పవిత్ర దినం.',
    significanceEnglish: 'The day Lord Krishna revealed the Bhagavad Gita to Arjuna at Kurukshetra.',
    matchMonth: 8,
    matchTithi: 11,
  },
  {
    id: 'vaikuntha-ekadashi',
    nameTelugu: 'వైకుంఠ ఏకాదశి / ముక్కోటి ఏకాదశి',
    nameEnglish: 'Vaikuntha Ekadashi / Mukkoti Ekadashi',
    category: 'major',
    ruleDescriptionTelugu: 'మార్గశిర లేదా పుష్య శుద్ధ ఏకాదశి (ఉత్తర ద్వార దర్శనం)',
    ruleDescriptionEnglish: 'Dhanurmasam / Pushya Shukla Ekadashi',
    significanceTelugu: 'వైష్ణవాలయాల్లో ఉత్తర ద్వార దర్శనం ద్వారా మోక్ష ప్రాప్తి కలుగునని విశ్వాసం.',
    significanceEnglish: 'Opening of North Gate (Uttara Dwara) at Tirupati and Vishnu temples.',
    matchMonth: 8,
    matchTithi: 11,
  },

  // 11. Pushya Masam (Month 9)
  {
    id: 'dhanurmasam-ends',
    nameTelugu: 'ధనుర్మాస పూజలు / గోదా కళ్యాణం',
    nameEnglish: 'Godadevi Kalyanam / Bhogi',
    category: 'vratam',
    ruleDescriptionTelugu: 'ధనుర్మాస ముగింపు దినం',
    ruleDescriptionEnglish: 'Conclusion of Dhanurmasa Vratham',
    significanceTelugu: 'శ్రీరంగనాథునితో ఆండాళ్ (గోదాదేవి) దివ్య కళ్యాణ మహోత్సవం.',
    significanceEnglish: 'Celestial marriage of Sri Ranganatha and Andal Godadevi.',
    matchGregorian: (_y, m, d) => m === 1 && d === 14,
  },

  // 12. Magha Masam (Month 10)
  {
    id: 'vasanta-panchami',
    nameTelugu: 'శ్రీ పంచమి / వసంత పంచమి (సరస్వతీ పూజ)',
    nameEnglish: 'Vasanta Panchami (Saraswati Puja)',
    category: 'vratam',
    ruleDescriptionTelugu: 'మాఘ శుద్ధ పంచమి',
    ruleDescriptionEnglish: 'Magha Shukla Panchami',
    significanceTelugu: 'జ్ఞాన ప్రదాయిని సరస్వతీ దేవి జయంతి; అక్షరాభ్యాసాలకు అత్యంత శుభప్రదం.',
    significanceEnglish: 'Appearance of Goddess Saraswati; auspicious for Aksharabhyasam / education.',
    matchMonth: 10,
    matchTithi: 5,
  },
  {
    id: 'ratha-saptami',
    nameTelugu: 'రథసప్తమి (సూర్య జయంతి)',
    nameEnglish: 'Ratha Saptami / Surya Jayanti',
    category: 'major',
    ruleDescriptionTelugu: 'మాఘ శుద్ధ సప్తమి (జిల్లేడు ఆకులతో స్నానం)',
    ruleDescriptionEnglish: 'Magha Shukla Saptami',
    significanceTelugu: 'సూర్య భగవానుని రథం ఉత్తర దిశగా పయనించే రోజు; జిల్లేడు ఆకులతో తలస్నానం చేసి పరమాన్నం నైవేద్యం.',
    significanceEnglish: 'Sun God Surya Jayanti; traditional bath with Arka leaves and kheer offering.',
    matchMonth: 10,
    matchTithi: 7,
  },
  {
    id: 'bhishma-ekadashi',
    nameTelugu: 'భీష్మ ఏకాదశి (విష్ణు సహస్రనామ జయంతి)',
    nameEnglish: 'Bhishma Ekadashi',
    category: 'ekadashi',
    ruleDescriptionTelugu: 'మాఘ శుద్ధ ఏకాదశి',
    ruleDescriptionEnglish: 'Magha Shukla Ekadashi',
    significanceTelugu: 'భీష్మాచార్యుల వారు శ్రీ విష్ణు సహస్రనామ స్తోత్రాన్ని ధర్మరాజుకు ఉపదేశించిన దినం.',
    significanceEnglish: 'Bhishma revealed Sri Vishnu Sahasranama to Yudhishthira from the bed of arrows.',
    matchMonth: 10,
    matchTithi: 11,
  },
  {
    id: 'maha-shivaratri',
    nameTelugu: 'మహా శివరాత్రి',
    nameEnglish: 'Maha Shivaratri',
    category: 'major',
    ruleDescriptionTelugu: 'మాఘ బహుళ చతుర్దశి (నిశీథ కాల వ్యాపిని చతుర్థి)',
    ruleDescriptionEnglish: 'Magha Krishna Chaturdashi',
    significanceTelugu: 'లింగోద్భవ కాలంలో పరమశివునికి అభిషేకాలు, ఉపవాసం, రాత్రి జాగరణ.',
    significanceEnglish: 'Great Night of Shiva; fasting, Lingodbhava midnight abhishekams, and all-night vigil.',
    matchMonth: 10,
    matchTithi: 29,
  },

  // 13. Phalguna Masam (Month 11)
  {
    id: 'kamadahanam-holi',
    nameTelugu: 'కామదహనం / హోలీ పౌర్ణమి',
    nameEnglish: 'Kamadahanam / Holi Pournami',
    category: 'major',
    ruleDescriptionTelugu: 'ఫాల్గుణ శుద్ధ పూర్ణిమ (వసంతోత్సవం)',
    ruleDescriptionEnglish: 'Phalguna Shukla Pournami',
    significanceTelugu: 'మన్మథుని దహనం మరియు రంగుల పండుగ వసంతోత్సవం.',
    significanceEnglish: 'Burning of Kama and celebration of colors (Holi/Vasantotsavam).',
    matchMonth: 11,
    matchTithi: 15,
  },
];

/**
 * Complete Ekadasi names list for 24 Ekadasis in a lunar year
 */
export const EKADASI_NAMES_MAP: Record<string, { telugu: string; english: string; significance: string }> = {
  '0-11': { telugu: 'కామద ఏకాదశి', english: 'Kamada Ekadashi', significance: 'చైత్ర శుక్ల ఏకాదశి - సర్వ పాపహారిణి' },
  '0-26': { telugu: 'వరూథినీ ఏకాదశి', english: 'Varuthini Ekadashi', significance: 'చైత్ర బహుళ ఏకాదశి - సౌభాగ్య ప్రదాయకం' },
  '1-11': { telugu: 'మోహినీ ఏకాదశి', english: 'Mohini Ekadashi', significance: 'వైశాఖ శుక్ల ఏకాదశి - మోహ వినాశనం' },
  '1-26': { telugu: 'అపరా ఏకాదశి', english: 'Apara Ekadashi', significance: 'వైశాఖ బహుళ ఏకాదశి - అపార పుణ్యఫలం' },
  '2-11': { telugu: 'నిర్జల ఏకాదశి', english: 'Nirjala Ekadashi', significance: 'జ్యేష్ఠ శుక్ల ఏకాదశి - జల రహిత మహా వ్రతం' },
  '2-26': { telugu: 'యోగినీ ఏకాదశి', english: 'Yogini Ekadashi', significance: 'జ్యేష్ఠ బహుళ ఏకాదశి - పాప విముక్తి' },
  '3-11': { telugu: 'శయన ఏకాదశి (తొలి ఏకాదశి)', english: 'Devashayani / Tholi Ekadashi', significance: 'ఆషాఢ శుక్ల ఏకాదశి - చాతుర్మాస్య వ్రతారంభం' },
  '3-26': { telugu: 'కామికా ఏకాదశి', english: 'Kamika Ekadashi', significance: 'ఆషాఢ బహుళ ఏకాదశి - శ్రీధర పూజ' },
  '4-11': { telugu: 'పుత్రదా ఏకాదశి', english: 'Shravana Putrada Ekadashi', significance: 'శ్రావణ శుక్ల ఏకాదశి - సంతాన ప్రాప్తి' },
  '4-26': { telugu: 'అజా ఏకాదశి', english: 'Aja (Annada) Ekadashi', significance: 'శ్రావణ బహుళ ఏకాదశి - హరిశ్చంద్ర మోక్షం' },
  '5-11': { telugu: 'పరివర్తిని ఏకాదశి', english: 'Parivartini Ekadashi', significance: 'భాద్రపద శుక్ల ఏకాదశి - విష్ణువు శయన పరివర్తనం' },
  '5-26': { telugu: 'ఇందిరా ఏకాదశి', english: 'Indira Ekadashi', significance: 'భాద్రపద బహుళ ఏకాదశి - పితృ మోక్ష ప్రదం' },
  '6-11': { telugu: 'పాశాంకుశ ఏకాదశి', english: 'Pashankusha Ekadashi', significance: 'ఆశ్వయుజ శుక్ల ఏకాదశి - యమ పాశ విముక్తి' },
  '6-26': { telugu: 'రమా ఏకాదశి', english: 'Rama Ekadashi', significance: 'ఆశ్వయుజ బహుళ ఏకాదశి - లక్ష్మీ అనుగ్రహం' },
  '7-11': { telugu: 'ప్రబోధినీ ఏకాదశి (ఉత్థాన)', english: 'Prabodhini / Utthana Ekadashi', significance: 'కార్తీక శుక్ల ఏకాదశి - చాతుర్మాస్య సమాప్తి, విష్ణు మేల్కొనుట' },
  '7-26': { telugu: 'ఉత్పత్తి ఏకాదశి', english: 'Utpanna Ekadashi', significance: 'కార్తీక బహుళ ఏకాదశి - ఏకాదశి దేవి ఆవిర్భావం' },
  '8-11': { telugu: 'మోక్షదా ఏకాదశి (వైకుంఠ)', english: 'Mokshada / Vaikuntha Ekadashi', significance: 'మార్గశిర శుక్ల ఏకాదశి - వైకుంఠ ద్వార దర్శనం' },
  '8-26': { telugu: 'సఫలా ఏకాదశి', english: 'Saphala Ekadashi', significance: 'మార్గశిర బహుళ ఏకాదశి - సర్వ కార్య సాఫల్యం' },
  '9-11': { telugu: 'పుష్య పుత్రదా ఏకాదశి', english: 'Pausha Putrada Ekadashi', significance: 'పుష్య శుక్ల ఏకాదశి - పుత్ర ప్రాప్తి' },
  '9-26': { telugu: 'షట్ తిలా ఏకాదశి', english: 'Shattila Ekadashi', significance: 'పుష్య బహుళ ఏకాదశి - నువ్వుల దానం' },
  '10-11': { telugu: 'జయ ఏకాదశి (భీష్మ)', english: 'Jaya / Bhaimi Ekadashi', significance: 'మాఘ శుక్ల ఏకాదశి - పిశాచత్వ విముక్తి' },
  '10-26': { telugu: 'విజయా ఏకాదశి', english: 'Vijaya Ekadashi', significance: 'మాఘ బహుళ ఏకాదశి - శత్రు జయం' },
  '11-11': { telugu: 'ఆమలకీ ఏకాదశి', english: 'Amalaki Ekadashi', significance: 'ఫాల్గుణ శుక్ల ఏకాదశి - ఉసిరి చెట్టు ఆరాధన' },
  '11-26': { telugu: 'పాపమోచనీ ఏకాదశి', english: 'Papamochani Ekadashi', significance: 'ఫాల్గుణ బహుళ ఏకాదశి - సకల పాప వినాశనం' },
};

export function getFestivalsForDay(
  year: number,
  month: number,
  day: number,
  monthIdx: number,
  tithiNum: number,
  dayOfWeek: number
): FestivalItem[] {
  const dateStr = `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`;
  const list: FestivalItem[] = [];

  for (const def of FESTIVAL_DEFINITIONS) {
    let matches = false;

    if (def.matchGregorian) {
      matches = def.matchGregorian(year, month, day);
    } else if (def.customMatch) {
      matches = def.customMatch(year, month, day, monthIdx, tithiNum, dayOfWeek);
    } else if (def.matchMonth !== undefined && def.matchTithi !== undefined) {
      matches = def.matchMonth === monthIdx && def.matchTithi === tithiNum;
    }

    if (matches) {
      list.push({
        id: def.id,
        nameTelugu: def.nameTelugu,
        nameEnglish: def.nameEnglish,
        category: def.category,
        ruleDescriptionTelugu: def.ruleDescriptionTelugu,
        ruleDescriptionEnglish: def.ruleDescriptionEnglish,
        significanceTelugu: def.significanceTelugu,
        significanceEnglish: def.significanceEnglish,
        date: dateStr,
      });
    }
  }

  // Check if today is an Ekadashi (Tithi 11 or Tithi 26)
  if (tithiNum === 11 || tithiNum === 26) {
    const key = `${monthIdx}-${tithiNum}`;
    const ekadasiInfo = EKADASI_NAMES_MAP[key];
    if (ekadasiInfo) {
      // Don't duplicate if already added by definition
      const alreadyHas = list.some((f) => f.nameEnglish.includes('Ekadashi'));
      if (!alreadyHas) {
        list.push({
          id: `ekadashi-${key}`,
          nameTelugu: ekadasiInfo.telugu,
          nameEnglish: ekadasiInfo.english,
          category: 'ekadashi',
          ruleDescriptionTelugu: tithiNum === 11 ? 'శుక్ల పక్ష ఏకాదశి' : 'కృష్ణ (బహుళ) పక్ష ఏకాదశి',
          ruleDescriptionEnglish: tithiNum === 11 ? 'Shukla Paksha Ekadashi' : 'Krishna Paksha Ekadashi',
          significanceTelugu: ekadasiInfo.significance,
          significanceEnglish: ekadasiInfo.significance,
          date: dateStr,
        });
      }
    }
  }

  return list;
}
