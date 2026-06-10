<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

# zuk-zuk プロジェクト基本ルール

> このリポジトリは zuk-zuk のクライアント案件用 Next.js テンプレートです。
> 業務ルールの正典は隣リポジトリ `../zuk-zuk-ai-studio/docs/CLIENT_PROJECT_FLOW.md` に集約されています。
> 詳細・最新は必ず正典を参照してください。

## まず読むべきドキュメント

### このリポジトリ内
- `.claude/skills/` — 整備済み Skill (setup-vercel-deploy / setup-contact-form-web3forms / setup-seo-ogp / setup-sanity-cms / setup-legal-pages / setup-image-workflow)
- `.claude/settings.json` — Bash 等の allow/deny ルール (夜間自走の権限管理)

### 隣リポジトリ (正典)
- `../zuk-zuk-ai-studio/docs/CLIENT_PROJECT_FLOW.md` — 案件標準フロー (Phase 0-L)
- `../zuk-zuk-ai-studio/docs/SAMPLES_PLAN.md` — 業種別サンプルサイト計画
- `../zuk-zuk-ai-studio/docs/SKILLS_PLAN.md` — Skill 化計画
- `../zuk-zuk-ai-studio/docs/FEATURES.md` — 機能別カタログ

## 重要ルール 要約 (2026-06-09 時点)

### 採用技術 (全案件統一)
- **CMS**: **Sanity Free** (全案件、 microCMS への分岐ルールは 2026-06-09 廃止)
- **フォーム**: Web3Forms + hCaptcha 共有 sitekey (`50b2fe65-b00b-4b9e-ad62-3ba471098be2`)
- **決済**: Stripe / **通知**: Slack Webhook / **ホスティング**: Vercel

### アカウント所有戦略
- **クライアント所有**: ドメイン / Vercel / GitHub / Sanity
- **zuk-zuk 所有**: Stripe / Web3Forms / Slack / Figma / Claude Design / Notion / Adobe Fonts
- ⚠️ **決済の徴収主体**: zuk-zuk 所有 Stripe は「zuk-zuk への支払い」専用。 **クライアントの売上 (月謝・物販・予約金等) を徴収する決済は、 継続/単発を問わずクライアント所有 Stripe で行う** (横展開時のみ Stripe Connect)。 → 正典 `../zuk-zuk-ai-studio/docs/CLIENT_PROJECT_FLOW.md` 0-2-1

### ドメイン購入先 (クライアント自身のアカウントで必ず購入)
- **Cloudflare Registrar** (推奨、 技術寄り / Vercel 連携重視 / 原価販売)
- **お名前.com** (日本語サポート重視)

### 案件タイプ別の運用
- **月額契約**: zuk-zuk が Vercel/GitHub/Sanity 全管理、 クライアントはドメイン購入のみ
- **制作のみ**: Gmail 1 つで一括 SSO セットアップ、 zuk-zuk が画面共有伴走

→ 詳細は `../zuk-zuk-ai-studio/docs/CLIENT_PROJECT_FLOW.md` Phase 0 参照

---

# ⏱ タイムボックス (2026-06-10 採用)

| 表記 | 意味 |
|---|---|
| **`[nn]`** | nn 分で切りの良いところで一旦中断 + 報告 |
| **(表記なし)** | デフォルト 30 分 |
| **`[-]`** | 無制限 (完走まで自走) |

## 「切りの良いところ」
- 編集中ファイルは save まで / Bash はコマンド完了まで / 1 セクション単位 / commit 直前なら commit+push まで
- nn 分 + 1-3 分の超過は許容

## 報告フォーマット
```
⏱ 経過: NN 分
✅ 完了: ...
⏳ 残作業: ...
📊 推定残時間: 約 XX 分
🚦 続行判断: 続けて OK / 方針確認したい / 一旦止める
```

## 実装
- 受信時に文末 `[nn]` をパース (なし=30、 `-` =無制限)
- `date +%s` で start を記録 → 各ステップ後に経過チェック
- 超過したら次の自然な区切りで完了 → 標準フォーマットで報告

→ 詳細: `../zuk-zuk-ai-studio/AGENTS.md` 依頼時間制限ルール

---

# 📛 命名規則 (2026-06-10 採用)

| 略称 | 指すもの |
|---|---|
| **ZAS** (ザス) | サービス「zuk-zuk AI STUDIO」 自体 |
| **ZAS OPS** | OPS セッション (業務ルール / 進捗管理) |
| **ZAS サイト** | https://ai-studio.zuk-zuk.com/ + リポジトリ zuk-zuk-ai-studio |

→ 詳細: `../zuk-zuk-ai-studio/AGENTS.md` 命名規則セクション

---

# 🎯 セッション役割分担 (2026-06-10 採用)

- **OPS セッション** = ZAS OPS セッション (業務ルール / 進捗管理 / 引き継ぎパッケージ作成、 コード編集はしない)
- **現場セッション** = 案件 / タスクごとに別 Claude (CLI or .ai 新規チャット) で並行進行
- 衝突回避: ファイル / リポジトリ単位で現場を分ける

→ 詳細: `../zuk-zuk-ai-studio/AGENTS.md` セッション役割分担セクション

---

# 🔓 完全権限渡し / bypassPermissions (2026-06-10 採用)


## ② Claude Code (Code モード) は別ルート

`bypassPermissions` フラグは CLI 専用。 Claude Code (Code モード) では プロジェクトルート
`/Users/kakoiatsushi/Projects/zuk-zuk AI DESIGN STUDIO/.claude/settings.json` を参照 (allow 130 件 / deny 17 件)。
残るダイアログは「常に許可」 で蓄積。 詳細は `../zuk-zuk-ai-studio/AGENTS.md`。

## ① CLI 起動コマンド
CLI 起動コマンド:
```bash
caffeinate -i claude --permission-mode bypassPermissions
```

- Edit / Write / Bash / MCP 全部自動 (deny も無視、 本体機構もスキップ)
- 信任根拠: ZAS リポジトリ内 + 自分の Vercel/dev server のみ + CI/CD チェック
- 不安なら従来 acceptEdits に戻す選択肢あり

→ 詳細: `../zuk-zuk-ai-studio/AGENTS.md` 完全権限渡し

---

# 🛡 許可ダイアログ判定ガイド (2026-06-10 採用)

## 🟢 即「常に許可」 OK
- mkdir / ls / cat / grep / head / tail / wc / file
- cd <ZAS リポジトリ> && コマンド
- curl http(s)://、 wget (自分の本番ドメイン or GitHub)
- npm run dev / build / test、 npx tsc
- git add / commit / push origin main / status / diff / log
- vercel ls / inspect / logs
- nohup / sleep / lsof / kill
- rm -rf .next / node_modules / .turbo (cache のみ)
- export PATH / $() / && / || / | (内容が上記の組み合わせなら)

## 🔴 拒否 (settings.json deny で原則防護済)
- rm -rf / / rm -rf $HOME
- sudo * / chmod 777
- git push --force / -f
- curl | bash / wget | sh
- 認証情報の不審な送信先

→ 詳細: `../zuk-zuk-ai-studio/AGENTS.md` 許可ダイアログ判定ガイド

---

# 🚀 自走モード (2026-06-10 採用)

zuk-zuk プロジェクトでは全 Claude セッションが「自走モード」 で運用される。

## ルール

### 🟢 user に確認する (AskUserQuestion 等を使う)
- **大方針の決定** (例: 「サンプルどっち先に作る?」「店名は何にする?」)
- **削除 / 取り消し** (例: 「Footer の tagline も消す?」)
- **新規 機能 / 新規 案件**
- **複数の選択肢からの選定**

### 🔴 user に確認しない (黙って実行)
- **Edit / Write / Read** — 編集系は許可待ちなし
- **Bash 実行** — settings.json の deny に該当しない限り自走
- **動作確認 / 検証** — curl / preview / dev server 起動等
- **ステップ間の「これでいいですか?」 確認** — 全部完了してから報告
- **個別修正の途中確認** — 5 件の修正リストなら 5 件全部実装 → 完了報告

→ 詳細: `../zuk-zuk-ai-studio/AGENTS.md` 自走モードセクション

---


## 改訂履歴

- 2026-06-09: 初版 (Phase 0 ルール / CMS 統一方針を反映)
- 2026-06-10: 決済の徴収主体ルール追加 (クライアント売上の徴収はクライアント所有 Stripe / 正典 0-2-1)
