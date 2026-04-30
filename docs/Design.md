# シンシアリー LP デザインシステム（Design.md）

最終更新: 2026-04-28
所在地: `cto/mock/docs/Design.md`（git リポ内）

本ドキュメントは cynthialy.co.jp（Studio.Design 製）の意匠を分析し、Astro モック（`cto/mock/`）で再現・拡張するための **設計憲章** である。
新ページの追加・既存ページの改修・コンポーネント切り出しを行う際は、まず本ドキュメントの該当章を参照すること。

> **パス表記**：本ドキュメント内のファイルパスはすべて project root（`projects/cynthialy-lp/`）からの相対パスです。

## 0. このドキュメントの位置づけ

- **目的**：複数ページ（TOP / サービス一覧 / コンサル / 研修 / 事例）にまたがる意匠を統一仕様として明文化する。
- **対象読者**：実装担当（人/AI）、リード生成スキル開発者、コピーライター、デザイナー。
- **関連ファイル**：
  - `cto/design-tokens/tokens.css` — 値の正典（CSS変数）
  - `cto/design-tokens/tokens.json` — 同・JSON 版
  - `shared/references/design-system-from-studio.md` — Studio から抽出した原資料（履歴）
  - `cto/mock/public/_astro/cynthialy-runtime.js` — `<loop-box>` などのランタイム実装
  - `cto/mock/public/_nuxt/entry.C0E92ihM.css` — Studio が出力した CSS バンドル（見た目の支配的存在）
- **更新ポリシー**：トークン値変更時は `tokens.css`/`tokens.json` も合わせて更新。Studio から再抽出した場合は `shared/references/` も更新。

---

## 1. ブランド・トーン

### 1.1 ブランドポジション

「**国内トップクラスの生成AIの専門家が伴走する、業務変革・人材変革の実装パートナー**」。
プロダクト売り切りではなく、コンサル × 研修 × 実装まで一気通貫で関与する“伴走型”が訴求軸。

### 1.2 ビジュアル世界観

- ミニマル・余白広め・大きめタイポグラフィのミッドセンチュリー感
- ベース：**深緑 #0d2623**（落ち着き・信頼）
- アクセント：**ゴールド #e8de9f**（プレミアム・ハイタッチ）
- 動の演出：背景動画・ロゴカルーセル・スクロール連動フェードイン
- 静の演出：上下のたっぷりした余白、左右はコンテンツ最大 1280px

### 1.3 文体ルール

- 基本：**ですます調**、簡潔で実践的
- 1ブロックの本文は最大 4 行を目安。それ以上は分割するか箇条書きへ
- 専門用語は使ってよいが、初出は和文で補う（例：「RAG（社内データ検索）」）
- 見出しは**体言止め or 動詞止め**を優先（例：「現場が迷わず使える貴社専用のAIワークフローを設計」）
- 数字訴求は単位込みで太字表現可（例：**98.7%**, **月30時間 → 4時間**）

---

## 2. デザイントークン

すべて `cto/design-tokens/tokens.css` に CSS 変数として定義済み。**ハードコード禁止**、必ず `var(--…)` で参照する。

### 2.1 カラーパレット

| 役割 | トークン | 値 | 主な用途 |
|---|---|---|---|
| メイン | `--color-deep-green` | `#0d2623` | 見出し、フッター背景、ボタン文字 |
| サブ | `--color-neutral-90-theme` | `#0e2623` | 暗背景代替 |
| アクセント | `--color-accent-gold` | `#e8de9f` | バッジ、強調ライン、グラデ終端 |
|  | `--color-accent-gold-light` | `#f9f9ba` | カード背景の薄ゴールド |
|  | `--color-accent-gold-dark` | `#e6dfa2` | グラデーション補助 |
| テキスト | `--color-neutral-100-txt` | `#030807` | 本文 |
|  | `--color-neutral-80-txt` | `#384946` | 補足テキスト |
| ボーダー | `--color-neutral-60-border` | `#7b8180` | 強い区切り |
|  | `--color-neutral-30-border` | `#dbdbdb` | カード境界 |
| 背景 | `--color-neutral-10-bg` | `#f1f1f1` | セクション淡背景 |
| サーフェス | `--surface-card` | `#ffffffd4` | 半透明カード |
|  | `--surface-lightgreen-bg` | `rgba(237,242,231,.8)` | 緑寄り淡背景 |
| リンク | `--color-link` | `#4584ae` | テキストリンク |
| エラー | `--color-error` | `#ae4546` | バリデーション |

**禁止事項**：別の青や赤、原色のグレーなどを新規導入しない。やむを得ず追加する場合は本ドキュメントと `tokens.css` を同時更新。

### 2.2 グラデーション

主要 4 種類（残りは派生・特殊用途、`tokens.css` 参照）：

| トークン | 用途 | 構成 |
|---|---|---|
| `--gradient-hero` | Hero 帯・装飾下線 | 深緑 → ゴールド → ミント → ターコイズ |
| `--gradient-back2` | カード上の薄背景 | 深緑 → ターコイズ淡 |
| `--gradient-soft` | セクション間の柔らか境界 | 深緑淡 → 黄淡 → ゴールド淡 |
| `--gradient-gold` | バッジ装飾 | ゴールドライト → ゴールドダーク |

### 2.3 タイポグラフィ

#### フォントファミリー
| トークン | 用途 |
|---|---|
| `--font-sans-jp` | 和文メイン（Noto Sans JP / ヒラギノ角ゴ / 秀英角ゴシック銀） |
| `--font-sans-en` | 英数（Inter / Montserrat / Lato / Roboto） |
| `--font-serif-jp` | 装飾見出し（Tsukushi Mincho / A1明朝） |
| `--font-script` | アクセント装飾（Bad Script、控えめに） |

**実装ロード（CSSバンドルが優先するもの）**：
```html
<link href="https://fonts.googleapis.com/css?display=swap&family=Poppins:wght@400" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?display=swap&family=Lato:wght@700" rel="stylesheet">
<link href="https://fonts.googleapis.com/css?display=swap&family=Inter:wght@500" rel="stylesheet">
```
（フォールバック群は tokens.css 側で網羅。Fontplus 契約フォントは使えないので CDN 不要）

#### サイズスケール

| トークン | px | 用途 |
|---|---|---|
| `--font-size-3xs` ~ `--font-size-xs` | 10〜12 | キャプション、注釈、タグ |
| `--font-size-sm` | 14 | 補足テキスト、フォーム |
| `--font-size-base` | 16 | 本文（既定） |
| `--font-size-lg` ~ `--font-size-2xl` | 18〜24 | 強調本文、サブ見出し |
| `--font-size-3xl` ~ `--font-size-5xl` | 32〜48 | H2、H3 |
| `--font-size-6xl` | 64 | H1（モバイル） |
| `--font-size-hero` | 72 | H1（PC）／Hero タイトル |

#### 行間・字間
- `--line-height-tight: 1.2` — H1/H2、英字大見出し
- `--line-height-normal: 1.4` — H3、リード文
- `--line-height-relaxed: 1.6` — 本文（既定）
- `--line-height-loose: 1.8` — 読み物セクション

英字ラベル（POINT / FLOW / CONTACT）は `letter-spacing: var(--letter-spacing-wider)`（0.1em）。

### 2.4 スペーシング

8px ベースのスケール（`--space-1` = 4px、`--space-2` = 8px、…、`--space-32` = 128px）。

**慣行**：
- カード内余白：`--space-6`〜`--space-8`（24〜32px）
- カード間ギャップ：`--space-8`〜`--space-12`（32〜48px）
- セクション縦余白：PC `--space-24`〜`--space-32`（96〜128px）／ モバイル `--space-12`〜`--space-16`（48〜64px）
- 段落間：`--space-4`〜`--space-6`

### 2.5 ブレークポイント

| 名称 | Max Width | 主な切替 |
|---|---|---|
| `--bp-mini` | 320px | 例外的・極小 |
| `--bp-mobile` | 540px | スマホ縦・ナビをドロワーに |
| `--bp-tablet` | 840px | 2カラム → 1カラム化、文字 1段階小 |
| `--bp-small` | 1140px | カード列数を 3→2 |
| `--bp-base` | 1280px | デフォルト PC |

`--container-max: 1280px` / `--container-padding: 24px` を本文の入れ物として使う。

### 2.6 シャドウ・角丸・モーション

- 角丸：`--radius-sm` 4px / `--radius-md` 8px（ボタン）/ `--radius-lg` 16px（カード）/ `--radius-xl` 24px（フォト枠）/ `--radius-pill` バッジ・ピル
- 影：`--shadow-sm` 微妙な浮き / `--shadow-md` カード / `--shadow-lg` モーダル・浮遊CTA
- モーション：`--duration-base 300ms` × `--ease-out cubic-bezier(.2,0,0,1)` を既定に

---

## 3. レイアウト原則

### 3.1 コンテナ
- 中央寄せ最大 1280px、左右 24px 余白
- カラムは flex/grid。カラム間ギャップは `--space-8`（32px）が基準

### 3.2 セクション構造のテンプレ

```
<section class="…">
  <span class="eyebrow">POINT</span>            ← 英字ラベル（任意）
  <h2>セクションタイトル</h2>                  ← 体言止め多用
  <p class="lead">サブ説明（1〜2行）</p>
  <div class="content">…セクション固有の中身…</div>
</section>
```

セクションの**縦リズム**は「英字ラベル → H2 → リード文 → ビジュアル/カード群」が基本進行。

### 3.3 グリッド・余白の決め方

- **3列カード**：PC 3列 / Tablet 2列 / Mobile 1列（縦積み）
- **2col-Text-Image**：PC 1:1 / Mobile 縦積み（テキスト → 画像）
- **Hero**：PC ではテキストが左半分、ビジュアル（動画/イラスト）が右
- 上下余白は**セクション境界で詰めず**、たっぷり 96〜128px とる

---

## 4. セクションアーキタイプ

4 ページ（TOP / 一覧 / コンサル / 研修）の横断分析で同定した再利用パターン。
新ページはここから組み合わせて構成する。

### 4.1 Hero
- 構成：H1（大）／英字サブタイトル／リード文／一次CTA + 二次CTA／実績バッジ（任意）
- バリエーション：**動画背景型**（TOP のみ）、**イラスト＋テキスト型**（コンサル）、**テキスト中心型**（一覧／研修）
- 数字バッジ：定着率 98.7% など右上 or 下に小さく配置
- ロゴカルーセルが直下に来るのは TOP のみ

### 4.2 Two-Col Text + Image
- 出現：全ページで複数回
- 構成：左カラム（H2 + 段落 + リスト + 任意ボタン）／右カラム（画像 or グリッド）
- 反転（左画像・右テキスト）も可。**1セクション内で交互配置はしない**（情報整理が乱れる）

### 4.3 Grid-Cards（3カード型）
- 出現：TOP「シンシアリーが選ばれる理由」、コンサル「シンシアリーが支持される理由」など
- 構成：英字ラベル「POINT」→ H2 → 3つのカード（数字バッジ 01/02/03 + サブ見出し + 本文 + 任意画像）
- カードは均等高、文字量は揃える

### 4.4 Case-Carousel（事例）
- 出現：全ページ共通（リケンテクノス + タマディックの 2 社が固定枠）
- 構成：英字ラベル「CASE」（任意）→ H2「人材研修で組織全体のAI活用が定着した事例」→ 2 〜複数枚カード
- カード内：企業ロゴ／企業名（H2/H3）／一行サマリ／詳細リンク
- 個別事例ページへの遷移：`/case/{slug}/` の動的ルート

### 4.5 Method-Showcase（独自メソッド）
- 出現：TOP（独自メソッド）、コンサル（AIワークフロー）、研修（カリキュラム）
- 構成：H2 → リード → 3〜5の段階表現（数字 + 見出し + 本文）
- アクセント：英字キャプション（AI Flow / AI Transformation / AI Development）

### 4.6 Process-Flow（導入の流れ）
- 出現：コンサル、研修
- 構成：英字ラベル「FLOW」→ H2「導入の流れ」→ 4 ステップ（縦並びまたは横並び）
- 各ステップ：番号 → 見出し → 本文（2〜3行）

### 4.7 Service-Overview（TOPのみ）
- 4 サービスカード（Gemini / Copilot / Training / Consulting）
- カード内：背景画像 or アイコン／H3／一行説明／「詳しくみる →」

### 4.8 Logo-Carousel（TOPのみ）
- `<loop-box>` Web Component を使用（実装：`cynthialy-runtime.js`）
- speed 属性で 1 周時間を指定（例：`speed="60"` → 60秒）

### 4.9 CTA-Block（資料請求 + 無料相談）
- 出現：全ページの最下段（footer 直前）共通
- 構成：英字ラベル「CONTACT」→ H2「資料請求・お問い合わせ」→ リード文 → 2 つの並列ブロック（資料請求 / 無料相談）
- 一次：**資料請求**（緑ベタボタン）／二次：**無料相談**（白抜きボタン）
- リンク先：cynthialy.co.jp の HubSpot フォーム埋め込み（外部遷移は最小限）

---

## 5. UI コンポーネント（細粒度）

### 5.1 ボタン

| 種別 | 背景 | 文字 | 用途 |
|---|---|---|---|
| Primary | `--color-deep-green` | `--color-white` | 一次CTA（資料請求） |
| Secondary | `--color-white` + `1px solid var(--color-deep-green)` | `--color-deep-green` | 二次CTA（無料相談） |
| Ghost | 透過 + 下線 | `--color-deep-green` | 補助リンク |
| Pill | 角丸 `--radius-pill` | – | カテゴリチップ等 |

矢印（`→`）は文字列で持つ（アイコンフォント不使用）。

### 5.2 数字バッジ
- 大型 `font-size: var(--font-size-4xl)` 〜 `var(--font-size-6xl)`、`font-family: var(--font-sans-en)`
- `01` `02` `03`...の二桁ゼロ埋め
- カラー：`--color-deep-green` か `--color-accent-gold`

### 5.3 英字セクションラベル
- 例：`POINT` `FLOW` `CONTACT` `CASE` `METHOD`
- スタイル：`font-family: var(--font-sans-en)`, `letter-spacing: var(--letter-spacing-wider)`, `font-size: var(--font-size-sm)` 〜 `var(--font-size-base)`, 色 `--color-deep-green` or `--color-accent-gold`
- 配置：H2 の真上、左寄せ、余白 16px

### 5.4 サービス／事例カード
- 角丸 `--radius-lg`（16px）、影 `--shadow-md`
- ホバー時：影を `--shadow-lg` に、`transform: translateY(-2px)`、`transition: var(--duration-base) var(--ease-out)`
- 内部余白 `--space-6` 〜 `--space-8`

### 5.5 装飾ライン・罫線
- 区切り罫線：`1px solid var(--color-neutral-30-border)`
- 強アクセント線：`--gradient-hero` を `height: 4px` で配置（セクション下部の装飾）
- 縦罫線（左ライン）：`--color-accent-gold` 2px

---

## 6. アニメーション・モーション

ランタイム実装はすべて `cto/mock/public/_astro/cynthialy-runtime.js`。

### 6.1 `.sd.appear` フェードイン
- IntersectionObserver で `is-appeared` クラスを付与 → CSS 側で opacity 0→1
- 閾値：`threshold: 0.05`、`rootMargin: 0px 0px -10% 0px`
- 一度発火したら `unobserve`（ちらつき防止）

**使い方**：見せたい要素に `class="sd appear"` を付ける（既存ミラーHTMLが既に付与している）。

### 6.2 `<loop-box>` 無限カルーセル（TOP のみ）
- カスタム要素 `<loop-box speed="60">…</loop-box>`
- 内部 `.loop-track` を `translateX(0 → -50%)` で linear infinite
- `.loop-sizer` は計測専用、`visibility:hidden`（触らない）

### 6.3 背景動画
- `<video loop autoplay muted playsinline>` を Hero 上方に配置
- ランタイムで再生キック（iOS 対策）。500ms 後に再キック

### 6.4 ホバー・トランジション
- ボタン：`transform`/`background-color` を `--duration-base` で
- カード：`box-shadow` + `translateY(-2px)`
- リンク：`text-decoration` フェード or 下線スライド

**禁止**：1秒以上の長尺アニメ、視差スクロール（重・モバイルで破綻）。

---

## 7. ページアーキタイプ

### 7.1 TOP（`/`）
- 役割：信頼形成・サービス全体像提示
- 推奨構成：Hero（動画背景 + ロゴカルーセル）→ 「4つの壁」（課題提起）→ 独自メソッド → サービス4種 → 事例 → セミナー/ホワイトペーパー → 強み3点 → 人材紹介 → CTA-Block
- 目安：14〜28 セクション

### 7.2 サービス一覧（`/services/`）
- 役割：4 サービスへの分岐ハブ
- 推奨構成：Hero（テキスト中心）→ 4つのフロー → 課題別提案 → 事例 → 「人材」「業務」変革領域 → CTA-Block
- 目安：10〜14 セクション

### 7.3 サービス詳細（`/services/{slug}/`）
- 役割：個別サービスの訴求・申込導線
- 推奨構成：Hero（テキスト + イラスト）→ 支持理由（3カード）→ 事例（共通枠）→ メソッド／特徴説明 → 導入の流れ（FLOW 4ステップ）→ CTA-Block
- 目安：8〜12 セクション
- 注意：**事例セクションは TOP/一覧と同じカードを再利用**（異物にしない）

### 7.4 事例詳細（`/case/{slug}/`）
- 役割：個別事例の物語化、横展開促進
- 推奨構成：Hero（企業ロゴ + 企業名 + 1行サマリ）→ 課題 → 取組 → 成果（数字バッジ） → 顧客コメント → 関連事例 → CTA-Block
- 実装：`src/pages/case/[slug].astro` 動的ルート（既存）

---

## 8. 実装ルール

### 8.1 既存実装方式（2系統並存）

| 方式 | 場所 | 用途 |
|---|---|---|
| **ミラーHTML注入** | `src/assets/*-body.html` を `set:html` で取り込み | TOP・サービス詳細など、Studio 既存ページの完全再現が必要な箇所 |
| **トークン版コンポーネント** | `src/components/*.astro` | （現時点では実質フォールバック扱い、新規利用は要相談） |

**今後の方針**：
- 既存 cynthialy.co.jp に存在するページは引き続き**ミラー方式**（スキル `cynthialy-page-mirror`）で取り込み
- 新規プロダクトページ（例：わざツグなど cynthialy.co.jp に無いもの）は、**Design.md に従ってコンポーネント方式で再実装**する方向に倒す
- 過去にコンポーネント方式で挫折した経緯があるため、**まず本 Design.md を整備 → 段階的にコンポーネント化** という順序を守る

### 8.2 デザイントークンの使い方

```astro
<!-- ❌ ハードコード禁止 -->
<style>
  .card { background: #0d2623; }
</style>

<!-- ✅ CSS 変数を使う -->
<style>
  .card { background: var(--color-deep-green); }
</style>
```

`tokens.css` は全ページの `<head>` から読み込まれている前提。ページ単位で再定義しない。

### 8.3 SEO・アクセシビリティ最低ライン

| 項目 | 必須要件 |
|---|---|
| `<title>` | 各ページ固有・80 字以内 |
| `<meta name="description">` | 各ページ固有・120 字以内 |
| `<link rel="canonical">` | 絶対 URL（`https://cynthialy.co.jp/...`） |
| `og:url` / `og:title` / `og:description` | 全部絶対 URL でセット |
| `<h1>` | 1 ページ 1 本（重複禁止） |
| `alt` 属性 | 意味画像は必ず記述、装飾画像は `aria-hidden="true"` |
| `meta robots` | **必ず `all`**（Studio が `noindex,nofollow` を出していたら根絶） |
| コントラスト | AA 以上（深緑 #0d2623 ベースは白文字でほぼ問題なし） |
| キーボード操作 | フォーカス可視・Tab 順序が論理的 |

### 8.4 アセット運用

- **既存ページの画像（Studio由来）**：`public/storage.googleapis.com/...` 配下に Studio CDN ローカルコピーを配置（既存 200+ファイル、再取得手間なので削除厳禁）
- **新規生成画像（AI生成）**：`public/img/{page-slug}/` 配下。`scripts/generate-images.mjs` で OpenAI gpt-image-1 から自動生成（§8.5 参照）
- 動画：`public/_astro/` 配下、mp4。将来は git-lfs 化検討
- フォント：Google Fonts（CDN）。Fontplus（Tsukushi Mincho 等）は契約必要なので使わない

### 8.5 AI 画像生成（gpt-image-1）

**いつ使う**：cynthialy.co.jp に存在しない新規ページの写真素材を、ブランドトーンで揃えて自動生成したいとき。

**仕組み**：
- 設定：`config/images.config.mjs` にページ別画像カタログを定義
- 実行：`npm run generate:images` で OpenAI API 呼び出し → `public/img/{page}/{name}.png` に保存
- 表示：Astro ページ側で `<img src="/img/{page}/{name}.png" onerror="this.remove()">` を `.photo` プレースホルダ内に配置（404 時はプレースホルダにフォールバック）

**コマンド**：
```bash
# 初回セットアップ
cp .env.example .env
# .env を編集して OPENAI_API_KEY=sk-... をセット

# 不足分のみ生成（既存はスキップ）
npm run generate:images

# 特定ページだけ
npm run generate:images -- --page wazatsugu

# 全部再生成（コスト注意）
npm run generate:images -- --force

# 計画だけ表示（API 呼ばない）
npm run generate:images -- --dry-run
```

**コスト目安**（gpt-image-1, 2026-04時点）：
- low: ~$0.011 / 枚
- medium: ~$0.042 / 枚（既定）
- high: ~$0.167 / 枚

**プロンプト作法**：
- 主題（誰が、何を、どこで）を英語で具体的に
- ブランドスタイル指示（neutral palette、photorealistic 等）は `defaultSuffix` に集約して全画像で揃える
- テキスト・ロゴは禁止（`no visible text or logos`）
- サイズは `1024x1024` `1024x1536` `1536x1024` のいずれか

**新ページ追加手順**：
1. `config/images.config.mjs` の `pages` に新エントリ追加
2. 各画像の `filename`, `prompt`, `size` を記述
3. `npm run generate:images -- --page <slug>` で生成
4. 該当 Astro ページに `<img src="/img/<slug>/<filename>" />` を `.photo` プレースホルダ内に配置

---

## 9. Do / Don't チェックリスト

### ✅ Do
- 値は必ず `var(--…)` で参照
- 新セクションは「英字ラベル → H2 → リード文 → 中身」の順で組む
- 事例セクション・CTA ブロックは全ページで再利用（独自に作らない）
- 動的アニメは `--duration-base 300ms` × `--ease-out` を既定に
- ボタンは Primary 1 個＋ Secondary 1 個までに絞る
- カード列数は PC 3 / Tablet 2 / Mobile 1 のレスポンシブを守る

### ❌ Don't
- 新しい色・新しいフォントを安易に追加（必ず Design.md と tokens.css を更新してから）
- ハードコードされた px・色（特に `#0d2623` をそのまま書くのは NG）
- 1 ページに 4 つ以上の CTA を出す（注意分散）
- ミラーHTML（`*-body.html`）を手で書き換える（スキル経由 or 慎重な置換のみ）
- `<div id="bg-movie">` をサブページに復活させる（右側突き抜けバグの原因）
- 1 ページに H1 を 2 つ書く（研修ページの旧仕様の名残・絶対真似しない）
- `meta robots="noindex,nofollow"` を残す（Studio が出していたら必ず `all` に）

---

## 10. 関連ファイル・参照

| パス | 種別 | 役割 |
|---|---|---|
| `cto/mock/docs/Design.md` | 本ドキュメント | デザインシステム憲章 |
| `cto/design-tokens/tokens.css` | コード | 値の正典（CSS変数） |
| `cto/design-tokens/tokens.json` | データ | 同・JSON 版（Figma 等同期用） |
| `cto/tech-stack.md` | ドキュメント | 技術選定・セットアップ |
| `cto/mock/CLAUDE.md` | ドキュメント | 実装時の作業ガードレール |
| `cto/mock/public/_astro/cynthialy-runtime.js` | コード | アニメ・カルーセル等のランタイム |
| `cto/mock/public/_nuxt/entry.C0E92ihM.css` | コード | Studio 由来 CSS バンドル |
| `cto/mock/src/assets/*-body.html` | データ | 各ページのミラー HTML |
| `cto/mock/src/pages/**/*.astro` | コード | ページエントリ |
| `shared/references/design-system-from-studio.md` | ドキュメント | Studio 抽出原資料（履歴） |
| `~/HuX/clients/シンシアリー/.claude/skills/cynthialy-page-mirror/` | スキル | 既存ページのミラー取込 |

---

## 11. 既知の未対応・将来課題

- **コンポーネント化**：現状はミラー HTML が中心。Design.md 確立後、Hero/Card/CTA など段階的に Astro コンポーネント化
- **わざツグ等の新規プロダクトページ**：cynthialy.co.jp に存在しないため、Design.md 準拠で**新規生成スキル**（仮称 `cynthialy-page-generator`）を作成予定
- **ダークモード**：未対応。深緑メインなのでダーク化しても破綻は少ないが要件出てから
- **多言語**：未対応。`<html lang="ja">` 固定
- **トークンの自動同期**：Figma → tokens.json の同期パイプラインは未整備
