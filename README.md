# Wiki-Chainer

Wikipedia のリンク構造とカテゴリ共通度を逆手に取って、**共通点の最も少ない記事**へと 20 歩移動し続ける拡散型ナレッジ探索 Web アプリです。

## 主な機能

- **20 歩の拡散探索**: 入力したキーワードを起点に、次の候補記事の中からリンク・カテゴリの重複（Overlap）が最小となる記事を選択して連鎖します。
- **軌道の可視化**: 到達した 20 ステップの経路をタイムライン形式で一覧表示します。
- **記事サマリーカード**: 各記事の冒頭概要・Divergence スコア・Wikipedia 元記事へのリンクをカード表示します。
- **外部 API キー不要**: 日本語版 Wikipedia API（MediaWiki Action API）へブラウザから直接アクセスするため、API キーの設定なしですぐに動作します。

## 技術スタック

- **React 19** + **TypeScript**
- **Vite 6**
- **Tailwind CSS**（CDN） / **Font Awesome 6**
- **MediaWiki Action API**（`ja.wikipedia.org`）

## セットアップ & 起動方法

### 必要環境

- Node.js 20 以上
- npm

### インストール・開発サーバー起動

```bash
npm install
npm run dev
```

起動後、ブラウザで `http://localhost:3000` を開きます。

### 型チェック・ビルド

```bash
# TypeScript 型チェック
npm run lint

# 本番ビルド（dist/ に出力）
npm run build

# ビルド結果のローカルプレビュー
npm run preview
```

## ディレクトリ構成

```text
.
├── App.tsx                     # メイン画面・探索ロジック
├── index.tsx                   # React エントリーポイント
├── index.html                  # HTML テンプレート
├── index.css                   # カスタムスタイル
├── components/
│   ├── Header.tsx              # ヘッダー
│   ├── PathVisualizer.tsx      # 20 歩の軌道ビジュアライザー
│   └── ArticleCard.tsx         # 記事カード
├── services/
│   └── wikipediaService.ts     # 日本語版 Wikipedia API クライアント
├── vite.config.ts
├── tsconfig.json
└── package.json
```

## GitHub へのアップロード手順

ローカルの Git リポジトリ（`main` ブランチ）は初期化・ステージング済みです。GitHub 上で空のリポジトリを作成した後、以下のコマンドで初回コミットとプッシュを行ってください。

```bash
git commit -m "Initial commit"
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```
