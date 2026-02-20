# Pokémon図鑑 (Next.js)
Next.jsで作成したポケモン図鑑のプロジェクトです。  
対戦系ツールみたいなガチガチなのではなく、見て楽しむ感じのゆるーいやつです。

## 実装機能
- 名前検索  ※ひらがな・カタカナ・(一応、ローマ字も)対応
- 並べ替え機能  ※「項目（図鑑番号、高さ...等）」+「昇順／降順」
- 絞り込み機能  **※条件を複数指定可能、一つずつの検索条件はAND、検索条件同士はORで**
- 詳細画面  ※クリックするとそのポケモンの詳細画面に飛びます


## 前提条件

**起動前に以下をインストールしてください**

- Node.js（動作確認時のバージョン: v22.16.0）  
  [Node.js公式サイト](https://nodejs.org/) からダウンロードできます

- Git（動作確認時のバージョン: 2.53.0）  
  [Git公式サイト](https://git-scm.com/) からダウンロードできます

インストールできたら新しくコンソールを開いて以下のコマンドで確認：
```bash
git --version
node -v
```
→バージョンが表示されればOK

## 起動手順
1. リポジトリをクローン  
   **※その場にフォルダ作成するので事前にディレクトリを移動しておく**
   ```bash
   git clone https://github.com/coffee-kunren/pokedex.git
   ```
2. ディレクトリを変更
   ```bash
   cd pokedex
   ```
3. 依存関係をインストール
   ```bash
   npm install
   ```
4. 開発サーバーを起動
   ```bash
   npm run dev
   ```
5. コンソールに
   ```bash
   > next dev
   ```
   が表示されたら [http://localhost:3000](http://localhost:3000)を開く
   

<br><br><br>
**以下、デフォルトのREADME.mdを残しておきます。**
<br><br><br>

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.js`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
