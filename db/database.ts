// This file sets up and exports the SQLite DB

import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export const getDB = async () => {
  if (!db) {
    db = await SQLite.openDatabaseAsync('calendar.db');
  }

  return db;
}

