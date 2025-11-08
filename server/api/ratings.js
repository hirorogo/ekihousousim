// 評価API
const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();

const DATA_PATH = path.join(__dirname, '../data/ratings.json');
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, '[]');

// 評価投稿
router.post('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_PATH));
  const { materialId, userId, rating } = req.body;
  if (!materialId || !userId || !rating) return res.status(400).json({ error: '必須項目が不足しています' });
  const newRating = {
    id: Date.now(),
    materialId: Number(materialId),
    userId: String(userId),
    rating: Number(rating),
    createdAt: new Date().toISOString(),
  };
  data.push(newRating);
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  res.json(newRating);
});

// 評価一覧取得（materialId指定可）
router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_PATH));
  const { materialId } = req.query;
  if (materialId) {
    return res.json(data.filter(r => r.materialId === Number(materialId)));
  }
  res.json(data);
});

module.exports = router;
