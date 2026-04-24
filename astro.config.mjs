import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';

export default defineConfig({
  site: 'https://cynthialy.co.jp',
  integrations: [
    tailwind({
      // 既存のtokens.cssと競合しないようにbase reset は自前で管理
      applyBaseStyles: false,
    }),
    mdx(),
  ],
});
