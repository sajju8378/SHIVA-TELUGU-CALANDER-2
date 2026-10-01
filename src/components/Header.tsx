import React from 'react';
import {
  Calendar as CalendarIcon,
  MapPin,
  Globe,
  Printer,
  Clock,
  Sparkles,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Smartphone,
  Bell,
} from 'lucide-react';
import { CityOption } from '../engine/types';

interface HeaderProps {
  currentYear: number;
  currentMonth: number; // 1-12
  onPrevMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
  onYearChange: (year: number) => void;
  language: 'te' | 'en';
  onToggleLanguage: () => void;
  selectedCity: CityOption;
  onOpenCityPicker: () => void;
  activeTab: 'calendar' | 'day' | 'festivals' | 'muhurtam' | 'reminders' | 'docs';
  onSelectTab: (tab: 'calendar' | 'day' | 'festivals' | 'muhurtam' | 'reminders' | 'docs') => void;
  onPrint: () => void;
  onDownloadApk: () => void;
  samvatsaraDisplay?: string;
  teluguMonthDisplay?: string;
}

const MONTH_NAMES_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

const MONTH_NAMES_TE = [
  'జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్',
  'జులై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్',
];

export const Header: React.FC<HeaderProps> = ({
  currentYear,
  currentMonth,
  onPrevMonth,
  onNextMonth,
  onToday,
  onYearChange,
  language,
  onToggleLanguage,
  selectedCity,
  onOpenCityPicker,
  activeTab,
  onSelectTab,
  onPrint,
  onDownloadApk,
  samvatsaraDisplay,
  teluguMonthDisplay,
}) => {
  const isTe = language === 'te';
  const monthName = isTe ? MONTH_NAMES_TE[currentMonth - 1] : MONTH_NAMES_EN[currentMonth - 1];

  return (
    <header className="bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-b border-amber-900/40 text-slate-100 shadow-xl sticky top-0 z-40">
      {/* Top Banner with Religious / Traditional Banner & Quick Tools */}
      <div className="max-w-7xl mx-auto px-4 py-2 border-b border-amber-900/30 flex flex-wrap items-center justify-between text-xs text-amber-200/90 gap-2">
        <div className="flex items-center space-x-2">
          <span className="text-amber-400 font-semibold">🕉️ శుభమస్తు</span>
          <span className="text-slate-400">|</span>
          <span className="font-telugu font-semibold">
            {samvatsaraDisplay || `శ్రీ ప్లవంగ నామ సంవత్సరం (${currentYear})`}
          </span>
          {teluguMonthDisplay && (
            <>
              <span className="text-slate-400 hidden sm:inline">·</span>
              <span className="font-telugu text-amber-300 hidden sm:inline">{teluguMonthDisplay}</span>
            </>
          )}
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3">
          {/* Reminders Button right in Top Header */}
          <button
            onClick={() => onSelectTab('reminders')}
            className={`flex items-center space-x-1.5 px-3 py-1 rounded-lg border text-xs font-bold transition-all ${
              activeTab === 'reminders'
                ? 'bg-amber-600 text-slate-950 border-amber-500 shadow-md ring-1 ring-amber-400'
                : 'bg-amber-950/70 hover:bg-amber-900 border-amber-700/60 text-amber-200'
            }`}
            title="Open Reminders & Notes Section"
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span>{isTe ? 'రిమైండర్లు' : 'Reminders'}</span>
          </button>

          {/* Location Button */}
          <button
            onClick={onOpenCityPicker}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-850 border border-slate-700 text-slate-200 transition-colors"
            title="Change City Location for accurate Sunrise/Kalam"
          >
            <MapPin className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-telugu font-medium">
              {isTe ? selectedCity.nameTelugu.split(' ')[0] : selectedCity.nameEnglish.split(' ')[0]}
            </span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center space-x-1 px-2.5 py-1 rounded bg-amber-900/70 hover:bg-amber-800 border border-amber-700/60 text-amber-100 font-medium transition-colors"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{isTe ? 'English' : 'తెలుగు'}</span>
          </button>

          {/* Download APK Button */}
          <button
            onClick={onDownloadApk}
            className="flex items-center space-x-1.5 px-2.5 py-1 rounded bg-emerald-900/80 hover:bg-emerald-800 border border-emerald-600/60 text-emerald-200 font-semibold shadow-sm transition-all"
            title="Download Android APK"
          >
            <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isTe ? 'APK డౌన్‌లోడ్' : 'Download APK'}</span>
          </button>

          {/* Print Calendar */}
          <button
            onClick={onPrint}
            className="p-1 rounded hover:bg-slate-800 text-slate-300 transition-colors hidden md:block"
            title="Print Calendar Month"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Bar with Navigation & Title */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* App Title */}
        <div className="flex items-center space-x-3 cursor-pointer" onClick={() => onSelectTab('calendar')}>
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-red-600 to-amber-600 p-0.5 shadow-lg shadow-red-950/50 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center text-amber-400 font-mono font-bold text-xl">
              27
            </div>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold font-telugu text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-100 to-amber-300 tracking-tight">
              {isTe ? 'తెలుగు పంచాంగం & క్యాలెండర్' : 'Telugu Hindu Panchangam'}
            </h1>
            <p className="text-xs text-amber-200/70 font-telugu">
              {isTe ? 'ఖచ్చితమైన ఖగోళ గణనలతో • అమాంత సాంప్రదాయం' : 'High-Precision Lahiri Astronomical Calculations • Amanta System'}
            </p>
          </div>
        </div>

        {/* Month & Year Navigation Bar - Standard English Universal Numbers */}
        <div className="flex items-center bg-slate-900/90 border border-amber-900/40 rounded-xl p-1.5 shadow-inner">
          <button
            onClick={onPrevMonth}
            className="p-1.5 rounded-lg hover:bg-amber-950 text-amber-300 transition-colors"
            title="Previous Month"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="px-3 flex items-center space-x-2 text-center">
            <span className="font-heading text-lg font-bold text-amber-200 min-w-24">
              {monthName}
            </span>
            <select
              value={currentYear}
              onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
              className="bg-transparent text-amber-300 font-mono font-bold text-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-amber-500 rounded px-1"
            >
              {[2024, 2025, 2026, 2027, 2028, 2029, 2030].map((y) => (
                <option key={y} value={y} className="bg-slate-900 text-slate-100">
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={onNextMonth}
            className="p-1.5 rounded-lg hover:bg-amber-950 text-amber-300 transition-colors"
            title="Next Month"
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            onClick={onToday}
            className="ml-2 px-2.5 py-1 text-xs font-semibold rounded bg-amber-600/30 hover:bg-amber-600/50 text-amber-300 border border-amber-500/40 transition-colors"
          >
            {isTe ? 'ఈ రోజు' : 'Today'}
          </button>
        </div>

        {/* View Tabs */}
        <nav className="flex items-center space-x-1 bg-slate-950/60 p-1 rounded-xl border border-amber-900/30 overflow-x-auto max-w-full">
          <button
            onClick={() => onSelectTab('calendar')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'calendar'
                ? 'bg-amber-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-amber-200 hover:bg-slate-900'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span className="font-telugu">{isTe ? 'క్యాలెండర్' : 'Calendar'}</span>
          </button>

          <button
            onClick={() => onSelectTab('reminders')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
              activeTab === 'reminders'
                ? 'bg-amber-600 text-slate-950 font-extrabold shadow-md ring-1 ring-amber-400'
                : 'text-amber-300 hover:text-amber-100 hover:bg-slate-900 bg-amber-950/30'
            }`}
          >
            <Bell className="w-3.5 h-3.5 text-amber-400" />
            <span className="font-telugu">{isTe ? 'రిమైండర్లు (Reminders)' : 'Reminders'}</span>
          </button>

          <button
            onClick={() => onSelectTab('day')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'day'
                ? 'bg-amber-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-amber-200 hover:bg-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="font-telugu">{isTe ? 'నేటి పంచాంగం' : 'Day View'}</span>
          </button>

          <button
            onClick={() => onSelectTab('festivals')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'festivals'
                ? 'bg-amber-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-amber-200 hover:bg-slate-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="font-telugu">{isTe ? 'పండుగలు' : 'Festivals'}</span>
          </button>

          <button
            onClick={() => onSelectTab('muhurtam')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'muhurtam'
                ? 'bg-amber-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-amber-200 hover:bg-slate-900'
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span className="font-telugu">{isTe ? 'ముహూర్తాలు' : 'Muhurtams'}</span>
          </button>

          <button
            onClick={() => onSelectTab('docs')}
            className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'docs'
                ? 'bg-amber-600 text-slate-950 font-bold shadow-md'
                : 'text-slate-300 hover:text-amber-200 hover:bg-slate-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span className="font-telugu">{isTe ? 'సూత్రాలు' : 'Rules'}</span>
          </button>
        </nav>
      </div>
    </header>
  );
};
