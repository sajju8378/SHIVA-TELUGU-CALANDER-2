import React from 'react';
import { PanchangamDay } from '../engine/types';
import { Clock, CheckCircle2, AlertTriangle, Sun, Sparkles } from 'lucide-react';
import { toTeluguNumber } from '../utils/teluguNumbers';

interface MuhurtamViewProps {
  day: PanchangamDay;
  onSelectDate: (date: string) => void;
  language: 'te' | 'en';
  useTeluguNumerals: boolean;
}

export const MuhurtamView: React.FC<MuhurtamViewProps> = ({
  day,
  onSelectDate,
  language,
  useTeluguNumerals,
}) => {
  const isTe = language === 'te';

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-telugu">
      {/* Date Selector Banner */}
      <div className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-amber-200 flex items-center space-x-2">
            <Clock className="w-6 h-6 text-amber-400" />
            <span>{isTe ? 'నేటి ముహూర్తములు & శుభాశుభ కాలాలు' : 'Muhurtam & Auspicious Timings'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">{day.teluguDateDisplay}</p>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="date"
            value={day.date}
            onChange={(e) => onSelectDate(e.target.value)}
            className="bg-slate-950 border border-amber-900/40 rounded-xl px-3 py-2 text-xs md:text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>

      {/* Primary Shubha Samayam Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Auspicious Windows */}
        <div className="bg-slate-900/80 border border-emerald-800/40 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-emerald-400 font-bold text-base border-b border-emerald-900/40 pb-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>{isTe ? 'శుభ సమయాలు (మంచి కార్యములకు శ్రేష్టం)' : 'Auspicious Timings (Shubha)'}</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-emerald-300 text-sm">
                    {isTe ? 'అభిజిత్ ముహూర్తం' : 'Abhijit Muhurtam'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isTe
                      ? 'మధ్యాహ్న వేళ వచ్చే అత్యంత శుభ ముహూర్తం (బుధవారం వర్జ్యం)'
                      : 'Midday solar zenith muhurtam, universally auspicious except Wednesday'}
                  </div>
                </div>
                <div className="font-bold text-sm text-emerald-300 font-mono">
                  {day.timings.abhijitMuhurtam ? day.timings.abhijitMuhurtam.formatted : (isTe ? 'ఈ రోజు లేదు' : 'None')}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-emerald-300 text-sm">
                    {isTe ? 'అమృత కాలం (ఘడియలు)' : 'Amrita Kalam'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isTe
                      ? 'నక్షత్ర చక్రంలో అమృతతుల్యమైన పవిత్ర ఘడియలు'
                      : 'Celestial nectar period during the nakshatra'}
                  </div>
                </div>
                <div className="font-bold text-sm text-emerald-300 font-mono">
                  {day.timings.amritaKalam ? day.timings.amritaKalam.formatted : (isTe ? 'శుభ సమయం' : 'Standard')}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-900/30">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-emerald-300 text-sm">
                    {isTe ? 'బ్రహ్మ ముహూర్తం' : 'Brahma Muhurtam'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isTe
                      ? 'సూర్యోదయానికి ముందు ధ్యానం, పూజలకు అత్యుత్తమ సమయం'
                      : 'Pre-dawn window ideal for meditation, prayer, and study'}
                  </div>
                </div>
                <div className="font-bold text-sm text-emerald-300 font-mono">
                  {day.timings.brahmaMuhurtam.formatted}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Inauspicious Windows */}
        <div className="bg-slate-900/80 border border-red-900/40 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center space-x-2 text-red-400 font-bold text-base border-b border-red-900/40 pb-2">
            <AlertTriangle className="w-5 h-5" />
            <span>{isTe ? 'అశుభ సమయాలు (నూతన కార్యములు విడనాడండి)' : 'Inauspicious Windows (Varjya)'}</span>
          </div>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/30">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-red-300 text-sm">
                    {isTe ? 'రాహుకాలం' : 'Rahu Kalam'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isTe ? 'రాహు గ్రహ ప్రభావ కాలం, శుభ కార్యాలు చేయకూడదు' : 'Inauspicious Rahu period; avoid starting new tasks'}
                  </div>
                </div>
                <div className="font-bold text-sm text-red-300 font-mono">
                  {day.timings.rahuKalam.formatted}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/30">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-red-300 text-sm">
                    {isTe ? 'యమగండం' : 'Yamagandam'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isTe ? 'యమధర్మరాజు ప్రభావ కాలం' : 'Inauspicious Yama period'}
                  </div>
                </div>
                <div className="font-bold text-sm text-red-300 font-mono">
                  {day.timings.yamagandam.formatted}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/30">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-red-300 text-sm">
                    {isTe ? 'దుర్ముహూర్తం' : 'Durmuhurtam'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isTe ? 'వార ఆధారిత దుష్ట ముహూర్తం' : 'Inauspicious weekday muhurtam'}
                  </div>
                </div>
                <div className="font-bold text-sm text-red-300 font-mono text-right">
                  {day.timings.durmuhurtam.map((d) => d.formatted).join(' & ')}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-red-950/20 border border-red-900/30">
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-red-300 text-sm">
                    {isTe ? 'వర్జ్యం (త్యాజ్యం)' : 'Varjyam'}
                  </div>
                  <div className="text-[11px] text-slate-400">
                    {isTe ? 'నక్షత్ర త్యాజ్య ఘడియలు (4 ఘడియలు = 1 గం 36 ని)' : 'Inauspicious tyajya window of nakshatra'}
                  </div>
                </div>
                <div className="font-bold text-sm text-red-300 font-mono">
                  {day.timings.varjyam.map((v) => v.formatted).join(', ')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Traditional Guidance Notes */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 text-xs text-slate-300 space-y-2">
        <h4 className="font-bold text-amber-300 text-sm">{isTe ? 'ముహూర్త నిర్ణయ సూత్రాలు' : 'Muhurtam Guidelines'}</h4>
        <p>
          {isTe
            ? '1. ఏ శుభకార్యానికైనా రాహుకాలం, యమగండం మరియు దుర్ముహూర్త సమయాలు నిషిద్ధము.'
            : '1. Rahu Kalam, Yamagandam, and Durmuhurtam must be avoided for beginning any auspicious undertakings.'}
        </p>
        <p>
          {isTe
            ? '2. అభిజిత్ ముహూర్తము అన్ని రోజులలోనూ శుభప్రదమైనది; బుధవారం మాత్రం రాహుకాల కలయిక దోషం వలన దీనిని నివారిస్తారు.'
            : '2. Abhijit Muhurtam is auspicious across all days, but avoided on Wednesday due to Rahu conflict.'}
        </p>
        <p>
          {isTe
            ? '3. ప్రస్తుత సమయాలు మీ ఎంపిక చేసుకున్న నగర సూర్యోదయ / సూర్యాస్తమయ సమయాలను బట్టి ఖచ్చితంగా లెక్కించబడ్డాయి.'
            : '3. Timings are calculated dynamically based on local astronomical sunrise and sunset for your chosen location.'}
        </p>
      </div>
    </div>
  );
};
