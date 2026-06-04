import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionHead } from "@/components/SectionHead";
import { FaqAccordion } from "@/components/FaqAccordion";
import { NAV_ITEMS, FOOTER_COLUMNS, FOOTER_BLURB, SITE } from "@/lib/content";

// FAQ サンプルデータ (デモ用、案件では lib/content.ts に移すのが推奨)
const SAMPLE_FAQ = [
  {
    q: "サイト制作にはどのくらい時間がかかりますか?",
    a: "プランや内容にもよりますが、最短 2 週間で公開可能です。Standard プランの場合、お打ち合わせから公開まで約 1 ヶ月が目安です。",
  },
  {
    q: "デザインの修正は何回まで可能ですか?",
    a: "提案ミーティング時の修正は 2 ラウンドまで含まれます。3 ラウンド目以降は別途見積もりとなりますが、月額契約案件であれば運用伴走の中で対応可能です。",
  },
  {
    q: "公開後の運用はどうなりますか?",
    a: "月額契約の場合、毎月の運用伴走時間内で記事の更新・画像差替え・微修正に対応します。制作のみ案件の場合は、サポート期間終了後は別途お見積りとなります。",
  },
  {
    q: "解約はいつでもできますか?",
    a: "月額契約の場合、最低契約期間は 12 ヶ月です。12 ヶ月以内の解約には残月分の一括お支払いが必要となります。詳細は利用規約をご確認ください。",
  },
];

/**
 * テンプレ用のホームページ。
 * Header / Hero / About / FAQ / Footer の動作確認 + 案件初動の出発点。
 *
 * 案件で編集する箇所:
 * - Hero タイトル / サブテキスト
 * - About セクションの中身
 * - FAQ の質問・回答 (lib/content.ts に移すと管理しやすい)
 * - 必要に応じて section を追加 (Service / Works / Contact 等)
 */
export default function Home() {
  return (
    <div className="app">
      <Header
        navItems={NAV_ITEMS}
        ctaLabel="お問い合わせ"
        ctaTargetId="contact"
        brandAlt={SITE.name}
      />

      <main>
        {/* ----- Hero ----- */}
        <section className="hero" id="top">
          <div className="wrap">
            <h1 className="h-display">
              ブランドタイトル
              <br />
              をここに
            </h1>
            <p className="hero-sub">
              ここにキャッチコピーを書いてください。
              <br />
              改行で 2 行目を続けることもできます。
            </p>
          </div>
        </section>

        {/* ----- About (example section) ----- */}
        <section className="section alt" id="about">
          <div className="wrap">
            <SectionHead
              label="ABOUT"
              title="セクション例"
              sub={"このセクションを編集して、案件用のコンテンツに差し替えてください。\nSectionHead コンポーネントが見出しの組み立てを担当します。"}
            />
            <div style={{ maxWidth: 720, margin: "0 auto", color: "var(--fg-2)" }}>
              <p>
                本文をここに記述します。Latin の単語 (Hello / 2026) や数字も
                <code> AutoLatinWrap </code>
                が自動でラップして視覚調整します。
              </p>
            </div>
          </div>
        </section>

        {/* ----- FAQ (sample, FaqAccordion コンポーネント実例) ----- */}
        <section className="section" id="faq">
          <div className="wrap">
            <SectionHead
              label="FAQ"
              title="よくあるご質問"
              sub="お問い合わせの前に、よくいただくご質問をご確認ください。"
            />
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <FaqAccordion items={SAMPLE_FAQ} />
            </div>
          </div>
        </section>
      </main>

      <Footer
        blurb={FOOTER_BLURB}
        columns={FOOTER_COLUMNS}
        copyright={`© ${new Date().getFullYear()} ${SITE.name}`}
        builtBy="Built with Claude"
        brandAlt={SITE.name}
      />
    </div>
  );
}
