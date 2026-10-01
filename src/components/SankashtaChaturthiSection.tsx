import React, { useState } from 'react';
import { getSankashtaChaturthiDates, SankashtaChaturthiItem } from '../engine/sankashtaChaturthi';
import { Moon, Calendar, Bell, ChevronDown, ChevronUp, Sparkles, Check, X } from 'lucide-react';
import { addReminder } from '../engine/reminders';

interface SankashtaChaturthiSectionProps {
  currentYear: number;
  cityName: string;
  onSelectDate: (date: string) => void;
  language: 'te' | 'en';
  onClose?: () => void;
}

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_NAMES_TE = [
  'జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్',
  'జులై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్',
];

export const SankashtaChaturthiSection: React.FC<SankashtaChaturthiSectionProps> = ({
  currentYear,
  cityName,
  onSelectDate,
  language,
  onClose,
}) => {
  const isTe = language === 'te';
  const [isExpanded, setIsExpanded] = useState(true);
  const [addedReminderId, setAddedReminderId] = useState<string | null>(null);

  const dates = getSankashtaChaturthiDates(currentYear, cityName);

  // Find the next upcoming one
  const todayStr = new Date().toISOString().split('T')[0];
  const upcoming = dates.find((d) => d.date >= todayStr) || dates[0];

  const handleAddFastingReminder = (item: SankashtaChaturthiItem) => {
    addReminder(
      item.date,
      isTe ? `సంకష్టహర చతుర్థి గణపతి పూజ & ఉపవాసం` : `Sankashta Chaturthi Ganesha Puja & Fasting`,
      '18:00',
      'fasting',
      `చంద్రోదయం: ${item.moonriseTime} | ${item.teluguMonth} | ${item.significanceTelugu}`
    );
    setAddedReminderId(item.date);
    setTimeout(() => setAddedReminderId(null), 3000);
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 via-amber-950/40 to-slate-900 border border-amber-800/50 rounded-2xl p-4 md:p-5 shadow-xl font-telugu space-y-4">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-900/40 pb-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300">
            <span className="text-xl">🐘</span>
          </div>
          <div>
            <h3 className="text-base md:text-lg font-bold text-amber-200 flex items-center space-x-2">
              <span>{isTe ? `సంకష్టహర చతుర్థి తేదీలు ${currentYear}` : `Sankashta Chaturthi Dates ${currentYear}`}</span>
              <span className="text-xs px-2 py-0.5 rounded bg-amber-950 border border-amber-600/50 text-amber-300 font-normal">
                {isTe ? 'చంద్రోదయ సమయాలు' : 'Moonrise Timings'}
              </span>
            </h3>
            <p className="text-xs text-slate-400">
              {isTe
                ? 'శ్రీ గణపతి ప్రీత్యర్థం సంకష్టహర చతుర్థి ఉపవాస దినములు మరియు చంద్ర దర్శన సమయాలు'
                : 'Lord Ganesha fasting days with local moonrise timings across all 12 months'}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-amber-900/40 hover:bg-slate-800 text-xs font-semibold text-amber-300 transition-colors cursor-pointer"
          >
            <span>{isExpanded ? (isTe ? 'కుదించు' : 'Collapse') : (isTe ? 'అన్నీ చూడండి (12)' : 'View All (12)')}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
          {onClose && (
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-900 border border-red-900/40 hover:bg-red-950/60 text-xs font-bold text-red-300 transition-colors cursor-pointer flex items-center justify-center"
              title={isTe ? 'మూసివేయి' : 'Close'}
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Featured Card: Next Sankashta Chaturthi */}
      {upcoming && (
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-600/40 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
                {isTe ? '🌟 రాబోయే సంకష్టహర చతుర్థి:' : '🌟 Next Sankashta Chaturthi:'}
              </span>
              {upcoming.isAngarika && (
                <span className="text-[11px] px-2 py-0.5 rounded bg-red-950 border border-red-600 text-red-200 font-bold">
                  {isTe ? 'మహా అంగారక చతుర్థి (మంగళవారం)' : 'Angarika Chaturthi (Tuesday)'}
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-lg md:text-xl font-bold font-mono text-slate-100">
                {upcoming.dayNum} {isTe ? MONTH_NAMES_TE[upcoming.monthNum - 1] : MONTH_NAMES_EN[upcoming.monthNum - 1]} {upcoming.year}
              </span>
              <span className="text-sm font-semibold text-amber-300">
                ({isTe ? upcoming.weekdayTelugu : upcoming.weekdayEnglish})
              </span>
              <span className="text-xs text-slate-400">
                • {upcoming.teluguMonth}
              </span>
            </div>

            <div className="flex items-center space-x-2 text-xs text-amber-300 pt-0.5">
              <Moon className="w-3.5 h-3.5 text-amber-400" />
              <span>
                {isTe ? 'చంద్రోదయ సమయం:' : 'Moonrise Time:'}{' '}
                <strong className="text-amber-200 font-mono text-sm">{upcoming.moonriseTime}</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => onSelectDate(upcoming.date)}
              className="px-3 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow transition-colors cursor-pointer"
            >
              {isTe ? 'క్యాలెండర్‌లో చూడండి' : 'Open in Calendar'}
            </button>

            <button
              onClick={() => handleAddFastingReminder(upcoming)}
              className="flex items-center space-x-1.5 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-amber-800/50 text-amber-300 font-semibold text-xs transition-colors cursor-pointer"
              title="Add reminder for this Sankashta Chaturthi"
            >
              {addedReminderId === upcoming.date ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-300">{isTe ? 'సేవ్ చేయబడింది!' : 'Saved!'}</span>
                </>
              ) : (
                <>
                  <Bell className="w-4 h-4 text-amber-400" />
                  <span>{isTe ? 'రిమైండర్ సెట్ చేయండి' : 'Set Reminder'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Expanded Grid of All 12 Dates */}
      {isExpanded && (
        <div className="space-y-2">
          <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
            {isTe ? `${currentYear} సంవత్సరపు పూర్తి 12 సంకష్టహర చతుర్థి తేదీల పట్టిక:` : `All 12 Sankashta Chaturthi Dates for ${currentYear}:`}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
            {dates.map((item) => {
              const isRemSaved = addedReminderId === item.date;

              return (
                <div
                  key={item.date}
                  className={`p-3 rounded-xl border transition-all flex flex-col justify-between ${
                    item.isAngarika
                      ? 'bg-red-950/20 border-red-700/60 shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 hover:border-amber-700/50'
                  }`}
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div className="font-bold text-sm text-slate-100 font-mono">
                        {item.dayNum}-{item.monthNum < 10 ? '0' + item.monthNum : item.monthNum}-{item.year}
                      </div>
                      {item.isAngarika && (
                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-red-900 text-red-100 font-bold">
                          అంగారక
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-amber-300 font-semibold mt-0.5">
                      {isTe ? item.weekdayTelugu : item.weekdayEnglish}
                    </div>

                    <div className="text-xs text-slate-400 mt-1">
                      {item.teluguMonth} • బహుళ చవితి
                    </div>

                    <div className="text-xs text-amber-300/90 mt-1.5 flex items-center space-x-1">
                      <Moon className="w-3 h-3 text-amber-400" />
                      <span>{isTe ? 'చంద్రోదయం:' : 'Moonrise:'} </span>
                      <strong className="font-mono text-amber-200">{item.moonriseTime}</strong>
                    </div>
                  </div>

                  <div className="pt-2.5 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
                    <button
                      onClick={() => onSelectDate(item.date)}
                      className="text-amber-400 hover:text-amber-300 underline font-medium"
                    >
                      {isTe ? 'తేదీ చూడండి' : 'View Date'}
                    </button>

                    <button
                      onClick={() => handleAddFastingReminder(item)}
                      className="flex items-center space-x-1 text-slate-300 hover:text-amber-300 transition-colors"
                      title="Add Fasting Reminder"
                    >
                      {isRemSaved ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Bell className="w-3.5 h-3.5 text-amber-400" />
                      )}
                      <span>{isRemSaved ? 'సేవ్డ్' : (isTe ? 'రిమైండర్' : 'Remind')}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
