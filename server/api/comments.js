// コメントAPI
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const DATA_PATH = path.join(__dirname, '../data/comments.json');
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, '[]');

// コメント一覧取得（materialId指定可）
router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_PATH));
  const { materialId } = req.query;
  if (materialId) {
    return res.json(data.filter(c => c.materialId === Number(materialId)));
  }
  res.json(data);
});

// コメント投稿
router.post('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_PATH));
  const { materialId, author, text, rating } = req.body;
  if (!materialId || !author || !text) return res.status(400).json({ error: '必須項目が不足しています' });
  const newComment = {
    id: Date.now(),
    materialId: Number(materialId),
    author,
    text,
    rating: Number(rating) || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  data.push(newComment);
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  res.json(newComment);
});

export default router;
