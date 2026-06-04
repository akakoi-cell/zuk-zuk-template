// SectionHead.tsx — セクション見出しの汎用コンポーネント
// 上にラベル (英大文字)、中央にタイトル、下にサブテキスト (任意)

type Props = {
  label: string;
  title: string;
  sub?: string;
};

export function SectionHead({ label, title, sub }: Props) {
  return (
    <div className="section-head">
      <div className="label t-overline">{label}</div>
      <h2 className="h-section">{title}</h2>
      {sub ? <p className="sub">{sub}</p> : null}
    </div>
  );
}
