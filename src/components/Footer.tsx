import { BrandLockup } from "./BrandLockup";

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  heading: string;        // 例: "Service" / "Legal"
  links: FooterLink[];
};

type Props = {
  /** フッター左カラムに表示するブランド説明文 */
  blurb?: string;
  /** 中央以降のフッターカラム (複数) */
  columns?: FooterColumn[];
  /** コピーライト表記 */
  copyright?: string;
  /** 右下の補足表記 (例: "Built with Claude") */
  builtBy?: string;
  /** BrandLockup に渡す props */
  brandSrc?: string;
  brandSubLabel?: string;
  brandAlt?: string;
  brandHref?: string;
};

/**
 * フッター。左カラムにブランド lockup + 説明、右側に複数のリンクカラム。
 *
 * 利用例:
 *   <Footer
 *     blurb="ブランドの一言キャッチコピー。"
 *     columns={[
 *       { heading: "Service", links: [{ label: "About", href: "#about" }] },
 *       { heading: "Legal", links: [{ label: "プライバシー", href: "/legal/privacy" }] },
 *     ]}
 *     copyright="© 2026 Brand"
 *     builtBy="Built with Claude"
 *   />
 */
export function Footer({
  blurb = "",
  columns = [],
  copyright = `© ${new Date().getFullYear()} Brand`,
  builtBy = "Built with Claude",
  brandSrc,
  brandSubLabel,
  brandAlt,
  brandHref = "#top",
}: Props) {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-col">
            <BrandLockup
              src={brandSrc}
              subLabel={brandSubLabel}
              alt={brandAlt}
              href={brandHref}
            />
            {blurb ? <p className="footer-blurb">{blurb}</p> : null}
          </div>
          {columns.map((col) => (
            <div className="footer-col" key={col.heading}>
              <h4>{col.heading}</h4>
              <ul>
                {col.links.map((link) => (
                  <li key={link.label}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="footer-bot">
          <div>{copyright}</div>
          <div>{builtBy}</div>
        </div>
      </div>
    </footer>
  );
}
