import React from 'react';
import { PanchangamDay } from '../engine/types';
import { Sparkles, Sun, Moon, Bell } from 'lucide-react';
import { getRemindersForDate } from '../engine/reminders';

interface CalendarGridProps {
  days: PanchangamDay[];
  currentYear: number;
  currentMonth: number;
  selectedDate: string;
  onSelectDate: (date: string) => void;
  language: 'te' | 'en';
}

const WEEKDAYS_TE = ['ఆదివారం', 'సోమవారం', 'మంగళవారం', 'బుధవారం', 'గురువారం', 'శుక్రవారం', 'శనివారం'];
const WEEKDAYS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const WEEKDAYS_SHORT_TE = ['ఆది', 'సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని'];
const WEEKDAYS_SHORT_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const CalendarGrid: React.FC<CalendarGridProps> = ({
  days,
  currentYear,
  currentMonth,
  selectedDate,
  onSelectDate,
  language,
}) => {
  const isTe = language === 'te';

  // Find day of week for the 1st of the month
  const firstDayOfWeek = days.length > 0 ? days[0].dayOfWeek : 0;
  const blankDays = Array.from({ length: firstDayOfWeek });

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="w-full">
      {/* Month Calendar Outer Box */}
      <div className="bg-slate-900/90 border border-amber-900/40 rounded-2xl shadow-2xl overflow-hidden calendar-container">
        {/* Weekday Header Row */}
        <div className="grid grid-cols-7 border-b border-amber-900/50 bg-slate-950/80 text-center text-xs md:text-sm font-semibold font-telugu">
          {Array.from({ length: 7 }).map((_, idx) => (
            <div
              key={idx}
              className={`py-3 px-1 border-r last:border-r-0 border-amber-900/30 ${
                idx === 0
                  ? 'text-red-400 bg-red-950/20'
                  : idx === 6
                  ? 'text-amber-400 bg-amber-950/20'
                  : 'text-amber-200/90'
              }`}
            >
              <span className="hidden md:inline">{isTe ? WEEKDAYS_TE[idx] : WEEKDAYS_EN[idx]}</span>
              <span className="md:hidden">{isTe ? WEEKDAYS_SHORT_TE[idx] : WEEKDAYS_SHORT_EN[idx]}</span>
            </div>
          ))}
        </div>

        {/* Calendar Day Cells */}
        <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-amber-900/30">
          {/* Leading Blank Cells */}
          {blankDays.map((_, i) => (
            <div key={`blank-${i}`} className="bg-slate-950/40 min-h-[92px] md:min-h-[115px]" />
          ))}

          {/* Days of Month */}
          {days.map((day) => {
            const dayNum = parseInt(day.date.split('-')[2], 10);
            const isToday = day.date === todayStr;
            const isSelected = day.date === selectedDate;
            const isSunday = day.dayOfWeek === 0;
            const hasFestival = day.festivals && day.festivals.length > 0;
            const isPournami = day.isPournami;
            const isAmavasya = day.isAmavasya;
            const isSankashtaChaturthi = day.tithi.number === 19;
            const dayReminders = getRemindersForDate(day.date);
            const hasReminders = dayReminders.length > 0;

            // Short tithi display
            const shortTithi = day.tithi
              ? `${day.tithi.paksha === 'Shukla' ? 'శు॥' : 'బ॥'} ${day.tithi.nameTelugu.replace(/^(పాడ్యమి|విదియ|తదియ|చవితి|పంచమి|షష్ఠి|సప్తమి|అష్టమి|నవమి|దశమి|ఏకాదశి|ద్వాదశి|త్రయోదశి|చతుర్దశి|పౌర్ణమి|అమావాస్య).*$/, '$1')}`
              : '';

            return (
              <div
                key={day.date}
                onClick={() => onSelectDate(day.date)}
                className={`day-cell min-h-[92px] md:min-h-[115px] p-1.5 md:p-2.5 flex flex-col justify-between cursor-pointer transition-all relative group select-none ${
                  isSelected
                    ? 'bg-amber-950/80 ring-2 ring-amber-500 z-10'
                    : isToday
                    ? 'bg-red-950/40 hover:bg-slate-800'
                    : isSunday
                    ? 'bg-red-950/10 hover:bg-slate-800/80'
                    : 'bg-slate-900/70 hover:bg-slate-800/80'
                }`}
              >
                {/* Top Row: UNIVERSAL ENGLISH DIGITS (1, 2, 3...) & Badges */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-1.5">
                    {/* Standard Universal English Digits */}
                    <span
                      className={`text-base md:text-xl font-bold font-mono ${
                        isSunday
                          ? 'text-red-400'
                          : isToday
                          ? 'text-amber-300 font-extrabold'
                          : 'text-slate-100'
                      }`}
                    >
                      {dayNum}
                    </span>
                    {isToday && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                    )}
                  </div>

                  {/* Special Markers: Reminders, Sankashta Chaturthi, Pournami, Amavasya */}
                  <div className="flex items-center space-x-1">
                    {hasReminders && (
                      <span
                        className="inline-flex items-center text-[10px] text-amber-300 bg-amber-950/80 border border-amber-500/60 rounded-full px-1.5 py-0.2 font-mono font-bold shadow"
                        title={`${dayReminders.length} reminder(s)`}
                      >
                        <Bell className="w-2.5 h-2.5 mr-0.5" />
                        <span>{dayReminders.length}</span>
                      </span>
                    )}

                    {isSankashtaChaturthi && (
                      <span
                        className="inline-flex items-center text-[10px] px-1 py-0.2 rounded bg-amber-900/80 text-amber-200 border border-amber-500/50"
                        title="సంకష్టహర చతుర్థి (Sankashta Chaturthi)"
                      >
                        🐘
                      </span>
                    )}

                    {isPournami && (
                      <span
                        className="inline-flex items-center text-[10px] md:text-xs font-semibold px-1 py-0.2 rounded bg-amber-400/20 text-amber-300 border border-amber-400/40"
                        title="పౌర్ణమి (Pournami)"
                      >
                        🌕
                      </span>
                    )}
                    {isAmavasya && (
                      <span
                        className="inline-flex items-center text-[10px] md:text-xs font-semibold px-1 py-0.2 rounded bg-slate-800 text-slate-300 border border-slate-700"
                        title="అమావాస్య (Amavasya)"
                      >
                        🌑
                      </span>
                    )}
                  </div>
                </div>

                {/* Middle Info: Tithi and Nakshatra */}
                <div className="my-1 space-y-0.5 text-[11px] md:text-xs font-telugu">
                  <div className="text-amber-200/90 font-medium truncate" title={day.tithi.nameTelugu}>
                    {shortTithi}
                  </div>
                  <div className="text-slate-400 text-[10px] md:text-[11px] truncate" title={day.nakshatra.nameTelugu}>
                    {day.nakshatra.nameTelugu} ({day.nakshatra.pada})
                  </div>
                </div>

                {/* Bottom Row: Festival indicator or Sunrise */}
                <div className="mt-auto">
                  {isSankashtaChaturthi ? (
                    <div
                      className="bg-amber-600/40 border border-amber-500/60 rounded px-1.5 py-0.5 text-[10px] md:text-xs text-amber-100 font-semibold truncate flex items-center space-x-1"
                      title="సంకష్టహర చతుర్థి (చంద్రోదయ పూజ)"
                    >
                      <span>🐘</span>
                      <span className="truncate font-telugu">సంకష్టహర చవితి</span>
                    </div>
                  ) : hasFestival ? (
                    <div
                      className="bg-red-600/30 border border-red-500/50 rounded px-1.5 py-0.5 text-[10px] md:text-xs text-amber-200 font-medium truncate flex items-center space-x-1"
                      title={day.festivals.map((f) => (isTe ? f.nameTelugu : f.nameEnglish)).join(', ')}
                    >
                      <Sparkles className="w-2.5 h-2.5 text-amber-300 shrink-0" />
                      <span className="truncate font-telugu">
                        {isTe ? day.festivals[0].nameTelugu : day.festivals[0].nameEnglish}
                      </span>
                    </div>
                  ) : (
                    <div className="text-[9px] md:text-[10px] text-slate-500 flex items-center justify-between font-mono">
                      <span className="flex items-center space-x-0.5">
                        <Sun className="w-2.5 h-2.5 text-amber-500/70" />
                        <span>{day.sunrise.formatted12}</span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
