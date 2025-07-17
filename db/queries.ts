// Query helper functions (insert, get, etc.)

import { CalendarEntry, SimpleDate, Time, TimeRange } from '@/components/Calendar';
import { getDB } from './database';

interface CalendarEntryRow {
  id: number;
  date: string;
  sleep_quality: number;
  sleep_time_start: string;
  sleep_time_end: string;
  notes: string;
}

// Insert a CalendarEntry object into the 'entries' table.
export const insertEntry = async (entry: CalendarEntry) => {
  const db = await getDB();
  await db.runAsync(
    'INSERT INTO entries (date, sleep_quality, sleep_time_start, sleep_time_end, notes) VALUES (?, ?, ?, ?, ?);',
    entry.date.toString(), entry.sleepQuality, entry.sleepTime.startTime.toString(),
    entry.sleepTime.endTime.toString(), entry.notes,
  );
}

// Get a CalendarEntry from a particular date.
// This will construct a new CalendarEntry object from the table row and return it.
export const getEntryFromDate = async (date: SimpleDate): Promise<CalendarEntry | null> => {
  const db = await getDB();
  const row = await db.getFirstAsync<CalendarEntryRow>('SELECT * FROM entries WHERE date = ?;', date.toString());

  if (row === null) {
    return null;
  }

  return calendarEntryFromRow(row);
}

// Get all CalendarEntrys in the month contained in 'date'.
export const getEntriesInMonth = async (date: SimpleDate): Promise<Array<CalendarEntry | null>> => {
  const db = await getDB();
  const year = date.getYear();
  const month = date.getMonth();

  const rows = await db.getAllAsync<CalendarEntryRow>(`
    SELECT * FROM entries WHERE date LIKE ?;`,
    `${year}-${month}-%`,
  );
  console.log(rows)

  let entries = new Array<CalendarEntry | null>(date.getNumDaysInMonth()).fill(null);
  for (let i = 0; i < rows.length; i++) {
    const entry = calendarEntryFromRow(rows[i]);
    entries[entry.date.getDay() - 1] = entry;
  }

  return entries;
}

// Get all entries in the entries table.
export const getAllEntries = async () => {
  const db = await getDB();
  const rows = await db.getAllAsync<CalendarEntryRow>(`
    SELECT * FROM entries;`);
  console.log(rows)

  let entries: CalendarEntry[] = [];
  for (let i = 0; i < rows.length; i++) {
    entries.push(calendarEntryFromRow(rows[i]));
  }

  return entries;
}

// Construct a CalendarEntry from a given row.
const calendarEntryFromRow = (row: CalendarEntryRow): CalendarEntry => {
  const date = SimpleDate.fromString(row.date);
  const sleepTime = new TimeRange(Time.fromString(row.sleep_time_start), Time.fromString(row.sleep_time_end));

  return new CalendarEntry(date, row.sleep_quality, sleepTime, row.notes);
}
