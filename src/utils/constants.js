// 定数定義

// 科目（ジャンル）の定義
export const SUBJECTS = [
  { id: 1, name: '数学', color: '#FF6B6B' },
  { id: 2, name: '英語', color: '#4ECDC4' },
  { id: 3, name: '言語文化', color: '#45B7D1' },
  { id: 4, name: '物理', color: '#FFA07A' },
  { id: 5, name: '科学と人間生活', color: '#98D8C8' },
  { id: 6, name: '電気回路', color: '#BB8FCE' },
  { id: 7, name: 'その他', color: '#F7DC6F' },
  { id: 8, name: '配布プリント', color: '#999999' },
];

// テスト過去問の初期データ
export const INITIAL_MATERIALS = [
  {
    id: 1,
    title: 'test',
    subject: '数学',
    description: 'test description',
    rating: 4.5,
    comments: 3,
    uploadDate: '2024-10-15',
    uploader: 'user1',
  },
  {
    id: 2,
    title: 'test2',
    subject: '英語',
    description: 'test description 2',  
    rating: 4.0,
    comments: 2,
    uploadDate: '2024-10-14',
    uploader: 'user2',
  },
];

// サイトアクセス用の共通パスワード
export const SITE_ACCESS_PASSWORD = '123';

// API設定
// 環境変数で設定（例: VITE_API_URL=http://localhost:3001）
const rawBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
// 後続の '/api' や末尾スラッシュの重複を防ぐ正規化処理
const normalizeBase = (url) => {
  if (!url) return url;
  // 末尾のスラッシュを削除
  let u = url.replace(/\/+$/, '');
  // 末尾が '/api' なら取り除く（エンドポイント側で /api を付与する）
  u = u.replace(/\/api$/, '');
  return u;
};
export const API_BASE_URL = normalizeBase(rawBase);

// APIエンドポイント
export const API_ENDPOINTS = {
  upload: `${API_BASE_URL}/api/upload`,
  materials: `${API_BASE_URL}/api/materials`,
  comments: `${API_BASE_URL}/api/comments`,
  ratings: `${API_BASE_URL}/api/ratings`,
  users: `${API_BASE_URL}/api/users`,
  ocr: `${API_BASE_URL}/api/ocr`,
};
