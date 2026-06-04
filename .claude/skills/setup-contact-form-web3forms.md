---
name: setup-contact-form-web3forms
description: Web3Forms + hCaptcha でお問い合わせフォームを実装する標準手順。「フォーム作って」「お問い合わせ実装」「コンタクトフォーム」「Web3Forms 入れる」「フォーム送信できるようにして」「メール通知」など、お問い合わせフォームの新規実装・hCaptcha 設定・Slack 通知連動に関する発言があったら必ず使う。
---

# Web3Forms + hCaptcha フォーム実装 (zuk-zuk 標準)

zuk-zuk-template ベースの案件に **お問い合わせフォーム** を組み込む Skill。
Web3Forms (サードパーティ SaaS) + hCaptcha (Method A: Web3Forms proxy 方式) で、サーバ実装不要・スパム対策込みで完成する。

## なぜ Web3Forms か

| 選択肢 | 採用判断 |
|---|---|
| **Web3Forms (採用)** | ✅ ノーコード、Free 50 件/月で個人事業者規模に十分、hCaptcha 込み |
| Resend + reCAPTCHA v3 自前 | コード保守が重い、案件横断のスケーラビリティ低 |
| 日本産 SaaS (Formrun 等) | 月額有料、案件で費用負担合意が必要 |

> 案件によっては自前 Resend + reCAPTCHA でも OK。Web3Forms は「**SaaS UI/UX に慣れていない事業者向け**」。

## 前提条件

- ✅ zuk-zuk-template クローン済み
- ✅ クライアントの **問い合わせ受付メールアドレス** が確定 (例: `contact@example.com`)
- ✅ 本番ドメインが決定済み (Allowed Domains 登録に必要)

---

## 手順

### Step 1. Web3Forms アカウント作成 + Access Key 取得

1. https://web3forms.com を開く
2. **受信用メールアドレス** (例: `contact@example.com`) を入力
3. 「Create Access Key」をクリック
4. メール認証 → ダッシュボードログイン
5. **Access Key** をコピー (例: `abc123-def456-...`)

### Step 2. ダッシュボード設定 (必須項目)

Web3Forms ダッシュボードで:

1. **Allowed Domains** に本番ドメインを登録 (必須!)
   - 例: `example.com`, `www.example.com`, `localhost` (開発用)
2. **Security Settings** で:
   - Captcha Protection: **hCaptcha** を有効化
   - これにより共有 Sitekey で hCaptcha が動く

> ⚠️ Allowed Domains を登録しないと、本番でフォーム送信が拒否される。

### Step 3. 環境変数を登録

`.env.local` に追加:

```env
NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY=abc123-def456-...
NEXT_PUBLIC_HCAPTCHA_SITE_KEY=50b2fe65-b00b-4b9e-ad62-3ba471098be2
```

> 💡 `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` は **Web3Forms 提供の共有 Sitekey**。固定値でよい。自前 hCaptcha アカウント不要。

### Step 4. Contact.tsx を実装

`src/components/Contact.tsx` を作成 (テンプレ用ベース):

```tsx
"use client";

import { useState } from "react";

export function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);
    // honeypot チェック (bot 自動回答対策)
    if (formData.get("botcheck")) return;

    formData.append("access_key", process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY!);

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
        // オプション: 並列で Slack 通知 (setup-slack-notifications 参照)
      } else {
        setStatus("error");
        setErrorMessage(data.message || "送信に失敗しました");
      }
    } catch (err) {
      setStatus("error");
      setErrorMessage("ネットワークエラーが発生しました");
    }
  };

  if (status === "success") {
    return <div className="contact-success">送信ありがとうございました。3 営業日以内にご返信します。</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      {/* honeypot — 人間には不可視、bot が自動入力する */}
      <input
        type="checkbox"
        name="botcheck"
        style={{ display: "none" }}
        tabIndex={-1}
        autoComplete="off"
      />

      <input type="text" name="name" placeholder="お名前" required />
      <input type="email" name="email" placeholder="メールアドレス" required />
      <textarea name="message" placeholder="お問い合わせ内容" rows={5} required />

      {/* hCaptcha (Method A: Web3Forms proxy) */}
      <div className="h-captcha" data-captcha="true"></div>
      <script src="https://web3forms.com/client/script.js" async defer></script>

      <button type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? "送信中..." : "送信"}
      </button>

      {status === "error" && <p className="error">{errorMessage}</p>}
    </form>
  );
}
```

### Step 5. ページに組み込み

`src/app/page.tsx` または該当セクションに:

```tsx
import { Contact } from "@/components/Contact";

// セクション内で
<section id="contact" className="section">
  <div className="wrap">
    <SectionHead label="CONTACT" title="お問い合わせ" />
    <Contact />
  </div>
</section>
```

### Step 6. (オプション) Slack 通知併用

お問い合わせ受信時に Slack にも通知したい場合:
- **`setup-slack-notifications`** Skill を別途実行
- Contact.tsx の送信成功後に **並列で** `/api/contact` を fire-and-forget 呼び出し
- ※ Web3Forms はサーバ POST を 403 で拒否するため **クライアント直接 POST + 並列で Slack 用 API** という設計が必須

```tsx
// 成功時のあとに
fetch("/api/contact", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ name, email, message }),
}).catch(e => console.warn("Slack notification failed:", e));
```

---

## 環境変数

| 変数 | 用途 | 取得方法 |
|---|---|---|
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | フォーム送信先の特定 | Web3Forms ダッシュボードでメール登録 → 自動発行 |
| `NEXT_PUBLIC_HCAPTCHA_SITE_KEY` | hCaptcha 共有 Sitekey | 固定値: `50b2fe65-b00b-4b9e-ad62-3ba471098be2` |

---

## 既知の罠 (Pitfalls)

### ❌ Web3Forms は Origin チェックがある
- **サーバから POST すると 403** を返す (`/api/contact/route.ts` から fetch しても拒否)
- **クライアント直接 POST が必須**
- Slack 通知併用時は「クライアント → Web3Forms (フォーム送信)」と「クライアント → /api/contact (Slack 通知 fire-and-forget)」を**並列**で

### ❌ Allowed Domains 未登録で本番だけ動かない
- 開発 (`localhost`) では動くが、本番ドメインで `403 Forbidden`
- ダッシュボードで **本番ドメインを必ず追加**
- カスタムドメイン (例: `example.com`) と Vercel preview (`*-vercel.app`) は **別々に登録** が必要

### ❌ Method B (公式 hCaptcha) は動かない
- `https://js.hcaptcha.com/1/api.js` の公式 hCaptcha を使うと、Web3Forms 共有 Sitekey が **`invalid-data` エラー**
- **Method A** (`data-captcha="true"` + `web3forms.com/client/script.js` proxy) を必ず使う

### ❌ Honeypot が見えてしまう
- `style={{ display: "none" }}` だけだと、JavaScript 無効時に表示される
- 補強: `tabIndex={-1}` + `autoComplete="off"` を追加

### ❌ Free プランは月 50 件まで
- 案件規模次第で **Starter ($9/月、200 件)** などへの切替を提案
- 月 50 件超えると 51 件目以降が受信されない (重要なリードを取りこぼす)

---

## テスト・動作確認

### 開発時
- [ ] `npm run dev` でフォーム表示
- [ ] hCaptcha のチェックボックスが表示される
- [ ] 必須項目 (name / email / message) のバリデーションが効く
- [ ] honeypot 入力すると送信されない (DevTools で `checked` を true にして確認)
- [ ] 送信成功時に「ありがとうございました」表示
- [ ] 失敗時にエラーメッセージ表示

### 本番デプロイ後
- [ ] 本番ドメインでフォーム送信が成功
- [ ] 登録メールアドレスに送信内容が届く
- [ ] スパムフォルダに振り分けられないか確認
- [ ] Web3Forms ダッシュボードで送信履歴が記録される

---

## トラブルシューティング

| 症状 | 原因と対処 |
|---|---|
| `403 Forbidden` | Allowed Domains に本番ドメインが未登録 |
| `invalid-data` (hCaptcha) | Method B を使っている → Method A に切り替え |
| 送信成功なのにメール届かない | スパムフォルダ確認 / Web3Forms ダッシュボードで受信履歴確認 |
| `Cannot read properties of undefined` | `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` 未設定 |
| 本番だけ動かない | Vercel に環境変数を登録 → Re-deploy |

---

## 参照ドキュメント

- AI STUDIO 実装事例: `src/components/sections/Contact.tsx`, `src/app/api/contact/route.ts` (Slack 連携用)
- AI STUDIO セットアップ詳細: `docs/WEB3FORMS_SETUP.md`
- Web3Forms 公式: https://docs.web3forms.com/
- hCaptcha 公式: https://www.hcaptcha.com/
