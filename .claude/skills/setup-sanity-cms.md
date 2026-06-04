---
name: setup-sanity-cms
description: Sanity Free プランで CMS 連携を構築する標準手順 (スキーマ定義・Studio 埋め込み・seed 投入)。「CMS 入れたい」「Sanity 設定」「お知らせ機能」「ブログ機能」「コラム機能」「事例 CMS」「Sanity Studio」「コンテンツ管理」「クライアントが更新できるように」など、CMS の新規構築・スキーマ追加・Studio 連携に関する発言があったら必ず使う。
---

# Sanity CMS 連携 (zuk-zuk 標準: Sanity Free プラン)

zuk-zuk-template ベースの案件に **Sanity (ヘッドレス CMS)** を組み込む Skill。月額契約案件で「お知らせ・記事・事例」などをクライアントが更新できる仕組みを構築する。

## なぜ Sanity Free か

| 選択肢 | 採用判断 |
|---|---|
| **Sanity Free (採用 — 月額契約案件)** | ✅ スキーマ無制限、コスト 0 円、英語 UI だが zuk-zuk が運用代行するなら問題なし |
| microCMS Hobby | ✅ 日本語 UI、クライアント所有、月 3 スキーマまで無料 (制作のみ案件向け) |
| Contentful | 高機能だが月額 $300 以上、中小案件に不向き |
| WordPress | サーバ管理が重い、Next.js との相性微妙 |

> **使い分けルール**:
> - **月額契約 (zuk-zuk が更新代行)** → **Sanity Free**
> - **制作のみ (クライアントが触る)** → **microCMS Hobby**

## 前提条件

- ✅ zuk-zuk-template クローン済み
- ✅ Sanity アカウント (https://www.sanity.io/login で GitHub or Google ログイン)
- ✅ 案件で CMS 化したいコンテンツ種別が決まっている (例: お知らせ / 記事 / 事例 / FAQ)

---

## 手順

### Step 1. Sanity プロジェクト作成

1. https://www.sanity.io/manage を開く
2. 「Create new project」
3. プロジェクト名: クライアント案件名
4. **Project ID** をコピー (例: `9q3o7nof`)
5. Dataset: `production` (デフォルトで OK)

### Step 2. 必要パッケージのインストール

```bash
npm install next-sanity sanity @sanity/vision @sanity/image-url @portabletext/react
npm install -D dotenv tsx  # seed スクリプト用 (既存ならスキップ)
```

### Step 3. 環境変数を登録

`.env.local`:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=9q3o7nof
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-01-01

# seed スクリプト実行時に必要 (NEXT_PUBLIC_ を付けない)
SANITY_API_WRITE_TOKEN=
```

`SANITY_API_WRITE_TOKEN` は:
- Sanity Manage > API > Tokens > 「Add API Token」
- Permission: **Editor** (read + write)
- 一度しか表示されないのでコピーして保存

### Step 4. ディレクトリ構造を作成

```
src/
├── sanity/
│   ├── client.ts          # Sanity クライアント
│   ├── lib/
│   │   └── image.ts       # 画像 URL ビルダー
│   └── schemas/
│       ├── index.ts       # スキーマ集約
│       └── news.ts        # スキーマ例
└── app/
    └── studio/
        └── [[...tool]]/
            └── page.tsx   # Sanity Studio 埋め込み

sanity.config.ts            # Sanity Studio 設定
```

### Step 5. `sanity.config.ts` を配置

```ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export default defineConfig({
  name: "default",
  title: "クライアント名 CMS",
  projectId,
  dataset,
  basePath: "/studio",  // /studio で Studio が起動
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
```

### Step 6. Sanity クライアント

`src/sanity/client.ts`:

```ts
import { createClient } from "next-sanity";

export const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2024-01-01",
  useCdn: process.env.NODE_ENV === "production",
});
```

### Step 7. スキーマ定義 (例: News)

`src/sanity/schemas/news.ts`:

```ts
import { defineField, defineType } from "sanity";

export const news = defineType({
  name: "news",
  title: "お知らせ",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "タイトル",
      type: "string",
      validation: (Rule) => Rule.required().max(80),
    }),
    defineField({
      name: "slug",
      title: "URL スラッグ",
      type: "slug",
      options: { source: "title" },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "publishedAt",
      title: "公開日",
      type: "datetime",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "抜粋",
      type: "text",
      rows: 3,
      validation: (Rule) => Rule.max(160),
    }),
    defineField({
      name: "coverImage",
      title: "カバー画像",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "body",
      title: "本文",
      type: "array",
      of: [{ type: "block" }, { type: "image" }],
    }),
  ],
  orderings: [
    { title: "公開日 (新しい順)", name: "publishedAtDesc", by: [{ field: "publishedAt", direction: "desc" }] },
  ],
});
```

`src/sanity/schemas/index.ts`:

```ts
import { news } from "./news";
// import { faq } from "./faq";
// import { works } from "./works";

export const schemaTypes = [news /*, faq, works */];
```

### Step 8. Studio 埋め込み

`src/app/studio/[[...tool]]/page.tsx`:

```tsx
"use client";

import { NextStudio } from "next-sanity/studio";
import config from "../../../../sanity.config";

export const dynamic = "force-static";
export { metadata, viewport } from "next-sanity/studio";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
```

これで `npm run dev` → http://localhost:3000/studio で Sanity Studio が動く。

### Step 9. データ取得 (ページ側)

`src/app/news/page.tsx` (一覧):

```tsx
import { sanityClient } from "@/sanity/client";

async function getNews() {
  return sanityClient.fetch(
    `*[_type == "news"] | order(publishedAt desc) {
      _id, title, slug, publishedAt, excerpt, coverImage
    }`,
    {},
    { next: { revalidate: 60, tags: ["news"] } }
  );
}

export default async function NewsListPage() {
  const news = await getNews();
  return (
    <main>
      {news.map((n: any) => (
        <article key={n._id}>
          <h2>{n.title}</h2>
          <time>{n.publishedAt}</time>
          <p>{n.excerpt}</p>
        </article>
      ))}
    </main>
  );
}
```

### Step 10. (オプション) Seed スクリプト

`scripts/seed-sanity.ts` で初期データを投入:

```ts
import { createClient } from "@sanity/client";
import { config } from "dotenv";

config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production",
  apiVersion: "2024-01-01",
  token: process.env.SANITY_API_WRITE_TOKEN,
  useCdn: false,
});

const sampleNews = [
  {
    _type: "news",
    title: "サイト公開のお知らせ",
    slug: { current: "site-launch" },
    publishedAt: new Date().toISOString(),
    excerpt: "新サイトを公開しました。",
  },
];

async function main() {
  for (const item of sampleNews) {
    const result = await client.create(item);
    console.log("Created:", result._id);
  }
}

main();
```

`package.json` に script 追加:

```json
"scripts": {
  "seed:sanity": "tsx scripts/seed-sanity.ts"
}
```

実行: `npm run seed:sanity`

---

## 環境変数

| 変数 | 用途 | 取得方法 |
|---|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` | Sanity プロジェクト識別 | Sanity Manage > Project Settings |
| `NEXT_PUBLIC_SANITY_DATASET` | 通常 `production` | 固定値 |
| `NEXT_PUBLIC_SANITY_API_VERSION` | API バージョン固定 | `2024-01-01` 推奨 |
| `SANITY_API_WRITE_TOKEN` | seed/書き込み権限 (Public 不可) | Sanity Manage > API > Tokens (Editor 権限) |

---

## 既知の罠 (Pitfalls)

### ❌ Project ID に URL を入れてしまう
- **AI STUDIO で実際にハマった**: Vercel env に `https://api.example.com` を入れていた
- 正: `9q3o7nof` のような英数字 ID
- Project ID は Sanity Manage > Project Settings に表示

### ❌ Write Token に `NEXT_PUBLIC_` を付けてしまう
- クライアントバンドルに漏れる = 誰でも書き込み可能になる
- **絶対に `NEXT_PUBLIC_` を付けない**
- `SANITY_API_WRITE_TOKEN` のみ (サーバ専用)

### ❌ CORS Origins 設定漏れ (Studio 表示エラー)
- Sanity Manage > API > CORS Origins で本番ドメインを許可
- `http://localhost:3000` (開発), `https://本番ドメイン` (本番), `https://*-vercel.app` (Preview)

### ❌ Studio が本番でアクセス可能 (セキュリティ)
- `/studio` は **Sanity アカウント認証必須** だが、Sanity Manage で許可ユーザーを管理しないと誰でも閲覧可
- Sanity Manage > Members で許可ユーザーを限定 (zuk-zuk 担当者 + クライアント)

### ❌ ISR の revalidate が短すぎる
- `revalidate: 1` だと Sanity API への負荷が増えて Free プラン制限 (10000 リクエスト/月) を超える
- 60-300 秒程度が推奨

### ❌ 画像が表示されない
- `@sanity/image-url` で URL ビルドが必要
- 直接 `coverImage.asset._ref` を `<img src>` に渡しても表示されない

---

## テスト・動作確認

### 開発時
- [ ] `npm run dev` → http://localhost:3000/studio で Studio 表示
- [ ] Studio でドキュメント作成 → ローカルページで表示確認
- [ ] `npm run seed:sanity` でサンプルデータ投入
- [ ] GROQ query で正しくフィルタ・ソートできるか

### 本番デプロイ後
- [ ] Vercel に環境変数を登録 (Project ID / Dataset / API Version)
- [ ] 本番ドメインで `/studio` にアクセス → Sanity ログインで管理画面が動く
- [ ] CORS Origins に本番ドメインを追加

---

## トラブルシューティング

| 症状 | 原因と対処 |
|---|---|
| `Configuration must contain projectId` | env 未設定 or 値が不正、`9q3o7nof` のような ID か確認 |
| Studio で「Network Error」 | CORS Origins に本番ドメイン未登録 |
| `permission denied` (seed 時) | Write Token が無効 / Read 権限のみ |
| 画像が `Cannot find image asset` | `@sanity/image-url` を使う、`urlFor(coverImage).url()` |
| 本番でデータ更新が反映されない | ISR の revalidate を待つか、Webhook で on-demand revalidate |

---

## 参照ドキュメント

- AI STUDIO 実装事例: `src/sanity/`, `sanity.config.ts`, `src/app/studio/`, `scripts/seed-sanity.ts`
- AI STUDIO セットアップ詳細: `docs/SANITY_SETUP.md`
- Sanity 公式: https://www.sanity.io/docs
- next-sanity: https://github.com/sanity-io/next-sanity
