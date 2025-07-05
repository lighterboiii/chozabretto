"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const db_1 = __importDefault(require("./db"));
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
const app = (0, express_1.default)();
const PORT = 4000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Папка для загрузок
const UPLOAD_DIR = path_1.default.join(__dirname, '..', 'uploads');
if (!fs_1.default.existsSync(UPLOAD_DIR)) {
    fs_1.default.mkdirSync(UPLOAD_DIR);
}
// Настройка multer для загрузки файлов
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        // уникальное имя файла
        const ext = path_1.default.extname(file.originalname);
        cb(null, (0, uuid_1.v4)() + ext);
    },
});
const upload = (0, multer_1.default)({ storage });
// Статика для доступа к изображениям
app.use('/uploads', express_1.default.static(UPLOAD_DIR));
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
 */
// Получить список одежды
app.get('/clothing', (req, res) => {
    const stmt = db_1.default.prepare('SELECT * FROM clothing');
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
    let imageUrl = null;
    if (req.file) {
        imageUrl = `/uploads/${req.file.filename}`;
    }
    const id = (0, uuid_1.v4)();
    const stmt = db_1.default.prepare('INSERT INTO clothing (id, name, type, color, imageUrl) VALUES (?, ?, ?, ?, ?)');
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
    const selectStmt = db_1.default.prepare('SELECT * FROM clothing WHERE id = ?');
    const item = selectStmt.get(id);
    if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
    }
    let imageUrl = item.imageUrl;
    if (req.file) {
        if (imageUrl) {
            const oldPath = path_1.default.join(__dirname, '..', imageUrl);
            if (fs_1.default.existsSync(oldPath)) {
                fs_1.default.unlinkSync(oldPath);
            }
        }
        imageUrl = `/uploads/${req.file.filename}`;
    }
    const updateStmt = db_1.default.prepare('UPDATE clothing SET name = ?, type = ?, color = ?, imageUrl = ? WHERE id = ?');
    updateStmt.run(name, type, color || null, imageUrl, id);
    res.json({ id, name, type, color, imageUrl });
});
// Удалить вещь по id
app.delete('/clothing/:id', (req, res) => {
    const { id } = req.params;
    // Найдем вещь и удалим изображение если есть
    const selectStmt = db_1.default.prepare('SELECT * FROM clothing WHERE id = ?');
    const item = selectStmt.get(id);
    if (!item) {
        res.status(404).json({ error: 'Item not found' });
        return;
    }
    if (item.imageUrl) {
        const imgPath = path_1.default.join(__dirname, '..', item.imageUrl);
        if (fs_1.default.existsSync(imgPath)) {
            fs_1.default.unlinkSync(imgPath);
        }
    }
    const deleteStmt = db_1.default.prepare('DELETE FROM clothing WHERE id = ?');
    deleteStmt.run(id);
    res.status(204).send();
});
// ===== API для наборов =====
// Получить список наборов
app.get('/outfits', (req, res) => {
    const stmt = db_1.default.prepare('SELECT * FROM outfits ORDER BY createdAt DESC');
    const outfits = stmt.all();
    // Преобразуем items из JSON строки в массив
    const formattedOutfits = outfits.map(outfit => ({
        ...outfit,
        items: JSON.parse(outfit.items)
    }));
    res.json(formattedOutfits);
});
// Создать новый набор
app.post('/outfits', (req, res) => {
    const { name, items } = req.body;
    if (!name || !items || !Array.isArray(items)) {
        res.status(400).json({ error: 'Name and items array are required' });
        return;
    }
    // Проверяем, что все items существуют в базе
    const itemsCheckStmt = db_1.default.prepare('SELECT id FROM clothing WHERE id = ?');
    for (const itemId of items) {
        const item = itemsCheckStmt.get(itemId);
        if (!item) {
            res.status(400).json({ error: `Clothing item with id ${itemId} not found` });
            return;
        }
    }
    const id = (0, uuid_1.v4)();
    const createdAt = new Date().toISOString();
    const itemsJson = JSON.stringify(items);
    const stmt = db_1.default.prepare('INSERT INTO outfits (id, name, items, createdAt) VALUES (?, ?, ?, ?)');
    stmt.run(id, name, itemsJson, createdAt);
    res.status(201).json({ id, name, items, createdAt });
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
    const selectStmt = db_1.default.prepare('SELECT * FROM outfits WHERE id = ?');
    const outfit = selectStmt.get(id);
    if (!outfit) {
        res.status(404).json({ error: 'Outfit not found' });
        return;
    }
    // Проверяем, что все items существуют в базе
    const itemsCheckStmt = db_1.default.prepare('SELECT id FROM clothing WHERE id = ?');
    for (const itemId of items) {
        const item = itemsCheckStmt.get(itemId);
        if (!item) {
            res.status(400).json({ error: `Clothing item with id ${itemId} not found` });
            return;
        }
    }
    const itemsJson = JSON.stringify(items);
    const updateStmt = db_1.default.prepare('UPDATE outfits SET name = ?, items = ? WHERE id = ?');
    updateStmt.run(name, itemsJson, id);
    res.json({ id, name, items, createdAt: outfit.createdAt });
});
// Удалить набор по id
app.delete('/outfits/:id', (req, res) => {
    const { id } = req.params;
    const selectStmt = db_1.default.prepare('SELECT * FROM outfits WHERE id = ?');
    const outfit = selectStmt.get(id);
    if (!outfit) {
        res.status(404).json({ error: 'Outfit not found' });
        return;
    }
    const deleteStmt = db_1.default.prepare('DELETE FROM outfits WHERE id = ?');
    deleteStmt.run(id);
    res.status(204).send();
});
// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
});
