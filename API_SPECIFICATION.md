# API 仕様書

## 1. API 概要

### 1.1 ベース情報

| 項目 | 内容 |
|------|------|
| **ベース URL** | `https://[REGION]-[PROJECT_ID].cloudfunctions.net/api` |
| **認証方式** | Firebase Authentication（JWT） |
| **コンテンツ形式** | `application/json` |
| **エラーハンドリ** | HTTP ステータスコード + JSON エラーレスポンス |
| **バージョン** | v1（現在）|
| **推奨バージョン** | 将来 v2 対応予定 |

### 1.2 対応環境

| 環境 | 状態 | 備考 |
|------|------|------|
| **開発環境** | 計画中 | ローカル Firebase Emulator |
| **ステージング** | 計画中 | Firebase staging プロジェクト |
| **本番環境** | 計画中 | Firebase production プロジェクト |

## 2. 認証・認可

### 2.1 認証ヘッダ

```
Authorization: Bearer <idToken>

<idToken>: Firebase Authentication が発行する JWT トークン

トークン例:
Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjEyMyJ9.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vIiwic3ViIjoiYWJjMTIzIn0.signature
```

### 2.2 認可スコープ

```
管理スコープ:
- admin:read - 全ユーザーデータ読み取り
- admin:write - ユーザーデータ書き込み・削除
- admin:delete - 強制削除

ユーザースコープ:
- user:read - 自分のデータ読み取り
- user:write - 自分のデータ書き込み
- user:delete - 自分のデータ削除

公開スコープ:
- public:read - 公開資料の読み取り
```

### 2.3 CORS ポリシー

```
許可オリジン: https://hirorogo.github.io/ekihousousim/
許可メソッド: GET, POST, PUT, DELETE, OPTIONS
許可ヘッダ: Content-Type, Authorization
許可認証情報: yes
キャッシュ時間: 3600 秒
```

## 3. エラーハンドリング

### 3.1 エラーレスポンス形式

```json
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "要求されたリソースが見つかりません",
    "details": {
      "resourceType": "material",
      "resourceId": "123"
    },
    "timestamp": "2024-01-01T12:00:00Z",
    "requestId": "req-abc-123-xyz"
  }
}
```

### 3.2 ステータスコード一覧

| コード | 意味 | 説明 |
|-------|------|------|
| **200** | OK | リクエスト成功 |
| **201** | Created | リソース作成成功 |
| **204** | No Content | 削除成功（応答本文なし） |
| **400** | Bad Request | リクエスト形式が不正 |
| **401** | Unauthorized | 認証失敗 |
| **403** | Forbidden | 権限不足 |
| **404** | Not Found | リソースが見つからない |
| **409** | Conflict | リソース重複（一意制約違反） |
| **413** | Payload Too Large | ペイロードサイズ超過 |
| **429** | Too Many Requests | レート制限超過 |
| **500** | Internal Server Error | サーバーエラー |
| **503** | Service Unavailable | サービス利用不可 |

### 3.3 エラーコード一覧

```
認証関連:
- AUTH_INVALID_TOKEN: トークンが無効
- AUTH_EXPIRED_TOKEN: トークンの有効期限切れ
- AUTH_MISSING_TOKEN: 認証ヘッダがない

リソース関連:
- RESOURCE_NOT_FOUND: リソースが見つからない
- RESOURCE_ALREADY_EXISTS: リソースが既に存在
- RESOURCE_INVALID_STATE: リソースの状態が不正

入力検証:
- VALIDATION_ERROR: 入力値が不正
- VALIDATION_TITLE_REQUIRED: タイトルは必須
- VALIDATION_FILE_TOO_LARGE: ファイルが大きすぎる

ファイル処理:
- FILE_UPLOAD_FAILED: ファイルアップロード失敗
- FILE_FORMAT_INVALID: ファイル形式が不正
- FILE_STORAGE_FULL: ストレージが満杯

その他:
- RATE_LIMIT_EXCEEDED: レート制限超過
- INTERNAL_ERROR: サーバーエラー
```

## 4. API エンドポイント

### 4.1 Materials（資料）

#### 4.1.1 GET /materials - 資料一覧取得

```
GET /materials?subject=数学&keyword=中間&sortBy=newest&page=1&limit=10

説明: フィルター条件に基づいて資料一覧を取得

クエリパラメータ:
┌──────────┬──────────┬──────────────────────────────────────┐
│ 名前     │ 型      │ 説明                                  │
├──────────┼──────────┼──────────────────────────────────────┤
│ subject  │ string   │ 科目でフィルター（オプション）        │
│ keyword  │ string   │ キーワードで検索（オプション）        │
│ sortBy   │ string   │ 並び順（newest/oldest/rating/...）   │
│ page     │ number   │ ページ番号（デフォルト: 1）           │
│ limit    │ number   │ 1ページあたりの件数（デフォルト: 10） │
│ tags     │ string[] │ タグでフィルター（カンマ区切り）      │
│ minRating│ number   │ 最低評価（デフォルト: 0）             │
│ maxRating│ number   │ 最高評価（デフォルト: 5）             │
└──────────┴──────────┴──────────────────────────────────────┘

レスポンス例:
{
  "status": "success",
  "data": {
    "materials": [
      {
        "id": 1,
        "title": "2024年度 数学 中間テスト",
        "subject": "数学",
        "description": "高校 1 年の中間テスト予想問題",
        "fileUrl": "https://storage.googleapis.com/.../test1.pdf",
        "uploadedBy": "Mr.Yamada",
        "rating": 4.5,
        "ratingCount": 12,
        "views": 234,
        "downloads": 45,
        "createdAt": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "totalCount": 45,
      "page": 1,
      "limit": 10,
      "totalPages": 5,
      "hasNextPage": true,
      "hasPrevPage": false
    }
  }
}

ステータスコード:
- 200: OK
- 400: 不正なクエリパラメータ
- 500: サーバーエラー
```

#### 4.1.2 GET /materials/:id - 資料詳細取得

```
GET /materials/1

説明: 指定された ID の資料詳細情報を取得

パスパラメータ:
┌───────┬─────────┬────────────────┐
│ 名前  │ 型      │ 説明            │
├───────┼─────────┼────────────────┤
│ id    │ number  │ 資料 ID         │
└───────┴─────────┴────────────────┘

レスポンス例:
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "2024年度 数学 中間テスト",
    "subject": "数学",
    "description": "高校 1 年の中間テスト予想問題\n範囲: 三角関数～微分法",
    "tags": ["中間", "予想問題", "解答付き"],
    "fileUrl": "https://storage.googleapis.com/.../test1.pdf",
    "fileName": "math_test_2024.pdf",
    "fileSize": 2097152,
    "uploadedBy": "Mr.Yamada",
    "uploadedById": "user-abc123",
    "rating": 4.5,
    "ratingCount": 12,
    "views": 234,
    "downloads": 45,
    "isPublished": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-20T14:00:00Z",
    "comments": [
      {
        "id": 1,
        "author": "学生A",
        "text": "非常に役立ちました！",
        "rating": 5,
        "createdAt": "2024-01-15T12:00:00Z"
      }
    ],
    "userRating": 4  // 現在のユーザーの評価（ない場合は null）
  }
}

ステータスコード:
- 200: OK
- 404: リソースが見つからない
- 500: サーバーエラー
```

#### 4.1.3 POST /materials - 資料アップロード

```
POST /materials
Content-Type: multipart/form-data
Authorization: Bearer <idToken>

説明: 新しい資料をアップロード

リクエストボディ:
┌──────────────┬─────────┬──────────┬────────────────────────┐
│ フィールド   │ 型      │ 必須     │ 説明                   │
├──────────────┼─────────┼──────────┼────────────────────────┤
│ title        │ string  │ ✓        │ 資料タイトル           │
│ subject      │ string  │ ✓        │ 科目名                 │
│ description  │ string  │          │ 説明（最大 500 字）    │
│ tags         │ string[]│          │ タグ配列               │
│ file         │ file    │ ✓        │ ファイル（PDF/画像）   │
│ nickname     │ string  │ ✓        │ アップロード者の名前   │
└──────────────┴─────────┴──────────┴────────────────────────┘

バリデーションルール:
- title: 1～100 文字
- subject: SUBJECTS に存在する科目
- description: 最大 500 文字
- file: .pdf/.jpg/.png/.gif、最大 10MB
- tags: 最大 10 個、1 個あたり最大 20 文字
- nickname: 1～30 文字

レスポンス例（成功時）:
{
  "status": "success",
  "data": {
    "id": 46,
    "title": "2024年度 数学 中間テスト",
    "subject": "数学",
    "description": "高校 1 年の中間テスト予想問題",
    "fileUrl": "https://storage.googleapis.com/.../test46.pdf",
    "uploadedBy": "Mr.Yamada",
    "createdAt": "2024-01-21T10:00:00Z"
  },
  "message": "資料をアップロードしました"
}

エラーレスポンス例:
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "入力値が不正です",
    "details": {
      "errors": [
        {
          "field": "title",
          "message": "タイトルは必須です"
        },
        {
          "field": "file",
          "message": "ファイルサイズは 10MB 以下にしてください"
        }
      ]
    }
  }
}

ステータスコード:
- 201: Created（成功）
- 400: Bad Request（検証エラー）
- 401: Unauthorized（認証失敗）
- 413: Payload Too Large（ファイルが大きすぎる）
- 500: Internal Server Error
```

#### 4.1.4 PUT /materials/:id - 資料更新

```
PUT /materials/1
Content-Type: application/json
Authorization: Bearer <idToken>

説明: 既存資料を更新（アップロード者のみ可能）

リクエストボディ:
{
  "title": "2024年度 数学 期末テスト",
  "description": "期末試験対策問題",
  "tags": ["期末", "対策", "解答付き"]
}

レスポンス例:
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "2024年度 数学 期末テスト",
    "description": "期末試験対策問題",
    "tags": ["期末", "対策", "解答付き"],
    "updatedAt": "2024-01-21T15:00:00Z"
  }
}

ステータスコード:
- 200: OK
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden（権限なし）
- 404: Not Found
- 500: Internal Server Error
```

#### 4.1.5 DELETE /materials/:id - 資料削除

```
DELETE /materials/1
Authorization: Bearer <idToken>

説明: 資料を削除（アップロード者またはアドミンのみ可能）

レスポンス例:
{
  "status": "success",
  "message": "資料を削除しました"
}

ステータスコード:
- 204: No Content（成功）
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error
```

### 4.2 Comments（コメント）

#### 4.2.1 GET /materials/:materialId/comments - コメント一覧

```
GET /materials/1/comments?page=1&limit=20

説明: 特定資料のコメント一覧を取得

パスパラメータ:
├── materialId: 対象資料 ID

クエリパラメータ:
├── page: ページ番号（デフォルト: 1）
├── limit: 1 ページあたり件数（デフォルト: 20）
└── sortBy: 並び順（newest/oldest/rating）

レスポンス例:
{
  "status": "success",
  "data": {
    "comments": [
      {
        "id": 1,
        "materialId": 1,
        "author": "学生A",
        "authorId": "user-student-001",
        "text": "とても分かりやすい説明で、助かりました！",
        "rating": 5,
        "createdAt": "2024-01-15T12:00:00Z"
      },
      {
        "id": 2,
        "materialId": 1,
        "author": "学生B",
        "authorId": "user-student-002",
        "text": "解答がもう少し詳しいと嬉しい",
        "rating": 4,
        "createdAt": "2024-01-16T08:30:00Z"
      }
    ],
    "pagination": {
      "totalCount": 12,
      "page": 1,
      "limit": 20,
      "totalPages": 1
    }
  }
}

ステータスコード:
- 200: OK
- 404: 資料が見つからない
```

#### 4.2.2 POST /materials/:materialId/comments - コメント投稿

```
POST /materials/1/comments
Content-Type: application/json
Authorization: Bearer <idToken>

説明: 資料にコメントを投稿

リクエストボディ:
{
  "text": "とても役に立ちました。ありがとうございます！",
  "rating": 5
}

バリデーション:
- text: 1～300 文字（必須）
- rating: 0～5 の整数（オプション）

レスポンス例:
{
  "status": "success",
  "data": {
    "id": 13,
    "materialId": 1,
    "author": "Mr.Smith",
    "text": "とても役に立ちました。ありがとうございます！",
    "rating": 5,
    "createdAt": "2024-01-21T16:00:00Z"
  }
}

ステータスコード:
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
```

#### 4.2.3 DELETE /comments/:commentId - コメント削除

```
DELETE /comments/1
Authorization: Bearer <idToken>

説明: コメントを削除（投稿者またはアドミンのみ）

レスポンス例:
{
  "status": "success",
  "message": "コメントを削除しました"
}

ステータスコード:
- 204: No Content
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
```

### 4.3 Ratings（評価）

#### 4.3.1 POST /materials/:materialId/ratings - 評価投稿

```
POST /materials/1/ratings
Content-Type: application/json
Authorization: Bearer <idToken>

説明: 資料に評価を投稿（1 ユーザーあたり 1 つ）

リクエストボディ:
{
  "rating": 4
}

バリデーション:
- rating: 1～5 の整数（必須）

レスポンス例:
{
  "status": "success",
  "data": {
    "id": 1,
    "materialId": 1,
    "userId": "user-abc123",
    "rating": 4,
    "createdAt": "2024-01-21T16:00:00Z"
  },
  "material": {
    "id": 1,
    "rating": 4.3,  // 更新された平均評価
    "ratingCount": 23
  }
}

ステータスコード:
- 201: Created（新規作成）
- 200: OK（既存評価を更新）
- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
```

#### 4.3.2 DELETE /materials/:materialId/ratings - 評価削除

```
DELETE /materials/1/ratings
Authorization: Bearer <idToken>

説明: 自分の評価を削除

レスポンス例:
{
  "status": "success",
  "message": "評価を削除しました",
  "material": {
    "id": 1,
    "rating": 4.2,  // 更新された平均評価
    "ratingCount": 22
  }
}

ステータスコード:
- 200: OK
- 401: Unauthorized
- 404: Not Found
```

### 4.4 Users（ユーザー）

#### 4.4.1 GET /users/:userId - ユーザー情報取得

```
GET /users/user-abc123

説明: ユーザー情報を取得

パスパラメータ:
├── userId: ユーザー ID

レスポンス例:
{
  "status": "success",
  "data": {
    "id": "user-abc123",
    "nickname": "Mr.Yamada",
    "email": "yamada@example.com",
    "bio": "高校数学教師です。よろしくお願いします。",
    "profileImage": "https://storage.googleapis.com/.../profile.jpg",
    "uploadedMaterialCount": 15,
    "uploadedMaterials": [1, 2, 3, ...],
    "totalDownloads": 234,
    "role": "teacher",
    "createdAt": "2023-09-01T10:00:00Z",
    "lastLoginAt": "2024-01-21T14:30:00Z"
  }
}

ステータスコード:
- 200: OK
- 404: Not Found
```

#### 4.4.2 PUT /users/:userId - ユーザー情報更新

```
PUT /users/user-abc123
Content-Type: application/json
Authorization: Bearer <idToken>

説明: 自分のユーザー情報を更新

リクエストボディ:
{
  "nickname": "Mr.Yamada",
  "bio": "高校数学教師です。よろしくお願いします。"
}

バリデーション:
- nickname: 1～30 文字（一意性チェック）
- bio: 最大 200 文字

レスポンス例:
{
  "status": "success",
  "data": {
    "id": "user-abc123",
    "nickname": "Mr.Yamada",
    "bio": "高校数学教師です。よろしくお願いします。",
    "updatedAt": "2024-01-21T16:00:00Z"
  }
}

ステータスコード:
- 200: OK
- 400: Bad Request
- 401: Unauthorized
- 409: Conflict（ニックネーム重複）
```

## 5. Rate Limiting（レート制限）

### 5.1 制限設定

```
無料ユーザー:
├── 読み取り: 100 リクエスト/分
├── 書き込み: 10 リクエスト/分
└── ファイルアップロード: 5 リクエスト/日

プレミアムユーザー（将来実装）:
├── 読み取り: 1000 リクエスト/分
├── 書き込み: 100 リクエスト/分
└── ファイルアップロード: 50 リクエスト/日
```

### 5.2 レート制限ヘッダ

```
レスポンスヘッダ:
X-RateLimit-Limit: 100        // 制限数
X-RateLimit-Remaining: 95     // 残り数
X-RateLimit-Reset: 1705865200 // リセット時刻（Unix タイムスタンプ）

制限超過時（429 Too Many Requests）:
{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "リクエストが多すぎます。しばらく待ってからお試しください。",
    "retryAfter": 60  // 秒単位
  }
}
```

## 6. ペジネーション

### 6.1 ページング方式

```
Offset-based ページング（現在）:

GET /materials?page=2&limit=10

レスポンス:
{
  "pagination": {
    "page": 2,
    "limit": 10,
    "totalCount": 45,
    "totalPages": 5,
    "offset": 10,
    "hasNextPage": true,
    "hasPrevPage": true
  }
}

将来の Cursor-based ページング:

GET /materials?limit=10&cursor=abc123xyz

レスポンス:
{
  "pagination": {
    "nextCursor": "xyz789abc",
    "prevCursor": "123abc789",
    "hasMore": true
  }
}
```

## 7. ソート・フィルター仕様

### 7.1 ソート可能フィールド

```
Materials:
- createdAt (newest/oldest) - デフォルト
- rating (高評価順)
- views (閲覧数順)
- downloads (ダウンロード数順)
- title (タイトル順)

Comments:
- createdAt (newest/oldest) - デフォルト
- rating (高評価順)

Users:
- createdAt (newest/oldest)
- uploadedCount (アップロード数順)
```

### 7.2 フィルター可能フィールド

```
Materials:
- subject: 単一選択
- tags: 複数選択（OR 条件）
- rating: 範囲指定（minRating～maxRating）
- uploadedBy: キーワード検索
- isPublished: boolean

Users:
- role: student/teacher/admin
- createdAt: 日付範囲指定
```

## 8. Webhook（将来実装）

### 8.1 イベント通知

```
Webhook エンドポイント登録:
POST /webhooks
{
  "url": "https://myapp.example.com/webhook",
  "events": ["material.created", "comment.added", "rating.updated"],
  "secret": "webhook_secret_key"
}

イベントタイプ:
- material.created: 資料がアップロードされた
- material.updated: 資料が更新された
- material.deleted: 資料が削除された
- comment.added: コメントが追加された
- comment.deleted: コメントが削除された
- rating.submitted: 評価が投稿された

Webhook ペイロード:
{
  "event": "material.created",
  "timestamp": "2024-01-21T16:00:00Z",
  "data": {
    "id": 46,
    "title": "2024年度 数学 中間テスト",
    "uploadedBy": "Mr.Yamada"
  }
}
```

## 9. バージョニング・後方互換性

### 9.1 API バージョニング戦略

```
URL ベース:
v1: https://.../api/v1/materials
v2: https://.../api/v2/materials

Accept ヘッダベース:
Accept: application/vnd.example.com; version=1

日付ベース（推奨しない）:
X-API-Version: 2024-01-01
```

### 9.2 非推奨 API の通知

```
非推奨時のレスポンスヘッダ:
Deprecation: true
Sunset: Sun, 31 Dec 2024 23:59:59 GMT
Link: <https://.../api/v2/...>; rel="successor-version"

非推奨 API からの警告レスポンス:
{
  "status": "success",
  "data": { ... },
  "warnings": [
    {
      "type": "DEPRECATION",
      "message": "このエンドポイントは 2024 年末で廃止予定です。v2 への移行をお願いします。",
      "deprecatedAt": "2024-01-01",
      "sunsetsAt": "2024-12-31"
    }
  ]
}
```

## 10. モニタリング・ログ

### 10.1 レスポンスメタデータ

```
すべてのレスポンスに以下を含める:

{
  "status": "success" | "error",
  "data": { ... },
  "meta": {
    "requestId": "req-abc123xyz",
    "timestamp": "2024-01-21T16:00:00Z",
    "version": "v1",
    "responseTime": 123  // ミリ秒
  }
}
```

### 10.2 監査ログ

```
重要な操作の監査ログを記録:

- 資料アップロード: CREATE_MATERIAL
- 資料削除: DELETE_MATERIAL
- コメント投稿: CREATE_COMMENT
- ユーザー情報変更: UPDATE_USER

ログフォーマット:
{
  "timestamp": "2024-01-21T16:00:00Z",
  "userId": "user-abc123",
  "action": "CREATE_MATERIAL",
  "resourceType": "Material",
  "resourceId": "46",
  "status": "SUCCESS",
  "details": {
    "title": "2024年度 数学 中間テスト"
  },
  "ipAddress": "192.168.1.1"
}
```

## 11. ベストプラクティス

### 11.1 クライアント実装推奨

```javascript
// API 呼び出し例（JavaScript）
async function getMaterials(filters) {
  const params = new URLSearchParams(filters);
  try {
    const response = await fetch(
      `https://.../api/materials?${params}`,
      {
        headers: {
          'Authorization': `Bearer ${idToken}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Failed to fetch materials:', error);
    throw error;
  }
}

// エラーハンドリング
try {
  const data = await getMaterials({ subject: '数学' });
} catch (error) {
  if (error.status === 401) {
    // 認証失敗 → ログイン画面へ
  } else if (error.status === 429) {
    // レート制限 → リトライ待機
  } else {
    // その他のエラー
  }
}
```

### 11.2 キャッシング戦略

```
Cache-Control ヘッダ設定:

GET /materials/:id (詳細情報)
Cache-Control: public, max-age=3600  // 1時間キャッシュ

GET /materials (一覧)
Cache-Control: public, max-age=300   // 5分キャッシュ

POST /materials (書き込み)
Cache-Control: no-cache, no-store    // キャッシュなし

ETags の活用:
- ETag: "abc123xyz"
- If-None-Match: "abc123xyz"
- 304 Not Modified: キャッシュヒット
```

## 12. テスト用エンドポイント（開発環境）

```
開発環境での動作確認:

GET /health
├── ステータス: サービスの健全性確認
└── レスポンス: { "status": "ok" }

GET /test-data
├── 説明: テスト用初期データを取得
└── レスポンス: INITIAL_MATERIALS[]

POST /test-reset
├── 説明: テストデータをリセット（開発環境のみ）
└── レスポンス: { "status": "reset" }
```

---

本 API 仕様書は、Firebase Cloud Functions と Firestore を基盤として設計されています。実装時に詳細調整が必要です。

