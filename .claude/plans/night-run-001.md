# 夜間自走 試行 #001: 404 ページ + FAQ アコーディオン

## 🎯 目的

1. **夜間自走フロー自体の検証** (これがメイン目的、成果物の量は二次)
2. zuk-zuk-template に汎用的な追加機能を実装 (副産物として価値ある)

---

## 📋 前提条件

| 項目 | 値 |
|---|---|
| **作業ディレクトリ** | `/Users/kakoiatsushi/Projects/zuk-zuk AI DESIGN STUDIO/zuk-zuk-template/` |
| **ブランチ戦略** | `night-run-001` を新規作成して作業 (main は変更しない) |
| **Permission mode** | `acceptEdits` 推奨 (ファイル編集は OK、Bash 実行は確認) |
| **タイムアウト目安** | 1-2h で完了想定 |
| **失敗時の保険** | main ブランチは無傷、最悪 night-run-001 ブランチを削除すれば良い |

---

## 🚀 起動コマンド (案)

```bash
cd "/Users/kakoiatsushi/Projects/zuk-zuk AI DESIGN STUDIO/zuk-zuk-template"

# このプランを Claude Code CLI に食わせて実行
claude --permission-mode acceptEdits

# または対話モードで起動して、最初のプロンプトで
# 「.claude/plans/night-run-001.md を読んで、書かれている Step 1 から順番に実装してください」
# と指示する
```

> ⚠️ `--dangerously-skip-permissions` は **使わない** (本リポジトリは大事なので)

---

## ✅ 実装ステップ (順番に実行)

### Step 1: ブランチ作成 + 環境準備

```bash
git checkout main
git pull origin main  # 念のため最新化
git checkout -b night-run-001
```

**完了判定**:
- [ ] `git branch` で `* night-run-001` が表示される
- [ ] `npm run dev` で port 3001 起動できる (動作確認用、起動後 Ctrl+C で止めて OK)

---

### Step 2: 404 ページ実装

`src/app/not-found.tsx` を新規作成:

```tsx
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
```

`src/app/globals.css` の末尾に追加:

```css
/* ---------- 404 Not Found ---------- */
.not-found {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 80px var(--gutter);
}
.not-found-content {
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 480px;
  margin: 0 auto;
}
.not-found-code {
  color: var(--fg-3);
  letter-spacing: 0.3em;
}
.not-found-message {
  color: var(--fg-2);
  line-height: 2;
  margin: 0;
}
.not-found-cta {
  margin-top: 16px;
  display: inline-flex;
  text-decoration: none;
}
```

**完了判定**:
- [ ] `npm run build` が成功
- [ ] `npm run dev` で存在しないパス (例: `/test-404-page`) にアクセス → 404 ページ表示
- [ ] レスポンシブ確認 (DevTools のモバイル表示で崩れない)
- [ ] git commit (例: `feat: add 404 not-found page`)

---

### Step 3: FAQ アコーディオン コンポーネント実装

`src/components/FaqAccordion.tsx` を新規作成:

```tsx
"use client";

import { useState } from "react";

export type FaqItem = {
  q: string;
  a: string;
};

type Props = {
  items: FaqItem[];
};

export function FaqAccordion({ items }: Props) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => {
    setOpenIndex((current) => (current === i ? null : i));
  };

  return (
    <div className="faq-accordion">
      {items.map((item, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={"faq-item" + (isOpen ? " open" : "")}
          >
            <button
              type="button"
              className="faq-q"
              aria-expanded={isOpen}
              aria-controls={`faq-a-${i}`}
              onClick={() => toggle(i)}
            >
              <span className="qnum">Q{i + 1}</span>
              <span className="qtxt">{item.q}</span>
              <span className="faq-icon" aria-hidden="true">
                {isOpen ? "−" : "+"}
              </span>
            </button>
            <div
              id={`faq-a-${i}`}
              className="faq-a"
              role="region"
              hidden={!isOpen}
            >
              <div className="inner">
                <p>{item.a}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
```

`src/app/globals.css` の末尾に追加:

```css
/* ---------- FAQ Accordion ---------- */
.faq-accordion {
  border-top: 1px solid var(--hairline);
}
.faq-item {
  border-bottom: 1px solid var(--hairline);
}
.faq-q {
  width: 100%;
  display: grid;
  grid-template-columns: auto 1fr auto;
  align-items: center;
  gap: 16px;
  padding: 24px 8px;
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
  font-family: var(--font-jp-sans);
  font-size: 15px;
  font-weight: 500;
  color: var(--sumi);
  transition: background var(--dur-fast) var(--ease);
}
.faq-q:hover { background: var(--paper-soft); }
.faq-q .qnum {
  font-family: var(--font-latin);
  font-weight: 600;
  font-size: 13px;
  color: var(--fg-3);
  letter-spacing: 0.1em;
  min-width: 24px;
}
.faq-q .qtxt {
  line-height: 1.6;
}
.faq-icon {
  font-family: var(--font-latin);
  font-size: 18px;
  color: var(--fg-2);
  width: 24px;
  text-align: center;
}
.faq-a {
  padding: 0 8px 24px;
}
.faq-a .inner {
  padding-left: 40px;
  color: var(--fg-2);
  font-size: 13.5px;
  line-height: 2;
}
.faq-a p { margin: 0; }
@media (max-width: 768px) {
  .faq-q { padding: 20px 4px; gap: 12px; }
  .faq-q .qtxt { font-size: 14px; }
  .faq-a .inner { padding-left: 28px; }
}
```

**完了判定**:
- [ ] `npm run build` が成功
- [ ] lint エラーなし (`npm run lint` が通る、設定されている場合)
- [ ] git commit (例: `feat: add FaqAccordion component`)

---

### Step 4: FAQ デモを page.tsx に組み込み

`src/app/page.tsx` の About セクションの後に FAQ セクション追加:

```tsx
// import 追加 (既存の import に追加)
import { FaqAccordion } from "@/components/FaqAccordion";

// FAQ サンプルデータ (デモ用、案件では lib/content.ts に移す)
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
```

About セクション直後 (Footer の前) に新規セクション:

```tsx
{/* ----- FAQ (sample) ----- */}
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
```

**完了判定**:
- [ ] `npm run dev` で `http://localhost:3001/#faq` にアクセス、FAQ セクション表示
- [ ] 各質問をクリックで展開・収納できる
- [ ] DevTools の Elements で `aria-expanded` の値が click で切り替わる
- [ ] git commit (例: `feat: add FAQ section to homepage`)

---

### Step 5: アクセシビリティ確認

- キーボード操作で FAQ を開閉できるか (Tab → Enter / Space)
- スクリーンリーダー対応の `role="region"` `aria-controls` `aria-expanded` がついている

**完了判定**:
- [ ] Tab で FAQ ボタンにフォーカス可能
- [ ] Enter / Space で開閉動作する
- [ ] DevTools の Accessibility タブで Role が正しい

---

### Step 6: ドキュメント更新

`README.md` の **「含まれるもの」** テーブルに追加:

```markdown
| 動作確認用 | `src/app/page.tsx` に Hero + About + FAQ セクション + Footer の最小ランディング |
```

`src/app/page.tsx` のコメント (冒頭) を更新:

```tsx
/**
 * テンプレ用のホームページ。
 * Header / Hero / About / FAQ / Footer の動作確認 + 案件初動の出発点。
 * ...
 */
```

**完了判定**:
- [ ] README.md に FAQ の追記あり
- [ ] page.tsx のコメントが更新

---

### Step 7: 最終コミット + main にマージしない

```bash
# 各 step ごとに commit があるはず。最後に全体を確認
git log --oneline -10

# main にはマージせず、night-run-001 ブランチのまま放置
# 朝のレビュー後、user が手動でマージする想定
```

**完了判定**:
- [ ] `git log` で各 Step ごとに commit が並んでいる
- [ ] `git branch` でアクティブブランチが `night-run-001`
- [ ] main ブランチは無変更

---

## 🚨 エラー時の対処ルール

| 状況 | 対処 |
|---|---|
| `npm run build` 失敗 | エラーメッセージを読んで該当ファイル修正、それでも詰むなら直前 commit に戻す `git reset --hard HEAD` |
| Lint エラー | `npm run lint -- --fix` で自動修正、それでも残るなら手動修正 |
| 30 分以上同じエラーで詰まる | そこで止めて、現状を commit してから「ここまでで停止」とログ出力して終了 |
| `claude` が止まる/timeout | OS の `caffeinate` で sleep を阻止しておく (`caffeinate -i claude ...`) |

---

## 🌅 朝のレビューチェックリスト

ブランチ `night-run-001` で `npm run dev` 起動して確認:

- [ ] `git log --oneline` で 6-7 件の commit が並んでいる
- [ ] `http://localhost:3001/` でホーム表示 (Hero / About / **FAQ** / Footer)
- [ ] `http://localhost:3001/test-404-page` で 404 ページ表示
- [ ] FAQ をクリックで展開・収納が動く
- [ ] FAQ の DevTools で `aria-expanded` が切り替わる
- [ ] FAQ のキーボード操作 (Tab → Enter / Space) が動く
- [ ] スマホ表示 (DevTools のレスポンシブ) で崩れない
- [ ] README.md に追記あり

**合格ライン**: 8 項目中 6 項目以上 OK

問題なければ:
```bash
git checkout main
git merge night-run-001
git push origin main
```

問題あれば:
```bash
# ロールバック (ブランチ削除)
git checkout main
git branch -D night-run-001
```

---

## 📊 試行結果の振り返り (朝のあとで書く)

このセクションは朝に user が書き込む:

- 完了 step 数: X / 7
- 想定時間 vs 実時間: 1-2h → ?
- うまくいった点:
- 課題があった点:
- 次回 (案 B 税理士サイト) で改善したい点:
- 結論: 夜間自走続ける / フロー見直し / 中止
