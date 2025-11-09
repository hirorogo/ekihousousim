
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
