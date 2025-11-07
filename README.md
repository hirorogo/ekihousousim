
# テスト過去問・プリント共有サイト

## システム概要
- **目的**: テストの過去問や授業プリントを共有するためのウェブサイトを作成する。
- **対象ユーザー**: 高校生やその教師。
- **主な機能**:
  1. ユーザーが過去問やプリントをアップロード・ダウンロードできる。
  2. カテゴリや科目ごとに資料を整理できる。
  3. 資料にコメントや評価を付けられる。
  4. ユーザー登録・ログイン機能。

## 技術スタック
- **フロントエンド**: React + Vite
- **ルーティング**: React Router
- **スタイリング**: CSS Modules
- **バックエンド（将来的に追加）**: Firebase（認証、データベース、ストレージ）
- **デプロイ**: GitHub Pages

## 機能要件
### 必須機能
1. **資料管理機能**
   - 資料のアップロード（PDF、画像ファイル）。
   - 資料のダウンロード。
   - 資料の削除（アップロードしたユーザーのみ）。
   - 資料の検索（科目、キーワードなど）。

2. **ユーザー管理機能**
   - ユーザー登録（メールアドレス、パスワード）。
   - ログイン・ログアウト。
   - プロフィール編集（ニックネーム、アイコン画像）。


4. **UI/UX**
   - モバイル対応のレスポンシブデザイン。
   - シンプルで直感的な操作性。

### 拡張機能（将来的に追加可能）
- 資料の閲覧履歴。
- 資料の「お気に入り」機能。
- 資料のタグ付け。
- 他のユーザーとのチャット機能。

## 非機能要件
1. **パフォーマンス**
   - 軽量で高速な動作を目指す。
   - 初期ロード時間を短縮するため、必要に応じてコード分割を行う。

2. **セキュリティ**
   - ユーザー認証にはJWT（JSON Web Token）を使用。

3. **運用・保守**
   - GitHubを使用してバージョン管理を行う。
   - GitHub Pagesでデプロイする。

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

## 回答について
- 回答は日本語を使用
- 絵文字は一切使用しない
- 技術用語は適切な日本語訳を使用
- コード例には詳細なコメントを含める
- ファイルパスは絶対パスで記述
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