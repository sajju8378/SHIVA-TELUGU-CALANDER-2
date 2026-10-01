import React from 'react';
import { BookOpen, CheckCircle, Code, ShieldCheck } from 'lucide-react';

interface DocsViewProps {
  language: 'te' | 'en';
}

export const DocsView: React.FC<DocsViewProps> = ({ language }) => {
  const isTe = language === 'te';

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-telugu text-slate-200">
      {/* Overview Banner */}
      <div className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-6 shadow-xl space-y-3">
        <div className="flex items-center space-x-2 text-amber-300">
          <BookOpen className="w-6 h-6 text-amber-400" />
          <h2 className="text-xl md:text-2xl font-bold">
            {isTe
              ? 'పంచాంగ గణన నిర్ణయాలు & సాంకేతిక పత్రం'
              : 'Panchangam Calculation Decisions & Technical Spec'}
          </h2>
        </div>
        <p className="text-xs md:text-sm text-slate-300 leading-relaxed">
          {isTe
            ? 'ఈ పంచాంగం భారత ప్రభుత్వ పంచాంగ సంస్కరణ కమిటీ ఆమోదించిన లహరి (చిత్రాపక్ష) అయనాంశ, అమాంత పద్ధతి మరియు ఖచ్చితమైన ఖగోళ గణనల ఆధారంగా రూపొందించబడింది. ఏ విధమైన మూడవ పక్షం API లపై ఆధారపడకుండా స్వయంగా లెక్కించబడుతుంది.'
            : 'Built using Swiss Ephemeris / VSOP87 and ELP2000 precision astronomical algorithms, Lahiri (Chitrapaksha) sidereal zodiac, and authentic Telugu Amanta lunar calendar rules.'}
        </p>
      </div>

      {/* Core Decisions Accordion / Cards */}
      <div className="space-y-4">
        {/* 1. Zodiac & Ayanamsa */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-base">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{isTe ? '1. రాశిచక్రం & అయనాంశ నిర్ణయం (Lahiri Ayanamsa)' : '1. Zodiac & Lahiri Ayanamsa'}</span>
          </div>
          <p className="text-xs md:text-sm text-slate-300">
            {isTe
              ? 'తెలుగు పంచాంగాలలో సాంప్రదాయకంగా వాడే చిత్ర నక్షత్ర పక్ష (లహరి) అయనాంశను ప్రమాణంగా తీసుకున్నాము. 2000 జనవరి నాటికి 23° 51\' 25.53" విలువ నుండి సంవత్సరానికి 50.290966" చొప్పున అక్ష విచలనం (Nutation) పరిగణనలోకి తీసుకోబడింది. 2027 నాటికి అయనాంశ విలువ సుమారు 24.237°.'
              : 'Configured with Lahiri (Chitrapaksha) Ayanamsa. Base at J2000.0 is 23° 51\' 25.53" with precession rate of 50.29 arcseconds/year and IAU 1980 nutation corrections (~24.237° in 2027).'}
          </p>
        </div>

        {/* 2. Amanta Lunar System */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-base">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{isTe ? '2. అమాంత పద్ధతి (Amanta System)' : '2. Amanta Lunar Month System'}</span>
          </div>
          <p className="text-xs md:text-sm text-slate-300">
            {isTe
              ? 'ఆంధ్రప్రదేశ్ మరియు తెలంగాణలలో అమాంత పద్ధతిని పాటిస్తారు. అనగా ప్రతి చంద్ర మాసము అమావాస్య ముగింపుతో (శుక్ల పాడ్యమి నాడు) మొదలై తరువాతి అమావాస్యతో అంతమవుతుంది. పూర్ణిమతో నెల ముగిసే ఉత్తర భారత పూర్ణిమాంత పద్ధతితో పోలిస్తే ఇది విభిన్నమైనది.'
              : 'Follows strictly the Amanta system: month begins at Shukla Pratipada (day after new moon) and ends at Amavasya. Month names are derived from the Solar Ingress (Sankranti) occurring within that lunar cycle.'}
          </p>
        </div>

        {/* 3. 60-Year Samvatsara */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-base">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{isTe ? '3. 60 సంవత్సరాల చక్ర గణన (Samvatsara Cycle)' : '3. 60-Year Samvatsara Computation'}</span>
          </div>
          <p className="text-xs md:text-sm text-slate-300">
            {isTe
              ? 'శాలివాహన శక సంవత్సరం ఆధారంగా గణించబడింది. 2027 ఉగాది (ఏప్రిల్ 7) వరకు పరాభవ నామ సంవత్సరం (40వది). ఉగాది పర్వదినం నుండి ప్లవంగ నామ సంవత్సరం (41వది) ప్రారంభమవుతుంది. ఇది ఎక్కడా హార్డ్‌కోడ్ చేయకుండా గణిత సూత్రం (Shaka + 11) % 60 ద్వారా లెక్కించబడుతుంది.'
              : 'Derived mathematically via Shaka year formula (Shaka + 11) % 60. Before Ugadi 2027 (April 7): Parabhava (40th). Ugadi 2027 onwards: Plavanga (41st)!'}
          </p>
        </div>

        {/* 4. Sunrise-to-Sunrise Vara */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-2">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-base">
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>{isTe ? '4. సూర్యోదయ వార గణన (Sunrise-to-Sunrise Vara)' : '4. Sunrise-to-Sunrise Vara Convention'}</span>
          </div>
          <p className="text-xs md:text-sm text-slate-300">
            {isTe
              ? 'హిందూ పంచాంగంలో రోజు అర్ధరాత్రి కాకుండా స్థానిక సూర్యోదయంతో ప్రారంభమవుతుంది. ఉదాహరణకు మంగళవారం వేకువజామున 4:30 గంటలకు సంభవించిన ఘడియలు సోమవారానికే వర్తిస్తాయి.'
              : 'The Hindu calendar day starts strictly at astronomical sunrise, not midnight. All Pancha Anga transitions before sunrise belong to the preceding day\'s Vara.'}
          </p>
        </div>

        {/* 5. API Endpoints Catalog */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-5 space-y-3">
          <div className="flex items-center space-x-2 text-amber-300 font-bold text-base">
            <Code className="w-4 h-4 text-amber-400" />
            <span>{isTe ? '5. అంతర్నిర్మిత REST API ఎండ్‌పాయింట్స్' : '5. Built-in REST API Endpoints'}</span>
          </div>
          <div className="space-y-2 text-xs font-mono">
            <div className="p-2 rounded bg-slate-950 border border-slate-850 flex items-center justify-between">
              <span className="text-emerald-400">GET /v1/panchangam/day?date=2027-04-07&lat=17.385&lon=78.486</span>
              <span className="text-slate-500">Day Panchangam</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-850 flex items-center justify-between">
              <span className="text-emerald-400">GET /v1/panchangam/month?year=2027&month=4</span>
              <span className="text-slate-500">Month Grid</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-855 flex items-center justify-between">
              <span className="text-emerald-400">GET /v1/panchangam/year?year=2027&page=1&limit=31</span>
              <span className="text-slate-500">Year Paginated</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-850 flex items-center justify-between">
              <span className="text-emerald-400">GET /v1/festivals?year=2027</span>
              <span className="text-slate-500">Festivals Catalog</span>
            </div>
            <div className="p-2 rounded bg-slate-950 border border-slate-850 flex items-center justify-between">
              <span className="text-emerald-400">GET /v1/muhurtam/day?date=2027-04-07</span>
              <span className="text-slate-500">Auspicious Timings</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
