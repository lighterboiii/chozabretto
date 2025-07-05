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
    imageUrl TEXT
  )
`);

export default db;
