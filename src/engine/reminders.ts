export interface PanchangamReminder {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  time?: string; // "HH:MM" 24h
  category: 'puja' | 'fasting' | 'muhurtam' | 'personal';
  notes?: string;
  createdAt: number;
}

const STORAGE_KEY = 'telugu_panchangam_reminders_v1';

export function loadAllReminders(): PanchangamReminder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load reminders:', e);
    return [];
  }
}

export function saveAllReminders(reminders: PanchangamReminder[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reminders));
  } catch (e) {
    console.error('Failed to save reminders:', e);
  }
}

export function getRemindersForDate(dateStr: string): PanchangamReminder[] {
  const all = loadAllReminders();
  return all.filter((r) => r.date === dateStr);
}

export function addReminder(
  date: string,
  title: string,
  time = '06:00',
  category: 'puja' | 'fasting' | 'muhurtam' | 'personal' = 'puja',
  notes = ''
): PanchangamReminder {
  const all = loadAllReminders();
  const newReminder: PanchangamReminder = {
    id: 'rem_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
    date,
    title,
    time,
    category,
    notes,
    createdAt: Date.now(),
  };
  all.push(newReminder);
  saveAllReminders(all);
  return newReminder;
}

export function deleteReminder(id: string): void {
  const all = loadAllReminders();
  const updated = all.filter((r) => r.id !== id);
  saveAllReminders(updated);
}

/**
 * Creates Google Calendar URL to add event with 1-click
 */
export function getGoogleCalendarLink(reminder: PanchangamReminder): string {
  const dateParts = reminder.date.replace(/-/g, '');
  const timeClean = reminder.time ? reminder.time.replace(':', '') + '00' : '060000';
  const startIso = `${dateParts}T${timeClean}`;
  // 1 hour event
  const endHour = reminder.time ? (parseInt(reminder.time.split(':')[0], 10) + 1).toString().padStart(2, '0') : '07';
  const endMin = reminder.time ? reminder.time.split(':')[1] : '00';
  const endIso = `${dateParts}T${endHour}${endMin}00`;

  const details = encodeURIComponent(
    `${reminder.notes || ''}\n\nAdded from Telugu Panchangam 2027`
  );
  const text = encodeURIComponent(reminder.title);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${text}&dates=${startIso}/${endIso}&details=${details}&sf=true&output=xml`;
}
