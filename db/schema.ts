// Creates tables if they don't already exist (i.e., on first run)

import * as SQLite from 'expo-sqlite';

export const initializeDatabase = async (db: SQLite.SQLiteDatabase) => {
  await db.execAsync(`
CREATE TABLE IF NOT EXISTS entries (
id INTEGER PRIMARY KEY AUTOINCREMENT,
date TEXT NOT NULL,
sleep_quality INTEGER NOT NULL,
sleep_time_start TEXT NOT NULL,
sleep_time_end TEXT NOT NUll,
notes TEXT NOT NULL
);`
  );
  console.log("DATABASE INITIALIZED!");
}

export const nukeDatabase = async (db: SQLite.SQLiteDatabase) => {
  await db.execAsync(`DROP TABLE entries;`);
  console.log("DATABASE NUKED!");
}
