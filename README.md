
# テスト過去問・プリント共有サイト

## 1. システム概要

### 1.1 プロジェクト目的
初心者高校生向けのテスト過去問・プリント共有サイト。生徒が互いに学習資料を共有し、学習効率を向上させるためのプラットフォーム。

### 1.2 対象ユーザー
- **一次ユーザー**: 高等学校の生徒（初心者から中級者）
- **二次ユーザー**: 高校の教師（管理・監督者）
- **使用環境**: デスクトップ、タブレット、スマートフォン

### 1.3 アクセス方式
- **認証方式**: 共通パスワード（'123'）による全サイトアクセス制御
- **ユーザー識別**: アップロード時に入力したニックネームで識別
- **永続化**: ブラウザのローカルストレージにログイン状態を保存

### 1.4 システムのスコープ
```
■ 実装済み（MVP）
├── ホームページ表示
├── 共通パスワード認証
├── 資料の一覧表示・検索・フィルター
├── 資料のアップロードフォーム
├── 科目の動的管理（定数管理）
└── レスポンシブデザイン

□ 実装予定（Phase 2）
├── バックエンド API 統合（Firebase）
├── ファイルアップロード機能
├── 資料詳細ページ・ダウンロード
├── コメント・評価機能
├── お気に入り機能
└── 高度なフィルター・タグ管理

□ 検討中（Phase 3+）
├── ユーザー分析・ダッシュボード
├── 通知機能
├── ソーシャル機能（チャット等）
└── AI による学習支援
```

## 2. 技術スタック

### 2.1 フロントエンド
- **ランタイム**: Node.js v20.11.0
- **フレームワーク**: React 19.1.1（関数コンポーネント）
- **ビルドツール**: Vite 7.1.7
- **ルーティング**: React Router DOM 7.9.5
- **スタイリング**: CSS Modules（グラデーション不使用）
- **ストレージ**: ブラウザ LocalStorage API

### 2.2 バックエンド（将来実装）
- **認証**: Firebase Authentication
- **データベース**: Firestore
- **ファイルストレージ**: Firebase Cloud Storage
- **API**: RESTful API（Firebase Cloud Functions）

### 2.3 デプロイ・CI/CD
- **静的ホスティング**: GitHub Pages
- **デプロイパイプライン**: GitHub Actions
- **バージョン管理**: Git + GitHub
- **ブランチ戦略**: Git Flow（main, develop, feature/*）


## 3. 詳細機能要件

### 3.1 認証・アクセス制御

#### 3.1.1 サイト全体アクセス
```
操作フロー:
1. ユーザーがサイトにアクセス
2. 認証状態をチェック（LocalStorage確認）
3. 未認証の場合、ログインページへリダイレクト
4. ユーザーが共通パスワード（'123'）を入力
5. パスワード照合成功 → LocalStorageに認証状態を保存
6. 通常のルートへリダイレクト
7. 認証を削除するには、プロフィールページでログアウトボタンをクリック

コンポーネント関連:
- App.jsx: 認証ロジック、Router設定
- Login.jsx: パスワード入力フォーム
- Profile.jsx: ログアウト機能
```

#### 3.1.2 LocalStorage スキーマ
```javascript
// キー: 'siteAuth'
// 値: 'true' または undefined
// 永続期間: ブラウザキャッシュクリア時に削除
localStorage.getItem('siteAuth'); // 認証確認
localStorage.setItem('siteAuth', 'true'); // 認証設定
localStorage.removeItem('siteAuth'); // ログアウト
```

### 3.2 資料管理機能

#### 3.2.1 資料データモデル
```javascript
Material {
  id: number,              // ユニークID（自動採番）
  title: string,           // 資料のタイトル（必須、最大100文字）
  subject: string,         // 科目名（SUBJECTS から選択）
  description: string,     // 説明文（最大500文字）
  file: File | null,       // ファイルオブジェクト（PDF、画像）
  uploadDate: string,      // アップロード日時（YYYY-MM-DD）
  uploader: string,        // アップロード者のニックネーム
  fileUrl: string | null,  // ファイルのURL（Firebase Cloud Storage）
  rating: number,          // 平均評価（0.0 ～ 5.0）
  ratingCount: number,     // 評価数
  comments: Comment[],     // コメント配列
  views: number,           // 閲覧数
  downloads: number,       // ダウンロード数
  tags: string[],          // タグ配列（複数選択可）
  isPublished: boolean,    // 公開状態
  createdAt: string,       // 作成日時（ISO 8601）
  updatedAt: string,       // 更新日時（ISO 8601）
}
```

#### 3.2.2 コメントデータモデル
```javascript
Comment {
  id: number,              // ユニークID
  materialId: number,      // 対応する資料のID
  author: string,          // コメント者のニックネーム
  text: string,            // コメント本文（最大300文字）
  rating: number,          // 評価（1 ～ 5）
  createdAt: string,       // 作成日時
  updatedAt: string,       // 更新日時
}
```

#### 3.2.3 科目マスタ
```javascript
SUBJECTS {
  id: number,              // 科目ID
  name: string,            // 科目名（例: '数学', '英語'）
  color: string,           // UIの色コード（#RRGGBB形式）
  icon: string,            // アイコン名（将来用）
  description: string,     // 説明（将来用）
}
```

現在の実装:
```javascript
const SUBJECTS = [
  { id: 1, name: '数学', color: '#FF6B6B' },
  { id: 2, name: '英語', color: '#4ECDC4' },
  { id: 3, name: '言語文化', color: '#45B7D1' },
  { id: 4, name: '物理', color: '#FFA07A' },
  { id: 5, name: '科学と人間生活', color: '#98D8C8' },
  { id: 6, name: '電気回路', color: '#BB8FCE' },
];
```

#### 3.2.4 資料のアップロード
```
操作フロー:
1. ユーザーが「資料アップロード」ページを開く
2. フォームに以下情報を入力
   - タイトル（必須）
   - 科目（必須、ドロップダウンから選択）
   - 説明文（任意）
   - ファイル選択（必須、PDF・画像ファイルのみ）
   - ニックネーム（必須、最大30文字）
3. バリデーション実施
   - 必須項目チェック
   - ファイルサイズチェック（10MB以下）
   - ファイル形式チェック（.pdf, .jpg, .png, .gif）
4. 送信ボタンクリック
5. フロントエンドで一時保存（LocalStorage）
6. 成功メッセージ表示
7. (将来) Firebase に送信・保存
```

#### 3.2.5 資料の検索・フィルター
```
機能一覧:
1. キーワード検索
   - 対象: タイトル、説明文
   - 方式: 部分一致（大文字小文字区別なし）
   - リアルタイム検索（入力中に反映）

2. 科目でフィルター
   - ドロップダウンから複数選択（チェックボックス）
   - 「すべてを表示」オプション
   - 複数選択時は OR 条件（どれか一つに該当すればOK）

3. 並び替え
   - 新しい順（デフォルト）
   - 古い順
   - 高評価順
   - 閲覧数が多い順
   - ダウンロード数が多い順

4. ペジネーション
   - 1ページあたり10件表示
   - 「次へ」「前へ」ボタン
   - ページ数表示

実装状況:
✓ キーワード検索（実装済み）
✓ 科目フィルター（実装済み）
□ 並び替え（未実装）
□ ペジネーション（未実装）
```

#### 3.2.6 資料の詳細表示
```
表示内容:
- タイトル
- 科目バッジ（色付き）
- アップロード日時
- アップロード者
- 説明文
- ファイルプレビュー（可能な場合）
- ダウンロードボタン
- 評価表示（★★★★☆ 4.5/5）
- コメント一覧
- コメント投稿フォーム（将来実装）

コンポーネント: MaterialDetail.jsx（現在はスタブ）
```

#### 3.2.7 資料の削除
```
ルール:
- アップロード者本人のみ削除可能
- 削除確認ダイアログを表示
- 削除後は復元不可
- ログイン状態で削除処理を実行

(将来実装) Firebase Firestore での権限管理
```

### 3.3 ユーザー管理機能

#### 3.3.1 ユーザーデータモデル
```javascript
User {
  id: string,              // ユニークID（UUID）
  nickname: string,        // ニックネーム（表示用、変更可能）
  email: string | null,    // メールアドレス（将来実装）
  profileImage: string,    // プロフィール画像URL
  bio: string,             // 自己紹介文
  uploadedMaterials: number[], // アップロードした資料のID配列
  favoritesMaterials: number[], // お気に入り資料のID配列
  createdAt: string,       // 登録日時
  lastLoginAt: string,     // 最終ログイン日時
  role: 'student' | 'teacher' | 'admin', // ロール（将来実装）
}
```

#### 3.3.2 認証方式の変更
```
旧方式（廃止）:
- ユーザー登録ページ（Register.jsx）を削除
- メール/パスワード認証を廃止
- ユーザー一覧管理（constants.js の USER_MANAGEMENT）を廃止

新方式（現在）:
- 全サイトに共通パスワード（'123'）を使用
- ユーザーはアップロード時にニックネームを入力
- ニックネームで識別（複数回同じニックネーム使用可）
```

#### 3.3.3 プロフィール機能
```
表示内容:
- ニックネーム（編集可能）
- 自己紹介文（編集可能、最大200文字）
- プロフィール画像（アップロード可能）
- アップロードした資料数
- 総ダウンロード数
- アカウント作成日

操作:
- プロフィール編集フォーム
- ログアウトボタン
- アカウント削除ボタン（将来実装）

コンポーネント: Profile.jsx（基本実装済み）
```

### 3.4 UI/UX 要件

#### 3.4.1 レスポンシブデザイン
```css
/* ブレークポイント */
Mobile:    < 600px
Tablet:    600px ～ 1024px
Desktop:   >= 1024px

実装方式: CSS Modules でメディアクエリ対応
```

#### 3.4.2 配色・スタイリング
```javascript
// 基本色
PRIMARY: '#3498DB'        // 青
SECONDARY: '#E74C3C'      // 赤
SUCCESS: '#2ECC71'        // 緑
WARNING: '#F39C12'        // 橙
DANGER: '#E74C3C'         // 赤
LIGHT: '#ECF0F1'          // グレー（明）
DARK: '#2C3E50'           // グレー（暗）

// フォント
Font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
Font-size: Base 16px, Headers 24px～48px

// その他
Border-radius: 8px
Box-shadow: 0 2px 8px rgba(0,0,0,0.1)
Transition: 0.3s ease-in-out
```

#### 3.4.3 ページレイアウト
```
全ページ共通:
┌─────────────────────────┐
│      Header             │ (固定: ロゴ、ナビゲーション)
├─────────────────────────┤
│      Navigation         │ (タブ: Home, Materials, Upload, Profile)
├─────────────────────────┤
│      Main Content       │ (ページ毎のコンテンツ)
│      (flex レイアウト)   │
├─────────────────────────┤
│      Footer             │ (固定: コピーライト等)
└─────────────────────────┘
```

## 4. 詳細非機能要件

### 4.1 パフォーマンス要件
```
指標値:
- ページロード時間: < 2秒（LCP）
- Time to Interactive: < 3.5秒
- Cumulative Layout Shift: < 0.1
- First Input Delay: < 100ms

最適化施策:
- コード分割（React.lazy + Suspense）
- 画像最適化（webp形式、遅延読み込み）
- バンドルサイズ削減（Tree shaking）
- キャッシング戦略（HTTP キャッシュ、ServiceWorker）
```

### 4.2 セキュリティ要件
```
実装済み:
✓ HTTPS（GitHub Pages）
✓ CSP（Content Security Policy）ヘッダ

実装予定（バックエンド時）:
□ JWT トークン認証
□ CORS ポリシー
□ データ暗号化（TLS）
□ 入力値サニタイズ
□ XSS対策（React のデフォルト）
□ CSRF トークン

共通パスワード ('123') に関する注意:
- 開発環境専用
- 本番環境では環境変数で管理
- 複雑なパスワードに変更する
- (将来) Firebase Admins SDK で権限管理に移行
```

### 4.3 アクセシビリティ要件
```
標準: WCAG 2.1 Level AA

実装内容:
- セマンティック HTML（<header>, <nav>, <main>, <footer>）
- ARIA ラベル・ロール（フォーム、ボタン等）
- キーボードナビゲーション対応
- スクリーンリーダー対応
- 十分なコントラスト比（4.5:1）
- 画像に alt 属性
```

### 4.4 スケーラビリティ
```
現在: フロントエンド オンリー（LocalStorage）
        → サーバー側データは未保存

将来: バックエンド API 統合時
├── データベース: Firestore（NoSQL）
│   ├── Materials コレクション
│   ├── Users コレクション
│   ├── Comments コレクション
│   └── Ratings コレクション
├── ファイルストレージ: Cloud Storage
├── 認証: Firebase Authentication
└── リアルタイム機能: Cloud Firestore Realtime
```

## 5. ページ・コンポーネント仕様

## 開発方針
- **アジャイル開発**:
  - 短いスプリント（1週間）で開発を進める。
  - 毎週、進捗確認と計画の見直しを行う。
- **タスク管理**:
  - GitHub Issuesを使用してタスクを管理。
  - プロジェクトボードで進捗を可視化。

## 最初のスプリント目標
1. React + Viteの環境構築。
2. 基本的なページ構成（ホーム、ログイン、資料一覧ページ）の作成。
3. 資料のアップロード・表示機能の実装。

## ディレクトリ構成
```
src/                # ソースコード
├── components/     # Reactカスタムコンポーネント
├── css/            # カスタムCSS
├── pages/          # ページコンポーネント
├── App.jsx         # メインコンポーネント
├── index.jsx       # エントリーポイント
public/             # 公開用静的ファイル
.github/workflows/  # GitHub Actions設定
package.json        # プロジェクト設定
vite.config.js      # Vite設定
```

## デプロイ
- **Repository URL**: [https://github.com/hirorogo/ekihousousim](https://github.com/hirorogo/ekihousousim)
- GitHub Pagesで公開する際、`vite.config.js`の`base`プロパティをリポジトリ名に合わせて設定してください。
```js
export default defineConfig({
  base: '/ekihousousim/', // リポジトリ名に合わせて設定
})
```
このプロジェクトでは、以下のルールに従ってコードを生成してください：

1. React（JS） + Viteを使用しています。
2. React Routerを使用してルーティングを管理します。
3. コンポーネントは関数コンポーネントを使用してください。
4. module.css を使ってください
5. GitHub Pagesで公開するため、React Routerに設定してください。
Repository URLを https://github.com/hirorogo/ekihousousim
# GitHub Copilot Instructions

## Project Overview
このリポジトリは、です。

## Technical Specifications
- 使用言語: , JS
- フレームワーク:  React 18.0 上に構築
- buildツール: Node.js v20.11.0
- デプロイ: GitHubActionsでビルドしてGitHubPagesに自動デプロイ
- 文字エンコーディング: UTF-8
- 国際化: 日本語 (ja) デフォルト


## Development Guidelines

## Coding Conventions
- 使用言語: javascript, Markdown
- 日本語でコメント文を記述
- 絵文字の使用禁止（コード内、コメント内、回答内すべて）
- クラス、関数、コンポーネントごとにコメント文を記述
- インデントはスペース2つ
- セミコロン必須
開発環境はM2MacBook
ユーザーネームはhiroです。
基本プログラム関係のファイルは初期で生成される書類フォルダの中にしています
デザインにグラデーションを使ってはならない
また最後に変更サマリーを出力すること
Agentモード時は変更すべき点をハイライトしどのように変更するか説明し許可を求めること
作業前と作業後でコミットを行う必要があります
〇〇の認識であってますか？などと認識のすり合わせを行うこと
## 回答について
- 回答は日本語を使用
- 絵文字は一切使用しない
- 技術用語は適切な日本語訳を使用
- コード例には詳細なコメントを含める
- ファイルパスは相対パス（プログラム上は）で記述
- コマンドなどは絶対パスでお願いします
src/
├── components/          # Reactカスタムコンポーネント
│   ├── Header.jsx       # ヘッダーコンポーネント
│   ├── Footer.jsx       # フッターコンポーネント  
│   ├── Navigation.jsx   # ナビゲーションコンポーネント
│   ├── Layout.jsx       # レイアウトコンポーネント
│   ├── MaterialCard.jsx # 資料カードコンポーネント
│   └── SearchBar.jsx    # 検索バーコンポーネント
├── pages/               # ページコンポーネント
│   ├── Home.jsx         # ホームページ
│   ├── Login.jsx        # ログインページ
│   ├── Register.jsx     # ユーザー登録ページ
│   ├── MaterialList.jsx # 資料一覧ページ
│   ├── MaterialUpload.jsx # 資料アップロードページ
│   ├── MaterialDetail.jsx # 資料詳細ページ
│   └── Profile.jsx      # プロフィールページ
├── css/                 # CSS Modules
│   ├── Home.module.css
│   ├── Login.module.css
│   ├── Register.module.css
│   ├── MaterialList.module.css
│   ├── MaterialUpload.module.css
│   ├── MaterialDetail.module.css
│   ├── Profile.module.css
│   ├── Header.module.css
│   ├── Footer.module.css
│   ├── Navigation.module.css
│   ├── Layout.module.css
│   ├── MaterialCard.module.css
│   └── SearchBar.module.css
├── utils/               # ユーティリティ関数
│   ├── api.js          # API呼び出し用関数
│   ├── helpers.js      # 共通ヘルパー関数
│   └── constants.js    # 定数定義
├── hooks/               # カスタムフック
│   ├── useAuth.js      # 認証管理フック
│   └── useLocalStorage.js # ローカルストレージ管理フック
├── App.jsx             # メインコンポーネント
└── main.jsx            # エントリーポイント
