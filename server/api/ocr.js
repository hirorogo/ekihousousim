// OCR API（アップロード済みファイルのテキスト抽出）
import express from 'express';
import path from 'path';
import fs from 'fs';
import Tesseract from 'tesseract.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// POST /api/ocr
// body: { filePath: '/uploads/xxx.pdf' }
router.post('/', async (req, res) => {
  const { filePath } = req.body;
  if (!filePath) return res.status(400).json({ error: 'filePathが必要です' });
  const absPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(absPath)) return res.status(404).json({ error: 'ファイルが存在しません' });

  try {
    const worker = await Tesseract.createWorker('jpn');
    const { data: { text } } = await worker.recognize(absPath);
    await worker.terminate();
    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: 'OCR処理に失敗しました', detail: err.message });
  }
});

export default router;
