import React, { useState, useMemo } from 'react';
import { FestivalItem } from '../engine/types';
import { Sparkles, Search, Filter, Calendar as CalendarIcon, ArrowRight } from 'lucide-react';
import { toTeluguNumber } from '../utils/teluguNumbers';

interface FestivalListProps {
  festivals: FestivalItem[];
  currentYear: number;
  onSelectDate: (date: string) => void;
  language: 'te' | 'en';
  useTeluguNumerals: boolean;
}

export const FestivalList: React.FC<FestivalListProps> = ({
  festivals,
  currentYear,
  onSelectDate,
  language,
  useTeluguNumerals,
}) => {
  const isTe = language === 'te';
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredFestivals = useMemo(() => {
    return festivals.filter((f) => {
      const matchesCategory = selectedCategory === 'all' || f.category === selectedCategory;
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        f.nameTelugu.toLowerCase().includes(q) ||
        f.nameEnglish.toLowerCase().includes(q) ||
        (f.ruleDescriptionTelugu && f.ruleDescriptionTelugu.toLowerCase().includes(q)) ||
        (f.ruleDescriptionEnglish && f.ruleDescriptionEnglish.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [festivals, search, selectedCategory]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto font-telugu">
      {/* Header and Search Filters */}
      <div className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-amber-200 flex items-center space-x-2">
              <Sparkles className="w-6 h-6 text-amber-400" />
              <span>
                {isTe
                  ? `${useTeluguNumerals ? toTeluguNumber(currentYear) : currentYear} సంవత్సరపు తెలుగు పండుగలు & వ్రతాలు`
                  : `Telugu Festivals & Vratams for ${currentYear}`}
              </span>
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isTe
                ? 'పంచాంగ తిథి నిర్ణయ సూత్రాల ఆధారంగా ఖచ్చితంగా గణించబడిన పండుగల జాబితా'
                : 'Mathematically derived festival dates based on traditional Telugu Amanta Panchangam rules'}
            </p>
          </div>

          {/* Search Input */}
          <div className="relative min-w-[260px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={isTe ? 'పండుగ పేరు శోధించండి...' : 'Search festival name...'}
              className="w-full bg-slate-950 border border-amber-900/40 rounded-xl pl-9 pr-4 py-2 text-xs md:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-900/30">
          <span className="text-xs text-amber-300/80 mr-1 flex items-center space-x-1">
            <Filter className="w-3.5 h-3.5" />
            <span>{isTe ? 'వర్గాలు:' : 'Filter:'}</span>
          </span>

          {[
            { id: 'all', te: 'అన్నీ (All)', en: 'All' },
            { id: 'major', te: 'ప్రధాన పండుగలు', en: 'Major Festivals' },
            { id: 'vratam', te: 'వ్రతాలు & పూజలు', en: 'Vratams & Observances' },
            { id: 'ekadashi', te: 'ఏకాదశులు', en: 'Ekadashis' },
            { id: 'jayanti', te: 'జయంతి ఉత్సవాలు', en: 'Jayantis' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-slate-950 font-bold shadow-md'
                  : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {isTe ? cat.te : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* Festivals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredFestivals.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-400 bg-slate-900/40 rounded-xl border border-slate-800">
            {isTe ? 'ఎటువంటి పండుగలు కనుగొనబడలేదు.' : 'No festivals found matching your search.'}
          </div>
        ) : (
          filteredFestivals.map((festival) => {
            const dateParts = festival.date.split('-');
            const y = parseInt(dateParts[0], 10);
            const m = parseInt(dateParts[1], 10);
            const d = parseInt(dateParts[2], 10);

            const dateDisplay = `${useTeluguNumerals ? toTeluguNumber(d) : d}-${useTeluguNumerals ? toTeluguNumber(m) : m}-${useTeluguNumerals ? toTeluguNumber(y) : y}`;

            const badgeBg =
              festival.category === 'major'
                ? 'bg-red-950/80 text-red-200 border-red-700/60'
                : festival.category === 'ekadashi'
                ? 'bg-indigo-950/80 text-indigo-200 border-indigo-700/60'
                : festival.category === 'vratam'
                ? 'bg-emerald-950/80 text-emerald-200 border-emerald-700/60'
                : 'bg-amber-950/80 text-amber-200 border-amber-700/60';

            return (
              <div
                key={`${festival.id}-${festival.date}`}
                onClick={() => onSelectDate(festival.date)}
                className="bg-slate-900/80 border border-amber-900/30 rounded-xl p-4 hover:border-amber-600/60 transition-all hover:bg-slate-850 cursor-pointer shadow-md flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="text-base md:text-lg font-bold text-amber-200 group-hover:text-amber-300 transition-colors">
                      {isTe ? festival.nameTelugu : festival.nameEnglish}
                    </h3>
                    <span className={`text-[11px] px-2 py-0.5 rounded border font-semibold ${badgeBg}`}>
                      {festival.category.toUpperCase()}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-xs text-amber-400 font-semibold mt-1">
                    <CalendarIcon className="w-3.5 h-3.5" />
                    <span>{dateDisplay}</span>
                  </div>

                  {/* Derivation Rule */}
                  <div className="mt-2.5 p-2 rounded bg-slate-950/60 border border-slate-800 text-xs text-slate-300">
                    <span className="font-semibold text-amber-300">{isTe ? 'సూత్రం:' : 'Rule:'} </span>
                    <span>{isTe ? festival.ruleDescriptionTelugu : festival.ruleDescriptionEnglish}</span>
                  </div>

                  {/* Religious Significance */}
                  {festival.significanceTelugu && (
                    <p className="mt-2 text-xs text-slate-400 line-clamp-2">
                      {isTe ? festival.significanceTelugu : festival.significanceEnglish}
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400/80 group-hover:text-amber-300">
                  <span>{isTe ? 'క్యాలెండర్‌లో చూడండి' : 'View in Calendar'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
