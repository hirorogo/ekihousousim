# テスト過去問・プリント共有サイト - 詳細要件定義書

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
実装済み（MVP）
├── ホームページ表示
├── 共通パスワード認証
├── 資料の一覧表示・検索・フィルター
├── 資料のアップロードフォーム
├── 科目の動的管理（定数管理）
└── レスポンシブデザイン

実装予定（Phase 2）
├── バックエンド API 統合（Firebase）
├── ファイルアップロード機能
├── 資料詳細ページ・ダウンロード
├── コメント・評価機能
├── お気に入り機能
└── 高度なフィルター・タグ管理

検討中（Phase 3+）
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

### 5.1 ページコンポーネント一覧
```
ページ構成（React Router）:
/              → Home.jsx
/login         → Login.jsx
/materials     → MaterialList.jsx
/materials/upload → MaterialUpload.jsx
/materials/:id → MaterialDetail.jsx
/profile       → Profile.jsx
```

### 5.2 Home.jsx（ホームページ）
```
目的: サイトの入口、主要機能のダッシュボード

レイアウト:
1. ヒーロー セクション
   - サイトタイトル・説明
   - CTA ボタン（「資料を検索」「資料をアップロード」）

2. 機能紹介 セクション
   - 3～4 つの特徴を表示（カード形式）
   - アイコン、タイトル、説明

3. 最新資料 セクション
   - 新着順に最大6件の資料を表示
   - 各資料は MaterialCard コンポーネント

4. 統計情報 セクション
   - 総資料数、総アップロード数、総ダウンロード数

CSS: Home.module.css
```

### 5.3 Login.jsx（ログインページ）
```
目的: 全サイトアクセスの認証

フォーム入力:
- パスワード入力フィールド
- 「ログイン」ボタン
- エラーメッセージ表示

バリデーション:
- 空白チェック
- パスワード一致チェック

動作:
- 成功時: onAuthenticated() コールバック実行
- 失敗時: エラーメッセージ表示（赤色）

Props:
- requiredPassword: string（比較対象パスワード）
- onAuthenticated: () => void（成功時コールバック）

CSS: Login.module.css
```

### 5.4 MaterialList.jsx（資料一覧ページ）
```
目的: 資料の検索・閲覧・フィルタリング

構成:
1. SearchBar コンポーネント
   - キーワード検索入力欄
   - 科目フィルタードロップダウン
   - 検索ボタン

2. 資料グリッド
   - レスポンシブグリッド（1～3列）
   - 各セルに MaterialCard コンポーネント

3. ペジネーション（将来実装）
   - 1ページ10件
   - ページネーションコントロール

状態管理:
- materials: 全資料リスト（INITIAL_MATERIALS）
- filteredMaterials: フィルター済みリスト

イベントハンドラ:
- handleSearch(keyword): キーワード検索
- handleFilterBySubject(subject): 科目フィルター

CSS: MaterialList.module.css
```

### 5.5 MaterialUpload.jsx（資料アップロードページ）
```
目的: 新規資料のアップロード

フォーム構成:
1. タイトル入力（テキスト、最大100文字）
2. 科目選択（ドロップダウン、SUBJECTS から動的生成）
3. 説明入力（テキストエリア、最大500文字）
4. ファイル選択（ファイルピッカー、.pdf/.jpg/.png/.gif）
5. ニックネーム入力（テキスト、最大30文字）
6. 「アップロード」ボタン

バリデーション:
- 必須項目チェック
- ファイルサイズチェック（≤ 10MB）
- ファイル形式チェック（.pdf, .jpg, .png, .gif）
- 文字数チェック

動作フロー:
1. フォーム送信 → バリデーション実施
2. 成功 → 成功ダイアログ表示 → フォームリセット
3. 失敗 → エラーメッセージ表示 → フォーム保持

状態管理:
- formData: 入力データ（title, subject, description, file, nickname）

将来: Firebase Cloud Storage へのアップロード

CSS: MaterialUpload.module.css
```

### 5.6 MaterialDetail.jsx（資料詳細ページ）
```
目的: 資料の詳細表示

表示内容:
- タイトル（h1）
- 科目バッジ（色付き）
- メタデータ（アップロード日、アップロード者）
- 説明文
- ファイルプレビュー（画像の場合）
- ダウンロードボタン
- 評価表示（★ 4.5/5.0）
- コメント一覧
- コメント投稿フォーム（将来実装）

ルーティング:
- useParams() で material ID を取得
- ID に対応する資料をローカルデータから検索

CSS: MaterialDetail.module.css
状態: 現在はスタブ実装（将来、Firebase から詳細データ取得）
```

### 5.7 Profile.jsx（プロフィールページ）
```
目的: ユーザー情報管理・ログアウト

表示内容:
- ニックネーム（編集可能）
- 自己紹介文（編集可能、最大200文字）
- プロフィール画像（表示、将来はアップロード機能）
- アップロード数
- 総ダウンロード数
- アカウント作成日

操作:
- 「編集」ボタン → 編集モードに移行
- 「保存」ボタン → LocalStorage に保存
- 「キャンセル」ボタン → 編集モード終了
- 「ログアウト」ボタン → 認証状態を削除 → Login ページへ

状態管理:
- userInfo: ユーザー情報オブジェクト
- isEditMode: 編集モードフラグ

LocalStorage キー:
- userProfile: ユーザー情報（JSON）

CSS: Profile.module.css
```

### 5.8 共通コンポーネント

#### 5.8.1 Header.jsx
```
目的: 全ページ共通のヘッダー

表示内容:
- サイトロゴ / タイトル
- ナビゲーション（デスクトップ）
- ハンバーガーメニュー（モバイル）

CSS: Header.module.css
```

#### 5.8.2 Navigation.jsx
```
目的: サイト内ナビゲーションタブ

リンク一覧:
- Home （/）
- 資料一覧 （/materials）
- アップロード （/materials/upload）
- プロフィール （/profile）

CSS: Navigation.module.css
```

#### 5.8.3 Footer.jsx
```
目的: 全ページ共通フッター

表示内容:
- コピーライト表記
- リンク集（プライバシーポリシー等、将来実装）
- SNS リンク（将来実装）

CSS: Footer.module.css
```

#### 5.8.4 Layout.jsx
```
目的: ページレイアウト統一

構成:
- Header
- Navigation
- Main（children）
- Footer

CSS: Layout.module.css（Grid レイアウト）
```

#### 5.8.5 MaterialCard.jsx
```
目的: 資料の簡潔表示（一覧用）

表示内容:
- 資料タイトル
- 科目バッジ（色付き）
- 説明文（省略表示、最大2行）
- メタデータ（アップロード日、アップロード者）
- 評価（★ 4.5/5）
- コメント数、ダウンロード数

Props:
- material: Material オブジェクト

イベント:
- onClick → /materials/:id へ遷移

CSS: MaterialCard.module.css
```

#### 5.8.6 SearchBar.jsx
```
目的: 検索・フィルター機能の UI

構成:
- キーワード検索入力欄
- 科目フィルタードロップダウン
- 「検索」ボタン

Props:
- onSearch: (keyword: string) => void
- onFilterBySubject: (subject: string | null) => void

動作:
- 入力フィールド変更時に onChange イベント
- 検索ボタン押下時（または Enter キー）に onSearch() 実行
- ドロップダウン選択時に onFilterBySubject() 実行

CSS: SearchBar.module.css
```

## 6. データフロー・アーキテクチャ

### 6.1 認証フロー
```
┌─────────────────────┐
│   App.jsx           │ (authentication state)
└──────────┬──────────┘
           │
    useEffect + localStorage check
           │
     ┌─────v────────┐
     │ Authenticated?│
     └─┬──────────┬──┘
       │          │
      NO         YES
       │          │
       v          v
   ┌───────┐   ┌──────────┐
   │ Login │   │ Routes   │
   └───────┘   └──────────┘
       │              │
    Password       Various
     Input        Pages
       │              │
     Match        Display
       │              │
     YES             │
       │              │
       └──────v───────┘
         LocalStorage
          'siteAuth'
```

### 6.2 資料管理フロー
```
Upload Flow:
┌──────────────────────────┐
│  MaterialUpload.jsx      │
├──────────────────────────┤
│ ユーザーフォーム入力     │
└────────────┬─────────────┘
             │
        バリデーション
             │
      ┌──────v──────┐
      │ Success?    │
      └┬────────────┘
       │
    YES│
       │
       v
   LocalStorage
   (temporary)
       │
       v
  成功メッセージ
       │
   (将来) Firebase
     へアップロード

Search & Filter Flow:
┌──────────────────────────┐
│ MaterialList.jsx         │
├──────────────────────────┤
│ materials[] (初期化)     │
│ filteredMaterials[] (空) │
└────────────┬─────────────┘
             │
   ┌─────────v──────────┐
   │  SearchBar イベント │
   └─────────┬──────────┘
             │
    ┌────────┴────────┐
    │                 │
  Search           Filter
    │                 │
    v                 v
 Title/Desc    Subject Match
   Filter          Filter
    │                 │
    └────────┬────────┘
             │
             v
      filteredMaterials
        更新・再描画
```

### 6.3 ファイル構成・依存関係
```
App.jsx (entry point)
├── Layout.jsx
│   ├── Header.jsx
│   ├── Navigation.jsx
│   ├── (Main Content)
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── MaterialList.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── MaterialCard.jsx
│   │   ├── MaterialUpload.jsx
│   │   ├── MaterialDetail.jsx
│   │   └── Profile.jsx
│   └── Footer.jsx
├── utils/constants.js
│   ├── SUBJECTS
│   ├── INITIAL_MATERIALS
│   └── SITE_ACCESS_PASSWORD
└── utils/api.js（将来実装）
```

## 7. API 仕様（将来実装）

### 7.1 Firebase Cloud Functions エンドポイント
```
ベースURL: https://[REGION]-[PROJECT_ID].cloudfunctions.net

POST /api/materials
├── 説明: 新規資料アップロード
├── リクエスト:
│   {
│     title: string,
│     subject: string,
│     description: string,
│     fileName: string,
│     fileSize: number,
│     uploadedBy: string,
│     tags: string[]
│   }
├── レスポンス:
│   {
│     id: number,
│     uploadDate: string,
│     fileUrl: string,
│     status: 'success' | 'error'
│   }
└── ステータスコード: 201 (Created), 400 (Bad Request), 413 (File Too Large)

GET /api/materials
├── 説明: 資料一覧取得（フィルター対応）
├── クエリパラメータ:
│   ├── subject: string（科目）
│   ├── keyword: string（検索キーワード）
│   ├── sortBy: 'newest' | 'rating' | 'downloads'
│   ├── page: number（ページ数）
│   └── limit: number（1ページあたりの件数、デフォルト10）
├── レスポンス:
│   {
│     materials: Material[],
│     totalCount: number,
│     page: number,
│     totalPages: number
│   }
└── ステータスコード: 200 (OK), 400 (Bad Request)

GET /api/materials/:id
├── 説明: 資料詳細取得
├── レスポンス: Material オブジェクト
└── ステータスコード: 200 (OK), 404 (Not Found)

DELETE /api/materials/:id
├── 説明: 資料削除（認可必須）
├── リクエストヘッダ: Authorization: Bearer <token>
└── ステータスコード: 204 (No Content), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found)

POST /api/materials/:id/comments
├── 説明: コメント投稿
├── リクエスト:
│   {
│     text: string,
│     rating: number (1-5),
│     author: string
│   }
└── レスポンス: Comment オブジェクト

GET /api/materials/:id/comments
├── 説明: コメント一覧取得
└── レスポンス: Comment[]

POST /api/materials/:id/ratings
├── 説明: 評価投稿
├── リクエスト: { rating: number (1-5), userId: string }
└── レスポンス: { averageRating: number, count: number }
```

### 7.2 Firestore データベース設計
```
コレクション構成:
├── materials/
│   ├── {materialId}
│   │   ├── id: number
│   │   ├── title: string
│   │   ├── subject: string
│   │   ├── description: string
│   │   ├── uploadedBy: string
│   │   ├── uploadDate: timestamp
│   │   ├── fileUrl: string
│   │   ├── rating: number
│   │   ├── ratingCount: number
│   │   ├── viewCount: number
│   │   ├── downloadCount: number
│   │   ├── tags: string[]
│   │   ├── isPublished: boolean
│   │   ├── createdAt: timestamp
│   │   └── updatedAt: timestamp
│   └── {materialId}/comments/{commentId}
│       ├── id: number
│       ├── author: string
│       ├── text: string
│       ├── rating: number (1-5)
│       ├── createdAt: timestamp
│       └── updatedAt: timestamp
│
├── users/
│   └── {userId}
│       ├── id: string
│       ├── nickname: string
│       ├── email: string
│       ├── profileImageUrl: string
│       ├── bio: string
│       ├── uploadedMaterials: number[]
│       ├── favoriteMaterials: number[]
│       ├── createdAt: timestamp
│       └── lastLoginAt: timestamp
│
└── ratings/
    └── {materialId}/{userId}
        ├── rating: number (1-5)
        ├── createdAt: timestamp
        └── updatedAt: timestamp

セキュリティルール（将来実装）:
- 全ユーザーに読み取り権限
- アップロード者のみ更新・削除権限
- 管理者による削除・復旧権限
```

## 8. テスト計画

### 8.1 単体テスト（ユニットテスト）
```
テスト対象コンポーネント:
- Login.jsx: パスワード入力・検証ロジック
- MaterialList.jsx: フィルター・検索ロジック
- MaterialCard.jsx: Props 渡し・表示ロジック
- SearchBar.jsx: イベントハンドラ

テストフレームワーク: Vitest + React Testing Library（将来実装）

テストケース例:
✓ パスワードが正しい場合、onAuthenticated() が呼ばれる
✓ パスワードが間違う場合、エラーメッセージが表示される
✓ キーワード検索で正しく資料が絞り込まれる
✓ 科目フィルターで複数選択が可能
```

### 8.2 統合テスト
```
テスト対象フロー:
1. ログイン → ホーム → 資料検索 → 詳細表示
2. ホーム → アップロードページ → フォーム入力 → 確認

テスト方式: Cypress + MSW（Mock Service Worker）（将来実装）

テストケース例:
✓ アップロード後に資料一覧に表示される
✓ フィルター適用後に検索結果に反映される
✓ ログアウト後に Login ページへリダイレクトされる
```

### 8.3 UI テスト
```
テスト内容:
- レスポンシブレイアウト確認（Mobile/Tablet/Desktop）
- ブラウザ互換性確認（Chrome, Firefox, Safari）
- アクセシビリティ検証（axe, Lighthouse）

手動テスト項目:
✓ すべてのリンク・ボタンが正しく動作
✓ フォーム入力がバリデーション正常に動作
✓ エラーメッセージが適切に表示
```

### 8.4 E2E テスト
```
テストツール: Playwright（将来実装）

シナリオ:
1. ユーザーがサイトアクセス → パスワード入力 → ホーム表示
2. 資料検索 → キーワード入力 → 科目フィルター → 結果表示
3. 資料アップロード → フォーム記入 → 完了 → 一覧に表示
```

## 9. リバースエンジニアリング（現在の実装分析）

### 9.1 実装状況サマリー
```
実装度: 55% (MVP フェーズ)

完了項目:
✓ プロジェクト構造・ファイル編成
✓ React Router ルーティング（basename="/ekihousousim"）
✓ 共通パスワード認証（'123'）
✓ LocalStorage ベースの認証状態管理
✓ 全ページコンポーネント実装（スタブ含む）
✓ 全共通コンポーネント実装
✓ CSS Modules スタイリング（13ファイル）
✓ 科目定数管理（SUBJECTS 配列）
✓ 資料の検索・フィルター機能
✓ GitHub Actions 自動デプロイ設定
✓ レスポンシブデザイン基本

未実装項目:
□ Firebase バックエンド統合
□ 実際のファイルアップロード機能
□ 資料詳細ページの完全実装
□ コメント・評価機能
□ ペジネーション
□ 並び替え機能
□ お気に入り機能
□ ユーザープロフィール詳細実装
□ 単体テスト・統合テスト
□ パフォーマンス最適化（コード分割等）
□ エラーバウンダリ実装
```

### 9.2 コード品質分析

#### 9.2.1 アーキテクチャ評価
```
✓ 良い点:
- ページ・コンポーネント・ユーティリティが適切に分離
- 定数を constants.js で一元管理
- React Router による明確なルーティング設計
- CSS Modules による スコープ付きスタイリング
- カスタムフック（useAuth, useLocalStorage）による ロジック再利用

改善点:
- State 管理が各コンポーネント内に散在（将来は Zustand/Redux）
- API 層が未実装（utils/api.js がスタブ）
- エラーハンドリングが最小限
- キャッシング戦略が未実装
- ローディング状態の管理が不十分
```

#### 9.2.2 コンポーネント設計評価
```
App.jsx:
✓ 認証ロジックが明確
改善点: 大きすぎるコンポーネント（Router 設定と認証ロジックが混在）
→ 改善案: authGuard ミドルウェアで分離

Layout.jsx:
✓ ページレイアウトが一元化
✓ 全ページで共通構造を保証
改善点: コンポーネント間の結合度がやや高い

MaterialList.jsx:
✓ 検索・フィルター ロジックが機能的
改善点: State 管理が複雑（将来はカスタムフック化推奨）
→ useMaterialFilter() カスタムフック化

Profile.jsx:
改善点: 実装が不完全（スタブ状態）
→ 編集機能の実装必要
```

#### 9.2.3 スタイリング評価
```
✓ CSS Modules によるスコープ分離
✓ レスポンシブデザイン基本実装
✓ 色彩体系の統一

改善点:
- グローバルスタイル（index.css）が複数の責務持つ
- マジックナンバーが散在（将来は CSS 変数化推奨）
- メディアクエリの統一的定義が未実装
```

#### 9.2.4 パフォーマンス評価
```
✓ 軽量なバンドルサイズ（Vite）
✓ LocalStorage 活用による高速化

改善が必要:
- コード分割未実装（全コンポーネントが初期バンドルに含まれる）
- 画像最適化が未実装
- 遅延読み込み（Suspense）が未実装
- キャッシング戦略が未構築
```

### 9.3 セキュリティ評価
```
✓ 実装済み:
- HTTPS（GitHub Pages）
- React のデフォルト XSS 対策

改善が必要:
- パスワード '123' は開発専用（本番は変更必須）
- 環境変数化が未実装
- CSRF トークン が未実装
- 入力値サニタイズが未実装
- コンテンツセキュリティポリシー（CSP）ヘッダが未設定
```

### 9.4 保守性・スケーラビリティ評価
```
✓ 良い点:
- ファイル構成が明確・拡張しやすい
- 定数管理で動的な科目追加が容易
- Git/GitHub による バージョン管理

改善が必要:
- コメント不足（各関数・コンポーネントに説明文が必要）
- 型安全性がない（TypeScript 導入推奨）
- テストが存在しない（単体テスト・統合テスト必須）
- ドキュメント化が不十分
- API 仕様が未定義（バックエンド時に必須）
```

## 10. 今後の開発計画

### 10.1 Phase 2（バックエンド統合）
```
優先度順:
1. Firebase プロジェクト初期化・設定
2. Cloud Firestore データベース設計・実装
3. Cloud Storage ファイルストレージ設定
4. Cloud Functions API エンドポイント実装
5. フロントエンド API 層実装（utils/api.js）
6. 資料アップロード機能の完全実装
7. 資料詳細ページの完全実装
```

### 10.2 Phase 3（高度な機能）
```
優先度順:
1. コメント・評価機能
2. ペジネーション・ページング
3. 並び替え機能（新着、高評価、ダウンロード数）
4. お気に入り機能
5. 検索の高度化（タグ、日付範囲等）
6. ユーザープロフィール詳細機能
```

### 10.3 Phase 4（非機能改善）
```
優先度順:
1. パフォーマンス最適化（コード分割、画像最適化）
2. TypeScript 導入
3. テスト実装（単体・統合・E2E）
4. エラーハンドリング・エラーバウンダリ
5. ログ・分析機能
6. セキュリティ強化（認可、暗号化）
```

## 11. 開発方針・ルール

### 11.1 開発プロセス
```
Git ワークフロー: Git Flow
├── main: 本番環境
├── develop: 開発環境
└── feature/*: 機能開発ブランチ

コミットメッセージ形式: Conventional Commits
├── feat: 新機能
├── fix: バグ修正
├── docs: ドキュメント
├── style: コード整形
├── refactor: リファクタリング
└── test: テスト

例: feat: Firebase Firestore 統合
```

### 11.2 コーディング規約
```
言語: JavaScript (ES6+)
フレームワーク: React 19
フォーマッタ: Prettier（将来導入）
リンター: ESLint（設定済み）

命名規則:
- コンポーネント: PascalCase（Home.jsx, MaterialCard.jsx）
- 関数・変数: camelCase（handleSearch, isAuthenticated）
- 定数: UPPER_SNAKE_CASE（SITE_ACCESS_PASSWORD, SUBJECTS）
- CSS クラス: kebab-case（.material-card, .search-bar）

コメント規約:
- ファイルヘッダ: // filepath: /path/to/file
- 関数: // 関数の説明
- 複雑なロジック: // 説明コメント
```

### 11.3 ブランチ運用
```
develop → feature/firebase-integration
       → feature/comments-feature
       → feature/pagination

PR 時のチェック:
✓ コードレビュー（2人承認）
✓ テスト実行成功
✓ コーディング規約準守
✓ ドキュメント更新
```

## 12. トラブルシューティング

### 12.1 よくある問題と対応
```
問題: GitHub Pages デプロイ後、ページが表示されない
原因: base パス設定ミス
対応: vite.config.js の base を確認（'/ekihousousim/'）

問題: ローカルストレージが反映されない
原因: localStorage API サポート未確認
対応: ブラウザの開発者ツール → Application → Local Storage で確認

問題: 科目ドロップダウンが表示されない
原因: SUBJECTS が constants.js に存在しない
対応: constants.js を確認・更新

問題: 検索フィルターが機能しない
原因: MaterialList.jsx の handleSearch/handleFilterBySubject が未実装
対応: SearchBar のコールバック確認
```

## 13. 参考資料・リンク

### 13.1 公式ドキュメント
- React: https://react.dev
- React Router: https://reactrouter.com
- Vite: https://vitejs.dev
- Firebase: https://firebase.google.com/docs
- GitHub Pages: https://pages.github.com

### 13.2 関連リソース
- GitHub リポジトリ: https://github.com/hirorogo/ekihousousim
- デプロイ URL: https://hirorogo.github.io/ekihousousim/
- 開発サーバー: http://localhost:5174/ekihousousim/ (npm run dev)

---

作成日: 2024年度
最終更新: 2024年度
ドキュメント版: 1.0
