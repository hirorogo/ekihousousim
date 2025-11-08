// 複数ファイルアップロード & PDF変換API（将来OCR対応）
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
// import { PDFDocument } from 'pdf-lib'; // PDF変換用（実装例）

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// アップロード先ディレクトリ
const UPLOAD_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// multer設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});
const upload = multer({ storage });

// POST /api/upload
router.post('/', upload.array('files', 10), async (req, res) => {
  try {
    // 1. ファイル受け取り
    const files = req.files;
    if (!files || files.length === 0) return res.status(400).json({ error: 'ファイルがありません' });

    // 2. PDF変換処理（ここではダミーでファイル名のみ返す）
    // 実際は画像/Word→PDF変換処理をここで実装
    // 例: const pdfBuffer = await convertToPDF(file.path);
    // fs.writeFileSync(pdfPath, pdfBuffer);

    // 3. OCR処理（将来: PDFからテキスト抽出）
    // 例: const text = await runOCR(pdfPath);

    // 4. レスポンス
    res.json({
      message: 'アップロード・PDF変換（仮）完了',
      files: files.map(f => ({ original: f.originalname, saved: f.filename }))
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'サーバーエラー' });
  }
});

export default router;
