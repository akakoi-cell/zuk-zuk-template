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

### ドメイン購入先 (クライアント自身のアカウントで必ず購入)
- **Cloudflare Registrar** (推奨、 技術寄り / Vercel 連携重視 / 原価販売)
- **お名前.com** (日本語サポート重視)

### 案件タイプ別の運用
- **月額契約**: zuk-zuk が Vercel/GitHub/Sanity 全管理、 クライアントはドメイン購入のみ
- **制作のみ**: Gmail 1 つで一括 SSO セットアップ、 zuk-zuk が画面共有伴走

→ 詳細は `../zuk-zuk-ai-studio/docs/CLIENT_PROJECT_FLOW.md` Phase 0 参照

## 改訂履歴

- 2026-06-09: 初版 (Phase 0 ルール / CMS 統一方針を反映)
