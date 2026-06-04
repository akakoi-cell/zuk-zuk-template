import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { SectionHead } from "@/components/SectionHead";
import { NAV_ITEMS, FOOTER_COLUMNS, FOOTER_BLURB, SITE } from "@/lib/content";

/**
 * テンプレ用のホームページ。
 * Header / Hero / Section / Footer の動作確認 + 案件初動の出発点。
 *
 * 案件で編集する箇所:
 * - Hero タイトル / サブテキスト
 * - About セクションの中身
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
