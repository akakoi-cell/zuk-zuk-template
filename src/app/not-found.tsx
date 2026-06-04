import Link from "next/link";

export default function NotFound() {
  return (
    <div className="app">
      <main className="not-found">
        <div className="wrap">
          <div className="not-found-content">
            <p className="not-found-code t-overline">404 NOT FOUND</p>
            <h1 className="h-section">ページが見つかりません</h1>
            <p className="not-found-message">
              お探しのページは移動または削除された可能性があります。
              <br />
              URL をもう一度ご確認ください。
            </p>
            <Link href="/" className="nav-cta not-found-cta">
              トップへ戻る
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
