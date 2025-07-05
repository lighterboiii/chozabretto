import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(__dirname, '..', 'data');
const dbFile = path.join(dbPath, 'clothing.db');

if (!fs.existsSync(dbPath)) {
  fs.mkdirSync(dbPath);
}

const db = new Database(dbFile);

db.exec(`
  CREATE TABLE IF NOT EXISTS clothing (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    color TEXT,
    imageUrl TEXT,
    userId TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS outfits (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    items TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    userId TEXT
  )
`);

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    telegramId INTEGER UNIQUE NOT NULL,
    firstName TEXT,
    lastName TEXT,
    username TEXT,
    photoUrl TEXT,
    createdAt TEXT NOT NULL
  )
`);

export default db;
