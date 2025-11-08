# 開発ガイド

## 1. 開発環境セットアップ

### 1.1 前提条件

```
- Node.js: v20.11.0 以上
- npm: v10.2.0 以上
- Git: 2.40.0 以上
- ブラウザ: Chrome, Firefox, Safari（最新版推奨）
- エディタ: Visual Studio Code 推奨
```

### 1.2 環境構築手順

```bash
# 1. リポジトリをクローン
git clone https://github.com/hirorogo/ekihousousim.git
cd ekihousousim

# 2. 依存パッケージをインストール
npm install

# 3. 開発サーバーを起動
npm run dev

# ブラウザで以下の URL にアクセス
# http://localhost:5174/ekihousousim/
```

### 1.3 環境変数設定

```bash
# .env.local ファイルを作成
cat > .env.local << EOF
# Firebase 設定（Phase 2 以降）
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_REGION=asia-northeast1

# 開発環境設定
VITE_API_BASE_URL=http://localhost:5000
VITE_DEBUG_MODE=true
VITE_LOG_LEVEL=debug

# セキュリティ
VITE_SITE_PASSWORD=123
EOF
```

### 1.4 IDE 拡張機能推奨

```
Visual Studio Code:
- ES7+ React/Redux/React-Native snippets
- ESLint
- Prettier
- Thunder Client または REST Client（API テスト）
- CSS Modules（intellisense）
```

## 2. プロジェクト構造と命名規則

### 2.1 ディレクトリ構成

```
src/
├── components/          # 再利用可能な UI コンポーネント
│   ├── Header.jsx       # ヘッダー
│   ├── Footer.jsx       # フッター
│   ├── Layout.jsx       # ページレイアウト
│   ├── Navigation.jsx   # ナビゲーション
│   ├── MaterialCard.jsx # 資料カード
│   └── SearchBar.jsx    # 検索バー
├── pages/               # ページコンポーネント（1 ページ = 1 ファイル）
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── MaterialList.jsx
│   ├── MaterialUpload.jsx
│   ├── MaterialDetail.jsx
│   └── Profile.jsx
├── css/                 # CSS Modules
│   ├── Home.module.css
│   ├── Login.module.css
│   └── ...（他 11 ファイル）
├── utils/               # ユーティリティ関数
│   ├── constants.js     # 定数管理
│   ├── api.js           # API 関連関数
│   └── helpers.js       # ヘルパー関数
├── hooks/               # カスタムフック
│   ├── useAuth.js       # 認証管理
│   └── useLocalStorage.js # LocalStorage 管理
├── App.jsx              # メインアプリケーション
├── main.jsx             # エントリーポイント
├── App.css              # グローバルスタイル
└── index.css            # リセットスタイル
```

### 2.2 命名規則

```
ファイル名:
- React コンポーネント: PascalCase (Home.jsx, MaterialCard.jsx)
- ユーティリティ関数: camelCase (api.js, helpers.js)
- CSS Modules: PascalCase + .module.css (Home.module.css)

関数名・変数名:
- 関数: camelCase (handleClick, fetchMaterials)
- 定数: UPPER_SNAKE_CASE (SITE_ACCESS_PASSWORD, SUBJECTS)
- state 変数: camelCase (isLoading, materials)
- boolean: is/has 接頭辞 (isAuthenticated, hasError)

CSS クラス名:
- kebab-case (material-card, search-bar)
- BEM 記法（オプション）:
  .button { }
  .button--primary { }
  .button__icon { }
```

## 3. コーディング規約

### 3.1 JavaScript/React

#### 3.1.1 ファイルヘッダー

```javascript
// filepath: /path/to/file.jsx
// ファイルの説明（役割、主要な機能等）
// 例：メインアプリケーションコンポーネント。認証ロジックとルーティングを管理。

import React, { useState, useEffect } from 'react';
// ... その他のインポート
```

#### 3.1.2 コンポーネント構造

```javascript
// コンポーネント
const MyComponent = ({ prop1, prop2 }) => {
  // 1. State 宣言
  const [state1, setState1] = useState(initialValue);
  
  // 2. Effect フック
  useEffect(() => {
    // 効果
  }, [dependencies]);
  
  // 3. ハンドラ関数
  const handleClick = () => {
    // イベントハンドラ
  };
  
  // 4. ヘルパー関数
  const helperFunction = () => {
    // ヘルパー関数
  };
  
  // 5. 返却（JSX）
  return (
    <div>
      {/* JSX コンテンツ */}
    </div>
  );
};

export default MyComponent;
```

#### 3.1.3 Props バリデーション（将来 TypeScript 導入前）

```javascript
// PropTypes は必須（現段階）
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.array,
  onSubmit: PropTypes.func.isRequired
};

MyComponent.defaultProps = {
  items: []
};
```

#### 3.1.4 キー命名規則

```javascript
// ✓ 良い例
const data = {
  userId: '123',
  userName: 'John',
  isActive: true,
  createdAt: '2024-01-01'
};

// ✗ 悪い例
const data = {
  user_id: '123',
  User_Name: 'John',
  is_active: true
};
```

### 3.2 CSS Modules

#### 3.2.1 スタイリング基本

```css
/* filepath: src/css/Home.module.css */
/* ホームページのスタイル */

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.title {
  font-size: 32px;
  font-weight: 600;
  color: #2c3e50;
  margin-bottom: 20px;
}

/* レスポンシブ対応 */
@media (max-width: 768px) {
  .container {
    padding: 12px;
  }
  
  .title {
    font-size: 24px;
  }
}
```

#### 3.2.2 CSS 変数の活用（推奨）

```css
/* グローバル変数定義（App.css または index.css）*/
:root {
  /* 色 */
  --color-primary: #3498db;
  --color-secondary: #e74c3c;
  --color-success: #2ecc71;
  
  /* 間隔 */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  
  /* フォント */
  --font-size-base: 16px;
  --font-size-lg: 20px;
  --font-family-base: 'Segoe UI', Tahoma, sans-serif;
}

/* コンポーネントで使用 */
.button {
  background-color: var(--color-primary);
  padding: var(--spacing-md);
  font-size: var(--font-size-base);
}
```

## 4. Git ワークフロー

### 4.1 ブランチ戦略（Git Flow）

```
main               # 本番環境
  ↑
  └── develop      # 開発環境
        ↑
        ├── feature/auth-improvement
        ├── feature/firebase-integration
        └── bugfix/search-filter-issue
```

### 4.2 ブランチ命名規則

```
新機能:     feature/{issue-number}-{brief-description}
           例: feature/10-firebase-integration

バグ修正:   bugfix/{issue-number}-{brief-description}
           例: bugfix/5-search-filter-not-working

ホットフィックス: hotfix/{issue-number}-{brief-description}
                例: hotfix/12-authentication-error

ドキュメント: docs/{brief-description}
            例: docs/api-specification
```

### 4.3 コミットメッセージ形式（Conventional Commits）

```
<type>(<scope>): <subject>

<body>

<footer>

type:
  - feat: 新機能
  - fix: バグ修正
  - docs: ドキュメント
  - style: コード整形（機能変更なし）
  - refactor: リファクタリング
  - perf: パフォーマンス改善
  - test: テスト追加
  - chore: ビルドやツール関連

scope: 影響を受けるコンポーネント
       例: auth, materials, search-bar

例:
feat(auth): パスワード認証を実装

- LocalStorage への状態保存
- ログアウト機能の追加

Closes #10
```

### 4.4 PR（Pull Request）プロセス

```
1. feature ブランチで作業
2. コードが完成したら PR を作成
3. チェックリスト確認
   - ✓ コード品質チェック（ESLint）
   - ✓ テスト実行
   - ✓ 説明文記述
4. レビュー依頼
5. レビュー承認後に merge
6. feature ブランチを削除

PR テンプレート:
---
## 変更内容
<!-- 変更の概要 -->

## 関連 Issue
Closes #{{ issue_number }}

## 変更タイプ
- [ ] 新機能
- [ ] バグ修正
- [ ] ドキュメント

## テスト方法
<!-- テスト手順 -->

## チェックリスト
- [ ] ESLint でエラーなし
- [ ] ローカルで動作確認済み
- [ ] 関連ドキュメント更新済み
---
```

## 5. ローカル開発での確認

### 5.1 開発サーバー起動

```bash
# 開発サーバー起動（自動リロード対応）
npm run dev

# ホットモジュールリプレイスメント（HMR）対応
# ファイル変更時に自動更新
```

### 5.2 ビルド・デプロイ確認

```bash
# 本番ビルド実行
npm run build

# ビルド出力確認
ls -la dist/

# ローカルでビルド結果をプレビュー
npm run preview

# ブラウザで http://localhost:5174/ekihousousim/ にアクセス
```

### 5.3 ブラウザ開発者ツール確認項目

```
Console:
- エラーメッセージなし
- 警告が最小限

Network:
- CSS: 1 ファイル（バンドル済み）
- JS: 1～2 ファイル（コード分割前）
- 初期ロード時間 < 2 秒

Storage:
- LocalStorage に 'siteAuth' キー確認
- キャッシュスペース < 10MB

Lighthouse:
- Performance > 80
- Accessibility > 85
- Best Practices > 85
- SEO > 90
```

## 6. デバッグ方法

### 6.1 Console ログ

```javascript
// 開発時のログ出力
console.log('message', variable); // 通常のログ
console.warn('warning message'); // 警告
console.error('error message');  // エラー

// 条件付きログ
if (process.env.NODE_ENV === 'development') {
  console.log('DEBUG:', data);
}

// 本番環境では削除推奨
```

### 6.2 React DevTools

```
拡張機能インストール:
- Chrome: React Developer Tools
- Firefox: React Developer Tools

使用方法:
1. DevTools を開く（F12）
2. Components タブを選択
3. コンポーネントツリーを検査
4. State・Props の値を確認
```

### 6.3 breakpoint デバッグ

```javascript
// DevTools で Source タブを開く
// コードの行番号をクリックして breakpoint を設定
// コードが実行されたときに停止

// または debugger ステートメント
function handleClick() {
  debugger; // ここで実行が止まる
  setState(true);
}
```

## 7. テスト方法（現在は手動テスト）

### 7.1 手動テストチェックリスト

#### 7.1.1 ページロード

```
[ ] ホームページ が正常に表示
[ ] パスワード入力画面が表示
[ ] 不正なパスワードでエラー表示
[ ] 正しいパスワードで入場
[ ] ログアウト後にログイン画面へ
```

#### 7.1.2 資料検索

```
[ ] 全資料が表示される
[ ] キーワード検索が機能
[ ] 科目フィルターが機能
[ ] 複数条件の組み合わせが機能
[ ] 検索結果が空の場合メッセージ表示
```

#### 7.1.3 資料アップロード

```
[ ] フォームが正常に表示
[ ] 必須項目チェック
[ ] ファイルサイズ制限チェック
[ ] 成功メッセージ表示
[ ] フォームリセット
```

#### 7.1.4 レスポンシブ対応

```
[ ] Mobile (< 600px): 1 列レイアウト
[ ] Tablet (600-1024px): 2 列レイアウト
[ ] Desktop (> 1024px): 3 列レイアウト
[ ] タッチジェスチャーが正常
[ ] フォント読みやすさ
```

### 7.2 クロスブラウザテスト

```
[ ] Chrome 最新版
[ ] Firefox 最新版
[ ] Safari 最新版
[ ] Edge 最新版
[ ] モバイルブラウザ（iOS Safari, Chrome Mobile）
```

## 8. よくある問題と解決方法

### 8.1 開発サーバーが起動しない

```bash
# 問題: Port 5174 が使用中
# 解決:
lsof -i :5174  # 使用中のプロセス確認
kill -9 <PID>  # プロセス終了

# または別の Port を使用
npm run dev -- --port 5175
```

### 8.2 モジュールが見つからない

```bash
# 問題: node_modules が破損
# 解決:
rm -rf node_modules
npm install
```

### 8.3 CSS が反映されない

```bash
# 問題: CSS Modules の import 誤り
# 解決:
// ✗ 誤り
import styles from './Home.css';

// ✓ 正しい
import styles from './Home.module.css';
```

### 8.4 LocalStorage データが保持されない

```bash
# 問題: ブラウザの設定でローカルストレージを無効
# 解決:
// DevTools → Application → Cookies の設定確認
// ブラウザの設定で "ローカルストレージの削除" をオフに
```

## 9. パフォーマンス最適化ガイド

### 9.1 バンドルサイズ分析

```bash
# バンドルサイズを確認
npm run build

# 詳細分析（Vite プラグイン使用時）
npm install --save-dev rollup-plugin-visualizer
```

### 9.2 React パフォーマンス最適化

```javascript
// useMemo での計算結果メモ化
const memoizedValue = useMemo(() => {
  return expensiveCalculation(a, b);
}, [a, b]);

// useCallback での関数メモ化
const memoizedCallback = useCallback(() => {
  handleClick();
}, [dependencies]);

// React.memo でコンポーネントメモ化
const MemoizedComponent = React.memo(MyComponent);
```

### 9.3 遅延読み込み（Lazy Loading）

```javascript
import { lazy, Suspense } from 'react';

const MaterialDetail = lazy(() => import('./pages/MaterialDetail'));

// 使用時
<Suspense fallback={<div>読み込み中...</div>}>
  <MaterialDetail />
</Suspense>
```

## 10. セキュリティベストプラクティス

### 10.1 環境変数

```javascript
// ✓ 正しい
const apiKey = import.meta.env.VITE_API_KEY;

// ✗ 誤り: ハードコード
const apiKey = 'abc123xyz';
```

### 10.2 ユーザー入力のサニタイズ

```javascript
// DOMPurify ライブラリ使用
import DOMPurify from 'dompurify';

const cleanHTML = DOMPurify.sanitize(userInput);
```

### 10.3 認証トークン管理（将来実装）

```javascript
// LocalStorage（重要度低のデータ）
localStorage.setItem('siteAuth', 'true');

// HttpOnly Cookie（重要度高のデータ）
// サーバーサイドで設定（クライアント JavaScript からアクセス不可）
document.cookie = 'authToken=abc123; HttpOnly; Secure; SameSite=Strict';
```

## 11. ドキュメント更新ガイド

### 11.1 ドキュメントファイル一覧

```
README.md                         # プロジェクト概要
REQUIREMENTS_SPECIFICATION.md     # 要件定義
REVERSE_ENGINEERING_REPORT.md     # リバースエンジニアリング
DATA_MODEL_DESIGN.md              # データモデル設計
USECASE_SEQUENCE_DIAGRAMS.md      # ユースケース図
API_SPECIFICATION.md              # API 仕様
DEVELOPMENT_GUIDE.md              # 本ファイル
TESTING_GUIDE.md                  # テスト計画
Howtomake.md                      # セットアップ手順（廃止予定）
```

### 11.2 ドキュメント更新時の注意点

```
- 機能追加時: README.md と該当ドキュメントを更新
- API 変更時: API_SPECIFICATION.md を更新
- データモデル変更時: DATA_MODEL_DESIGN.md を更新
- テスト項目追加時: TESTING_GUIDE.md を更新
- 変更したら README に「最終更新日」を記載
```

---

開発時に不明な点や問題が生じた場合は、本ガイドを参照するか、GitHub Issues で質問してください。

