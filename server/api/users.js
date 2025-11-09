// ユーザーAPI
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const DATA_PATH = path.join(__dirname, '../data/users.json');
if (!fs.existsSync(DATA_PATH)) fs.writeFileSync(DATA_PATH, '[]');

// ユーザー一覧取得
router.get('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_PATH));
  res.json(data);
});

// ユーザー詳細取得
router.get('/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_PATH));
  const user = data.find(u => u.id === req.params.id);
  if (!user) return res.status(404).json({ error: 'ユーザーが見つかりません' });
  res.json(user);
});

// ユーザー新規作成
router.post('/', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_PATH));
  const { id, nickname, email, profileImage, bio } = req.body;
  if (!id || !nickname) return res.status(400).json({ error: '必須項目が不足しています' });
  const newUser = {
    id: String(id),
    nickname,
    email: email || null,
    profileImage: profileImage || '',
    bio: bio || '',
    uploadedMaterials: [],
    favoritesMaterials: [],
    createdAt: new Date().toISOString(),
    lastLoginAt: new Date().toISOString(),
    role: 'student',
  };
  data.push(newUser);
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  res.json(newUser);
});

// ユーザー情報更新
router.put('/:id', (req, res) => {
  const data = JSON.parse(fs.readFileSync(DATA_PATH));
  const idx = data.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'ユーザーが見つかりません' });
  const { nickname, email, profileImage, bio, role } = req.body;
  if (nickname) data[idx].nickname = nickname;
  if (email) data[idx].email = email;
  if (profileImage) data[idx].profileImage = profileImage;
  if (bio) data[idx].bio = bio;
  if (role) data[idx].role = role; // 管理者による役割変更
  data[idx].updatedAt = new Date().toISOString();
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  res.json(data[idx]);
});

// ユーザー削除（管理者用）
router.delete('/:id', (req, res) => {
  let data = JSON.parse(fs.readFileSync(DATA_PATH));
  const idx = data.findIndex(u => u.id === req.params.id);
  if (idx === -1) return res.status(404).json({ error: 'ユーザーが見つかりません' });
  
  const deletedUser = data[idx];
  data.splice(idx, 1);
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  res.json({ message: 'ユーザーを削除しました', user: deletedUser });
});

export default router;
