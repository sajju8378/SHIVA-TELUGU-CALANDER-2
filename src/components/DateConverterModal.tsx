import React, { useState } from 'react';
import { calculatePanchangamForDay, TELUGU_MONTHS, TITHI_NAMES } from '../engine/panchangam';
import { Calendar, Search, ArrowRightLeft, X, Sparkles } from 'lucide-react';

interface DateConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDate: (date: string) => void;
  language: 'te' | 'en';
}

export const DateConverterModal: React.FC<DateConverterModalProps> = ({
  isOpen,
  onClose,
  onSelectDate,
  language,
}) => {
  if (!isOpen) return null;
  const isTe = language === 'te';

  const [mode, setMode] = useState<'g2t' | 't2g'>('g2t');
  const [inputDate, setInputDate] = useState('2027-04-07');
  const [selectedMonth, setSelectedMonth] = useState(0); // Chaitra
  const [selectedTithi, setSelectedTithi] = useState(1); // Pratipada

  // Gregorian to Telugu Result
  const g2tResult = calculatePanchangamForDay(inputDate);

  // Telugu to Gregorian Search (scan 2027)
  const handleTeluguSearch = () => {
    const start = new Date(2027, 0, 1);
    for (let i = 0; i < 365; i++) {
      const cur = new Date(start.getTime() + i * 86400000);
      const ds = cur.toISOString().split('T')[0];
      const p = calculatePanchangamForDay(ds);
      // Check month and tithi
      // Month data
      const mIdx = TELUGU_MONTHS.findIndex((m) => m.telugu === p.monthTelugu);
      if (mIdx === selectedMonth && p.tithi.number === selectedTithi) {
        onSelectDate(ds);
        onClose();
        return;
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-amber-900/50 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden font-telugu animate-in fade-in zoom-in-95 duration-200">
        <div className="p-4 bg-gradient-to-r from-red-950 via-slate-900 to-amber-950 border-b border-amber-900/40 flex items-center justify-between text-amber-200">
          <div className="flex items-center space-x-2">
            <ArrowRightLeft className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">
              {isTe ? 'తెలుగు తేదీ మార్పిడి (Date Converter)' : 'Telugu Date Converter & Finder'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4 text-xs md:text-sm">
          {/* Mode Switcher */}
          <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => setMode('g2t')}
              className={`py-2 px-3 rounded-lg font-medium transition-all text-center ${
                mode === 'g2t'
                  ? 'bg-amber-600 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isTe ? 'ఇంగ్లీష్ ➔ తెలుగు' : 'English ➔ Telugu'}
            </button>
            <button
              onClick={() => setMode('t2g')}
              className={`py-2 px-3 rounded-lg font-medium transition-all text-center ${
                mode === 't2g'
                  ? 'bg-amber-600 text-slate-950 font-bold shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {isTe ? 'తెలుగు ➔ ఇంగ్లీష్' : 'Telugu ➔ English'}
            </button>
          </div>

          {mode === 'g2t' ? (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isTe ? 'ఇంగ్లీష్ తేదీ ఎంచుకోండి:' : 'Select Gregorian Date:'}
                </label>
                <input
                  type="date"
                  value={inputDate}
                  onChange={(e) => setInputDate(e.target.value)}
                  className="w-full bg-slate-950 border border-amber-900/40 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-mono"
                />
              </div>

              {/* Conversion Result Card */}
              <div className="p-3.5 rounded-xl bg-slate-950/80 border border-amber-800/40 space-y-2">
                <div className="text-amber-400 font-bold text-xs uppercase tracking-wider">
                  {isTe ? 'తెలుగు పంచాంగ సమాచారం:' : 'Telugu Panchangam Date:'}
                </div>
                <div className="text-base font-bold text-amber-200">
                  {g2tResult.teluguDateDisplay}
                </div>
                <div className="text-xs text-slate-300 space-y-1 pt-1 border-t border-slate-800">
                  <div>నక్షత్రం: <strong className="text-slate-100">{g2tResult.nakshatra.nameTelugu} ({g2tResult.nakshatra.pada}వ పాదం)</strong></div>
                  <div>యోగం: {g2tResult.yoga.nameTelugu} | కరణం: {g2tResult.karana.nameTelugu}</div>
                  <div>వారం: {g2tResult.varaTelugu}</div>
                </div>
              </div>

              <button
                onClick={() => {
                  onSelectDate(inputDate);
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md transition-colors"
              >
                {isTe ? 'ఈ రోజు పంచాంగం తెరవండి' : 'Open in Calendar'}
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isTe ? 'తెలుగు మాసం ఎంచుకోండి:' : 'Select Telugu Month:'}
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-amber-900/40 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {TELUGU_MONTHS.map((m, idx) => (
                    <option key={m.no} value={idx}>
                      {m.telugu} ({m.english})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-400 block mb-1">
                  {isTe ? 'తిథి ఎంచుకోండి:' : 'Select Tithi:'}
                </label>
                <select
                  value={selectedTithi}
                  onChange={(e) => setSelectedTithi(parseInt(e.target.value, 10))}
                  className="w-full bg-slate-950 border border-amber-900/40 rounded-xl px-3 py-2 text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
                >
                  {TITHI_NAMES.map((t) => (
                    <option key={t.no} value={t.no}>
                      {t.paksha === 'Shukla' ? 'శుక్ల' : 'కృష్ణ'} {t.telugu} ({t.english})
                    </option>
                  ))}
                </select>
              </div>

              <button
                onClick={handleTeluguSearch}
                className="w-full py-2.5 px-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow-md transition-colors flex items-center justify-center space-x-1.5"
              >
                <Search className="w-4 h-4" />
                <span>{isTe ? '2027 లో తేదీని కనుగొనండి' : 'Find Date in 2027'}</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
