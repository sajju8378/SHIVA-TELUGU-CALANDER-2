import React, { useState, useEffect } from 'react';
import {
  PanchangamReminder,
  loadAllReminders,
  deleteReminder,
  getGoogleCalendarLink,
} from '../engine/reminders';
import {
  Bell,
  Trash2,
  Calendar,
  Clock,
  ExternalLink,
  Plus,
  ArrowRight,
  Filter,
} from 'lucide-react';

interface AllRemindersViewProps {
  onSelectDate: (date: string) => void;
  language: 'te' | 'en';
}

export const AllRemindersView: React.FC<AllRemindersViewProps> = ({
  onSelectDate,
  language,
}) => {
  const isTe = language === 'te';
  const [reminders, setReminders] = useState<PanchangamReminder[]>([]);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const refreshList = () => {
    const list = loadAllReminders().sort((a, b) => a.date.localeCompare(b.date));
    setReminders(list);
  };

  useEffect(() => {
    refreshList();
  }, []);

  const handleDelete = (id: string) => {
    deleteReminder(id);
    refreshList();
  };

  const filtered = reminders.filter(
    (r) => filterCategory === 'all' || r.category === filterCategory
  );

  return (
    <div className="space-y-6 max-w-4xl mx-auto font-telugu">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-amber-900/40 rounded-2xl p-5 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-amber-200 flex items-center space-x-2">
            <Bell className="w-6 h-6 text-amber-400" />
            <span>{isTe ? 'మీ పూజా రిమైండర్లు & వ్రత జ్ఞాపికలు' : 'My Scheduled Reminders & Vratam Notes'}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {isTe
              ? 'మీరు సేవ్ చేసుకున్న అన్ని పూజలు, ఉపవాసాలు మరియు శుభకార్యాల జ్ఞాపికలు (బ్రౌజర్‌లో సురక్షితంగా భద్రపరచబడతాయి)'
              : 'All your saved puja reminders, fasts, and personal muhurtams saved offline in your browser'}
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          {[
            { id: 'all', te: 'అన్నీ (All)', en: 'All' },
            { id: 'puja', te: 'పూజలు', en: 'Puja' },
            { id: 'fasting', te: 'ఉపవాసాలు', en: 'Fasting' },
            { id: 'muhurtam', te: 'ముహూర్తాలు', en: 'Muhurtam' },
            { id: 'personal', te: 'వ్యక్తిగతం', en: 'Personal' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterCategory(cat.id)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                filterCategory === cat.id
                  ? 'bg-amber-600 text-slate-950 font-bold shadow'
                  : 'bg-slate-950/60 hover:bg-slate-800 text-slate-300 border border-slate-800'
              }`}
            >
              {isTe ? cat.te : cat.en}
            </button>
          ))}
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 bg-slate-900/40 rounded-2xl border border-slate-800/80 space-y-3">
            <Bell className="w-8 h-8 mx-auto text-slate-600" />
            <p className="text-sm">
              {isTe
                ? 'ఎటువంటి రిమైండర్లు లేవు. క్యాలెండర్‌లో ఏదైనా తేదీని ఎంచుకుని "రిమైండర్లు & నోట్స్" ద్వారా సులభంగా జోడించుకోవచ్చు.'
                : 'No reminders saved yet. Click on any date in the calendar and add your puja or event reminders.'}
            </p>
          </div>
        ) : (
          filtered.map((rem) => {
            const gCalUrl = getGoogleCalendarLink(rem);
            const badgeBg =
              rem.category === 'puja'
                ? 'bg-amber-950/80 text-amber-200 border-amber-800/50'
                : rem.category === 'fasting'
                ? 'bg-indigo-950/80 text-indigo-200 border-indigo-800/50'
                : rem.category === 'muhurtam'
                ? 'bg-emerald-950/80 text-emerald-200 border-emerald-800/50'
                : 'bg-slate-800 text-slate-200 border-slate-700';

            return (
              <div
                key={rem.id}
                className="p-4 rounded-xl bg-slate-900/80 border border-amber-900/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow hover:border-amber-600/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-base text-slate-100">{rem.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-semibold ${badgeBg}`}>
                      {rem.category}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-amber-400 font-mono">
                    <span className="flex items-center space-x-1">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{rem.date}</span>
                    </span>
                    {rem.time && (
                      <span className="flex items-center space-x-1">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{rem.time}</span>
                      </span>
                    )}
                  </div>

                  {rem.notes && <p className="text-xs text-slate-300 mt-1">{rem.notes}</p>}
                </div>

                <div className="flex items-center space-x-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-slate-800">
                  {/* Jump to Date button */}
                  <button
                    onClick={() => onSelectDate(rem.date)}
                    className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-600/20 hover:bg-amber-600/40 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-colors"
                  >
                    <span>{isTe ? 'క్యాలెండర్‌లో చూడండి' : 'View Date'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>

                  {/* Add to Google Calendar */}
                  <a
                    href={gCalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-amber-300 transition-colors"
                    title="Export to Google Calendar"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(rem.id)}
                    className="p-2 rounded-lg bg-slate-800 hover:bg-red-950/60 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete Reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
