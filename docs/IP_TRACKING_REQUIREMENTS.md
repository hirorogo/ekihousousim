# IPアドレス取得機能 要件定義書

## 1. 目的

資料アップロード時にアップロード者のIPアドレスを記録し、不正利用の防止やセキュリティ監視を可能にする。

## 2. 背景

- 現在のシステムではアップロード者の識別が「テストユーザー」などの自己申告のみ
- 不適切なコンテンツのアップロードや悪用の追跡が困難
- 管理者による監視・制御が必要

## 3. 機能要件

### 3.1 IPアドレスの取得

**取得タイミング：**
- 資料アップロード時
- 将来的には閲覧時・ダウンロード時も記録可能

**取得方法：**
- サーバー側でリクエストヘッダーから取得
- プロキシ経由を考慮した実IPアドレスの取得
- 以下のヘッダーを優先順にチェック：
  1. `X-Forwarded-For`（プロキシ経由の場合）
  2. `X-Real-IP`（Nginx等のリバースプロキシ）
  3. `req.connection.remoteAddress`（直接接続）

**取得する情報：**
```javascript
{
  ipAddress: string,        // IPv4 または IPv6
  timestamp: Date,          // 取得日時
  userAgent: string,        // ブラウザ情報
  action: string           // 'upload' | 'view' | 'download'
}
```

### 3.2 データの保存

**保存先：**
1. `materials.json` に各資料のIPアドレスを記録
2. 将来的には `server/data/ip_logs.json` に詳細ログを保存

**materials.jsonへの追加フィールド：**
```javascript
{
  id: number,
  title: string,
  // ...既存フィールド...
  uploaderIP: string,           // アップロード者のIPアドレス
  uploaderUserAgent: string,    // ブラウザ情報
  uploadTimestamp: string       // アップロード日時（既存のuploadDateを使用）
}
```

### 3.3 IPアドレスの表示

**管理者パネルでの表示：**
- 資料一覧でIPアドレスを表示（管理者のみ）
- 同一IPからのアップロード一覧
- IPアドレスごとのアップロード統計

**一般ユーザー：**
- IPアドレスは非表示
- プライバシー保護のため閲覧不可

### 3.4 セキュリティ・プライバシー対策

**データ保護：**
- IPアドレスは管理者のみ閲覧可能
- APIレスポンスから一般ユーザーへのIPアドレス送信を防止
- ハッシュ化（オプション）：個人識別を避けるためSHA-256でハッシュ化も検討

**保持期間：**
- 基本的には削除しない（証跡として保持）
- 必要に応じて古いログを定期削除する機能（Phase 2）

**法的対応：**
- 個人情報保護法への配慮
- 利用規約への明記が必要

## 4. 技術仕様

### 4.1 バックエンド実装

**ファイル：** `server/api/upload.js`

**実装内容：**
```javascript
// IPアドレス取得関数
function getClientIP(req) {
  return req.headers['x-forwarded-for']?.split(',')[0].trim() ||
         req.headers['x-real-ip'] ||
         req.connection.remoteAddress ||
         req.socket.remoteAddress ||
         'unknown';
}

// User-Agent取得関数
function getUserAgent(req) {
  return req.headers['user-agent'] || 'unknown';
}

// アップロード処理内で使用
const newMaterial = {
  id: Date.now(),
  title,
  subject,
  description: description || '',
  uploader,
  uploaderIP: getClientIP(req),
  uploaderUserAgent: getUserAgent(req),
  fileName: Buffer.from(file.originalname, 'latin1').toString('utf8'),
  filePath: `/uploads/${file.filename}`,
  fileSize: file.size,
  fileType: file.mimetype,
  uploadDate: new Date().toISOString(),
  viewCount: 0,
  downloadCount: 0,
  tags: [subject.toLowerCase()],
};
```

### 4.2 フロントエンド実装

**管理者パネルでの表示：**
- `src/pages/AdminPanel.jsx` でIPアドレスを表示
- IPアドレスでフィルタリング機能
- 同一IPの検出と警告表示

**一般ユーザー画面：**
- `src/pages/MaterialList.jsx` や `src/pages/MaterialDetail.jsx` ではIPアドレスを非表示

### 4.3 API仕様

**既存APIの拡張：**

**POST /api/upload**
- リクエストヘッダーからIPアドレスを自動取得
- レスポンスにIPアドレスは含めない（セキュリティ）

**GET /api/materials（一般ユーザー）**
```javascript
// IPアドレスを除外したレスポンス
{
  id, title, subject, description, uploader,
  fileName, filePath, fileSize, fileType,
  uploadDate, viewCount, downloadCount, tags
}
```

**GET /api/admin/materials（管理者専用・新規）**
```javascript
// IPアドレスを含む完全なレスポンス
{
  id, title, subject, description, uploader,
  uploaderIP, uploaderUserAgent,
  fileName, filePath, fileSize, fileType,
  uploadDate, viewCount, downloadCount, tags
}
```

## 5. 実装フェーズ

### Phase 1（初期実装）
1. IPアドレス取得関数の実装
2. materials.jsonへのIPアドレス保存
3. 既存データへのマイグレーション（IPアドレスなし → "unknown"）
4. コンソールログでの確認

### Phase 2（管理者パネル統合）
1. 管理者認証システムの実装
2. 管理者パネルでのIPアドレス表示
3. IPアドレスでのフィルタリング機能
4. 同一IPアドレスの検出と統計

### Phase 3（拡張機能）
1. IPアドレスのブロックリスト機能
2. 異常検知（短時間の大量アップロード等）
3. 詳細ログファイルの作成（ip_logs.json）
4. ログローテーション機能

## 6. テスト計画

### 6.1 単体テスト
- IPアドレス取得関数のテスト
- 各種ヘッダーパターンでの動作確認
- IPv4/IPv6の両対応確認

### 6.2 統合テスト
- アップロード時のIPアドレス記録確認
- materials.jsonへの正常保存確認
- 一般ユーザーAPIでのIPアドレス非表示確認

### 6.3 セキュリティテスト
- ヘッダー偽装への対策確認
- SQL/NoSQLインジェクション対策
- 権限チェックの動作確認

## 7. リスクと対策

### 7.1 プライバシーリスク
**リスク：** IPアドレスは個人情報に該当する可能性
**対策：**
- 管理者のみ閲覧可能
- 利用規約への明記
- 必要に応じてハッシュ化

### 7.2 プロキシ・VPN対策
**リスク：** VPN等でIPアドレスが隠蔽される
**対策：**
- User-Agentやその他の情報も併せて記録
- 行動パターンでの異常検知（Phase 3）

### 7.3 ストレージ容量
**リスク：** ログデータの肥大化
**対策：**
- 定期的な古いログの削除（Phase 3）
- ログローテーション機能

## 8. データ構造例

### materials.json（更新後）
```json
[
  {
    "id": 1762669904257,
    "title": "サンプル資料",
    "subject": "数学",
    "description": "説明文",
    "uploader": "テストユーザー",
    "uploaderIP": "192.168.1.100",
    "uploaderUserAgent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)...",
    "fileName": "sample.pdf",
    "filePath": "/uploads/1762669904257_sample.pdf",
    "fileSize": 1736948,
    "fileType": "application/pdf",
    "uploadDate": "2025-11-09T06:25:04.257Z",
    "viewCount": 0,
    "downloadCount": 0,
    "tags": ["数学"]
  }
]
```

## 9. 今後の拡張案

- アクセスログの詳細記録（閲覧・ダウンロード時）
- IPアドレスの地理的位置情報の取得（GeoIP）
- 不審なアクティビティの自動検知
- レート制限（同一IPからの連続アップロード制限）
- ブロックリスト機能

## 10. まとめ

この機能により、以下のメリットが得られます：
- セキュリティの向上
- 不正利用の抑止効果
- 問題発生時の追跡が可能
- 管理者による効果的な監視

実装優先度：**高**（Phase 1から着手推奨）

---

**作成日：** 2025年11月9日  
**最終更新：** 2025年11月9日  
**ステータス：** 承認待ち
