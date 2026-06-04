// content.ts — 案件ごとに編集するコンテンツ定数の集約場所
// このファイルを案件用に上書きすることで、全体のテキスト・ナビが切り替わる想定。

import type { NavItem } from "@/components/Header";
import type { FooterColumn } from "@/components/Footer";

// ============================================================
// サイト基本情報
// ============================================================
export const SITE = {
  name: "Brand",
  title: "Brand — タグラインをここに",
  description: "サイトの説明文を 100-160 文字程度で。検索結果と OGP で使われる。",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://example.com",
  /** OGP / JSON-LD で使用するロゴパス */
  logo: "/brand_logo.svg",
} as const;

// ============================================================
// ナビゲーション項目 (Header / Mobile Menu)
// ============================================================
export const NAV_ITEMS: NavItem[] = [
  { id: "about", label: "ABOUT", jp: "私たちについて" },
  { id: "service", label: "SERVICE", jp: "サービス" },
  { id: "contact", label: "CONTACT", jp: "お問い合わせ" },
];

// ============================================================
// フッターのリンクカラム
// ============================================================
export const FOOTER_COLUMNS: FooterColumn[] = [
  {
    heading: "Service",
    links: [
      { label: "私たちについて", href: "#about" },
      { label: "サービス", href: "#service" },
      { label: "お問い合わせ", href: "#contact" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "プライバシーポリシー", href: "/legal/privacy" },
      { label: "利用規約", href: "/legal/terms" },
      { label: "特定商取引法に基づく表記", href: "/legal/tokushoho" },
    ],
  },
];

export const FOOTER_BLURB =
  "ブランドの一言キャッチコピーをここに。\n改行で 2 行目を続けることもできます。";
