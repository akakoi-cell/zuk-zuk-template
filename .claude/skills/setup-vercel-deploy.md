---
name: setup-vercel-deploy
description: zuk-zuk-template ベースの Next.js プロジェクトを Vercel にデプロイする標準手順 + 罠リスト。「Vercel に上げて」「本番にデプロイ」「カスタムドメイン設定したい」「DNS どうする?」「Vercel Pro に変える?」「環境変数 Vercel に登録」など、Vercel への新規デプロイ・カスタムドメイン設定・本番化準備に関する発言があったら必ず使う。
---

# Vercel デプロイ標準手順 (zuk-zuk 用)

zuk-zuk-template ベースの案件を **Vercel にデプロイ + カスタムドメイン設定 + 本番化** までを一気通貫で案内する Skill。AI STUDIO の本番デプロイで得た知見・罠を盛り込み、毎案件で同品質を担保する。

## 前提条件

- ✅ zuk-zuk-template クローン済み (もしくは同等の Next.js 16 プロジェクト)
- ✅ ローカルで `npm run dev` が動く状態
- ✅ GitHub アカウント (zuk-zuk 案件は `akakoi-cell` 組織配下に作成)
- ✅ Vercel アカウント (GitHub 連携済み)
- ✅ クライアントの本番ドメイン取得元が判明している (Squarespace / お名前.com / Cloudflare / Vercel 直接購入 等)

---

## 手順

### Step 1. GitHub リポジトリ準備

```bash
# プロジェクトディレクトリで
cd clients/案件名

# .gitignore の確認 (テンプレに既に含まれているはず)
cat .gitignore | grep -E "\.env\.local|\.next|node_modules"

# 初期コミットがまだなら
git add .
git commit -m "Initial commit"

# GitHub リポジトリ作成 + push
gh repo create akakoi-cell/案件名 --private --source=. --remote=origin --push \
  --description="クライアント案件: XXX 様のサイト"
```

> ⚠️ クライアント案件は **--private** を推奨 (機密性確保)。`zuk-zuk-template` 本体だけが `--public`。

### Step 2. Vercel プロジェクト作成

1. https://vercel.com/dashboard を開く
2. 「Add New...」→「Project」
3. GitHub リポジトリを Import (検索で案件名)
4. **Framework**: Next.js が自動検出される
5. **Build Settings**: そのまま (テンプレが Next.js 16 標準なので調整不要)
6. **Environment Variables** を登録 (Step 3 参照)
7. 「Deploy」をクリック

### Step 3. 環境変数の登録

最低限必須:

| 変数名 | 値 | 必須? |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `https://本番ドメイン` | ✅ 必須 |
| `NEXT_PUBLIC_TYPEKIT_KIT_ID` | `gux5cqf` (zuk-zuk スタンダード) or 案件固有 | 任意 |

案件機能に応じて追加 (各 Skill のドキュメント参照):

| 変数 | 関連 Skill |
|---|---|
| `NEXT_PUBLIC_SANITY_PROJECT_ID` 等 | setup-sanity-cms |
| `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` | setup-contact-form-web3forms |
| `SLACK_WEBHOOK_URL` 等 | setup-slack-notifications |
| `STRIPE_SECRET_KEY` 等 | setup-stripe-subscription |

> ⚠️ **「Production / Preview / Development」3 つの環境がある** ことを意識:
> - **Production**: main ブランチ → 本番ドメイン
> - **Preview**: 他ブランチ → `*-vercel.app`
> - **Development**: `vercel dev` ローカル時 (ほぼ使わない)
> - 通常は **「Production + Preview」両方にチェック** を入れて登録

### Step 4. 初回 Preview デプロイ確認

1. Deploy 完了後、Vercel が自動で `*-vercel.app` URL を発行
2. URL を開いて動作確認:
   - Header / Hero / Footer が正常表示されるか
   - スマホビューでレスポンシブが崩れないか
   - フォーム / Sanity / Stripe など案件機能の動作確認
3. Build ログでエラーがないか確認 (Vercel ダッシュボード > Deployments > 該当デプロイ > Build Logs)

### Step 5. カスタムドメイン設定

Vercel ダッシュボード > Project > Settings > Domains:

1. 「Add」をクリック
2. 本番ドメイン (例: `example.com`) を入力
3. Vercel が必要な DNS レコードを表示:
   - **Apex ドメイン** (`example.com`): A レコード `76.76.21.21`
   - **www / サブドメイン**: CNAME → `cname.vercel-dns.com`
4. DNS 取得元 (Squarespace / お名前.com 等) で該当レコードを追加
5. Vercel が DNS を検出 → SSL (Let's Encrypt) 自動発行 → ~5 分で完了

**zuk-zuk の典型例 (Squarespace DNS)**:
- ドメイン: `ai-studio.zuk-zuk.com` (サブドメイン)
- 設定: Squarespace DNS で `ai-studio` CNAME → `cname.vercel-dns.com`
- TTL: 自動 or 3600 秒

### Step 6. Hobby → Pro 切替 (商用利用前に必須)

⚠️ **Vercel Hobby は商用利用不可** (Vercel 利用規約)。クライアント案件は **必ず Pro ($20/月) に変更**:

1. Vercel ダッシュボード > Settings > Billing
2. プラン変更: Hobby → Pro
3. 支払い情報を登録
4. Pro になると以下が有効化:
   - 商用利用許諾
   - 帯域幅 1TB/月
   - チームメンバー追加
   - パスワード保護 (Preview)

### Step 7. main / preview ブランチ運用

クライアントレビュー用に Preview ブランチを活用:

```bash
# 開発用ブランチを作成
git checkout -b preview

# 修正をコミット & push
git push origin preview
# → Vercel が *-vercel.app に自動デプロイ
# → クライアントに URL を共有して確認してもらう

# OK なら main にマージ → 本番反映
git checkout main
git merge preview
git push origin main
```

---

## 環境変数 (このスキルが扱うもの)

| 変数 | 用途 | 取得方法 |
|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | OGP / sitemap / 構造化データ で使う本番 URL | 自分で設定 (`https://本番ドメイン`) |
| `NEXT_PUBLIC_TYPEKIT_KIT_ID` | Adobe Fonts (Typekit) kit ID | https://fonts.adobe.com/my_fonts#web_projects-section |

---

## 既知の罠 (Pitfalls)

### ❌ 環境変数の値ミス
- **Sanity の projectId に URL を入れてしまうケース** ← AI STUDIO で実際にハマった
  - 正: `9q3o7nof` (英数字 ID)
  - 誤: `https://api.example.com`
- 環境変数を登録した後、必ず **Re-deploy** が必要 (既存ビルドには反映されない)

### ❌ Hobby のまま商用運用してしまう
- 商用利用 = クライアントのためのサイト = **Hobby は規約違反**
- ローンチ前に必ず Pro に切替
- 違反すると Vercel から警告メール / 最悪アカウント停止

### ❌ DNS 設定の TTL が長すぎて反映待ち
- 古い DNS 設定が残っている場合、新規 CNAME の反映に時間がかかる
- 設定変更時に TTL を一時的に短く (300秒 等) しておくと早い
- 確認: `dig CNAME ai-studio.zuk-zuk.com` で現在の解決状態を見る

### ❌ Apex ドメインで CNAME を使う
- Apex (例: `example.com`) は CNAME 設定不可 (DNS 仕様)
- **A レコード**を使う (Vercel の指示通り: `76.76.21.21`)
- サブドメイン (例: `www.example.com`, `ai-studio.example.com`) なら CNAME OK

### ❌ Build 失敗時の対処
- ローカルで `npm run build` を必ず通してから push する
- 環境変数が未登録だと `Cannot read properties of undefined` 系エラー
- Build Logs を確認して、不足変数を追加 → Re-deploy

### ❌ 本番デプロイで Sanity Studio (/studio) にアクセスできない
- `/studio` ルートには Auth がない (デフォルト)
- 本番では認証必須 (Sanity ログイン)
- Sanity Manage で許可ユーザーを登録

---

## テスト・動作確認

### Preview デプロイ確認
- [ ] `*-vercel.app` URL でサイトが正常表示
- [ ] Header / Hero / Footer のレイアウト崩れなし
- [ ] スマホビュー (DevTools のレスポンシブモード) で確認
- [ ] フォーム送信が動く (案件で実装した場合)
- [ ] CMS データが取れる (Sanity を使う場合)

### カスタムドメイン確認
- [ ] `https://本番ドメイン` でアクセス可能
- [ ] SSL 証明書が有効 (鍵アイコン表示)
- [ ] `http://` でアクセスしても `https://` にリダイレクト
- [ ] `www` あり/なし どちらでもアクセス可 (案件次第)

### Pro 切替確認
- [ ] Vercel ダッシュボードでプランが「Pro」表示
- [ ] 「Project Settings > General」で商用利用許諾が有効

---

## トラブルシューティング

| 症状 | 原因と対処 |
|---|---|
| Build が `Error: ...` で失敗 | Build Logs を確認、不足環境変数を追加 → Re-deploy |
| Preview URL が 404 | Branch が Vercel と接続されていない、Project Settings > Git で確認 |
| カスタムドメイン「Invalid Configuration」 | DNS レコードが不正、Vercel が指示する正確な値か再確認 |
| SSL が「Pending」のまま | DNS 反映待ち、最大 24 時間、`dig` で確認 |
| `404 Not Found` だが build は成功 | Output 設定 / next.config.ts の `output: "export"` 等の意図しない設定を確認 |

---

## 参照ドキュメント

- AI STUDIO 本番デプロイ事例: `docs/CLIENT_PROJECT_FLOW.md` Phase I
- Vercel 公式: https://vercel.com/docs/projects/overview
- Vercel カスタムドメイン: https://vercel.com/docs/projects/domains
