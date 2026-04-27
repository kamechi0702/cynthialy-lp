# Astro mock — Claude 向け作業指示

このディレクトリは cynthialy.co.jp を Astro で再構築した本体。

最初に必ず `../HANDOFF.md` を読むこと。

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

1. 新ページ追加 → スキル `cynthialy-page-mirror` の `run_all.sh` を使う
2. CMS 編集（事例記事の文言変更）→ `src/content/works/{slug}.mdx` の frontmatter or 本文を編集
3. ランタイム拡張 → `public/_astro/cynthialy-runtime.js` に追記（新しい `<scroll-box>` 等の web component が増えた場合）

## ビルドが落ちたら

```bash
# rollup native binary 問題
rm -rf node_modules package-lock.json && npm install

# MDX バージョン不整合
npm install astro@4.16.18 @astrojs/mdx@3.1.9 @astrojs/tailwind@5.1.5 tailwindcss@3.4.17
```

## デプロイ

```bash
git push origin main      # Vercel-GitHub 連携が動いてれば自動
# または
vercel --prod             # 手動
```

詳細は `../HANDOFF.md`。
