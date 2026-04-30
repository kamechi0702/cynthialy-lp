/**
 * Content Collections スキーマ
 * ---------------------------------------------------------------
 * /case/[slug] 配下の事例記事は `works` コレクション（MDX）で量産する。
 * - メタ情報は frontmatter に集中させて編集者が触りやすくする
 * - before / after の導入前後対比を構造化して「定型ブロック」で見せる
 * - 本文の H2 / 画像 / パラグラフは通常の MDX 記法でそのまま書ける
 *
 * 参考：本家 Studio の URL 形（/case/{public_id}）に合わせて slug は 8 文字英数。
 */
import { defineCollection, z } from "astro:content";

const works = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    company: z.string(),
    // 本家カードの "Future of AI Interview #03" 相当のシリーズ表記
    seriesLabel: z.string().optional(),
    seriesNumber: z.string().optional(),
    // インタビュイー氏名（カード下段に表示）
    interviewee: z.string().optional(),
    category: z.string().default("インタビュー"),
    publishedAt: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    heroImage: z.string().url().optional(),
    heroImageAlt: z.string().optional(),
    summary: z.string(),
    // TOPカードで表示する一行コピー（背景/効果）
    backgroundLabel: z.string().optional(),
    effectLabel: z.string().optional(),
    // 導入前 / 導入後 の対比ブロック（任意・記事ページ用）
    before: z.array(z.string()).optional(),
    after: z.array(z.string()).optional(),
    // 目次に表示するセクション一覧（MDX の H2 と揃える）
    toc: z.array(z.string()).default([]),
    // 関連事例 slug（2件まで推奨）
    related: z.array(z.string()).default([]),
    // SEO
    ogImage: z.string().url().optional(),
    noindex: z.boolean().default(false),
  }),
});

export const collections = { works };
