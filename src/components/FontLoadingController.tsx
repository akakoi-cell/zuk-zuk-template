"use client";

import { useEffect } from "react";

/**
 * フォント読込完了の検知 + 最小表示時間制御を担当。
 *
 * 動作:
 * - 初期状態で <html> に wf-loading が付いており、splash が全画面に出ている
 * - 完了条件:
 *   ・document.fonts.ready 解決 ＋ 最小表示時間 800ms 経過、の両方を満たす
 *   ・または safety timeout 3000ms
 * - 最小表示時間を入れる理由: フォントがブラウザキャッシュ済みだと
 *   fonts.ready が <50ms で解決して splash が一瞬で消え、プログレスバーが視認できないため
 */
const MIN_DISPLAY_MS = 800;
const SAFETY_TIMEOUT_MS = 3000;

export function FontLoadingController() {
  useEffect(() => {
    let done = false;

    const finish = () => {
      if (done) return;
      done = true;
      const html = document.documentElement;
      html.classList.remove("wf-loading");
      if (
        !html.classList.contains("wf-active") &&
        !html.classList.contains("wf-inactive")
      ) {
        html.classList.add("wf-active");
      }
    };

    const minDelay = new Promise<void>((resolve) =>
      setTimeout(resolve, MIN_DISPLAY_MS)
    );

    // フォント読込完了 AND 最小表示時間経過、の両方を待つ
    if (typeof document !== "undefined" && "fonts" in document) {
      Promise.all([document.fonts.ready, minDelay])
        .then(() => finish())
        .catch(() => finish());
    } else {
      // fonts API 非対応環境: 最小表示時間後に完了
      minDelay.then(finish);
    }

    // safety timeout: 上記が解決しない万一のケース用
    const timer = setTimeout(finish, SAFETY_TIMEOUT_MS);

    return () => clearTimeout(timer);
  }, []);

  return null;
}
