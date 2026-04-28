# Astro mock — Claude 向け作業指示

このディレクトリは cynthialy.co.jp を Astro で再構築した本体。

**最初に必ず読む順序**：
1. `../HANDOFF.md` — 進行状況・引き継ぎ
2. `../Design.md` — デザインシステム憲章（色・タイポ・セクション・コンポーネント・Do/Don't）
3. 本ファイル — 実装上のガードレール

## 重要なルール

### ❌ やってはいけないこと

1. **`src/components/` 配下を新規にいじって TOP やサービスページを作り直そうとしない**
   - 過去にそれをやって挫折し、ミラー HTML 注入方式に切り替えた経緯がある
   - 既存の `*.astro` コンポーネント群はトークン版実装のフォールバックとして残置されている

2. **`public/storage.googleapis.com/` 配下のファイルを手動で消さない**
   - 約 200 ファイル（37MB）の Studio CDN ローカルコピー。再取得が手間

3. **`src/assets/*-body.html` を手書きで編集しない**
   - スキル `cynthialy-page-mirror` で自動生成される。手で書き換えるとビルド時に上書きで消える可能性

4. **`<div id="bg-movie">` をサブページに復活させない**
   - 右側に背景動画が突き抜けるバグの原因。`process_html.py` で自動削除している

### ✅ やってよいこと

1. **既存ページのミラー追加** → スキル `cynthialy-page-mirror` の `run_all.sh` を使う（cynthialy.co.jp に存在するページのみ）
2. **新規プロダクトページ作成**（cynthialy.co.jp に存在しないもの、例：わざツグ）→ `../Design.md` のセクションアーキタイプ／コンポーネント仕様に従ってコンポーネント方式で実装
3. **CMS 編集**（事例記事の文言変更）→ `src/content/works/{slug}.mdx` の frontmatter or 本文を編集
4. **ランタイム拡張** → `public/_astro/cynthialy-runtime.js` に追記（新しい `<scroll-box>` 等の web component が増えた場合）

## デザインシステム

`../Design.md` が正典。色・タイポグラフィ・セクションアーキタイプ・コンポーネント仕様・Do/Don't はすべてそこに集約。

トークン値は `cto/design-tokens/tokens.css` に CSS 変数として定義済み。**ハードコード禁止**、必ず `var(--…)` 参照で書く。

## ビルドが落ちたら

```bash
# rollup native binary 問題
rm -rf node_modules package-lock.json && npm install

# MDX バージョン不整合
npm install astro@4.16.18 @astrojs/mdx@3.1.9 @astrojs/tailwind@5.1.5 tailwindcss@3.4.17
```

## デプロイ

```bash
git push origin main      # GitHub Actions が自動で vercel build & deploy（約50秒）
# 手動デプロイ（緊急時）
vercel --prod
```

GitHub Actions の workflow は `.github/workflows/deploy.yml`。
Secrets（`VERCEL_TOKEN` / `VERCEL_ORG_ID` / `VERCEL_PROJECT_ID`）は登録済み。
本番URL（安定エイリアス）：<https://mock-rho-two.vercel.app/>

詳細は `../HANDOFF.md`。
