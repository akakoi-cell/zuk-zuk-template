"use client";

import { useEffect } from "react";

/**
 * 指定セレクタ内の Latin/数字シーケンスを <span class="latin-soft"> で
 * 自動ラップし、CSS から個別に font-weight/size/baseline 等を当てられるようにする。
 *
 * 目的: 和文 (例: ShizukaRDGo / Zen Kaku) と Latin (例: Montserrat / Inter) で
 * x-height・太さが異なるため、同じ要素内で script ごとに見え方を補正する。
 *
 * 対象: 和文と Latin が混在する見出し・本文の共通セレクタのみ。
 * テンプレ用に「最大公約数」だけを TARGETS に設定。
 * 案件で独自セクションを追加した場合は、必要に応じて TARGETS を拡張すること。
 */
const TARGETS = [
  ".h-display",
  ".h-section",
  ".h-card",
  ".section-head .sub",
];

/**
 * これらのいずれかが祖先にある textNode はスキップする。
 * 「強調 Latin (weight 700・独自サイズ) を維持したい」要素群。
 */
const EXCLUDE_SELECTORS = [
  ".t-overline",
  ".t-overline-light",
  "button",
];

const LATIN_RE = /([A-Za-z0-9]+(?:[,.\-/][A-Za-z0-9]+)*)/g;

function wrapLatinInTextNodes(root: Element, excludeSelector: string) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
  const nodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) {
    nodes.push(n as Text);
  }

  for (const textNode of nodes) {
    if (!textNode.nodeValue) continue;
    const parent = textNode.parentElement;
    if (!parent || parent.classList.contains("latin-soft")) continue;
    // 除外セレクタの祖先がある場合はスキップ
    if (excludeSelector && parent.closest(excludeSelector)) continue;

    let lastIndex = 0;
    let match: RegExpExecArray | null;
    let hasMatch = false;
    const fragment = document.createDocumentFragment();
    LATIN_RE.lastIndex = 0;

    while ((match = LATIN_RE.exec(textNode.nodeValue)) !== null) {
      hasMatch = true;
      if (match.index > lastIndex) {
        fragment.appendChild(
          document.createTextNode(
            textNode.nodeValue.slice(lastIndex, match.index)
          )
        );
      }
      const span = document.createElement("span");
      span.className = "latin-soft";
      span.textContent = match[0];
      fragment.appendChild(span);
      lastIndex = LATIN_RE.lastIndex;
    }

    if (!hasMatch) continue;

    if (lastIndex < textNode.nodeValue.length) {
      fragment.appendChild(
        document.createTextNode(textNode.nodeValue.slice(lastIndex))
      );
    }

    textNode.parentNode?.replaceChild(fragment, textNode);
  }
}

export function AutoLatinWrap() {
  useEffect(() => {
    const selector = TARGETS.join(",");
    const excludeSelector = EXCLUDE_SELECTORS.join(",");

    const apply = () => {
      document.querySelectorAll(selector).forEach((el) => {
        wrapLatinInTextNodes(el, excludeSelector);
      });
    };

    apply();

    // React の再レンダリングで text node が置換されたら再ラップ
    const observers: MutationObserver[] = [];
    document.querySelectorAll(selector).forEach((el) => {
      const observer = new MutationObserver(() => {
        requestAnimationFrame(() =>
          wrapLatinInTextNodes(el, excludeSelector)
        );
      });
      observer.observe(el, {
        childList: true,
        characterData: true,
        subtree: true,
      });
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return null;
}
