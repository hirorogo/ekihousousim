import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// アップロード先ディレクトリ
const UPLOAD_DIR = path.join(__dirname, '../uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// multer設定
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    // オリジナルのファイル名をデコード
    const originalName = decodeURIComponent(file.originalname);
    
    // 日本語ファイル名を維持しつつ、タイムスタンプを追加
    const timestamp = Date.now();
    const ext = path.extname(originalName);
    const basename = path.basename(originalName, ext);
    
    // ファイル名を構築（タイムスタンプ_元のファイル名.拡張子）
    const safeName = `${timestamp}_${basename}${ext}`;
    
    cb(null, safeName);
  }
});

const upload = multer({ 
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB制限
  },
  fileFilter: (req, file, cb) => {
    // ファイル形式チェック
    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png', 'text/plain'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('サポートされていないファイル形式です'), false);
    }
  }
});

// POST /api/upload
router.post('/', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;
    const { title, subject, description, uploader } = req.body;
    
    // アップロードユーザーの検証
    if (!uploader || uploader === 'test') {
      return res.status(401).json({ error: 'ログインが必要です' });
    }
    
    console.log('アップロード受信:', {
      file: file ? file.originalname : 'なし',
      body: req.body
    });
    
    if (!file) {
      return res.status(400).json({ error: 'ファイルがありません' });
    }
    
    if (!title || !subject || !uploader) {
      return res.status(400).json({ error: '必須項目が不足しています' });
    }
    
    // Materialsデータベースに保存
    const materialsPath = path.join(__dirname, '../data/materials.json');
    let materials = [];
    
    if (fs.existsSync(materialsPath)) {
      try {
        const data = fs.readFileSync(materialsPath, 'utf8');
        materials = JSON.parse(data);
      } catch (error) {
        console.error('Materials.json読み込みエラー:', error);
        materials = [];
      }
    }
    
    const newMaterial = {
      id: Date.now(),
      title,
      subject,
      description: description || '',
      uploader,
      fileName: file.originalname,
      filePath: `/uploads/${file.filename}`,
      fileSize: file.size,
      fileType: file.mimetype,
      uploadDate: new Date().toISOString(),
      viewCount: 0,
      downloadCount: 0,
      rating: 0,
      tags: [subject.toLowerCase()],
    };
    
    materials.push(newMaterial);
    
    // データ保存
    fs.writeFileSync(materialsPath, JSON.stringify(materials, null, 2));
    
    console.log('新しい資料が保存されました:', newMaterial);
    
    res.json({
      success: true,
      message: 'アップロードが完了しました',
      material: newMaterial,
    });

  } catch (err) {
    console.error('アップロードエラー:', err);
    res.status(500).json({ error: 'サーバーエラー: ' + err.message });
  }
});

export default router;
