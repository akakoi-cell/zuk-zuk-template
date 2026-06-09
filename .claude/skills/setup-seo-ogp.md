---
name: setup-seo-ogp
description: Next.js 16 App Router で SEO / OGP / 構造化データ / 動的 OG 画像生成 を整備する標準手順。「SEO 対策」「OGP 設定」「構造化データ」「JSON-LD」「sitemap 作って」「robots.txt」「メタタグ整備」「Google にインデックスされない」「SNS シェア時の画像」「OGP 画像」「OG 画像」「正方形に収めて」「LINE シェアで切れる」「Slack で OG 画像」「Discord で OG」「OGP 1:1 クロップ」「Twitter Card」 など、SEO 対応や OGP 整備、 OG 画像のレイアウト調整に関する発言があったら必ず使う。
---

# SEO / OGP / 構造化データ 整備 (zuk-zuk 標準)

zuk-zuk-template ベースの案件に **SEO・OGP・sitemap・robots・構造化データ・動的 OG 画像** を整備する Skill。Next.js 16 App Router の標準機能を活用して、検索エンジンと SNS の両方に最適化する。

## このスキルでカバーする範囲

| 項目 | 対応ファイル |
|---|---|
| metadata (title / description / OGP / Twitter / robots) | `src/app/layout.tsx` の `metadata` export |
| sitemap.xml の動的生成 | `src/app/sitemap.ts` |
| robots.txt の動的生成 | `src/app/robots.ts` |
| 構造化データ (JSON-LD) | `src/app/layout.tsx` 内に `<script>` で埋め込み |
| 動的 OG 画像生成 | `src/app/opengraph-image.tsx` |
| ページ別 metadata (お知らせ詳細など) | `app/news/[slug]/page.tsx` の `generateMetadata` |

## 前提条件

- ✅ zuk-zuk-template クローン済み (基本的な metadata は既に含まれている)
- ✅ 本番ドメインが決定済み (`NEXT_PUBLIC_SITE_URL`)
- ✅ クライアントの正式社名 / サービス名 / 説明文が確定
- ✅ ロゴ画像が `public/` に配置済み (構造化データで参照)

---

## 手順

### Step 1. metadata の整備 (`src/app/layout.tsx`)

`SITE` 定数を `src/lib/content.ts` に集約 (テンプレに含まれている):

```ts
export const SITE = {
  name: "クライアント名",
  title: "クライアント名 — メインメッセージ",
  description: "サイトの説明文を 100-160 文字程度で。検索結果と OGP で使われる。",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  logo: "/brand_logo.svg",
} as const;
```

`src/app/layout.tsx` の `metadata` は基本的にテンプレ通りで OK。案件で追加するものがあれば:

```ts
export const metadata: Metadata = {
  // ... 既存 ...
  keywords: ["案件向けキーワード", "業種", "地域"],
  authors: [{ name: SITE.name }],
  creator: SITE.name,
  publisher: SITE.name,
  category: "Business",  // 案件業種に応じて
};
```

### Step 2. sitemap.ts の作成

`src/app/sitemap.ts`:

```ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = SITE.url;

  // 静的ページ
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), priority: 1.0 },
    { url: `${baseUrl}/legal/terms`, lastModified: new Date(), priority: 0.3 },
    { url: `${baseUrl}/legal/privacy`, lastModified: new Date(), priority: 0.3 },
    { url: `${baseUrl}/legal/tokushoho`, lastModified: new Date(), priority: 0.3 },
  ];

  // Sanity を使う案件は news 等の動的ページも追加
  // const news = await sanityClient.fetch(`*[_type == "news"]{ slug, _updatedAt }`);
  // const dynamicPages = news.map(n => ({
  //   url: `${baseUrl}/news/${n.slug.current}`,
  //   lastModified: new Date(n._updatedAt),
  //   priority: 0.5,
  // }));

  return [...staticPages /*, ...dynamicPages */];
}
```

### Step 3. robots.ts の作成

`src/app/robots.ts`:

```ts
import type { MetadataRoute } from "next";
import { SITE } from "@/lib/content";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/account/", "/api/", "/studio/"], // 管理画面等を除外
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
  };
}
```

### Step 4. 構造化データ (JSON-LD)

`src/app/layout.tsx` 内の `jsonLd` 定数を案件に合わせて拡張。

**最低限の構成** (テンプレに含まれている):
- `Organization` — 運営組織
- `WebSite` — サイト全体

**案件で追加候補**:

```ts
const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    // Organization (既存)
    // WebSite (既存)

    // 業種別: LocalBusiness (実店舗がある場合)
    {
      "@type": "LocalBusiness",
      "@id": `${SITE.url}/#localbusiness`,
      name: SITE.name,
      address: {
        "@type": "PostalAddress",
        streetAddress: "東京都〇〇区〇〇1-2-3",
        addressLocality: "東京都",
        postalCode: "100-0001",
        addressCountry: "JP",
      },
      telephone: "+81-3-1234-5678",
      openingHours: "Mo-Fr 10:00-19:00",
    },

    // 業種別: MedicalClinic (歯科クリニック等)
    {
      "@type": "MedicalClinic",
      name: SITE.name,
      // ... LocalBusiness と同様 + medicalSpecialty 等
    },

    // サービス提供型: Service
    {
      "@type": "Service",
      "@id": `${SITE.url}/#service`,
      name: "サービス名",
      provider: { "@id": `${SITE.url}/#organization` },
      serviceType: "サービスタイプ",
    },
  ],
};
```

> 💡 業種別に **正しい schema.org type** を使うことが重要 (Google リッチリザルト対応)。

| 業種 | 推奨 type |
|---|---|
| 飲食店・カフェ | `Restaurant` / `CafeOrCoffeeShop` |
| 美容室・サロン | `BeautySalon` / `HairSalon` |
| 歯科 | `Dentist` (or `MedicalClinic`) |
| 整体 | `MedicalBusiness` |
| 士業 | `LegalService` / `AccountingService` |
| 物販 EC | `Store` / `Product` (商品個別) |
| 教育・スクール | `EducationalOrganization` |

### Step 5. 動的 OG 画像 (`opengraph-image.tsx`) ⭐ **正方形セーフエリア必須**

#### 🚨 重要ルール: 中央 630x630 セーフエリア

OG 画像は **1200x630 (アスペクト比 1.91:1)** が標準だが、 **LINE / Slack / Discord / iMessage 等は 1:1 正方形でクロップ** する。 横長配置だと左右の重要情報が切れる。

→ **全コンテンツを中央 630x630 セーフエリアに集約** する。 左右の各 285px は装飾のみ。

```
┌────────────────────────────────────────────────┐ 1200x630 (Twitter/Facebook 全表示)
│ 装飾 │ ◆中央セーフエリア 630x630 (LINE/Slack/Discord で見える範囲) ◆ │ 装飾 │
│ 285  │   ロゴ / タイトル / subtitle / 統計 等の主要情報を集約        │ 285  │
│      │                                                                │      │
└────────────────────────────────────────────────┘
```

#### 実装テンプレ (推奨パターン)

`src/app/opengraph-image.tsx`:

```tsx
import { ImageResponse } from "next/og";
import { SITE } from "@/lib/content";

export const alt = SITE.title;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  const SAFE = 630; // 中央正方形セーフエリア

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#FFFFFF",
          display: "flex",
          justifyContent: "center",  // ← 中央寄せ
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* 左右の装飾 (任意、 横長表示時の間延び防止) */}
        <div style={{ position: "absolute", left: 80, top: 80, bottom: 80, width: 1, background: "#1A1A1A", opacity: 0.1 }} />
        <div style={{ position: "absolute", right: 80, top: 80, bottom: 80, width: 1, background: "#1A1A1A", opacity: 0.1 }} />

        {/* 中央 630x630 正方形セーフエリア */}
        <div
          style={{
            width: SAFE,
            height: SAFE,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",  // 上中下 配置
            padding: 60,
          }}
        >
          {/* top: eyebrow / logo */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontSize: 18, letterSpacing: 6, color: "#595959", textTransform: "uppercase" }}>
              {SITE.tagline ?? "Brand Tagline"}
            </div>
            {/* ロゴ枠 */}
            <div style={{ width: 64, height: 64, border: "2px solid #1A1A1A", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24 }}>
              {SITE.initial ?? "X"}
            </div>
          </div>

          {/* center: title (※ 長い場合は 2 行に分割) */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 68, fontWeight: 700, color: "#1A1A1A", lineHeight: 1.05 }}>
              {SITE.name}
            </div>
            <div style={{ fontSize: 22, color: "#595959", marginTop: 20, lineHeight: 1.4 }}>
              {SITE.description}
            </div>
          </div>

          {/* bottom: 統計やバッジ等 (任意) */}
          <div style={{ display: "flex", gap: 36 }}>
            {/* 数字とラベルのペア */}
          </div>
        </div>
      </div>
    ),
    size
  );
}
```

#### 設計の判断基準

| コンテンツ | 配置先 |
|---|---|
| タイトル / ロゴ / メインメッセージ / 重要統計 | **中央 630x630 セーフエリア内 (必須)** |
| 装飾 (border / 縦線 / グラデーション 等) | 左右の余白 (各 285px) |
| 1200x630 全幅で表示される時の余白埋め | 左右の装飾で間延び防止 |

#### フォントサイズの目安 (正方形セーフ前提)

| 要素 | サイズ |
|---|---|
| メインタイトル | 60-72 (長い場合は 2 行に分割) |
| サブタイトル | 20-28 (長い場合は 2 行折り返し or 短縮) |
| Eyebrow / ラベル | 16-22 |
| 統計の数字 | 36-48 |
| 統計のラベル | 14-18 (省略表記 OK: "Property owners" → "Owners") |

> 💡 案件次第でフォント (Next/font の woff2) を `ImageResponse` の `fonts` オプションで読み込み可能。
>
> 💡 **検証**: ローカルで `http://localhost:3000/opengraph-image` を表示 → **中央 630x630 だけ手動でクロップして全情報が読めるか確認**。 切れたら修正。

### Step 6. ページ別 metadata (お知らせ詳細など)

動的ページ (例: `app/news/[slug]/page.tsx`):

```ts
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const news = await fetchNewsBySlug(slug); // Sanity 等から取得

  return {
    title: news.title,
    description: news.excerpt,
    openGraph: {
      title: news.title,
      description: news.excerpt,
      images: [{ url: news.coverImage }],
    },
  };
}
```

### Step 7. Google Search Console / アクセス解析 (別 Skill)

GA4 + Search Console 連携は **`setup-google-analytics-search-console`** Skill で対応。

---

## 環境変数

| 変数 | 用途 |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | OGP / sitemap / 構造化データ全てで使用、本番ドメイン必須 |

---

## 既知の罠 (Pitfalls)

### ❌ `NEXT_PUBLIC_SITE_URL` が未設定だと OGP/sitemap が壊れる
- デフォルト値 `https://example.com` のまま本番デプロイ → OGP 画像 / sitemap の URL が `example.com` のリンクに
- Vercel 環境変数で **必ず本番ドメインを設定**

### ❌ 構造化データの型が間違っている
- 飲食店なのに `Organization` だけだと、Google リッチリザルト効果が薄い
- **業種に合った schema.org type** を使う (上記表参照)
- 検証: https://search.google.com/test/rich-results で URL を入力

### ❌ OG 画像のサイズ / 正方形クロップ問題 ⭐ 最頻発
- **画像サイズは 1200 x 630** が標準 (Twitter / Facebook / LINE 共通、 アスペクト比 1.91:1)
- ⚠️ **コンテンツ配置は中央 630x630 セーフエリアに集約必須** (Step 5 参照)
- LINE / Slack / Discord / iMessage は **1:1 正方形クロップ** で表示する → 横長配置だと左右が切れる
- 「タイトルが横長配置」「ロゴが左端、 統計が右端」 は **NG**、 全部中央 630x630 に
- 1200 x 600 や 1080 x 1080 だと Twitter で切れる
- アスペクト比 1.91:1 を厳守、 ただし内側のレイアウトは 1:1 セーフ

### ❌ OG 画像のレイアウトで「とりあえず space-between で全幅広げ」
- 過去事例: 税理士サンプル (#67) で 1200x630 全幅にコンテンツ配置 → LINE シェアで左右切れ
- → 修正: 中央 630x630 ラッパー導入で解決
- 教訓: **OG 画像のレイアウトは「正方形セーフ」 がデフォルト**、 横長活用はオプション

### ❌ sitemap.ts で動的ページが含まれない
- Sanity 等 CMS のデータも sitemap に含める必要あり
- ビルド時に CMS からデータ取得 → sitemap に追加

### ❌ robots.ts の Disallow 漏れ
- `/admin` / `/account` / `/studio` のような管理画面 / 内部用ルートを Disallow し忘れる
- Google にインデックスされると検索結果に表示されてしまう

---

## テスト・動作確認

### 開発時
- [ ] `npm run dev` → `http://localhost:3000/sitemap.xml` で XML 表示
- [ ] `http://localhost:3000/robots.txt` で robots ルール表示
- [ ] `http://localhost:3000/opengraph-image` で OG 画像表示
- [ ] DevTools の Network タブで `<meta>` タグ確認

### 本番デプロイ後
- [ ] **Google Rich Results Test** で構造化データを検証 (https://search.google.com/test/rich-results)
- [ ] **Facebook Sharing Debugger** で OGP を検証 (https://developers.facebook.com/tools/debug/)
- [ ] **Twitter Card Validator** で Twitter 表示を検証 (https://cards-dev.twitter.com/validator)
- [ ] **Google Search Console** に sitemap.xml を登録 (`setup-google-analytics-search-console` Skill 参照)
- [ ] サイト内ページを **SNS で実際にシェア** して OG 画像表示を確認

---

## トラブルシューティング

| 症状 | 原因と対処 |
|---|---|
| OGP 画像が反映されない | Facebook Debugger で「Scrape Again」、または OG 画像 URL が `https://` か確認 |
| sitemap.xml が 404 | `src/app/sitemap.ts` の export default 関数を確認、Next.js 再起動 |
| 構造化データのエラー | Rich Results Test のエラーメッセージを見て修正、schema.org type を確認 |
| Twitter Card が表示されない | `twitter:card` を `summary_large_image` に、画像 URL が絶対 URL か確認 |
| robots.txt がデフォルト (Next.js 自動生成) のまま | `src/app/robots.ts` を作成 (テンプレに含まれない場合) |

---

## 参照ドキュメント

- AI STUDIO 実装事例: `src/app/layout.tsx` (metadata + JSON-LD), `src/app/sitemap.ts`, `src/app/robots.ts`, `src/app/opengraph-image.tsx`
- Next.js Metadata API: `node_modules/next/dist/docs/...` (Next.js 16 docs)
- schema.org: https://schema.org/
- Google Rich Results Test: https://search.google.com/test/rich-results
