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
 */

// Получить список одежды
app.get('/clothing', (req, res) => {
  const stmt = db.prepare('SELECT * FROM clothing');
  const items = stmt.all();
  res.json(items);
});

// Добавить новую вещь (с фото)
app.post('/clothing', upload.single('image'), (req, res) => {
  const { name, type, color } = req.body;

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
    'INSERT INTO clothing (id, name, type, color, imageUrl) VALUES (?, ?, ?, ?, ?)'
  );
  stmt.run(id, name, type, color || null, imageUrl);

  res.status(201).json({ id, name, type, color, imageUrl });
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

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});
