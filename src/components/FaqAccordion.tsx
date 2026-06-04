"use client";

import { useState } from "react";

export type FaqItem = {
  q: string;
  a: string;
};

type Props = {
  items: FaqItem[];
};

/**
 * シンプルなアコーディオン型 FAQ コンポーネント。
 * - クリックで展開・収納 (1 度に 1 つだけ開く挙動)
 * - キーボード操作対応 (Enter / Space、ボタン要素のネイティブ動作)
 * - aria-expanded / aria-controls / role="region" でスクリーンリーダー対応
 *
 * 利用例:
 *   <FaqAccordion items={[
 *     { q: "質問", a: "回答" },
 *     ...
 *   ]} />
 */
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
