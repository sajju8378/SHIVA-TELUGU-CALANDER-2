import React from 'react';
import { PanchangamDay } from '../engine/types';
import { toTeluguNumber } from '../utils/teluguNumbers';

interface PrintCalendarProps {
  days: PanchangamDay[];
  currentYear: number;
  currentMonth: number;
  cityName: string;
  useTeluguNumerals: boolean;
  language: 'te' | 'en';
}

const MONTH_NAMES_TE = [
  'జనవరి', 'ఫిబ్రవరి', 'మార్చి', 'ఏప్రిల్', 'మే', 'జూన్',
  'జులై', 'ఆగస్టు', 'సెప్టెంబర్', 'అక్టోబర్', 'నవంబర్', 'డిసెంబర్',
];

const WEEKDAYS = ['ఆది', 'సోమ', 'మంగళ', 'బుధ', 'గురు', 'శుక్ర', 'శని'];

export const PrintCalendar: React.FC<PrintCalendarProps> = ({
  days,
  currentYear,
  currentMonth,
  cityName,
  useTeluguNumerals,
}) => {
  if (days.length === 0) return null;

  const firstDay = days[0];
  const blankDays = Array.from({ length: firstDay.dayOfWeek });

  return (
    <div className="hidden print:block p-4 bg-white text-black font-telugu">
      {/* Header */}
      <div className="text-center border-b-2 border-black pb-2 mb-3">
        <h1 className="text-2xl font-bold tracking-tight">
          శ్రీ {firstDay.samvatsaraTelugu} నామ సంవత్సరం • {firstDay.monthTelugu}
        </h1>
        <div className="text-sm font-semibold flex items-center justify-center space-x-4 mt-1">
          <span>{MONTH_NAMES_TE[currentMonth - 1]} {useTeluguNumerals ? toTeluguNumber(currentYear) : currentYear}</span>
          <span>•</span>
          <span>{cityName}</span>
          <span>•</span>
          <span>{firstDay.ayanaTelugu} / {firstDay.rituTelugu}</span>
        </div>
      </div>

      {/* 7-column Calendar Table */}
      <table className="w-full border-collapse border-2 border-black text-xs">
        <thead>
          <tr className="bg-gray-100 text-center font-bold">
            {WEEKDAYS.map((w, idx) => (
              <th key={w} className={`border border-black p-1.5 ${idx === 0 ? 'text-red-700' : ''}`}>
                {w}వారం
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Group days into weeks */}
          {(() => {
            const allCells: (PanchangamDay | null)[] = [...blankDays.map(() => null), ...days];
            const rows = [];
            for (let i = 0; i < allCells.length; i += 7) {
              rows.push(allCells.slice(i, i + 7));
            }

            return rows.map((row, rIdx) => (
              <tr key={rIdx} className="h-20">
                {row.map((cell, cIdx) => {
                  if (!cell) {
                    return <td key={cIdx} className="border border-black bg-gray-50" />;
                  }
                  const dNum = parseInt(cell.date.split('-')[2], 10);
                  const isSun = cell.dayOfWeek === 0;
                  const hasFest = cell.festivals && cell.festivals.length > 0;

                  return (
                    <td
                      key={cIdx}
                      className="border border-black p-1 align-top relative"
                    >
                      <div className="flex justify-between items-start font-bold">
                        <span className={`text-base font-serif-num ${isSun ? 'text-red-700' : ''}`}>
                          {useTeluguNumerals ? toTeluguNumber(dNum) : dNum}
                        </span>
                        <div className="text-[10px]">
                          {cell.isPournami && <span className="font-bold">🌕 పౌర్ణమి</span>}
                          {cell.isAmavasya && <span className="font-bold">🌑 అమావాస్య</span>}
                        </div>
                      </div>

                      <div className="text-[10px] mt-0.5 space-y-0.5 leading-tight">
                        <div className="font-semibold text-gray-800 truncate">
                          {cell.tithi.paksha === 'Shukla' ? 'శు॥' : 'బ॥'} {cell.tithi.nameTelugu}
                        </div>
                        <div className="text-gray-600 truncate">
                          {cell.nakshatra.nameTelugu}
                        </div>
                      </div>

                      {hasFest && (
                        <div className="mt-1 text-[9px] font-bold text-red-800 bg-red-50 p-0.5 rounded leading-tight truncate">
                          ★ {cell.festivals[0].nameTelugu}
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ));
          })()}
        </tbody>
      </table>

      {/* Footer Notes */}
      <div className="mt-3 text-[10px] text-gray-700 flex justify-between border-t border-gray-400 pt-1">
        <div>లహరి (చిత్రాపక్ష) అయనాంశ • అమాంత పద్ధతి • సూర్యోదయ వార గణన</div>
        <div>ముద్రణ తేదీ: {new Date().toLocaleDateString('te-IN')}</div>
      </div>
    </div>
  );
};
