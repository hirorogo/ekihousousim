# データモデル設計ドキュメント

## 1. 概要

このドキュメントは、テスト過去問・プリント共有サイトのデータモデル（ER 図、スキーマ定義、関係性）を詳細に定義します。

## 2. ER 図（エンティティ・リレーションシップ図）

```
┌─────────────────┐
│     Users       │
├─────────────────┤
│ id (PK)         │
│ nickname        │ 1 ───── N ┌──────────────────┐
│ email           │           │   Materials      │
│ profileImage    │           ├──────────────────┤
│ bio             │           │ id (PK)          │
│ createdAt       │           │ title            │
│ lastLoginAt     │           │ subject          │
└─────────────────┘           │ description      │
           ▲                   │ uploadedBy (FK)  │
           │ 1                 │ fileUrl          │
           │                   │ rating           │
           │ N                 │ ratingCount      │
┌──────────┴────────┐          │ views            │
│    Comments       │          │ downloads        │
├─────────────────────┤         │ tags             │
│ id (PK)             │         │ isPublished      │
│ materialId (FK)  ───┼────── N │ createdAt        │
│ author              │         │ updatedAt        │
│ text                │         └──────────────────┘
│ rating              │                 ▲
│ createdAt           │                 │ 1
│ updatedAt           │                 │
└─────────────────────┘                 │ N
                            ┌───────────┴──────────┐
                            │   Ratings            │
                            ├──────────────────────┤
                            │ id (PK)              │
                            │ materialId (FK)      │
                            │ userId (FK)          │
                            │ rating (1-5)         │
                            │ createdAt            │
                            │ updatedAt            │
                            └──────────────────────┘
```

## 3. テーブル定義

### 3.1 Users テーブル

```sql
CREATE TABLE users (
  -- プライマリキー
  id STRING NOT NULL PRIMARY KEY,  -- UUID v4

  -- 基本情報
  nickname STRING NOT NULL UNIQUE,
  email STRING NULLABLE,
  bio STRING DEFAULT '',

  -- メディア
  profileImage STRING DEFAULT 'https://cdn.example.com/default-avatar.png',
  profileImageFile FILE NULLABLE,

  -- 関連データ
  uploadedMaterialIds ARRAY<NUMBER> DEFAULT [],
  favoriteMaterialIds ARRAY<NUMBER> DEFAULT [],

  -- 権限管理
  role ENUM('student', 'teacher', 'admin') DEFAULT 'student',

  -- タイムスタンプ
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  lastLoginAt TIMESTAMP,

  -- インデックス
  INDEX (email),
  INDEX (nickname),
  INDEX (createdAt)
);
```

**フィールド説明**:
| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | STRING (UUID) | ✓ | Firebase Auth UID と連携 |
| nickname | STRING | ✓ | ユーザーの表示名（一意） |
| email | STRING | ○ | メールアドレス（将来実装） |
| bio | STRING | | 自己紹介文（最大 200 字） |
| profileImage | STRING (URL) | | プロフィール画像 URL |
| uploadedMaterialIds | ARRAY | | アップロード資料 ID 配列 |
| favoriteMaterialIds | ARRAY | | お気に入り資料 ID 配列 |
| role | ENUM | | ロール（ユーザー分類） |
| createdAt | TIMESTAMP | ✓ | 作成日時 |
| lastLoginAt | TIMESTAMP | | 最終ログイン日時 |

**制約条件**:
```
- nickname: 1～30 文字、英数字とアンダースコア、一意
- bio: 最大 200 文字
- uploadedMaterialIds, favoriteMaterialIds: 最大 10000 個
```

### 3.2 Materials テーブル

```sql
CREATE TABLE materials (
  -- プライマリキー
  id NUMBER NOT NULL PRIMARY KEY AUTO_INCREMENT,

  -- 基本情報
  title STRING NOT NULL,
  subject STRING NOT NULL,
  description TEXT DEFAULT '',
  tags ARRAY<STRING> DEFAULT [],

  -- ファイル関連
  fileUrl STRING NOT NULL,
  fileName STRING NOT NULL,
  fileSize NUMBER DEFAULT 0,
  fileType ENUM('pdf', 'image', 'document') DEFAULT 'pdf',

  -- メタデータ
  uploadedBy STRING NOT NULL,  -- Users.nickname への参照
  uploadedById STRING,         -- Users.id への参照
  rating DECIMAL(3, 2) DEFAULT 0.00,  -- 0.00～5.00
  ratingCount NUMBER DEFAULT 0,
  views NUMBER DEFAULT 0,
  downloads NUMBER DEFAULT 0,
  isPublished BOOLEAN DEFAULT true,

  -- タイムスタンプ
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- インデックス
  INDEX (subject),
  INDEX (uploadedById),
  INDEX (createdAt),
  INDEX (rating DESC),
  FULLTEXT INDEX (title, description),

  -- 外部キー制約（Firestore では運用レベルで対応）
  CONSTRAINT fk_materials_users FOREIGN KEY (uploadedById) REFERENCES users(id)
);
```

**フィールド説明**:
| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | NUMBER | ✓ | 自動採番（シーケンシャル） |
| title | STRING | ✓ | 資料タイトル（1～100 字） |
| subject | STRING | ✓ | 科目名（SUBJECTS から） |
| description | TEXT | | 詳細説明（最大 500 字） |
| tags | ARRAY | | タグ配列（複数選択可） |
| fileUrl | STRING | ✓ | Cloud Storage の URL |
| fileName | STRING | ✓ | オリジナルファイル名 |
| fileSize | NUMBER | | ファイルサイズ（バイト） |
| fileType | ENUM | | ファイル形式 |
| uploadedBy | STRING | ✓ | アップロード者ニックネーム |
| uploadedById | STRING | | アップロード者 ID |
| rating | DECIMAL | | 平均評価（0.00～5.00） |
| ratingCount | NUMBER | | 評価数 |
| views | NUMBER | | 閲覧数 |
| downloads | NUMBER | | ダウンロード数 |
| isPublished | BOOLEAN | | 公開状態 |
| createdAt | TIMESTAMP | ✓ | 作成日時 |
| updatedAt | TIMESTAMP | ✓ | 更新日時 |

**制約条件**:
```
- title: 1～100 文字
- description: 最大 500 文字
- fileSize: 10MB 以下（10485760 バイト）
- rating: 0.00～5.00 の範囲
- tags: 最大 10 個タグ
```

### 3.3 Comments テーブル

```sql
CREATE TABLE comments (
  -- プライマリキー
  id NUMBER NOT NULL PRIMARY KEY AUTO_INCREMENT,

  -- 外部キー
  materialId NUMBER NOT NULL,
  author STRING NOT NULL,
  authorId STRING NULLABLE,

  -- コンテンツ
  text TEXT NOT NULL,
  rating NUMBER DEFAULT 0,  -- 1～5

  -- ステータス
  isModerated BOOLEAN DEFAULT false,
  isDeletion BOOLEAN DEFAULT false,

  -- タイムスタンプ
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- インデックス
  INDEX (materialId),
  INDEX (authorId),
  INDEX (createdAt),

  -- 外部キー制約
  CONSTRAINT fk_comments_materials FOREIGN KEY (materialId) REFERENCES materials(id),
  CONSTRAINT fk_comments_users FOREIGN KEY (authorId) REFERENCES users(id)
);
```

**フィールド説明**:
| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | NUMBER | ✓ | コメント ID |
| materialId | NUMBER | ✓ | 関連資料 ID |
| author | STRING | ✓ | コメント者ニックネーム |
| authorId | STRING | | コメント者 ID |
| text | TEXT | ✓ | コメント本文（最大 300 字） |
| rating | NUMBER | | 評価（1～5、0 は評価なし） |
| isModerated | BOOLEAN | | モデレーション対象フラグ |
| isDeletion | BOOLEAN | | 削除フラグ |
| createdAt | TIMESTAMP | ✓ | 作成日時 |
| updatedAt | TIMESTAMP | ✓ | 更新日時 |

**制約条件**:
```
- text: 1～300 文字
- rating: 0 または 1～5
```

### 3.4 Ratings テーブル

```sql
CREATE TABLE ratings (
  -- プライマリキー
  id NUMBER NOT NULL PRIMARY KEY AUTO_INCREMENT,

  -- 外部キー
  materialId NUMBER NOT NULL,
  userId STRING NOT NULL,

  -- レーティング
  rating NUMBER NOT NULL,  -- 1～5

  -- ステータス
  isDeleted BOOLEAN DEFAULT false,

  -- タイムスタンプ
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  -- ユニーク制約（ユーザーごとに 1 つのレーティングのみ）
  UNIQUE KEY (materialId, userId),

  -- インデックス
  INDEX (materialId),
  INDEX (userId),
  INDEX (rating),

  -- 外部キー制約
  CONSTRAINT fk_ratings_materials FOREIGN KEY (materialId) REFERENCES materials(id),
  CONSTRAINT fk_ratings_users FOREIGN KEY (userId) REFERENCES users(id)
);
```

**フィールド説明**:
| フィールド | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| id | NUMBER | ✓ | レーティング ID |
| materialId | NUMBER | ✓ | 対象資料 ID |
| userId | STRING | ✓ | ユーザー ID |
| rating | NUMBER | ✓ | 評価スコア（1～5） |
| isDeleted | BOOLEAN | | 削除フラグ |
| createdAt | TIMESTAMP | ✓ | 作成日時 |
| updatedAt | TIMESTAMP | ✓ | 更新日時 |

**制約条件**:
```
- rating: 1～5 の整数値
- (materialId, userId): ユニーク（重複投票防止）
```

### 3.5 Subjects（定数マスタ）

```javascript
const SUBJECTS = [
  {
    id: 1,
    name: '数学',
    color: '#FF6B6B',
    icon: 'calculator',
    description: '数学全般（代数、幾何、確率等）'
  },
  {
    id: 2,
    name: '英語',
    color: '#4ECDC4',
    icon: 'globe',
    description: '英語全般（読解、文法、会話等）'
  },
  {
    id: 3,
    name: '言語文化',
    color: '#45B7D1',
    icon: 'book',
    description: '現代の国語、古典文学'
  },
  {
    id: 4,
    name: '物理',
    color: '#FFA07A',
    icon: 'atom',
    description: '物理（力学、熱学、波動等）'
  },
  {
    id: 5,
    name: '科学と人間生活',
    color: '#98D8C8',
    icon: 'flask',
    description: '化学、生物、地学の融合'
  },
  {
    id: 6,
    name: '電気回路',
    color: '#BB8FCE',
    icon: 'zap',
    description: '工業系：電気回路、電子工学'
  }
];
```

## 4. JSON スキーマ（API リクエスト/レスポンス）

### 4.1 User JSON スキーマ

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "string",
      "description": "ユーザーユニークID（UUID v4）"
    },
    "nickname": {
      "type": "string",
      "minLength": 1,
      "maxLength": 30,
      "pattern": "^[a-zA-Z0-9_]+$",
      "description": "ユーザーニックネーム"
    },
    "email": {
      "type": "string",
      "format": "email",
      "description": "メールアドレス"
    },
    "bio": {
      "type": "string",
      "maxLength": 200,
      "description": "自己紹介文"
    },
    "profileImage": {
      "type": "string",
      "format": "uri",
      "description": "プロフィール画像 URL"
    },
    "uploadedMaterialIds": {
      "type": "array",
      "items": {
        "type": "number"
      },
      "description": "アップロード資料 ID 配列"
    },
    "favoriteMaterialIds": {
      "type": "array",
      "items": {
        "type": "number"
      },
      "description": "お気に入り資料 ID 配列"
    },
    "role": {
      "type": "string",
      "enum": ["student", "teacher", "admin"],
      "description": "ユーザーロール"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "作成日時（ISO 8601）"
    },
    "lastLoginAt": {
      "type": "string",
      "format": "date-time",
      "description": "最終ログイン日時"
    }
  },
  "required": ["id", "nickname", "createdAt"],
  "additionalProperties": false
}
```

### 4.2 Material JSON スキーマ

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "number",
      "description": "資料ユニークID"
    },
    "title": {
      "type": "string",
      "minLength": 1,
      "maxLength": 100,
      "description": "資料タイトル"
    },
    "subject": {
      "type": "string",
      "description": "科目名（SUBJECTS から選択）"
    },
    "description": {
      "type": "string",
      "maxLength": 500,
      "description": "資料の説明"
    },
    "tags": {
      "type": "array",
      "items": {
        "type": "string"
      },
      "maxItems": 10,
      "description": "タグ配列"
    },
    "fileUrl": {
      "type": "string",
      "format": "uri",
      "description": "Cloud Storage ファイル URL"
    },
    "fileName": {
      "type": "string",
      "description": "オリジナルファイル名"
    },
    "fileSize": {
      "type": "number",
      "maximum": 10485760,
      "description": "ファイルサイズ（バイト、最大 10MB）"
    },
    "uploadedBy": {
      "type": "string",
      "description": "アップロード者ニックネーム"
    },
    "uploadedById": {
      "type": "string",
      "description": "アップロード者 ID"
    },
    "rating": {
      "type": "number",
      "minimum": 0,
      "maximum": 5,
      "multipleOf": 0.01,
      "description": "平均評価（0.00～5.00）"
    },
    "ratingCount": {
      "type": "number",
      "description": "評価数"
    },
    "views": {
      "type": "number",
      "description": "閲覧数"
    },
    "downloads": {
      "type": "number",
      "description": "ダウンロード数"
    },
    "isPublished": {
      "type": "boolean",
      "description": "公開状態"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "作成日時"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "更新日時"
    }
  },
  "required": ["id", "title", "subject", "fileUrl", "uploadedBy", "createdAt"],
  "additionalProperties": false
}
```

### 4.3 Comment JSON スキーマ

```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "type": "object",
  "properties": {
    "id": {
      "type": "number",
      "description": "コメント ID"
    },
    "materialId": {
      "type": "number",
      "description": "対象資料 ID"
    },
    "author": {
      "type": "string",
      "description": "コメント者ニックネーム"
    },
    "authorId": {
      "type": "string",
      "description": "コメント者 ID"
    },
    "text": {
      "type": "string",
      "minLength": 1,
      "maxLength": 300,
      "description": "コメント本文"
    },
    "rating": {
      "type": "number",
      "minimum": 0,
      "maximum": 5,
      "description": "評価スコア（0 = 評価なし、1～5）"
    },
    "createdAt": {
      "type": "string",
      "format": "date-time",
      "description": "作成日時"
    },
    "updatedAt": {
      "type": "string",
      "format": "date-time",
      "description": "更新日時"
    }
  },
  "required": ["id", "materialId", "author", "text", "createdAt"],
  "additionalProperties": false
}
```

## 5. Firestore コレクション設計

### 5.1 コレクション構造
```
firestore-database
├── users/
│   ├── {userId}
│   │   ├── nickname: string
│   │   ├── email: string
│   │   ├── bio: string
│   │   ├── profileImage: string
│   │   ├── uploadedMaterials: number[]
│   │   ├── favoriteMaterials: number[]
│   │   ├── role: string
│   │   ├── createdAt: timestamp
│   │   └── lastLoginAt: timestamp
│   │
│   └── materials/  (subcollection)
│       └── (アップロード者本人の資料のみ)
│
├── materials/
│   ├── {materialId}
│   │   ├── title: string
│   │   ├── subject: string
│   │   ├── description: string
│   │   ├── tags: string[]
│   │   ├── fileUrl: string
│   │   ├── fileName: string
│   │   ├── fileSize: number
│   │   ├── uploadedBy: string
│   │   ├── uploadedById: string (reference)
│   │   ├── rating: number
│   │   ├── ratingCount: number
│   │   ├── views: number
│   │   ├── downloads: number
│   │   ├── isPublished: boolean
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   │
│   └── comments/  (subcollection)
│       ├── {commentId}
│       │   ├── author: string
│       │   ├── authorId: string (reference)
│       │   ├── text: string
│       │   ├── rating: number
│       │   ├── createdAt: timestamp
│       │   └── updatedAt: timestamp
│       │
│
└── ratings/
    └── {materialId}_{userId}
        ├── rating: number
        ├── createdAt: timestamp
        └── updatedAt: timestamp
```

### 5.2 セキュリティルール（Firestore）

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    
    // Users コレクション
    match /users/{userId} {
      // 読み取り: 全員可能
      allow read: if true;
      
      // 書き込み: 本人またはシステムのみ
      allow create: if request.auth.uid == userId;
      allow update: if request.auth.uid == userId ||
                       request.auth.token.role == 'admin';
      allow delete: if request.auth.uid == userId ||
                       request.auth.token.role == 'admin';
    }
    
    // Materials コレクション
    match /materials/{materialId} {
      // 読み取り: 全員可能
      allow read: if true;
      
      // 作成: 認証ユーザーなら可能
      allow create: if request.auth != null;
      
      // 更新: アップロード者またはアドミンのみ
      allow update: if request.auth.uid == resource.data.uploadedById ||
                       request.auth.token.role == 'admin';
      
      // 削除: アップロード者またはアドミンのみ
      allow delete: if request.auth.uid == resource.data.uploadedById ||
                       request.auth.token.role == 'admin';
      
      // Comments サブコレクション
      match /comments/{commentId} {
        allow read: if true;
        allow create: if request.auth != null;
        allow update: if request.auth.uid == resource.data.authorId;
        allow delete: if request.auth.uid == resource.data.authorId ||
                         request.auth.token.role == 'admin';
      }
    }
    
    // Ratings コレクション
    match /ratings/{document=**} {
      allow read: if true;
      allow create, update: if request.auth != null;
      allow delete: if request.auth.uid == resource.data.userId;
    }
  }
}
```

## 6. インデックス戦略

### 6.1 複合インデックス（Firestore）

```
1. Materials コレクション
   ├── (subject, createdAt DESC) - 科目別・新着順
   ├── (subject, rating DESC) - 科目別・高評価順
   ├── (subject, downloads DESC) - 科目別・ダウンロード数順
   └── (isPublished, createdAt DESC) - 公開資料・新着順

2. Comments コレクション
   └── (materialId, createdAt DESC) - 資料別・新着順

3. Ratings コレクション
   ├── (materialId) - 資料別に集計
   └── (userId) - ユーザー別に集計

4. Users コレクション
   └── (createdAt DESC) - 新規ユーザー順
```

## 7. データキャッシング戦略

### 7.1 ローカルストレージ

```javascript
// 認証状態
localStorage.setItem('siteAuth', 'true');
// キー: 'siteAuth', 値: 'true' | undefined

// ユーザープロフィール（将来実装）
localStorage.setItem('userProfile', JSON.stringify(userObject));
// キー: 'userProfile', 値: JSON 文字列

// 資料キャッシュ（将来実装）
localStorage.setItem('materialCache', JSON.stringify(materialsArray));
// キー: 'materialCache', 値: JSON 文字列
// 有効期限: 1 時間
```

### 7.2 Firestore キャッシング（オフラインサポート）

```javascript
// Firestore Offline Persistence を有効化
import { initializeFirestore, enableIndexedDbPersistence } from 'firebase/firestore';

const db = initializeFirestore(app, {
  experimentalForceLongPolling: true,
});

enableIndexedDbPersistence(db)
  .catch((err) => {
    if (err.code === 'failed-precondition') {
      // 複数タブで開かれている場合
    } else if (err.code === 'unimplemented') {
      // ブラウザがサポートしていない
    }
  });
```

## 8. データ整合性と制約

### 8.1 参照整合性

```javascript
// Users ← Materials の参照
// 削除時: Materials.uploadedById が削除対象 User ID の場合、
//        Materials は削除またはアーカイブ

// Materials ← Comments の参照
// 削除時: Material 削除時に Comments も削除

// Materials ← Ratings の参照
// 削除時: Material 削除時に Ratings も削除

// Firestore トランザクション例:
async function deleteMaterial(materialId, userId) {
  const db = getFirestore();
  await runTransaction(db, async (transaction) => {
    const materialRef = doc(db, 'materials', materialId);
    const material = await transaction.get(materialRef);
    
    if (!material.exists()) {
      throw new Error('Material not found');
    }
    
    if (material.data().uploadedById !== userId) {
      throw new Error('Unauthorized');
    }
    
    // Material 削除
    transaction.delete(materialRef);
    
    // Comments 削除
    const commentsRef = collection(db, 'materials', materialId, 'comments');
    const commentsSnapshot = await getDocs(commentsRef);
    commentsSnapshot.docs.forEach(doc => {
      transaction.delete(doc.ref);
    });
    
    // Ratings 削除
    const ratingsRef = query(collection(db, 'ratings'), 
      where('materialId', '==', materialId));
    const ratingsSnapshot = await getDocs(ratingsRef);
    ratingsSnapshot.docs.forEach(doc => {
      transaction.delete(doc.ref);
    });
  });
}
```

## 9. マイグレーション計画

### 9.1 Phase 0 → Phase 1（現在）

```
LocalStorage オンリー:
✓ 認証状態: 'siteAuth' キー
✓ 初期資料: INITIAL_MATERIALS 配列
✗ 永続化なし（ページリロードで初期化）
```

### 9.2 Phase 1 → Phase 2（次段階）

```
Firestore 統合手順:

1. Firestore プロジェクト初期化
   - Firebase Console でプロジェクト作成
   - Firestore Database 作成
   - セキュリティルール設定

2. スキーマ作成
   - users コレクション作成
   - materials コレクション作成
   - comments & ratings コレクション作成

3. データマイグレーション
   - LocalStorage から Firestore へデータ移行
   - INITIAL_MATERIALS を資料テーブルに投入

4. API 層実装
   - utils/api.js に Firestore 呼び出し実装
   - CRUD 操作の実装

5. フロントエンド更新
   - useState → useFirestore（カスタムフック）
   - API 呼び出しに切り替え

6. マイグレーション確認
   - 全ページで Firestore データ取得確認
   - LocalStorage との同期確認
```

## 10. データサイズ見積もり

### 10.1 ストレージサイズ

```
1 ユーザーあたり: 約 0.5KB
1 資料あたり: 約 2KB (メタデータ)
1 コメントあたり: 約 0.3KB
1 評価あたり: 約 0.2KB

見積例（アクティブユーザー 1000 人）:
├── Users: 1000 × 0.5KB = 500KB
├── Materials: 5000 × 2KB = 10MB
├── Comments: 50000 × 0.3KB = 15MB
├── Ratings: 20000 × 0.2KB = 4MB
└── 合計: 約 30MB

Firestore 無料枠:
- ストレージ: 1GB
- 読み取り: 50,000/日
- 書き込み: 20,000/日
- 削除: 20,000/日
→ 十分対応可能（初期段階）
```

### 10.2 ファイルストレージ

```
Cloud Storage 無料枠: 5GB

1 資料ファイルあたり: 平均 1～5MB

見積例:
- PDF（数学テスト）: 2MB
- 画像（プリント）: 0.5MB
- 複数ページ（スキャン）: 3MB

1000 ファイル: 2～5GB
→ 無料枠内で対応可能（初期段階）
```

## 11. バージョニング戦略

### 11.1 スキーマバージョン

```javascript
// Material スキーマバージョン
const MATERIAL_SCHEMA_VERSION = 1;

// 将来のスキーマ拡張時:
// v1: 初期バージョン（title, subject, description 等）
// v2: タグ機能追加
// v3: コメント非表示オプション追加
// 等...

// マイグレーション関数
async function migrateMaterial(doc) {
  if (doc.schemaVersion === undefined) {
    // v1 へマイグレーション
    return {
      ...doc,
      schemaVersion: 1,
      tags: [],
      migrationDate: new Date()
    };
  }
  return doc;
}
```

## 12. 監査ログ（将来実装）

```sql
CREATE TABLE audit_logs (
  id NUMBER NOT NULL PRIMARY KEY AUTO_INCREMENT,
  userId STRING NOT NULL,
  action STRING NOT NULL,  -- 'CREATE', 'UPDATE', 'DELETE', 'READ'
  targetType STRING NOT NULL,  -- 'material', 'comment', 'user'
  targetId STRING NOT NULL,
  oldValue JSON,
  newValue JSON,
  ipAddress STRING,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  INDEX (userId, timestamp),
  INDEX (targetId, timestamp)
);
```

---

このデータモデル設計により、スケーラブルで保守性の高いシステムが実現できます。

