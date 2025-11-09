# テスト過去問・プリント共有サイト - プロジェクトドキュメント

## 1. プロジェクト概要

### 1.1 システムの目的
初心者高校生向けのテスト過去問・プリント共有サイト。OCR機能とPDF変換・結合機能を備えたフロントエンド重視のWebアプリケーション。

### 1.2 主要機能
- **OCR機能**: フロントエンドでの画像テキスト抽出（tesseract.js）
- **PDF変換・結合機能**: 画像ファイルをPDFに変換し、複数ファイルを一つに結合
- **複数ファイルアップロード**: 画像・PDF・テキストファイル対応
- **資料検索・フィルター**: リアルタイム検索と科目別フィルタリング
- **レスポンシブデザイン**: モバイル・タブレット・デスクトップ対応
- **WEBビューアー機能**: PDF、画像、テキストファイルのブラウザ内プレビュー

### 1.3 技術スタック
```
フロントエンド:
├── React 19.1.1 (関数コンポーネント)
├── Vite 7.1.7 (ビルドツール)
├── React Router DOM 7.9.5 (ルーティング)
├── tesseract.js 6.0.1 (OCR機能)
├── pdf-lib 1.17.1 (PDF操作)
├── react-pdf (PDFビューアー)
└── CSS Modules (スタイリング)

バックエンド:
├── Node.js + Express (APIサーバー)
├── multer (ファイルアップロード)
├── JSONファイル (簡易データベース)
└── CORS対応 (クロスオリジン通信)
```

## 2. 実装済み機能詳細

### 2.1 フロントエンドOCR機能
**場所**: `src/pages/MaterialUpload.jsx`

**実装内容**:
- tesseract.jsライブラリを使用した日本語OCR
- リアルタイム進捗表示
- エラーハンドリング
- OCR実行のオン/オフ選択

**主要関数**:
```javascript
const runOCR = async (file, onProgress) => {
  const worker = await Tesseract.createWorker('jpn', 1, {
    logger: m => {
      if (onProgress && m.status === 'recognizing text') {
        onProgress(Math.round(m.progress * 100));
      }
    }
  });
  const { data: { text } } = await worker.recognize(file);
  await worker.terminate();
  return text;
};
```

### 2.2 PDF変換・結合機能
**場所**: `src/pages/MaterialUpload.jsx`

**実装内容**:
- 画像ファイル（JPEG, PNG）からPDFへの変換
- 複数PDFファイルの結合
- アスペクト比保持
- 進捗表示対応

**主要関数**:
```javascript
const convertToPDF = async (file, onProgress) => {
  // 画像ファイルをPDFに変換
  const pdfDoc = await PDFDocument.create();
  // 画像埋め込み処理
  // アスペクト比計算・配置
};

const mergePDFs = async (pdfFiles, onProgress, title) => {
  // 複数PDFを一つに結合
  const mergedPdf = await PDFDocument.create();
  // ページコピー・結合処理
};
```

### 2.3 複数ファイルアップロード機能
**場所**: `src/pages/MaterialUpload.jsx`, `server/api/upload.js`

**対応ファイル形式**:
- PDF: `application/pdf`
- 画像: `image/jpeg`, `image/jpg`, `image/png`
- テキスト: `text/plain`

**ファイルサイズ制限**: 50MB

**プレビュー機能**:
- 選択ファイルの即座プレビュー
- ファイル情報表示（名前、サイズ、形式）
- 個別ファイル削除機能

### 2.4 API一元管理システム
**場所**: `src/utils/constants.js`, `src/utils/api.js`

**API定義**:
```javascript
export const API_BASE_URL = 'http://localhost:3001';
export const API_ENDPOINTS = {
  upload: `${API_BASE_URL}/api/upload`,
  materials: `${API_BASE_URL}/api/materials`,
  comments: `${API_BASE_URL}/api/comments`,
  ratings: `${API_BASE_URL}/api/ratings`,
  users: `${API_BASE_URL}/api/users`,
  ocr: `${API_BASE_URL}/api/ocr`
};
```

### 2.5 資料検索・フィルター機能
**場所**: `src/pages/MaterialList.jsx`

**検索機能**:
- キーワード検索（タイトル・説明文）
- 科目別フィルター
- リアルタイム検索結果更新

**科目データ**:
```javascript
const SUBJECTS = [
  { id: 1, name: '数学', color: '#FF6B6B' },
  { id: 2, name: '英語', color: '#4ECDC4' },
  { id: 3, name: '言語文化', color: '#45B7D1' },
  { id: 4, name: '物理', color: '#FFA07A' },
  { id: 5, name: '科学と人間生活', color: '#98D8C8' },
  { id: 6, name: '電気回路', color: '#BB8FCE' }
];
```

### 2.6 WEBビューアー機能
**場所**: `src/components/FileViewer.jsx`, `src/pages/MaterialDetail.jsx`

**対応ファイル形式**:
- PDF: `application/pdf` (react-pdf使用)
- 画像: `image/jpeg`, `image/png` (HTMLネイティブ表示)
- テキスト: `text/plain` (プレーンテキスト表示)

**PDFビューアー機能**:
- ページナビゲーション（前ページ/次ページ）
- ページ数表示
- レスポンシブ表示（画面サイズに自動調整）
- 読み込みエラー処理

**画像ビューアー機能**:
- 画面サイズに合わせた自動リサイズ
- アスペクト比保持
- 読み込みエラー処理

**テキストビューアー機能**:
- 日本語テキスト対応
- 改行・インデント保持
- スクロール対応

**主要コンポーネント**:
```javascript
const FileViewer = ({ fileUrl, fileName, fileType }) => {
  // PDFビューアー
  if (fileType === 'application/pdf') {
    return <PDFViewerComponent />;
  }
  // 画像ビューアー
  if (fileType.startsWith('image/')) {
    return <ImageViewerComponent />;
  }
  // テキストビューアー
  if (fileType === 'text/plain') {
    return <TextViewerComponent />;
  }
  // 未対応形式
  return <UnsupportedFileComponent />;
};
```

**資料詳細ページ統合**:
- 資料メタデータ表示
- ファイルプレビュー
- ダウンロード機能
- パンくずナビゲーション
- レスポンシブデザイン

## 3. データ構造

### 3.1 資料データモデル
```javascript
Material {
  id: number,              // ユニークID（タイムスタンプ）
  title: string,           // 資料タイトル
  subject: string,         // 科目名
  description: string,     // 説明文
  uploader: string,        // アップロード者
  fileName: string,        // 元ファイル名
  filePath: string,        // サーバー上のファイルパス
  fileSize: number,        // ファイルサイズ（バイト）
  fileType: string,        // MIMEタイプ
  uploadDate: string,      // アップロード日時（ISO 8601）
  viewCount: number,       // 閲覧数
  downloadCount: number,   // ダウンロード数
  rating: number,          // 平均評価
  tags: string[]           // タグ配列
}
```

### 3.2 データファイル構成
```
server/data/
├── materials.json       # 資料データ
├── comments.json        # コメントデータ
├── ratings.json         # 評価データ
└── users.json          # ユーザーデータ
```

## 4. アーキテクチャ設計

### 4.1 フロントエンドアーキテクチャ
```
src/
├── components/          # 再利用可能コンポーネント
│   ├── Header.jsx       # ヘッダー
│   ├── Footer.jsx       # フッター
│   ├── Navigation.jsx   # ナビゲーション
│   ├── Layout.jsx       # レイアウト
│   ├── MaterialCard.jsx # 資料カード
│   └── SearchBar.jsx    # 検索バー
├── pages/               # ページコンポーネント
│   ├── Home.jsx         # ホーム
│   ├── Login.jsx        # ログイン
│   ├── MaterialList.jsx # 資料一覧
│   ├── MaterialUpload.jsx # 資料アップロード
│   ├── MaterialDetail.jsx # 資料詳細
│   └── Profile.jsx      # プロフィール
├── utils/               # ユーティリティ
│   ├── constants.js     # 定数定義
│   ├── api.js          # API関数
│   └── helpers.js      # ヘルパー関数
├── hooks/               # カスタムフック
│   ├── useAuth.js      # 認証管理
│   └── useLocalStorage.js # ローカルストレージ
└── css/                # CSS Modules
    ├── (各コンポーネント用CSSファイル)
    └── ...
```

### 4.2 バックエンドAPI設計
```
server/
├── index.js             # メインサーバーファイル
├── api/                 # APIルート
│   ├── upload.js        # ファイルアップロード
│   ├── materials.js     # 資料CRUD
│   ├── comments.js      # コメント機能
│   ├── ratings.js       # 評価機能
│   ├── users.js         # ユーザー管理
│   └── ocr.js          # OCR機能
├── data/                # JSONデータベース
└── uploads/             # アップロードファイル
```

## 5. 開発ガイドライン

### 5.1 コーディング規約
- **言語**: JavaScript（ES6+）
- **コンポーネント**: 関数コンポーネント使用
- **スタイリング**: CSS Modules
- **インデント**: スペース2個
- **セミコロン**: 必須
- **コメント**: 日本語で記述

### 5.2 環境設定

**必要な環境**:
- Node.js v20.11.0+
- npm 10.0.0+

**開発サーバー起動**:
```bash
# フロントエンド
cd /Users/hiro/Documents/ekihousousim
npm run dev

# バックエンド
cd /Users/hiro/Documents/ekihousousim/server
PORT=3001 npm start
```

### 5.3 ポート設定
- フロントエンド: http://localhost:5173
- バックエンド API: http://localhost:3001

## 6. 機能テスト手順

### 6.1 OCR機能テスト
1. MaterialUploadページにアクセス
2. 画像ファイル（PNG/JPEG）を選択
3. 「OCR実行」チェックボックスをONにする
4. アップロード実行
5. OCR進捗表示とテキスト抽出結果を確認

### 6.2 PDF変換・結合機能テスト
1. 複数の画像ファイルを選択
2. 「PDF結合」チェックボックスをONにする
3. アップロード実行
4. PDF変換進捗と結合進捗を確認
5. 結合されたPDFファイルの確認

### 6.3 ファイルアップロード機能テスト
1. 対応形式のファイルを選択
2. タイトル、科目、説明文を入力
3. アップロード実行
4. サーバーログでファイル受信を確認
5. materials.jsonにデータ保存を確認

## 7. 今後の開発予定

### 7.1 Phase 2（短期）
- [ ] ファイルダウンロード機能
- [ ] 資料詳細ページの完成
- [ ] コメント・評価機能の実装
- [ ] ファイルプレビュー機能の拡張

### 7.2 Phase 3（中期）
- [ ] ユーザー認証システム（Firebase）
- [ ] リアルタイム通知機能
- [ ] 高度な検索・フィルター
- [ ] タグ管理システム

### 7.3 Phase 4（長期）
- [ ] AI による学習支援
- [ ] ソーシャル機能（チャット等）
- [ ] 管理者ダッシュボード
- [ ] パフォーマンス最適化

## 8. トラブルシューティング

### 8.1 よくある問題
**問題**: サーバー起動エラー（ポート競合）
**解決**: ポート3001が使用可能か確認
```bash
lsof -i :3001
```

**問題**: CORS エラー
**解決**: server/index.jsのCORS設定を確認

**問題**: ファイルアップロード失敗
**解決**: ファイルサイズ制限（50MB）とファイル形式を確認

### 8.2 デバッグ方法
- ブラウザのDevTools → Networkタブでリクエスト確認
- サーバーコンソールでAPI呼び出しログ確認
- LocalStorageの認証状態確認

## 9. セキュリティ考慮事項

### 9.1 現在の実装
- ファイル形式チェック（multer）
- ファイルサイズ制限
- CORS設定
- XSS対策（Reactのデフォルト）

### 9.2 将来の改善点
- ファイル内容の詳細検証
- アップロードファイルのウイルススキャン
- レート制限の実装
- 認証・認可システムの導入

## 10. パフォーマンス最適化

### 10.1 実装済み
- コンポーネントの適切な分割
- CSS Modulesによるスタイル最適化
- 進捗表示によるUX向上

### 10.2 改善予定
- 画像の遅延読み込み
- ファイルの圧縮処理
- キャッシング戦略
- バンドルサイズの最適化

---

**最終更新日**: 2025年11月9日  
**バージョン**: 1.0.0  
**作成者**: hiro

このドキュメントは開発状況に応じて随時更新されます。