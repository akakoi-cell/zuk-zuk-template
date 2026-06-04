import Image from "next/image";

type Props = {
  /** ロゴ画像のパス。デフォルトは public/brand_logo.svg のプレースホルダー */
  src?: string;
  /** ロゴ下に表示するサブラベル (英大文字想定)。未指定なら非表示 */
  subLabel?: string;
  /** クリック時の遷移先。デフォルトは "#top" (ページ内アンカー) */
  href?: string;
  /** alt テキスト。SEO/アクセシビリティ用 */
  alt?: string;
  /** SVG の表示サイズ (px) */
  width?: number;
  height?: number;
};

/**
 * ロゴ + サブラベル のブランドロックアップ。
 * Header と Footer の両方で利用。
 *
 * 利用例:
 *   <BrandLockup src="/logo.svg" subLabel="AI STUDIO" alt="zuk-zuk" />
 */
export function BrandLockup({
  src = "/brand_logo.svg",
  subLabel,
  href = "#top",
  alt = "Brand",
  width = 160,
  height = 80,
}: Props) {
  return (
    <a className="brand-lockup" href={href} aria-label={alt}>
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority
        className="brand-mark"
      />
      {subLabel ? <span className="brand-sub">{subLabel}</span> : null}
    </a>
  );
}
