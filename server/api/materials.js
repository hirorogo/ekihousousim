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
  
  // ファイル削除も行う（オプション）
  const material = data[idx];
  const uploadsDir = path.join(__dirname, '../uploads');
  const filePath = path.join(uploadsDir, path.basename(material.filePath));
  
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (err) {
    console.error('ファイル削除エラー:', err);
  }
  
  data.splice(idx, 1);
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  res.json({ message: '削除しました' });
});

// 資料更新（管理者用）
router.put('/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_PATH));
  const idx = data.findIndex(m => m.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: '資料が見つかりません' });
  
  const { title, subject, description, uploader } = req.body;
  
  // 更新可能なフィールドのみ更新
  if (title !== undefined) data[idx].title = title;
  if (subject !== undefined) data[idx].subject = subject;
  if (description !== undefined) data[idx].description = description;
  if (uploader !== undefined) data[idx].uploader = uploader;
  
  // 更新日時を記録
  data[idx].updatedDate = new Date().toISOString();
  
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  res.json(data[idx]);
});

export default router;
