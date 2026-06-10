---
name: setup-image-workflow
description: ビジュアル主体のサンプルサイトやクライアントワークで画像を扱う標準フロー (設計書の画像要件 → CLI 実装の placeholder → 画像リクエスト docs 生成 → user が AdobeStock / AI 生成で配置)。「ここに写真が欲しい」「Hero に画像入れる」「美容室の店内写真」「スタッフ集合写真」「ビフォーアフター」「商品写真」「メニュー写真」「画像を AdobeStock で用意」「AI で画像生成」「画像リクエスト」「placeholder のままじゃダメ」など、 画像主体のサイト制作・画像配置・画像準備に関する発言があったら必ず使う。 zuk-zuk AI STUDIO や 税理士サンプル のように「文字主体で OK」 ではなく、 美容室・カフェ・EC・歯科 等のビジュアル勝負のサンプルで特に重要。
---

# 画像ワークフロー (zuk-zuk 標準)

zuk-zuk が制作する案件で、 **画像を積極的に使うサイト** (美容室 / カフェ / EC / 歯科 / フォトグラファー 等) で「文字だけで成立させない」 ための実装フロー。

## なぜ Skill 化したか

| 過去事例 | 結果 |
|---|---|
| zuk-zuk AI STUDIO 本体 | 意図的にモノクロ・ロゴ + 抽象グラフィック → **ブランドコンセプト** として成立 |
| 試行 #2 税理士サンプル | 顔写真ダミー (ネイビーパネル) のみ → **士業として成立** |
| 試行 #3 以降 (美容室など) | **同じ方針だと致命的** → このフローを通す必要 |

## 前提

- 案件は「画像が主役」 になる業種 (美容室 / カフェ / EC / 歯科 / 不動産 / 写真スタジオ 等)
- user は AdobeStock or AI 画像生成 (Midjourney / DALL-E / Adobe Firefly 等) で画像を用意できる
- CLI は画像を生成できない (テキスト・コードのみ) → user に画像を依頼する設計

---

## 3 レイヤーで画像思考を組み込む

### レイヤー 1: 設計書 (design-brief.md) に「画像要件」 セクション

設計書テンプレに固定セクションとして含める:

```markdown
## 7. 画像要件 (user 用意 / AI 生成 / Stock)

### Hero (1 枚必須)
- 用途: ファーストビューの背景 or 主要要素
- 指定: 「具体的な被写体・構図・トーン (例: 20代女性が施術を受けている、 自然光、 落ち着いた雰囲気、 やや俯瞰)」
- アスペクト比: 16:9 or 縦長 4:5
- 配置先: `public/images/[サンプル名]/hero.jpg`
- 推奨ソース: AdobeStock | AI 生成 | クライアント提供

### スタッフ / 代表 (X 枚)
- 用途: 個別紹介
- 指定: 「胸から上のポートレート、 同じ背景・トーン、 微笑み」
- 配置先: `public/images/[サンプル名]/staff-{1..6}.jpg`

### サービスメニュー / 商品 (X 枚)
- 用途: カードのサムネ
- 指定: 「具体的な被写体 (施術のクローズアップ、 商品単体、 等)」
- 配置先: `public/images/[サンプル名]/menu-{slug}.jpg`

### Works / 事例 / ビフォーアフター (X 枚)
- 用途: 実績紹介
- 指定: 「ビフォーアフター、 同じ角度・照明、 一貫感」
- 配置先: `public/images/[サンプル名]/works/{id}.jpg`

### 店内 / 制作風景 / 抽象写真 (任意)
- 用途: About 補足 / セクション間ブリッジ / 信頼感醸成
- 指定: 「店内全景、 自然光、 横長」
- 配置先: `public/images/[サンプル名]/about-{slug}.jpg`

### OG 画像 (1 枚)
- 用途: SNS シェア時のプレビュー
- アスペクト比: 1.91:1 (1200x630)
- 配置先: `public/images/[サンプル名]/og.png`
```

### レイヤー 2: CLI 実装時のガイドライン

`Plan` ファイルに以下の指示を含める:

```markdown
## 画像実装ルール (Phase E でセクション実装時)

### 配置先
- 全画像: `public/images/[サンプル名]/`
- next/image を使う想定 (sizes / priority / blur placeholder)

### Placeholder ルール
画像が未配置の段階での実装:

1. **Hero 等の必須セクション**:
   ```tsx
   {/* TODO: image hero.jpg needed (16:9, 自然光, 施術中) */}
   <div className="aspect-[16/9] bg-stone-200 flex items-center justify-center">
     <p className="text-stone-500 text-sm">Photo: hero.jpg</p>
   </div>
   ```
   - HTML コメントで TODO を明示
   - グレー背景 + キャプションで「ここに画像が入る」 を可視化
   - 文字だけで成立させない (= 画像必須を示す)

2. **画像があれば差し替え** (条件分岐 fallback は最小限):
   ```tsx
   import Image from "next/image";
   <div className="relative aspect-[16/9]">
     <Image
       src="/images/salon/hero.jpg"
       alt="..."
       fill
       sizes="100vw"
       priority
       className="object-cover"
     />
   </div>
   ```

3. **動的画像 (Sanity 等)** はそのまま使う (CMS フォールバックは別)

### 命名規約
- `hero.jpg` (1 枚)
- `staff-{1..6}.jpg`
- `menu-{slug}.jpg` (e.g., `menu-cut.jpg`, `menu-color.jpg`)
- `works/{id}.jpg` (10+ 枚想定でサブディレクトリ)
- `about-{slug}.jpg`
- `og.png` (OG 画像)

### アスペクト比 (Tailwind ユーティリティ前提)
- Hero: `aspect-[16/9]` or `aspect-[4/5]` (縦長)
- ポートレート: `aspect-[4/5]` or `aspect-square`
- 商品カード: `aspect-square` or `aspect-[3/4]`
- ビフォーアフター: `aspect-[3/4]` (左右並び)
```

### レイヤー 3: 画像リクエスト docs 生成

CLI 実装完了後、 `docs/IMAGE-REQUESTS.md` を生成 (user が AdobeStock 等で用意するためのリスト):

```markdown
# [サンプル名] 画像リクエスト

下記の画像を `public/images/[サンプル名]/` に配置してください。

| # | ファイル名 | 用途 | サイズ目安 | 指定 | 推奨ソース |
|---|---|---|---|---|---|
| 1 | hero.jpg | Hero 背景 | 1920x1080 | 20代女性、自然光、施術中 | AdobeStock or AI 生成 |
| 2 | about-portrait.jpg | 代表挨拶 | 800x1000 | スタイリスト、笑顔、縦長 | AdobeStock |
| 3 | staff-1.jpg〜staff-3.jpg | スタッフ紹介 | 800x800 | 同じトーン、ポートレート | AI 生成 (同一スタイル) |
| 4 | menu-cut.jpg | カット | 800x800 | カット中の手元 | AdobeStock |
| 5 | menu-color.jpg | カラー | 800x800 | カラー施術中 | AdobeStock |
| 6 | works/1.jpg〜works/12.jpg | ビフォーアフター | 各 800x1000 | ビフォーアフター比較 | クライアント提供 / AI 生成 |
| 7 | og.png | OG画像 | 1200x630 | サイトキービジュアル | デザイナー作成 |

## 配置後の作業

1. 画像を配置 (`public/images/[サンプル名]/` 配下)
2. dev で表示確認 (placeholder が消えて画像が出るか)
3. 必要に応じて next/image の sizes / quality 調整
4. OG 画像は別途 `opengraph-image.tsx` で動的生成も検討

## AI 画像生成のコツ

- **一貫性**: 同じ「スタイル」 を保つため、 1 つの seed / style reference を全枚で使う
- **被写体の一貫**: 「20代女性、 ショートカット、 笑顔」 等を全体で揃える
- **トーン**: 「自然光 / セピア / ハイキー / ローキー」 等を統一
- **AdobeStock 検索コツ**: 業種ごとの専門カテゴリで絞り込み (例: 「Hair Salon Asian」)
```

---

## 手順 (Skill 起動時)

### Step 1: 案件のジャンル判定

ヒアリング情報や設計書から、 案件が **画像必須型** か **テキスト主体型** か判定:

| ジャンル | 画像必須度 | 画像枚数目安 |
|---|---|---|
| 美容室 / サロン | ★★★ 必須 | 20-40 枚 |
| カフェ / 飲食店 | ★★★ 必須 | 20-30 枚 |
| EC / 物販 | ★★★ 必須 | 商品数 × 3 枚 |
| 歯科 / 整体 | ★★ 推奨 | 10-15 枚 |
| 不動産 | ★★★ 必須 | 物件数 × 5 枚 |
| 写真スタジオ | ★★★ 必須 | 50+ 枚 |
| 教育・スクール | ★★ 推奨 | 10-20 枚 |
| 士業 (税理士 / 弁護士) | ★ 任意 | 5-10 枚 (代表 + 事務所) |
| ブランドサイト (BtoB) | ★★ 推奨 | 10-15 枚 |
| LP (キャンペーン) | ★★★ 必須 | 5-10 枚 (大判) |

### Step 2: 設計書 (design-brief.md) に画像要件を追加

レイヤー 1 のフォーマットで、 案件に合わせて記入。

### Step 3: Plan に CLI 実装ルールを反映

レイヤー 2 の指示を Plan ファイルに含める。

### Step 4: CLI 実装後、 IMAGE-REQUESTS.md を生成

レイヤー 3 のフォーマットで、 必要な画像を user に依頼。

### Step 5: user が画像を用意 → 配置 → 確認

- AdobeStock 購入 / AI 生成 / クライアント受領
- `public/images/[サンプル名]/` 配下に配置
- dev で確認、 placeholder が消えて画像が出るか
- 必要なら CLI に「画像置いたので最適化して」 と再依頼

---

## 既知の罠 (Pitfalls)

### ❌ Placeholder のまま放置
- 「画像未配置でも動く」 ように作ると、 user が画像配置を忘れる
- → **必須セクションは Placeholder を目立つように** (グレー背景 + キャプション)

### ❌ 文字だけで成立させる fallback を作りすぎる
- 「画像なくても十分」 な実装にすると、 user が画像を用意するインセンティブが下がる
- → **画像ありきでレイアウト**、 文字 fallback は最小限

### ❌ 画像サイズ・形式の不統一
- 各セクションで異なるアスペクト比 / 解像度の画像を使うと、 user の準備負担が増える
- → **Skill のテーブル形式で「ファイル名 + サイズ + 指定」 を明示**

### ❌ next/image の sizes 設定漏れ
- 大きな画像を全幅で読むと LCP が悪化
- → **必ず `sizes` 属性を指定**: `sizes="(max-width: 768px) 100vw, 50vw"` 等

### ❌ AI 生成画像の一貫性欠如
- 各セクションで違うトーン・スタイルの画像を生成すると統一感がない
- → **1 つの seed / style guide で全枚生成**、 user に AI 生成方法をガイド

---

## 配置例: 美容室サンプル (#68)

```
public/images/salon/
├── hero.jpg                      ← Hero (女性が施術を受けている)
├── about-portrait.jpg            ← 代表挨拶ポートレート
├── staff-1.jpg                   ← スタッフ紹介 1
├── staff-2.jpg                   ← スタッフ紹介 2
├── staff-3.jpg                   ← スタッフ紹介 3
├── menu-cut.jpg                  ← カットメニュー
├── menu-color.jpg                ← カラーメニュー
├── menu-perm.jpg                 ← パーマメニュー
├── menu-treatment.jpg            ← トリートメント
├── interior-1.jpg                ← 店内全景
├── interior-2.jpg                ← セット面
├── works/
│   ├── 1.jpg                     ← ビフォーアフター 1
│   ├── 2.jpg
│   ├── ...
│   └── 12.jpg
├── og.png                        ← OG 画像
└── favicon.ico                   ← ファビコン
```

---

## レイヤー 4: 🎨 プロンプトパック生成 (2026-06-10 追加) ⭐

設計書 / IMAGE-REQUESTS-{案件}.md が完成したら、 **user が AI ツールにコピペするだけで画像生成できる** プロンプトパックを生成する。 これで user の「プロンプトを毎回考える時間」 が消える。

### 配置先
- `docs/IMAGE-PROMPTS-{案件名}.md` (各サンプル / クライアント案件に 1 つ)
- 例: `docs/IMAGE-PROMPTS-SALON.md`、 `docs/IMAGE-PROMPTS-SCHOOL.md`

### 構造テンプレ

```markdown
# {案件名} — AI 画像生成プロンプトパック

## 🎨 案件のビジュアル方針 (ベース定義)
- トーン: [ナチュラル × ヴィンテージ / モダン × ミニマル / 等]
- カラー: [メインカラー × アクセントカラー]
- 雰囲気キーワード: [3-5 個、 例: dried flowers, warm light, jazz cafe vibe]
- 撮影スタイル: [editorial photography / lifestyle / product / etc]
- レンズ・機材: [shot on Sony A7, 35mm lens, shallow DOF 等]

## 📦 ベースプロンプト (全画像共通の冒頭)

### Midjourney / Firefly (英語、 構文短め)
```
[案件世界観の英文 1-2 文、 上記要素を凝縮]
```

### DALL-E 3 / ChatGPT (英文、 自然言語)
```
[同じ内容を自然な英文 2-3 文で記述]
```

## 🖼 各画像のバリエーションプロンプト

設計書 / IMAGE-REQUESTS-{案件}.md のリストに対応:

### N. {画像名}.jpg ({用途})
- **指定**: [被写体 / 構図 / 雰囲気]
- **アスペクト比**: [16:9 / 4:5 / 1:1 等]
- **配置先**: `public/images/{案件}/{画像名}.jpg`
- **推奨ツール**: [AdobeStock / Midjourney / DALL-E / Firefly]
- **プロンプト**:
  ```
  [ベース] + [個別指示]
  ```
- **一貫性指示** (該当時、 主にスタッフ写真など):
  - `--seed XXXX` (同じ被写体で複数枚生成する場合)
  - `--sref [前回生成画像 URL]` (style reference)

(画像数だけ繰り返す)

## 🎯 AI ツール別 最適化指針

### Midjourney
- **強み**: 一貫したスタイル、 高品質、 `--seed` `--sref` で再現性
- **適用**: スタッフ写真 (同トーン必須)、 アート性高い Hero 画像
- **書式**: `[プロンプト] --ar 16:9 --seed 1234 --sref [URL] --v 7`

### DALL-E 3 (ChatGPT 経由)
- **強み**: 自然言語で詳細指示可能、 文字入りも OK
- **適用**: インテリア、 小物、 抽象的シーン
- **書式**: 自然な英文で記述

### Adobe Firefly
- **強み**: 商用ライセンス明確、 「Generative Match」 で参照スタイル継承
- **適用**: 制作物の使用 (zuk-zuk Creative Cloud で生成 → 商用 OK)
- **書式**: Firefly UI で参照画像をアップロード → 類似スタイル生成

### AdobeStock (AI じゃないが)
- **強み**: プロ品質、 商用ライセンス OK、 検索が早い
- **適用**: リアルな店舗写真、 業種特有のシーン (税理士オフィス、 美容室店内 等)
- **検索コツ**: 「[業種] [テイスト] [国]」 例: `hair salon vintage japan`

## 🔄 一貫性を保つコツ (複数画像で同じ世界観を)

### 同じ世界観で複数枚生成する場合
1. **1 枚目を高品質で生成** (これが基準)
2. **その画像 URL を `--sref` (style reference) として 2 枚目以降に渡す**
3. **seed を固定** (`--seed 1234` を全画像で同じ)
4. **ベースプロンプトを完全に同一にする** (個別指示だけ変える)

### 違う AI ツール間で世界観を揃える場合
1. **1 つのツールで決め打ち**: 同じ案件は 1 ツールに統一が一番安全
2. **共通プロンプトを使う**: ツール間で英文の核心部分を同じに
3. **ChatGPT に翻訳依頼**: 「この Midjourney プロンプトを DALL-E 用に書き直して」

## 📋 ZAS OPS 整備フロー (案件着手時)

```
1. 設計書 (sample-{案件}-design-brief.md) 完成
        ↓
2. IMAGE-REQUESTS-{案件}.md 作成 (画像リスト + アスペクト比 + 配置先)
        ↓
3. IMAGE-PROMPTS-{案件}.md 作成 ⭐ ← この Skill のレイヤー 4
   - ヒアリング結果 (トーン・カラー・雰囲気) からベースプロンプト導出
   - 各画像のバリエーションプロンプトを生成
   - AI ツール別最適化指示
        ↓
4. user に引き継ぎパッケージとして渡す
   ┌──────────────────────────────┐
   │ IMAGE-REQUESTS  ← 何を作るか │
   │ IMAGE-PROMPTS   ← どう作るか │
   └──────────────────────────────┘
        ↓
5. user は AI ツールに **コピペするだけ** で画像生成
        ↓
6. 配置 → サイトに反映 (Next.js HMR で自動更新)
```

→ user の「プロンプトを考える時間」 が **ゼロ** に。 ZAS OPS が設計書から自動導出する。

---

## 関連ドキュメント

- 設計書テンプレ: `.claude/plans/sample-XXX-design-brief.md`
- Plan テンプレ: `.claude/plans/night-run-XXX-full.md`
- 画像要件テンプレ: `docs/IMAGE-REQUESTS-XXX.md`
- プロンプトパック テンプレ: `docs/IMAGE-PROMPTS-XXX.md` ⭐ (この Skill のレイヤー 4)
- 関連 Skill:
  - `setup-vercel-deploy` (画像 CDN 配信)
  - `setup-seo-ogp` (OG 画像)
  - `setup-sanity-cms` (CMS 経由の動的画像)
