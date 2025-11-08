// 定数定義

// 科目（ジャンル）の定義
export const SUBJECTS = [
  { id: 1, name: '数学', color: '#FF6B6B' },
  { id: 2, name: '英語', color: '#4ECDC4' },
  { id: 3, name: '言語文化', color: '#45B7D1' },
  { id: 4, name: '物理', color: '#FFA07A' },
  { id: 5, name: '科学と人間生活', color: '#98D8C8' },
  { id: 6, name: '電気回路', color: '#BB8FCE' },
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

// ユーザー管理用の定数
export const TEST_USERS = [
  {
    id: 1,
    email: 'test@example.com',
    password: 'password123',
    nickname: 'テストユーザー',
  },
];

// API エンドポイント（将来的に使用）
export const API_BASE_URL = 'https://api.example.com';
