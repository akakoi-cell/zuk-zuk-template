# zuk-zuk template

> zuk-zuk が制作する案件 (サンプルサイト / クライアントワーク) の出発点となる Next.js テンプレート。
> AI STUDIO 本体から「全案件で使う汎用部分」だけを抽出し、案件ごとにカスタマイズしやすい形で整備したもの。

## 含まれるもの

| 領域 | 内容 |
|---|---|
| 基盤 | Next.js 16.2.6 / TypeScript 5 / Tailwind CSS v4 / Turbopack / React 19 |
| フォント | Google Fonts (Zen Kaku Gothic + Caveat) + Adobe Fonts オプション (Typekit kitId を環境変数で指定) |
| 共通コンポーネント | `Header` / `Footer` / `BrandLockup` / `SectionHead` / `Icons` / `AutoLatinWrap` / `FontLoadingController` / `FaqAccordion` |
| スタイル基盤 | `globals.css` に CSS 変数 / FOUT 対策 splash / 共通レイアウト (nav, footer, mobile-menu, section, hero, **404**, **faq-accordion**) |
| 動作確認用 | `src/app/page.tsx` に Hero + About + **FAQ** + Footer の最小ランディング |
| エラーページ | `src/app/not-found.tsx` で App Router 標準の 404 ページ |
| メタデータ | 動的 metadata (title / description / OGP / Twitter / robots) + JSON-LD (Organization + WebSite) |

## 含まれないもの (案件次第で追加)

- 業務固有のセクション (Service / Plans / Works 等) → 案件で実装
- お問い合わせフォーム (Web3Forms) → Skill `setup-contact-form-web3forms` で組み込み
- Sanity CMS 連携 → Skill `setup-sanity-cms` で組み込み
- 法務ページ (利用規約 / プライバシー / 特商法) → Skill `setup-legal-pages` で組み込み
- Stripe 決済 → Skill `setup-stripe-subscription` で組み込み
- アクセス解析 (GA4 + Search Console) → Skill `setup-google-analytics-search-console` で組み込み
- Slack 通知 → Skill `setup-slack-notifications` で組み込み

## はじめかた (新案件で使う場合)

```bash
# 1. このテンプレを案件用にクローン
git clone <this-template-repo> clients/案件名
cd clients/案件名

# 2. 依存インストール
npm install

# 3. 環境変数セット
cp .env.example .env.local
# .env.local を編集 (NEXT_PUBLIC_SITE_URL は必須)

# 4. 開発サーバー起動
npm run dev
# → http://localhost:3000

# 5. 案件用カスタマイズ
#    - public/brand_logo.svg を差し替え (必須!)
#    - src/lib/content.ts の SITE / NAV_ITEMS / FOOTER_COLUMNS を編集
#    - src/app/page.tsx を案件用に書き換え
#    - 必要な Skill を実行 (Web3Forms / Sanity / Stripe / 法務 等)
```

## ⚠️ 案件初動で必ずやること (チェックリスト)

- [ ] `public/brand_logo.svg` をクライアントロゴに差し替え (現状はプレースホルダー)
- [ ] `src/lib/content.ts` の `SITE` (name / title / description / url) を案件用に変更
- [ ] `src/lib/content.ts` の `NAV_ITEMS` / `FOOTER_COLUMNS` / `FOOTER_BLURB` を編集
- [ ] `.env.local` の `NEXT_PUBLIC_SITE_URL` を本番ドメインに変更
- [ ] (任意) Adobe Fonts を使うなら `NEXT_PUBLIC_TYPEKIT_KIT_ID` を設定
- [ ] `src/app/layout.tsx` の `<html lang="ja">` を案件の言語に変更 (基本は ja のままで OK)
- [ ] 案件用セクションを `src/app/page.tsx` に追加
- [ ] **コミット前に `public/brand_logo.svg` が差し替え済みか再確認** (zuk-zuk プレースホルダーが残らないように)

## Adobe Fonts (Typekit) の使い方

`NEXT_PUBLIC_TYPEKIT_KIT_ID` を `.env.local` で設定すると、自動的に Typekit が読み込まれ、FOUT 対策の splash も有効になる。

```env
# zuk-zuk スタンダード (Montserrat + ShizukaRDGo)
NEXT_PUBLIC_TYPEKIT_KIT_ID=gux5cqf
```

未設定の場合は Google Fonts (Zen Kaku Gothic + Caveat) のみで動作し、splash 画面は表示されない。

## ディレクトリ構成

```
src/
├── app/
│   ├── globals.css     ← CSS 変数 + 共通レイアウトスタイル
│   ├── layout.tsx      ← ルートレイアウト (フォント / metadata / JSON-LD)
│   └── page.tsx        ← ホームページ (案件で書き換え)
├── components/
│   ├── AutoLatinWrap.tsx       ← 和文/Latin の自動 span ラップ
│   ├── BrandLockup.tsx          ← ロゴ + サブラベル
│   ├── FontLoadingController.tsx ← FOUT 対策 splash 制御
│   ├── Footer.tsx               ← フッター (props 化)
│   ├── Header.tsx               ← ヘッダー + モバイルメニュー (props 化)
│   ├── Icons.tsx                ← ラインアイコン群
│   └── SectionHead.tsx          ← セクション見出し
└── lib/
    └── content.ts      ← 案件ごとに編集するコンテンツ定数 (SITE / NAV / FOOTER)

public/
└── brand_logo.svg      ← ⚠️ プレースホルダーロゴ。案件初動で差し替え必須
```

## 参照ドキュメント (AI STUDIO リポジトリ内)

| ドキュメント | 内容 |
|---|---|
| `docs/SAMPLES_PLAN.md` | 業種別サンプルサイト計画 (このテンプレを使う 6 サイトの構成) |
| `docs/SKILLS_PLAN.md` | Skill 化計画 (機能追加時に参照する Skill 一覧) |
| `docs/CLIENT_PROJECT_FLOW.md` | 案件標準フロー |
| `docs/FEATURES.md` | 機能別カタログ (案件で追加する機能の参照元) |

## ライセンス・権利関係

- このテンプレは zuk-zuk の内部利用を想定。
- `public/brand_logo.svg` はプレースホルダー。クライアント案件では必ず差し替えること。
- Adobe Fonts (Typekit) は zuk-zuk アカウント (kitId: `gux5cqf`) を使用。クライアント納品時は別途権利調整が必要。
