// OCR API（アップロード済みファイルのテキスト抽出）
const express = require('express');
const path = require('path');
const fs = require('fs');
const { createWorker } = require('tesseract.js');
const router = express.Router();

// POST /api/ocr
// body: { filePath: '/uploads/xxx.pdf' }
router.post('/', async (req, res) => {
  const { filePath } = req.body;
  if (!filePath) return res.status(400).json({ error: 'filePathが必要です' });
  const absPath = path.join(__dirname, '..', filePath);
  if (!fs.existsSync(absPath)) return res.status(404).json({ error: 'ファイルが存在しません' });

  try {
    const worker = await createWorker('jpn');
    const { data: { text } } = await worker.recognize(absPath);
    await worker.terminate();
    res.json({ text });
  } catch (err) {
    res.status(500).json({ error: 'OCR処理に失敗しました', detail: err.message });
  }
});

module.exports = router;
