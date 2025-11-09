// 管理者API
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const ADMIN_DATA_PATH = path.join(__dirname, '../data/admin.json');
const MATERIALS_DATA_PATH = path.join(__dirname, '../data/materials.json');
const UPLOADS_DIR = path.join(__dirname, '../uploads');

// 管理者データファイル初期化
if (!fs.existsSync(ADMIN_DATA_PATH)) {
  fs.writeFileSync(ADMIN_DATA_PATH, JSON.stringify({
    username: 'admin',
    password: '114514',
    displayName: '管理者',
    createdAt: new Date().toISOString()
  }, null, 2));
}

// 管理者ログイン認証
router.post('/login', (req, res) => {
  const { password } = req.body;
  const adminData = JSON.parse(fs.readFileSync(ADMIN_DATA_PATH));
  
  if (password === adminData.password) {
    res.json({ 
      success: true, 
      message: 'ログイン成功',
      admin: {
        username: adminData.username,
        displayName: adminData.displayName
      }
    });
  } else {
    res.status(401).json({ success: false, message: 'パスワードが違います' });
  }
});

// ダッシュボード統計情報取得
router.get('/dashboard/stats', (req, res) => {
  try {
    const materials = JSON.parse(fs.readFileSync(MATERIALS_DATA_PATH));
    
    // 総資料数
    const totalMaterials = materials.length;
    
    // 総閲覧数
    const totalViews = materials.reduce((sum, m) => sum + (m.viewCount || 0), 0);
    
    // 総ダウンロード数
    const totalDownloads = materials.reduce((sum, m) => sum + (m.downloadCount || 0), 0);
    
    // 科目別統計
    const subjectStats = materials.reduce((acc, m) => {
      const subject = m.subject || 'その他';
      acc[subject] = (acc[subject] || 0) + 1;
      return acc;
    }, {});
    
    // ファイル形式別統計
    const fileTypeStats = materials.reduce((acc, m) => {
      const type = m.fileType || 'unknown';
      const category = type.includes('pdf') ? 'PDF' : 
                      type.includes('image') ? '画像' : 'その他';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});
    
    // 最近のアップロード（最新10件）
    const recentUploads = materials
      .sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate))
      .slice(0, 10)
      .map(m => ({
        id: m.id,
        title: m.title,
        subject: m.subject,
        uploader: m.uploader,
        uploadDate: m.uploadDate,
        ipAddress: m.ipAddress || '未記録'
      }));
    
    res.json({
      totalMaterials,
      totalViews,
      totalDownloads,
      subjectStats,
      fileTypeStats,
      recentUploads
    });
  } catch (error) {
    res.status(500).json({ error: 'データ取得エラー', details: error.message });
  }
});

// サーバー稼働状況取得
router.get('/server/status', (req, res) => {
  try {
    const materials = JSON.parse(fs.readFileSync(MATERIALS_DATA_PATH));
    const adminData = JSON.parse(fs.readFileSync(ADMIN_DATA_PATH));
    
    // アップロードディレクトリのファイル一覧
    const uploadedFiles = fs.existsSync(UPLOADS_DIR) 
      ? fs.readdirSync(UPLOADS_DIR)
      : [];
    
    // ファイルサイズ合計
    let totalFileSize = 0;
    uploadedFiles.forEach(file => {
      const filePath = path.join(UPLOADS_DIR, file);
      if (fs.existsSync(filePath)) {
        const stats = fs.statSync(filePath);
        totalFileSize += stats.size;
      }
    });
    
    res.json({
      serverStatus: 'running',
      database: {
        materialsCount: materials.length,
        filePath: MATERIALS_DATA_PATH,
        lastModified: fs.statSync(MATERIALS_DATA_PATH).mtime
      },
      storage: {
        uploadDirectory: UPLOADS_DIR,
        fileCount: uploadedFiles.length,
        totalSize: totalFileSize,
        files: uploadedFiles.map(file => {
          const filePath = path.join(UPLOADS_DIR, file);
          const stats = fs.statSync(filePath);
          return {
            name: file,
            size: stats.size,
            created: stats.birthtime,
            modified: stats.mtime
          };
        })
      },
      adminAccount: {
        username: adminData.username,
        displayName: adminData.displayName,
        createdAt: adminData.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'サーバー情報取得エラー', details: error.message });
  }
});

// 資料編集
router.put('/materials/:id', (req, res) => {
  try {
    let materials = JSON.parse(fs.readFileSync(MATERIALS_DATA_PATH));
    const materialIndex = materials.findIndex(m => m.id === Number(req.params.id));
    
    if (materialIndex === -1) {
      return res.status(404).json({ error: '資料が見つかりません' });
    }
    
    // 編集可能なフィールドのみ更新
    const { title, subject, description, uploader, tags } = req.body;
    
    materials[materialIndex] = {
      ...materials[materialIndex],
      title: title || materials[materialIndex].title,
      subject: subject || materials[materialIndex].subject,
      description: description || materials[materialIndex].description,
      uploader: uploader || materials[materialIndex].uploader,
      tags: tags || materials[materialIndex].tags,
      lastModified: new Date().toISOString()
    };
    
    fs.writeFileSync(MATERIALS_DATA_PATH, JSON.stringify(materials, null, 2));
    res.json({ success: true, material: materials[materialIndex] });
  } catch (error) {
    res.status(500).json({ error: '資料編集エラー', details: error.message });
  }
});

// 資料削除（ファイルも削除）
router.delete('/materials/:id', (req, res) => {
  try {
    let materials = JSON.parse(fs.readFileSync(MATERIALS_DATA_PATH));
    const materialIndex = materials.findIndex(m => m.id === Number(req.params.id));
    
    if (materialIndex === -1) {
      return res.status(404).json({ error: '資料が見つかりません' });
    }
    
    const material = materials[materialIndex];
    
    // ファイル削除
    if (material.filePath) {
      const fullPath = path.join(__dirname, '..', material.filePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }
    
    // データから削除
    materials.splice(materialIndex, 1);
    fs.writeFileSync(MATERIALS_DATA_PATH, JSON.stringify(materials, null, 2));
    
    res.json({ success: true, message: '資料を削除しました' });
  } catch (error) {
    res.status(500).json({ error: '資料削除エラー', details: error.message });
  }
});

// パスワード変更
router.post('/settings/password', (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const adminData = JSON.parse(fs.readFileSync(ADMIN_DATA_PATH));
    
    if (currentPassword !== adminData.password) {
      return res.status(401).json({ error: '現在のパスワードが違います' });
    }
    
    adminData.password = newPassword;
    adminData.lastPasswordChange = new Date().toISOString();
    
    fs.writeFileSync(ADMIN_DATA_PATH, JSON.stringify(adminData, null, 2));
    res.json({ success: true, message: 'パスワードを変更しました' });
  } catch (error) {
    res.status(500).json({ error: 'パスワード変更エラー', details: error.message });
  }
});

export default router;
