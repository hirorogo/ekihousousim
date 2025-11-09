# クイックスタートガイド

このガイドでは、テスト過去問・プリント共有サイトを素早く起動して動作確認する手順を説明します。

## 前提条件

- Node.js v20.11.0 以上
- npm 10.0.0 以上
- macOS（推奨環境）

## セットアップ手順

### 1. リポジトリのクローン（初回のみ）

```bash
cd /Users/hiro/Documents
git clone https://github.com/hirorogo/ekihousousim.git
cd ekihousousim
```

### 2. 依存関係のインストール

#### フロントエンド
```bash
cd /Users/hiro/Documents/ekihousousim
npm install
```

#### バックエンド
```bash
cd /Users/hiro/Documents/ekihousousim/server
npm install
```

### 3. サーバー起動

#### バックエンド API サーバーの起動
```bash
cd /Users/hiro/Documents/ekihousousim/server
PORT=3001 npm start
```

正常に起動すると以下のメッセージが表示されます：
```
APIサーバー起動: http://localhost:3001
```

#### フロントエンド開発サーバーの起動
別のターミナルウィンドウで実行：
```bash
cd /Users/hiro/Documents/ekihousousim
npm run dev
```

正常に起動すると以下のメッセージが表示されます：
```
  VITE v7.2.1  ready in xxx ms

  ➜  Local:   http://localhost:5173/ekihousousim/
  ➜  Network: use --host to expose
```

### 4. ブラウザでアクセス

ブラウザで以下のURLにアクセス：
```
http://localhost:5173/ekihousousim/
```

## 基本機能の確認

### 1. ログイン機能
- 初回アクセス時、ログインページが表示される
- パスワード `123` を入力してログイン
- ログイン状態はブラウザのLocalStorageに保存される

### 2. 資料アップロード機能
1. ナビゲーションから「アップロード」をクリック
2. 以下の項目を入力：
   - タイトル（必須）
   - 科目（ドロップダウンから選択）
   - 説明文（任意）
   - ファイル選択（画像・PDF・テキスト対応）
3. オプション機能：
   - OCR実行：画像ファイルからテキストを抽出
   - PDF結合：複数ファイルを一つのPDFに結合
4. 「アップロード」ボタンをクリック

### 3. 資料一覧・検索機能
1. ナビゲーションから「資料一覧」をクリック
2. 検索バーでキーワード検索
3. 科目フィルターで絞り込み
4. 資料カードをクリックで詳細表示

### 4. OCR機能のテスト
1. 画像ファイル（PNG/JPEG）を用意
2. アップロード画面で画像を選択
3. 「OCR実行」チェックボックスをONにする
4. アップロード実行
5. 進捗バーとOCR結果を確認

### 5. PDF変換・結合機能のテスト
1. 複数の画像ファイルを選択
2. 「PDF結合」チェックボックスをONにする
3. アップロード実行
4. 変換・結合進捗を確認

## テスト用ファイル

プロジェクトには以下のテストファイルが含まれています：
```
test-files/
├── math-problem.png     # 数学の問題画像（OCRテスト用）
├── english-problem.png  # 英語の問題画像（OCRテスト用）
├── physics-test.txt     # テキストファイル
└── その他のテストファイル
```

## API エンドポイント確認

### 資料一覧取得
```bash
curl http://localhost:3001/api/materials
```

### ファイルアップロード
```bash
curl -X POST \
  -F "file=@/path/to/test.pdf" \
  -F "title=テスト資料" \
  -F "subject=数学" \
  -F "description=テスト用の資料です" \
  -F "uploader=テストユーザー" \
  http://localhost:3001/api/upload
```

## トラブルシューティング

### よくある問題

#### 1. ポート競合エラー
```bash
# ポート使用状況確認
lsof -i :3001
lsof -i :5173

# プロセス終了（必要に応じて）
kill -9 <PID>
```

#### 2. npm install エラー
```bash
# node_modules削除後再インストール
rm -rf node_modules package-lock.json
npm install
```

#### 3. サーバー起動エラー
- Node.jsのバージョン確認：`node --version`
- 必要ディレクトリの作成：`mkdir -p server/uploads server/data`

#### 4. CORS エラー
- フロントエンドとバックエンドのポート設定を確認
- `src/utils/constants.js`のAPI_BASE_URLを確認

### ログの確認

#### サーバーログ
```bash
cd /Users/hiro/Documents/ekihousousim/server
PORT=3001 npm start
# アップロード時に「アップロード受信:」ログが出力される
```

#### ブラウザログ
- ブラウザのDevTools → Consoleタブでエラー確認
- Networkタブで API リクエストの状況確認

## 開発モード

### ファイル監視モード
フロントエンドは自動でファイル変更を検知してリロードします。

バックエンドで自動リロードが必要な場合：
```bash
cd /Users/hiro/Documents/ekihousousim/server
npm install -g nodemon
PORT=3001 nodemon index.js
```

### デバッグモード
```bash
# Node.js デバッグモード
cd /Users/hiro/Documents/ekihousousim/server
PORT=3001 node --inspect index.js
```

## 本番デプロイ

### GitHub Pages デプロイ
```bash
cd /Users/hiro/Documents/ekihousousim
npm run build
npm run deploy
```

### 環境変数設定
本番環境では以下の環境変数を設定：
```bash
VITE_API_URL=https://your-api-domain.com
```

---

このガイドで問題が解決しない場合は、`docs/PROJECT_DOCUMENTATION.md` の詳細ドキュメントを参照してください。