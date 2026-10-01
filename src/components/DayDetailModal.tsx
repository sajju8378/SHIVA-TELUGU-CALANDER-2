import React, { useState } from 'react';
import { PanchangamDay } from '../engine/types';
import { NAKSHATRAS } from '../engine/panchangam';
import { generateSankalpam, calculateTarabalam } from '../engine/sankalpam';
import { RemindersSection } from './RemindersSection';
import {
  X,
  Sun,
  Sunset,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Share2,
  Copy,
  Check,
  ScrollText,
  Star,
  ExternalLink,
  Bell,
} from 'lucide-react';
import { toTeluguNumber } from '../utils/teluguNumbers';

interface DayDetailModalProps {
  day: PanchangamDay;
  onClose: () => void;
  onPrevDay: () => void;
  onNextDay: () => void;
  language: 'te' | 'en';
  useTeluguNumerals: boolean;
}

export const DayDetailModal: React.FC<DayDetailModalProps> = ({
  day,
  onClose,
  onPrevDay,
  onNextDay,
  language,
  useTeluguNumerals,
}) => {
  const isTe = language === 'te';
  const [activeSubTab, setActiveSubTab] = useState<'panchangam' | 'reminders' | 'timeline' | 'sankalpam' | 'tarabalam' | 'share'>('panchangam');
  const [copiedText, setCopiedText] = useState(false);
  const [selectedJanmaNakshatra, setSelectedJanmaNakshatra] = useState<number>(1); // Default Ashwini

  // Format date display in universal English numbers
  const dateParts = day.date.split('-');
  const y = parseInt(dateParts[0], 10);
  const m = parseInt(dateParts[1], 10);
  const d = parseInt(dateParts[2], 10);

  const displayDateStr = `${d}-${m}-${y}`;

  const sankalpa = generateSankalpam(day);
  const userTara = calculateTarabalam(selectedJanmaNakshatra, day.nakshatra.number);

  // WhatsApp Share Text
  const shareText = `🕉️ *నేటి తెలుగు పంచాంగం (${displayDateStr} - ${day.varaTelugu})* 🕉️
శ్రీ ${day.samvatsaraTelugu} నామ సంవత్సరం • ${day.monthTelugu}
${day.pakshaTelugu} • ${day.tithi.nameTelugu} (${day.tithi.endTime ? day.tithi.endTime.formatted12 + ' వరకు' : 'రోజంతా'})
నక్షత్రం: ${day.nakshatra.nameTelugu} (${day.nakshatra.pada}వ పాదం)
యోగం: ${day.yoga.nameTelugu} | కరణం: ${day.karana.nameTelugu}
సూర్యోదయం: ${day.sunrise.formatted12} | సూర్యాస్తమయం: ${day.sunset.formatted12}
${day.timings.abhijitMuhurtam ? `అభిజిత్ ముహూర్తం: ${day.timings.abhijitMuhurtam.formatted}\n` : ''}
రాహుకాలం: ${day.timings.rahuKalam.formatted} (వర్జ్యం)
యమగండం: ${day.timings.yamagandam.formatted}
${day.festivals.length > 0 ? `విశేషం: ${day.festivals.map(f => f.nameTelugu).join(', ')}\n` : ''}
ప్రాంతం: ${day.location.cityName}`;

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const handleWhatsApp = () => {
    const url = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-amber-900/50 rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header Bar */}
        <div className="p-4 bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-b border-amber-900/40 flex items-center justify-between text-amber-200">
          <div className="flex items-center space-x-2">
            <button
              onClick={onPrevDay}
              className="p-1 rounded-lg hover:bg-amber-950/60 text-amber-300 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-lg md:text-xl font-bold font-serif-num text-slate-100">
                  {displayDateStr}
                </span>
                <span className="text-amber-400 font-telugu font-semibold">
                  ({isTe ? day.varaTelugu : day.varaEnglish})
                </span>
              </div>
              <p className="text-xs text-amber-300/80 font-telugu">{day.teluguDateDisplay}</p>
            </div>
            <button
              onClick={onNextDay}
              className="p-1 rounded-lg hover:bg-amber-950/60 text-amber-300 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Feature Sub-Navigation Tabs */}
        <div className="flex items-center overflow-x-auto bg-slate-950/90 border-b border-amber-900/30 px-3 py-2 gap-1.5 text-xs font-telugu no-scrollbar">
          <button
            onClick={() => setActiveSubTab('panchangam')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
              activeSubTab === 'panchangam'
                ? 'bg-amber-600 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-amber-200 hover:bg-slate-900'
            }`}
          >
            📋 {isTe ? 'పంచాంగ వివరాలు' : 'Panchangam Details'}
          </button>

          <button
            onClick={() => setActiveSubTab('reminders')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
              activeSubTab === 'reminders'
                ? 'bg-amber-600 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-amber-200 hover:bg-slate-900'
            }`}
          >
            🔔 {isTe ? 'రిమైండర్లు & నోట్స్' : 'Reminders & Notes'}
          </button>

          <button
            onClick={() => setActiveSubTab('timeline')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
              activeSubTab === 'timeline'
                ? 'bg-amber-600 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-amber-200 hover:bg-slate-900'
            }`}
          >
            ⏱️ {isTe ? 'ముహూర్త చక్రం' : 'Muhurtam Timeline'}
          </button>

          <button
            onClick={() => setActiveSubTab('sankalpam')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
              activeSubTab === 'sankalpam'
                ? 'bg-amber-600 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-amber-200 hover:bg-slate-900'
            }`}
          >
            🪔 {isTe ? 'పూజా సంకల్పం' : 'Puja Sankalpam'}
          </button>

          <button
            onClick={() => setActiveSubTab('tarabalam')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
              activeSubTab === 'tarabalam'
                ? 'bg-amber-600 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-amber-200 hover:bg-slate-900'
            }`}
          >
            ⭐ {isTe ? 'తారాబలం' : 'Tarabalam'}
          </button>

          <button
            onClick={() => setActiveSubTab('share')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap font-medium transition-all ${
              activeSubTab === 'share'
                ? 'bg-amber-600 text-slate-950 font-bold shadow'
                : 'text-slate-300 hover:text-amber-200 hover:bg-slate-900'
            }`}
          >
            📲 {isTe ? 'వాట్సాప్ కార్డ్' : 'Share Card'}
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-4 md:p-6 space-y-6 overflow-y-auto font-telugu">
          {/* TAB 1: Core Panchangam View */}
          {activeSubTab === 'panchangam' && (
            <>
              {/* Festivals on this day banner */}
              {day.festivals && day.festivals.length > 0 && (
                <div className="p-3.5 rounded-xl bg-gradient-to-r from-amber-950/90 to-red-950/90 border border-amber-500/40 shadow-lg space-y-2">
                  <div className="flex items-center space-x-2 text-amber-300 font-semibold text-sm">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    <span>{isTe ? 'నేటి పండుగలు & విశేషాలు' : 'Festivals & Special Observances'}</span>
                  </div>
                  <div className="space-y-2">
                    {day.festivals.map((f) => (
                      <div key={f.id} className="border-t border-amber-900/40 pt-2 first:border-0 first:pt-0">
                        <div className="font-bold text-base text-amber-200">
                          {isTe ? f.nameTelugu : f.nameEnglish}
                        </div>
                        <div className="text-xs text-amber-300/80 mt-0.5">
                          <span className="font-medium text-amber-400">{isTe ? 'సూత్రం / నిర్ణయం:' : 'Rule:'} </span>
                          {isTe ? f.ruleDescriptionTelugu : f.ruleDescriptionEnglish}
                        </div>
                        {f.significanceTelugu && (
                          <div className="text-xs text-slate-300 mt-1">
                            {isTe ? f.significanceTelugu : f.significanceEnglish}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Good Time to Start / Shubha Samayam recommendation */}
              <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800/40 flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div className="text-xs md:text-sm space-y-1">
                  <div className="font-bold text-emerald-300">
                    {isTe ? 'శుభ సమయం / మంచి ముహూర్తం' : 'Good Time to Start Something (Shubha Samayam)'}
                  </div>
                  <div className="text-slate-200">
                    {day.timings.abhijitMuhurtam ? (
                      <span>
                        {isTe ? 'అభిజిత్ ముహూర్తం:' : 'Abhijit Muhurtam:'}{' '}
                        <strong className="text-emerald-300">{day.timings.abhijitMuhurtam.formatted}</strong>
                      </span>
                    ) : day.timings.amritaKalam ? (
                      <span>
                        {isTe ? 'అమృత ఘడియలు:' : 'Amrita Kalam:'}{' '}
                        <strong className="text-emerald-300">{day.timings.amritaKalam.formatted}</strong>
                      </span>
                    ) : (
                      <span>{isTe ? 'సూర్యోదయ శుభ వేళలు' : 'Standard Daytime Auspicious Hours'}</span>
                    )}
                    {day.timings.brahmaMuhurtam && (
                      <span className="block text-slate-400 mt-0.5">
                        {isTe ? 'బ్రహ్మ ముహూర్తం (పూజకు శ్రేష్టం):' : 'Brahma Muhurtam (Best for Puja):'}{' '}
                        {day.timings.brahmaMuhurtam.formatted}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Pancha Angas (5 Limbs) Table Grid */}
              <div>
                <h3 className="text-sm font-bold text-amber-300 mb-3 flex items-center space-x-2">
                  <span>🌟</span>
                  <span>{isTe ? 'పంచాంగ విశేషాలు (పంచాంగాలు)' : 'Pancha Angas (Five Limbs)'}</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs md:text-sm">
                  {/* Tithi Card */}
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                    <div className="text-slate-400 text-xs">{isTe ? 'తిథి' : 'Tithi'}</div>
                    <div className="font-bold text-amber-200 text-base">
                      {day.tithi.pakshaTelugu} {day.tithi.nameTelugu}
                    </div>
                    {day.tithi.endTime ? (
                      <div className="text-slate-300 text-xs">
                        {isTe ? 'ముగింపు సమయం:' : 'Ends at:'}{' '}
                        <span className="text-amber-400 font-medium">{day.tithi.endTime.formatted12}</span>
                      </div>
                    ) : (
                      <div className="text-slate-400 text-xs">{isTe ? 'రోజంతా ఉంటుంది' : 'Full Day'}</div>
                    )}
                  </div>

                  {/* Nakshatra Card */}
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                    <div className="text-slate-400 text-xs">{isTe ? 'నక్షత్రం' : 'Nakshatra'}</div>
                    <div className="font-bold text-amber-200 text-base">
                      {day.nakshatra.nameTelugu}{' '}
                      <span className="text-amber-400 text-xs font-normal">
                        ({isTe ? `${day.nakshatra.pada}వ పాదం` : `Pada ${day.nakshatra.pada}`})
                      </span>
                    </div>
                    {day.nakshatra.endTime ? (
                      <div className="text-slate-300 text-xs">
                        {isTe ? 'ముగింపు సమయం:' : 'Ends at:'}{' '}
                        <span className="text-amber-400 font-medium">{day.nakshatra.endTime.formatted12}</span>
                      </div>
                    ) : (
                      <div className="text-slate-400 text-xs">{isTe ? 'రోజంతా ఉంటుంది' : 'Full Day'}</div>
                    )}
                  </div>

                  {/* Yoga Card */}
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                    <div className="text-slate-400 text-xs">{isTe ? 'యోగం' : 'Yoga'}</div>
                    <div className="font-bold text-amber-200 text-base">{day.yoga.nameTelugu}</div>
                    <div className="text-slate-400 text-xs">({day.yoga.nameEnglish})</div>
                  </div>

                  {/* Karana Card */}
                  <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1">
                    <div className="text-slate-400 text-xs">{isTe ? 'కరణం' : 'Karana'}</div>
                    <div className="font-bold text-amber-200 text-base">{day.karana.nameTelugu}</div>
                    <div className="text-slate-400 text-xs">({day.karana.nameEnglish})</div>
                  </div>
                </div>
              </div>

              {/* Sun & Moon Rasi */}
              <div>
                <h3 className="text-sm font-bold text-amber-300 mb-3 flex items-center space-x-2">
                  <span>☀️</span>
                  <span>{isTe ? 'సూర్య & చంద్ర సంచారం' : 'Solar & Lunar Positions'}</span>
                </h3>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                    <div className="text-slate-400">{isTe ? 'సూర్యోదయం' : 'Sunrise'}</div>
                    <div className="font-bold text-slate-100 mt-1 flex items-center space-x-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>{day.sunrise.formatted12}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                    <div className="text-slate-400">{isTe ? 'సూర్యాస్తమయం' : 'Sunset'}</div>
                    <div className="font-bold text-slate-100 mt-1 flex items-center space-x-1">
                      <Sunset className="w-3.5 h-3.5 text-orange-400" />
                      <span>{day.sunset.formatted12}</span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                    <div className="text-slate-400">{isTe ? 'సూర్య రాశి' : 'Sun Sign'}</div>
                    <div className="font-bold text-amber-200 mt-1">{day.sunSignTelugu}</div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-slate-800/40 border border-slate-700/40">
                    <div className="text-slate-400">{isTe ? 'చంద్ర రాశి' : 'Moon Sign'}</div>
                    <div className="font-bold text-amber-200 mt-1">{day.moonSignTelugu}</div>
                  </div>
                </div>
              </div>

              {/* Muhurtam & Kalam Timings Breakdown */}
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-amber-300 flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{isTe ? 'వర్జ్యం & రాహుకాలాలు (అశుభ / శుభ వేళలు)' : 'Auspicious & Inauspicious Timings'}</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3.5 rounded-xl bg-red-950/20 border border-red-900/30 space-y-2 text-xs">
                    <div className="flex items-center space-x-1.5 text-red-400 font-bold">
                      <AlertTriangle className="w-3.5 h-3.5" />
                      <span>{isTe ? 'అశుభ సమయాలు (వర్జ్యం చేయవలసినవి)' : 'Inauspicious Windows'}</span>
                    </div>

                    <div className="space-y-1.5 divide-y divide-red-950/50">
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-400">{isTe ? 'రాహుకాలం:' : 'Rahu Kalam:'}</span>
                        <span className="font-medium text-red-300">{day.timings.rahuKalam.formatted}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-400">{isTe ? 'యమగండం:' : 'Yamagandam:'}</span>
                        <span className="font-medium text-red-300">{day.timings.yamagandam.formatted}</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-400">{isTe ? 'గుళికా కాలం:' : 'Gulika Kalam:'}</span>
                        <span className="font-medium text-slate-300">{day.timings.gulikaKalam.formatted}</span>
                      </div>
                      {day.timings.durmuhurtam.length > 0 && (
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-400">{isTe ? 'దుర్ముహూర్తం:' : 'Durmuhurtam:'}</span>
                          <span className="font-medium text-red-300">
                            {day.timings.durmuhurtam.map((d) => d.formatted).join(', ')}
                          </span>
                        </div>
                      )}
                      {day.timings.varjyam.length > 0 && (
                        <div className="flex justify-between pt-1">
                          <span className="text-slate-400">{isTe ? 'వర్జ్యం:' : 'Varjyam:'}</span>
                          <span className="font-medium text-red-300">
                            {day.timings.varjyam.map((v) => v.formatted).join(', ')}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 space-y-2 text-xs">
                    <div className="flex items-center space-x-1.5 text-emerald-400 font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{isTe ? 'శుభ సమయాలు' : 'Auspicious Windows'}</span>
                    </div>

                    <div className="space-y-1.5 divide-y divide-emerald-950/50">
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-400">{isTe ? 'అభిజిత్ ముహూర్తం:' : 'Abhijit Muhurtam:'}</span>
                        <span className="font-medium text-emerald-300">
                          {day.timings.abhijitMuhurtam ? day.timings.abhijitMuhurtam.formatted : (isTe ? 'బుధవారం వర్జ్యం' : 'Omitted on Wednesday')}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-400">{isTe ? 'అమృత కాలం:' : 'Amrita Kalam:'}</span>
                        <span className="font-medium text-emerald-300">
                          {day.timings.amritaKalam ? day.timings.amritaKalam.formatted : (isTe ? 'శుభ ఘడియలు' : 'Standard')}
                        </span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-slate-400">{isTe ? 'బ్రహ్మ ముహూర్తం:' : 'Brahma Muhurtam:'}</span>
                        <span className="font-medium text-emerald-300">{day.timings.brahmaMuhurtam.formatted}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: Reminders & Notes Section */}
          {activeSubTab === 'reminders' && (
            <RemindersSection day={day} language={language} />
          )}

          {/* TAB 3: Visual Muhurtam Timeline */}
          {activeSubTab === 'timeline' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <h4 className="font-bold text-amber-300 text-sm flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>{isTe ? 'నేటి 24 గంటల ముహూర్త చక్రం (సూర్యోదయం నుండి సూర్యాస్తమయం)' : '24-Hour Muhurtam Timeline'}</span>
                </h4>
                <p className="text-xs text-slate-300">
                  {isTe
                    ? 'రోజులోని ప్రతి భాగాన్ని శుభ (ఆకుపచ్చ) మరియు వర్జ్యం/అశుభ (ఎరుపు) సమయాలుగా విభజించబడిన కాలచక్రం:'
                    : 'Visual classification of daylight hours into auspicious (green) and inauspicious (red) periods:'}
                </p>

                {/* Visual Timeline Blocks */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between text-xs text-amber-400 font-mono">
                    <span>సూర్యోదయం: {day.sunrise.formatted12}</span>
                    <span>మధ్యాహ్నం (అభిజిత్)</span>
                    <span>సూర్యాస్తమయం: {day.sunset.formatted12}</span>
                  </div>

                  {/* Horizontal Segmented Bar */}
                  <div className="h-6 w-full rounded-lg bg-slate-950 flex overflow-hidden border border-slate-700 shadow-inner">
                    <div className="bg-emerald-600/70 w-[15%]" title="Morning Shubha Window" />
                    <div className="bg-red-600/80 w-[15%]" title={`Rahu Kalam / Yamagandam: ${day.timings.rahuKalam.formatted}`} />
                    <div className="bg-emerald-600/70 w-[20%]" title="Midday Auspicious" />
                    <div className="bg-amber-500/80 w-[15%]" title={`Abhijit Muhurtam: ${day.timings.abhijitMuhurtam ? day.timings.abhijitMuhurtam.formatted : 'None'}`} />
                    <div className="bg-red-600/80 w-[15%]" title="Inauspicious Window" />
                    <div className="bg-emerald-600/70 w-[20%]" title="Sunset Auspicious Sandhya" />
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-slate-300 pt-2">
                    <span className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 rounded bg-emerald-600 inline-block" />
                      <span>{isTe ? 'శుభ సమయం' : 'Auspicious'}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 rounded bg-amber-500 inline-block" />
                      <span>{isTe ? 'అభిజిత్ / అమృతం' : 'Abhijit / Amrita'}</span>
                    </span>
                    <span className="flex items-center space-x-1.5">
                      <span className="w-3 h-3 rounded bg-red-600 inline-block" />
                      <span>{isTe ? 'రాహుకాలం / వర్జ్యం' : 'Inauspicious / Rahu'}</span>
                    </span>
                  </div>
                </div>
              </div>

              {/* Timing Details Table */}
              <div className="p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 space-y-2 text-xs">
                <div className="font-bold text-slate-200 text-sm mb-2">{isTe ? 'వివరణాత్మక కాల విభజన:' : 'Detailed Time Allocations:'}</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">రాహుకాలం (Rahu):</span>
                    <span className="font-bold text-red-400 font-mono">{day.timings.rahuKalam.formatted}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">యమగండం (Yama):</span>
                    <span className="font-bold text-red-400 font-mono">{day.timings.yamagandam.formatted}</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">అభిజిత్ ముహూర్తం:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {day.timings.abhijitMuhurtam ? day.timings.abhijitMuhurtam.formatted : 'ఈ రోజు లేదు'}
                    </span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex justify-between">
                    <span className="text-slate-400">అమృత కాలం:</span>
                    <span className="font-bold text-emerald-400 font-mono">
                      {day.timings.amritaKalam ? day.timings.amritaKalam.formatted : 'శుభ సమయం'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Puja Sankalpam Generator */}
          {activeSubTab === 'sankalpam' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-950/70 to-amber-950/70 border border-amber-600/40 shadow-lg space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-amber-300 font-bold text-base">
                    <ScrollText className="w-5 h-5 text-amber-400" />
                    <span>{isTe ? 'నేటి సంపూర్ణ వేద పూజా సంకల్పం' : 'Vedic Puja Sankalpa Mantra'}</span>
                  </div>
                  <button
                    onClick={() => handleCopy(sankalpa.sanskritTelugu)}
                    className="flex items-center space-x-1.5 px-3 py-1 rounded bg-amber-600 hover:bg-amber-500 text-slate-950 text-xs font-bold transition-all shadow"
                  >
                    {copiedText ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedText ? 'కాపీ చేయబడింది!' : 'సంకల్పం కాపీ'}</span>
                  </button>
                </div>

                <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-900/40 text-amber-100/90 text-xs md:text-sm leading-relaxed font-telugu whitespace-pre-line max-h-60 overflow-y-auto">
                  {sankalpa.sanskritTelugu}
                </div>
              </div>

              {/* Simplified Telugu Points */}
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-2">
                <div className="font-bold text-amber-300 text-xs">{isTe ? 'సంకల్ప ముఖ్య అంశాలు:' : 'Summary Points:'}</div>
                <div className="text-xs text-slate-300 whitespace-pre-line font-telugu leading-relaxed">
                  {sankalpa.simpleTelugu}
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: Tarabalam Calculator */}
          {activeSubTab === 'tarabalam' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center space-x-2 text-amber-300 font-bold text-base">
                  <Star className="w-5 h-5 text-amber-400" />
                  <span>{isTe ? 'నేటి తారాబలం గణన (వ్యక్తిగత శుభాశుభ నిర్ణయం)' : 'Tarabalam Calculator'}</span>
                </div>
                <p className="text-xs text-slate-300">
                  {isTe
                    ? 'మీ జన్మ నక్షత్రాన్ని ఎంచుకోండి. నేటి నక్షత్రం (' + day.nakshatra.nameTelugu + ') మీకు ఏ తారగా వస్తుందో మరియు ఏ కార్యాలకు శుభప్రదమో తెలుసుకోండి:'
                    : `Select your birth nakshatra to see today's Tara compatibility with ${day.nakshatra.nameTelugu}:`}
                </p>

                {/* Nakshatra Selector */}
                <div className="pt-1">
                  <label className="text-xs font-semibold text-slate-400 block mb-1">
                    {isTe ? 'మీ జన్మ నక్షత్రం ఎంచుకోండి:' : 'Select Your Birth Star (Janma Nakshatra):'}
                  </label>
                  <select
                    value={selectedJanmaNakshatra}
                    onChange={(e) => setSelectedJanmaNakshatra(parseInt(e.target.value, 10))}
                    className="w-full bg-slate-950 border border-amber-900/50 rounded-xl px-3 py-2 text-xs md:text-sm text-amber-200 focus:outline-none focus:ring-1 focus:ring-amber-500"
                  >
                    {NAKSHATRAS.map((nak) => (
                      <option key={nak.no} value={nak.no} className="bg-slate-900 text-slate-100">
                        {nak.no}. {nak.telugu} ({nak.english})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Computed Tara Card */}
                <div
                  className={`p-4 rounded-xl border mt-3 flex items-start space-x-3 ${
                    userTara.isGood
                      ? 'bg-emerald-950/40 border-emerald-700/60 text-emerald-200'
                      : 'bg-red-950/40 border-red-800/60 text-red-200'
                  }`}
                >
                  {userTara.isGood ? (
                    <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <div className="font-bold text-base">
                      {userTara.nameTelugu}{' '}
                      <span className="text-xs font-normal opacity-90">({userTara.nameEnglish})</span>
                    </div>
                    <div className="text-xs font-semibold mt-0.5">
                      {userTara.isGood
                        ? (isTe ? '✅ అత్యంత శుభప్రదం (అనుకూల తార)' : '✅ Highly Favorable')
                        : (isTe ? '⚠️ అశుభం / దోష తార (ముఖ్య కార్యములు వాయిదా వేయండి)' : '⚠️ Unfavorable')}
                    </div>
                    <p className="text-xs mt-1 opacity-90">{userTara.descTelugu}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: WhatsApp / Social Share Card */}
          {activeSubTab === 'share' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-3">
                <div className="flex items-center space-x-2 text-amber-300 font-bold text-base">
                  <Share2 className="w-5 h-5 text-amber-400" />
                  <span>{isTe ? 'వాట్సాప్ పంచాంగ సందేశం' : 'WhatsApp Share Message'}</span>
                </div>
                <p className="text-xs text-slate-300">
                  {isTe
                    ? 'నేటి సంపూర్ణ పంచాంగ వివరాలను స్నేహితులు, బంధువులతో వాట్సాప్‌లో సులభంగా పంచుకోండి:'
                    : 'Share today’s formatted Panchangam details with family and friends on WhatsApp:'}
                </p>

                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 text-xs md:text-sm text-slate-200 font-mono whitespace-pre-line leading-relaxed max-h-56 overflow-y-auto">
                  {shareText}
                </div>

                <div className="flex flex-wrap gap-2 pt-2">
                  <button
                    onClick={handleWhatsApp}
                    className="flex-1 flex items-center justify-center space-x-2 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-4 h-4" />
                    <span>{isTe ? 'వాట్సాప్‌లో షేర్ చేయండి' : 'Share on WhatsApp'}</span>
                  </button>

                  <button
                    onClick={() => handleCopy(shareText)}
                    className="flex items-center space-x-1.5 py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs transition-colors"
                  >
                    {copiedText ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    <span>{copiedText ? 'కాపీ చేయబడింది!' : 'సందేశం కాపీ చేయండి'}</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Location & Calculation Details Footer */}
          <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex flex-wrap items-center justify-between gap-2">
            <div>
              <span>{isTe ? 'ప్రాంతం:' : 'Location:'} </span>
              <strong className="text-slate-300">{day.location.cityName}</strong>
            </div>
            <div>
              <span>{isTe ? 'అయనాంశ:' : 'Ayanamsa:'} </span>
              <span className="text-slate-300">{day.settings.ayanamsa} ({day.settings.ayanamsaValueDeg}°)</span>
            </div>
            <div>
              <span>{isTe ? 'మాన పద్ధతి:' : 'System:'} </span>
              <span className="text-slate-300">{isTe ? 'అమాంత మానం (సూర్యోదయ వార గణన)' : 'Amanta (Sunrise Vara)'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
