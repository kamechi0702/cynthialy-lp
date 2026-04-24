# cynthialy-lp

シンシアリー株式会社 コーポレート／LP サイトを Astro + Tailwind で構築したリポジトリ。

本番 [cynthialy.co.jp](https://cynthialy.co.jp/) を基準に、TOP ページと事例記事
（`/case/[slug]/`）を **ミラー準拠のテンプレート** で再現しつつ、新規記事を
Markdown（MDX）で量産できる CMS 構造を備えています。

## セットアップ

```bash
# 1. 依存インストール
npm install

# 2. 開発サーバ (http://localhost:4321)
npm run dev

# 3. 静的ビルド (dist/)
npm run build

# 4. ビルド成果物のプレビュー
npm run preview
```

要件: Node.js 20 以上。

## 構成

```
src/
├─ assets/
│   ├─ mirror-body.html             # TOP: Nuxt SSR の <body> を丸ごと注入
│   ├─ mirror-head-styles.html      # TOP: head クリティカル <style>
│   ├─ case-template-body.html      # 事例: ミラー準拠テンプレート（トークン差込式）
│   └─ case-template-head-styles.html
├─ components/                      # トークン版コンポーネント（フォールバック/開発用）
│   ├─ HeroSection.astro / MethodSection.astro / ServicesSection.astro
│   ├─ WorksSection.astro / SeminarSection.astro / ContactMidSection.astro
│   ├─ PointSection.astro / ConsultantSection.astro / ReportsSection.astro
│   ├─ CTABlock.astro / StickyCTA.astro / Header.astro / Footer.astro
│   └─ case/CaseHero.astro / CaseToc.astro / CaseRelated.astro / CaseServiceLinks.astro
├─ content/
│   ├─ config.ts                    # works コレクションの Zod スキーマ
│   └─ works/
│       ├─ X8Q6V52T.mdx             # タマディック事例 (mirrorTemplate: "case")
│       └─ vEzexR_H.mdx             # リケンテクノス事例 (MDX レイアウト)
├─ layouts/
│   ├─ BaseLayout.astro             # head / OGP / JSON-LD を集約
│   └─ CaseLayout.astro             # MDX 事例用レイアウト
├─ pages/
│   ├─ index.astro                  # /  (TOP: ミラー HTML 完全注入)
│   └─ case/[slug].astro            # /case/{slug}/ (MDX or mirror テンプレート)
└─ styles/
    ├─ tokens.css                   # デザイントークン (CSS 変数)
    └─ global.css                   # @tailwind + ユーティリティ

public/
├─ _astro/cynthialy-runtime.js      # <loop-box> / video / appear の自前ランタイム
├─ _nuxt/                           # Studio/Nuxt ビルドの CSS + JS バンドル
├─ storage.googleapis.com/          # Studio CDN の画像・背景動画（ローカル配信）
└─ studio-front/                    # Studio フォント
```

## CMS 運用（事例記事の追加）

新しい事例は `src/content/works/{slug}.mdx` に frontmatter + MDX 本文で追加します。

```yaml
---
slug: "ABCD1234"                    # 8 桁英数。/case/ABCD1234/ になる
title: "インタビュータイトル"
company: "○○株式会社"
interviewee: "○○ △△"
seriesLabel: "Future of AI"
seriesNumber: "04"
category: "Copilot"
publishedAt: 2026-05-20
tags: ["Copilot"]
heroImage: "https://storage.googleapis.com/..."   # 省略可
summary: "一行サマリー"
backgroundLabel: "導入前の課題"
effectLabel: "導入後の成果"
before: ["課題1", "課題2", "課題3"]
after:  ["成果1", "成果2", "成果3"]
toc:
  - "H2 見出し 1"
  - "H2 見出し 2"
  - "H2 見出し 3"
related: []
# mirrorTemplate: "case"   # 指定すると本番準拠テンプレートで描画
---

## H2 見出し 1
本文（MDX）。`<figure class="case-figure">` や `<strong>` などそのまま書けます。
```

`mirrorTemplate: "case"` を付けると `src/assets/case-template-body.html` が
トークン差込のテンプレートに使われ、frontmatter からピクセル一致でレンダリング。
未指定なら `src/layouts/CaseLayout.astro` + MDX でレンダリングされます。

## デザインシステム

- ブランド色: deep-green `#0d2623` × accent-gold `#e8de9f`
- 英文フォント: Lato / Poppins / Inter（Google Fonts）
- 和文フォント: 秀英角ゴシック銀 (TypeSquare) → Noto Sans JP にフォールバック
- ブレークポイント: mini 320 / mobile 540 / tablet 840 / small 1140 / base 1280

## デプロイ

静的ホスティングならどこでも可（Vercel / Netlify / Cloudflare Pages /
S3+CloudFront / GitHub Pages 等）。`npm run build` で `dist/` に完成版が出力されます。

Vercel の例:
```bash
npx vercel
```

Cloudflare Pages の例: Framework preset `Astro` / Build command `npm run build`
/ Output directory `dist`。

> 背景動画 (`public/storage.googleapis.com/.../s-1920x1080_*.mp4`) があるため、
> 静的サーバは **HTTP Range リクエスト対応** が必要です。
> Vercel / Netlify / Cloudflare Pages はすべて対応済み。

## SEO / CVR

- ページごとに title / description / canonical / OGP / JSON-LD を完全指定
- `noindex: true` (frontmatter) で下書き段階のみ検索エンジン拒否に切替可
- 一次/二次 CTA（資料請求 / 無料相談）をページ末 + モバイル追従の両方に配置

## 謝辞

本家 [cynthialy.co.jp](https://cynthialy.co.jp/) は [Studio](https://studio.design/) で制作されています。
本リポジトリはその Nuxt SSR 出力を再利用し、Astro 環境で配信・拡張できる形に
再構築したものです。Studio 側で新規ページを追加した際は、
`mirror/mirror.js` などの取得スクリプトで再ミラーリングし、
`src/assets/*.html` と `public/storage.googleapis.com/` を更新してください。

## ライセンス

コンテンツ（テキスト・画像・動画）は シンシアリー株式会社 の著作物です。
コード部分は社内利用を想定したプロプライエタリ扱いです。
