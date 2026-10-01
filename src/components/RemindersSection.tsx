import React, { useState, useEffect } from 'react';
import { PanchangamDay } from '../engine/types';
import {
  PanchangamReminder,
  getRemindersForDate,
  addReminder,
  deleteReminder,
  getGoogleCalendarLink,
} from '../engine/reminders';
import {
  Bell,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  ExternalLink,
  Check,
} from 'lucide-react';

interface RemindersSectionProps {
  day: PanchangamDay;
  language: 'te' | 'en';
  onReminderChange?: () => void;
}

export const RemindersSection: React.FC<RemindersSectionProps> = ({
  day,
  language,
  onReminderChange,
}) => {
  const isTe = language === 'te';
  const [reminders, setReminders] = useState<PanchangamReminder[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [title, setTitle] = useState('');
  const [time, setTime] = useState('06:00');
  const [category, setCategory] = useState<'puja' | 'fasting' | 'muhurtam' | 'personal'>('puja');
  const [notes, setNotes] = useState('');

  const refreshReminders = () => {
    const list = getRemindersForDate(day.date);
    setReminders(list);
    if (onReminderChange) onReminderChange();
  };

  useEffect(() => {
    refreshReminders();
  }, [day.date]);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    addReminder(day.date, title.trim(), time, category, notes.trim());
    setTitle('');
    setNotes('');
    setShowAddForm(false);
    refreshReminders();
  };

  const handleDelete = (id: string) => {
    deleteReminder(id);
    refreshReminders();
  };

  const handleAddPreset = (presetTitle: string, presetCategory: 'puja' | 'fasting' | 'muhurtam' | 'personal', presetTime = '06:00') => {
    addReminder(day.date, presetTitle, presetTime, presetCategory, `Telugu Panchangam: ${day.teluguDateDisplay}`);
    refreshReminders();
  };

  return (
    <div className="space-y-4 font-telugu">
      {/* Header and Add Button */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/50 to-slate-900 border border-amber-900/40 flex items-center justify-between">
        <div className="flex items-center space-x-2 text-amber-300">
          <Bell className="w-5 h-5 text-amber-400" />
          <h4 className="font-bold text-sm md:text-base">
            {isTe ? 'ఈ తేదీ రిమైండర్లు & పూజా జ్ఞాపికలు' : 'Reminders & Puja Notes for this Date'}
          </h4>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs shadow transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{isTe ? 'కొత్త రిమైండర్' : 'Add Reminder'}</span>
        </button>
      </div>

      {/* Preset Quick-Add Chips */}
      <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
        <div className="text-xs text-slate-400 flex items-center space-x-1 font-semibold">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>{isTe ? 'త్వరిత పూజా రిమైండర్లు:' : 'Quick Religious Reminders:'}</span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <button
            onClick={() => handleAddPreset(isTe ? 'ఉదయపు దీపారాధన & పూజ' : 'Morning Lamp Lighting & Puja', 'puja', '06:00')}
            className="px-2.5 py-1 rounded-lg bg-amber-950/60 hover:bg-amber-900/60 border border-amber-800/40 text-amber-200 transition-colors"
          >
            🪔 {isTe ? 'ఉదయపు దీపారాధన' : 'Morning Puja'}
          </button>

          {(day.tithi.number === 11 || day.tithi.number === 26) && (
            <button
              onClick={() => handleAddPreset(isTe ? 'ఏకాదశి ఉపవాస వ్రతం' : 'Ekadashi Fasting', 'fasting', '05:30')}
              className="px-2.5 py-1 rounded-lg bg-indigo-950/60 hover:bg-indigo-900/60 border border-indigo-800/40 text-indigo-200 transition-colors"
            >
              🌿 {isTe ? 'ఏకాదశి ఉపవాసం' : 'Ekadashi Fasting'}
            </button>
          )}

          {day.festivals.length > 0 && (
            <button
              onClick={() => handleAddPreset(`${day.festivals[0].nameTelugu} పూజ`, 'puja', '08:00')}
              className="px-2.5 py-1 rounded-lg bg-red-950/60 hover:bg-red-900/60 border border-red-800/40 text-red-200 transition-colors"
            >
              🎉 {day.festivals[0].nameTelugu}
            </button>
          )}

          {day.timings.abhijitMuhurtam && (
            <button
              onClick={() => handleAddPreset(isTe ? 'అభిజిత్ ముహూర్త శుభకార్యం' : 'Abhijit Muhurtam Activity', 'muhurtam', day.timings.abhijitMuhurtam?.start.formatted24 || '12:00')}
              className="px-2.5 py-1 rounded-lg bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-800/40 text-emerald-200 transition-colors"
            >
              ✨ {isTe ? 'అభిజిత్ ముహూర్తం' : 'Abhijit Muhurtam'}
            </button>
          )}
        </div>
      </div>

      {/* Add Reminder Form */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="p-4 rounded-xl bg-slate-950 border border-amber-800/50 space-y-3 animate-in fade-in duration-150">
          <div className="font-bold text-xs text-amber-300">
            {isTe ? 'నూతన రిమైండర్ వివరాలు:' : 'New Reminder Details:'}
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              {isTe ? 'శీర్షిక (విషయం):' : 'Title / Event:'}
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={isTe ? 'ఉదాహరణ: సత్యనారాయణ స్వామి వ్రతం' : 'e.g. Satyanarayana Swamy Vratam'}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {isTe ? 'సమయం (Time):' : 'Time:'}
              </label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {isTe ? 'వర్గం:' : 'Category:'}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as any)}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="puja">{isTe ? 'పూజ / వ్రతం' : 'Puja / Vratam'}</option>
                <option value="fasting">{isTe ? 'ఉపవాసం' : 'Fasting'}</option>
                <option value="muhurtam">{isTe ? 'ముహూర్తం' : 'Muhurtam'}</option>
                <option value="personal">{isTe ? 'వ్యక్తిగతం' : 'Personal'}</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs text-slate-400 block mb-1">
              {isTe ? 'అదనపు గమనికలు (ఐచ్ఛికం):' : 'Notes (Optional):'}
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={isTe ? 'పూజా సామగ్రి, ఆలయ దర్శనం మొదలైనవి...' : 'Items needed, temple details...'}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-slate-100 placeholder-slate-500"
            />
          </div>

          <div className="flex justify-end space-x-2 pt-1">
            <button
              type="button"
              onClick={() => setShowAddForm(false)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-xs text-slate-300"
            >
              {isTe ? 'రద్దు' : 'Cancel'}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold text-xs"
            >
              {isTe ? 'సేవ్ చేయండి' : 'Save'}
            </button>
          </div>
        </form>
      )}

      {/* Reminders List */}
      <div className="space-y-2">
        {reminders.length === 0 ? (
          <div className="p-6 text-center text-slate-500 bg-slate-950/40 rounded-xl border border-slate-800/80 text-xs">
            {isTe
              ? 'ఈ తేదీకి ఎటువంటి రిమైండర్లు లేవు. మీ పూజలు, ఉపవాసాలు లేదా శుభకార్యాల జ్ఞాపికలను జోడించుకోండి.'
              : 'No reminders set for this date yet. Add your puja, fasting, or event notes above.'}
          </div>
        ) : (
          reminders.map((rem) => {
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
                className="p-3.5 rounded-xl bg-slate-850/90 border border-slate-750 flex items-start justify-between gap-3 shadow-sm hover:border-amber-700/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-sm text-slate-100">{rem.title}</span>
                    <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-semibold ${badgeBg}`}>
                      {rem.category}
                    </span>
                  </div>

                  {rem.time && (
                    <div className="flex items-center space-x-1 text-xs text-amber-400 font-mono">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{rem.time}</span>
                    </div>
                  )}

                  {rem.notes && <p className="text-xs text-slate-300">{rem.notes}</p>}
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  {/* Google Calendar export link */}
                  <a
                    href={gCalUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-amber-400 transition-colors"
                    title="Add to Google Calendar"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {/* Delete button */}
                  <button
                    onClick={() => handleDelete(rem.id)}
                    className="p-1.5 rounded-lg hover:bg-red-950/50 text-slate-400 hover:text-red-400 transition-colors"
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
