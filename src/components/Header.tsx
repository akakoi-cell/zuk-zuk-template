"use client";

import { useState } from "react";
import { BrandLockup } from "./BrandLockup";
import { IconMenu, IconClose } from "./Icons";

export type NavItem = {
  id: string;
  label: string; // 英ラベル (例: "ABOUT")
  jp?: string;   // 和ラベル (例: "私たちについて") — モバイル時に併記表示
};

type Props = {
  navItems: NavItem[];
  /** CTA ボタンのラベル。例: "無料相談" / "Contact" */
  ctaLabel?: string;
  /** CTA クリック時のターゲット (ページ内 ID または URL) */
  ctaTargetId?: string;
  /** BrandLockup に渡す props */
  brandSrc?: string;
  brandSubLabel?: string;
  brandAlt?: string;
};

/**
 * ヘッダー (固定ナビゲーション) + モバイルメニュー。
 * navItems を props で受け取ることで、案件ごとにナビ構成を切り替えられる。
 *
 * 利用例:
 *   <Header
 *     navItems={[{ id: "about", label: "ABOUT", jp: "私たちについて" }, ...]}
 *     ctaLabel="お問い合わせ"
 *     ctaTargetId="contact"
 *     brandSrc="/logo.svg"
 *     brandSubLabel="STUDIO"
 *   />
 */
export function Header({
  navItems,
  ctaLabel = "Contact",
  ctaTargetId = "contact",
  brandSrc,
  brandSubLabel,
  brandAlt,
}: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  const goTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 60, behavior: "smooth" });
  };

  // CTA を除いたナビ項目
  const linkItems = navItems.filter((n) => n.id !== ctaTargetId);

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <BrandLockup
            src={brandSrc}
            subLabel={brandSubLabel}
            alt={brandAlt}
          />
          <div className="nav-right">
            <nav className="nav-links">
              {linkItems.map((n) => (
                <button
                  key={n.id}
                  className="nav-link"
                  onClick={goTo(n.id)}
                >
                  {n.label}
                </button>
              ))}
            </nav>
            <button className="nav-cta" onClick={goTo(ctaTargetId)}>
              {ctaLabel}
            </button>
            <button
              className="menu-btn"
              aria-label="menu"
              onClick={() => setMenuOpen((s) => !s)}
            >
              {menuOpen ? <IconClose size={18} /> : <IconMenu size={18} />}
            </button>
          </div>
        </div>
      </header>
      <div className={"mobile-menu" + (menuOpen ? " open" : "")}>
        {navItems.map((n) => (
          <a key={n.id} href={"#" + n.id} onClick={goTo(n.id)}>
            <span>{n.jp ?? n.label}</span>
            <span className="en">{n.label}</span>
          </a>
        ))}
      </div>
    </>
  );
}
