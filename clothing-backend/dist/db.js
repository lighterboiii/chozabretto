"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const better_sqlite3_1 = __importDefault(require("better-sqlite3"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const dbPath = path_1.default.join(__dirname, '..', 'data');
const dbFile = path_1.default.join(dbPath, 'clothing.db');
if (!fs_1.default.existsSync(dbPath)) {
    fs_1.default.mkdirSync(dbPath);
}
const db = new better_sqlite3_1.default(dbFile);
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
exports.default = db;
