import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import db from './db';

const clothingTypes = [
  "jeans",
  "shorts",
  "jacket",
  "windbreaker",
  "hoodie",
  "sweater",
  "pants",
  "shoes",
  "hat",
  "t-shirt",
  "shirt",
];


const app = express();
const PORT = 4000;

app.use(cors());

app.use(express.json());

// Папка для загрузок
const UPLOAD_DIR = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(UPLOAD_DIR)) {
  fs.mkdirSync(UPLOAD_DIR);
}

// Настройка multer для загрузки файлов
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    // уникальное имя файла
    const ext = path.extname(file.originalname);
    cb(null, uuidv4() + ext);
  },
});
const upload = multer({ storage });

// Статика для доступа к изображениям
app.use('/uploads', express.static(UPLOAD_DIR));

/**
 * Типы:
 * ClothingItem:
 * {
 *   id: string,
 *   name: string,
 *   type: string,
 *   color?: string,
 *   imageUrl?: string
 * }
 * 
 * Outfit:
 * {
 *   id: string,
 *   name: string,
 *   items: string[],
 *   createdAt: string
 * }
 * 
 * User:
 * {
 *   id: string,
 *   telegramId: number,
 *   firstName?: string,
 *   lastName?: string,
 *   username?: string,
 *   photoUrl?: string,
 *   createdAt: string
 * }
 */

// ===== API для пользователей =====

// Получить пользователя по Telegram ID
app.get('/users/telegram/:telegramId', (req, res) => {
  const { telegramId } = req.params;
  
  const stmt = db.prepare('SELECT * FROM users WHERE telegramId = ?');
  const user = stmt.get(telegramId);
  
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }
  
  res.json(user);
});

// Создать или обновить пользователя
app.post('/users', (req, res) => {
  const { telegramId, firstName, lastName, username, photoUrl } = req.body;

  if (!telegramId) {
    res.status(400).json({ error: 'Telegram ID is required' });
    return;
  }

  // Проверяем, существует ли пользователь
  const selectStmt = db.prepare('SELECT * FROM users WHERE telegramId = ?');
  const existingUser = selectStmt.get(telegramId);

  if (existingUser) {
    // Обновляем существующего пользователя
    const updateStmt = db.prepare(
      'UPDATE users SET firstName = ?, lastName = ?, username = ?, photoUrl = ? WHERE telegramId = ?'
    );
    updateStmt.run(firstName || null, lastName || null, username || null, photoUrl || null, telegramId);
    
    res.json({ ...existingUser, firstName, lastName, username, photoUrl });
  } else {
    // Создаем нового пользователя
    const id = uuidv4();
    const createdAt = new Date().toISOString();
    
    const insertStmt = db.prepare(
      'INSERT INTO users (id, telegramId, firstName, lastName, username, photoUrl, createdAt) VALUES (?, ?, ?, ?, ?, ?, ?)'
    );
    insertStmt.run(id, telegramId, firstName || null, lastName || null, username || null, photoUrl || null, createdAt);
    
    res.status(201).json({ id, telegramId, firstName, lastName, username, photoUrl, createdAt });
  }
});

// Обновить профиль пользователя
app.put('/users/:id', upload.single('photo'), (req, res) => {
  const { id } = req.params;
  const { firstName, lastName, username } = req.body;

  const selectStmt = db.prepare('SELECT * FROM users WHERE id = ?');
  const user = selectStmt.get(id);
  
  if (!user) {
    res.status(404).json({ error: 'User not found' });
    return;
  }

  let photoUrl = user.photoUrl;
  if (req.file) {
    if (photoUrl) {
      const oldPath = path.join(__dirname, '..', photoUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    photoUrl = `/uploads/${req.file.filename}`;
  }

  const updateStmt = db.prepare(
    'UPDATE users SET firstName = ?, lastName = ?, username = ?, photoUrl = ? WHERE id = ?'
  );
  updateStmt.run(firstName || null, lastName || null, username || null, photoUrl, id);

  res.json({ ...user, firstName, lastName, username, photoUrl });
});

// Получить список одежды
app.get('/clothing', (req, res) => {
  const { userId } = req.query;
  
  if (userId) {
    const stmt = db.prepare('SELECT * FROM clothing WHERE userId = ?');
    const items = stmt.all(userId);
    res.json(items);
  } else {
    const stmt = db.prepare('SELECT * FROM clothing');
    const items = stmt.all();
    res.json(items);
  }
});

// Добавить новую вещь (с фото)
app.post('/clothing', upload.single('image'), (req, res) => {
  const { name, type, color, userId } = req.body;

  if (!name || !type) {
    res.status(400).json({ error: 'Name and type are required' });
    return; // просто выйти из функции
  }

  if (!clothingTypes.includes(type)) {
    res.status(400).json({ error: 'Invalid clothing type' });
    return;
  }

  let imageUrl: string | null = null;
  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`;
  }

  const id = uuidv4();
  const stmt = db.prepare(
    'INSERT INTO clothing (id, name, type, color, imageUrl, userId) VALUES (?, ?, ?, ?, ?, ?)'
  );
  stmt.run(id, name, type, color || null, imageUrl, userId || null);

  res.status(201).json({ id, name, type, color, imageUrl, userId });
});


// Обновить вещь по id (с фото)
app.put('/clothing/:id', upload.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, type, color } = req.body;

  if (!name || !type) {
    res.status(400).json({ error: 'Name and type are required' });
    return;
  }

  const selectStmt = db.prepare('SELECT * FROM clothing WHERE id = ?');
  const item = selectStmt.get(id);
  if (!item) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }

  let imageUrl = item.imageUrl;
  if (req.file) {
    if (imageUrl) {
      const oldPath = path.join(__dirname, '..', imageUrl);
      if (fs.existsSync(oldPath)) {
        fs.unlinkSync(oldPath);
      }
    }
    imageUrl = `/uploads/${req.file.filename}`;
  }

  const updateStmt = db.prepare(
    'UPDATE clothing SET name = ?, type = ?, color = ?, imageUrl = ? WHERE id = ?'
  );
  updateStmt.run(name, type, color || null, imageUrl, id);

  res.json({ id, name, type, color, imageUrl });
});


// Удалить вещь по id
app.delete('/clothing/:id', (req, res) => {
  const { id } = req.params;

  // Найдем вещь и удалим изображение если есть
  const selectStmt = db.prepare('SELECT * FROM clothing WHERE id = ?');
  const item = selectStmt.get(id);
  
  if (!item) {
    res.status(404).json({ error: 'Item not found' });
    return;
  }
  
  if (item.imageUrl) {
    const imgPath = path.join(__dirname, '..', item.imageUrl);
    if (fs.existsSync(imgPath)) {
      fs.unlinkSync(imgPath);
    }
  }

  const deleteStmt = db.prepare('DELETE FROM clothing WHERE id = ?');
  deleteStmt.run(id);

  res.status(204).send();
});

// ===== API для наборов =====

// Получить список наборов
app.get('/outfits', (req, res) => {
  const { userId } = req.query;
  
  let stmt;
  if (userId) {
    stmt = db.prepare('SELECT * FROM outfits WHERE userId = ? ORDER BY createdAt DESC');
    const outfits = stmt.all(userId);
    
    const formattedOutfits = outfits.map(outfit => ({
      ...outfit,
      items: JSON.parse(outfit.items)
    }));
    
    res.json(formattedOutfits);
  } else {
    stmt = db.prepare('SELECT * FROM outfits ORDER BY createdAt DESC');
    const outfits = stmt.all();
    
    const formattedOutfits = outfits.map(outfit => ({
      ...outfit,
      items: JSON.parse(outfit.items)
    }));
    
    res.json(formattedOutfits);
  }
});

// Создать новый набор
app.post('/outfits', (req, res) => {
  const { name, items, userId } = req.body;

  if (!name || !items || !Array.isArray(items)) {
    res.status(400).json({ error: 'Name and items array are required' });
    return;
  }

  // Проверяем, что все items существуют в базе
  const itemsCheckStmt = db.prepare('SELECT id FROM clothing WHERE id = ?');
  for (const itemId of items) {
    const item = itemsCheckStmt.get(itemId);
    if (!item) {
      res.status(400).json({ error: `Clothing item with id ${itemId} not found` });
      return;
    }
  }

  const id = uuidv4();
  const createdAt = new Date().toISOString();
  const itemsJson = JSON.stringify(items);

  const stmt = db.prepare(
    'INSERT INTO outfits (id, name, items, createdAt, userId) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run(id, name, itemsJson, createdAt, userId || null);

  res.status(201).json({ id, name, items, createdAt, userId });
});

// Обновить набор по id
app.put('/outfits/:id', (req, res) => {
  const { id } = req.params;
  const { name, items } = req.body;

  if (!name || !items || !Array.isArray(items)) {
    res.status(400).json({ error: 'Name and items array are required' });
    return;
  }

  // Проверяем, что набор существует
  const selectStmt = db.prepare('SELECT * FROM outfits WHERE id = ?');
  const outfit = selectStmt.get(id);
  if (!outfit) {
    res.status(404).json({ error: 'Outfit not found' });
    return;
  }

  // Проверяем, что все items существуют в базе
  const itemsCheckStmt = db.prepare('SELECT id FROM clothing WHERE id = ?');
  for (const itemId of items) {
    const item = itemsCheckStmt.get(itemId);
    if (!item) {
      res.status(400).json({ error: `Clothing item with id ${itemId} not found` });
      return;
    }
  }

  const itemsJson = JSON.stringify(items);
  const updateStmt = db.prepare(
    'UPDATE outfits SET name = ?, items = ? WHERE id = ?'
  );
  updateStmt.run(name, itemsJson, id);

  res.json({ id, name, items, createdAt: outfit.createdAt });
});

// Удалить набор по id
app.delete('/outfits/:id', (req, res) => {
  const { id } = req.params;

  const selectStmt = db.prepare('SELECT * FROM outfits WHERE id = ?');
  const outfit = selectStmt.get(id);
  
  if (!outfit) {
    res.status(404).json({ error: 'Outfit not found' });
    return;
  }

  const deleteStmt = db.prepare('DELETE FROM outfits WHERE id = ?');
  deleteStmt.run(id);

  res.status(204).send();
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
