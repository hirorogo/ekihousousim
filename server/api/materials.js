// 資料（Material）API
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const DATA_PATH = path.join(__dirname, '../data/materials.json');

// データファイル初期化
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, '[]');

// 全資料取得
router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_PATH));
  res.json(data);
});

// 資料詳細取得
router.get('/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_PATH));
  const material = data.find(m => m.id === Number(req.params.id));
  if (!material) return res.status(404).json({ error: '資料が見つかりません' });
  res.json(material);
});

// 資料削除
router.delete('/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_PATH));
  const idx = data.findIndex(m => m.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: '資料が見つかりません' });
  data.splice(idx, 1);
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  res.json({ message: '削除しました' });
});

export default router;
