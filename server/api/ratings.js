// 評価API
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const DATA_PATH = path.join(__dirname, '../data/ratings.json');
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, '[]');

// 評価投稿
router.post('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_PATH));
  const { materialId, userId, rating } = req.body;
  if (!materialId || !userId || rating === undefined) {
    return res.status(400).json({ error: '必須項目が不足しています' });
  }
  // 既存の評価を更新または新規追加
  const existingIdx = data.findIndex(r => r.materialId === Number(materialId) && r.userId === userId);
  const newRating = {
    id: existingIdx >= 0 ? data[existingIdx].id : Date.now(),
    materialId: Number(materialId),
    userId,
    rating: Number(rating),
    createdAt: existingIdx >= 0 ? data[existingIdx].createdAt : new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  if (existingIdx >= 0) data[existingIdx] = newRating;
  else data.push(newRating);
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  res.json(newRating);
});

// 統計取得
router.get('/stats/:materialId', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_PATH));
  const ratings = data.filter(r => r.materialId === Number(req.params.materialId));
  const stats = {
    count: ratings.length,
    average: ratings.length ? ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length : 0,
  };
  res.json(stats);
});

export default router;
