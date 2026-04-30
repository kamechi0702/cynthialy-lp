#!/usr/bin/env node
/**
 * cynthialy LP — 画像一括生成スクリプト
 * ----------------------------------------------------------------
 * OpenAI gpt-image-1 API を呼び出して config/images.config.mjs に
 * 定義された画像を public/img/{page}/ 配下に生成する。
 *
 * 必要：
 *   - OPENAI_API_KEY 環境変数（または .env ファイル）
 *   - Node.js 20 以上（fetch / 自動 .env 読み込みのため）
 *
 * 使い方：
 *   npm run generate:images                          # 既存はスキップして不足分のみ生成
 *   npm run generate:images -- --force               # すべて再生成
 *   npm run generate:images -- --page wazatsugu      # 特定ページだけ
 *   npm run generate:images -- --dry-run             # API 呼ばず計画だけ表示
 *   npm run generate:images -- --quality high        # 品質オーバーライド
 *
 * コスト目安（gpt-image-1, 2026-04 時点）：
 *   low    ~$0.011 / 枚
 *   medium ~$0.042 / 枚
 *   high   ~$0.167 / 枚
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { IMAGE_CATALOG } from "../config/images.config.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

// ----- .env 簡易読み込み（dotenv パッケージ不要） -----
async function loadDotenv() {
  const envPath = path.join(projectRoot, ".env");
  try {
    const content = await fs.readFile(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eq = trimmed.indexOf("=");
      if (eq < 0) continue;
      const key = trimmed.slice(0, eq).trim();
      let value = trimmed.slice(eq + 1).trim();
      // 引用符除去
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!process.env[key]) process.env[key] = value;
    }
  } catch (err) {
    if (err.code !== "ENOENT") throw err;
    // .env 無くても OK（環境変数で渡す運用も想定）
  }
}

// ----- CLI 引数 -----
const args = process.argv.slice(2);
function flag(name) {
  return args.includes(name);
}
function arg(name) {
  const i = args.indexOf(name);
  return i >= 0 && i + 1 < args.length ? args[i + 1] : null;
}

const isForce = flag("--force");
const isDryRun = flag("--dry-run");
const pageFilter = arg("--page");
const qualityOverride = arg("--quality");
const showHelp = flag("--help") || flag("-h");

if (showHelp) {
  console.log(`
cynthialy LP image generator

Usage:
  node scripts/generate-images.mjs [options]

Options:
  --page <slug>      Generate only the specified page (e.g., wazatsugu)
  --force            Re-generate even if file exists
  --dry-run          Print plan without calling API
  --quality <level>  Override quality: low | medium | high | auto
  --help, -h         Show this message

Env:
  OPENAI_API_KEY     Required (also reads .env at project root)
`);
  process.exit(0);
}

// ----- API 呼び出し -----
const COST_PER_IMAGE = {
  low: 0.011,
  medium: 0.042,
  high: 0.167,
  auto: 0.042,
};

async function generateImage({ apiKey, model, prompt, size, quality }) {
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      prompt,
      size,
      quality,
      n: 1,
    }),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`OpenAI API ${res.status}: ${errText.slice(0, 400)}`);
  }

  const json = await res.json();
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) {
    throw new Error(`No image data in response: ${JSON.stringify(json).slice(0, 200)}`);
  }
  return Buffer.from(b64, "base64");
}

// ----- メイン -----
async function main() {
  await loadDotenv();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey && !isDryRun) {
    console.error("\n[ERROR] OPENAI_API_KEY is not set.");
    console.error("Options:");
    console.error("  1) Set env var:  export OPENAI_API_KEY=sk-...");
    console.error("  2) Use .env:     cp .env.example .env && edit .env");
    console.error("Get a key:        https://platform.openai.com/api-keys\n");
    process.exit(1);
  }

  const model = IMAGE_CATALOG.defaultModel;
  const quality = qualityOverride || IMAGE_CATALOG.defaultQuality || "medium";
  const styleSuffix = IMAGE_CATALOG.defaultSuffix || "";

  console.log(`\n========================================================`);
  console.log(`cynthialy LP — image generator`);
  console.log(`========================================================`);
  console.log(`model:    ${model}`);
  console.log(`quality:  ${quality}`);
  console.log(`mode:     ${isDryRun ? "DRY RUN" : "LIVE"}`);
  console.log(`page:     ${pageFilter || "(all)"}`);
  console.log(`force:    ${isForce ? "yes" : "no"}`);

  let totalGenerated = 0;
  let totalSkipped = 0;
  let totalErrors = 0;
  let estCost = 0;

  for (const [pageSlug, page] of Object.entries(IMAGE_CATALOG.pages)) {
    if (pageFilter && pageFilter !== pageSlug) continue;

    console.log(`\n--- page: ${pageSlug} ---`);
    const baseDir = path.join(projectRoot, page.basePath);
    if (!isDryRun) await fs.mkdir(baseDir, { recursive: true });

    for (const img of page.images) {
      const outputPath = path.join(baseDir, img.filename);
      const relPath = path.relative(projectRoot, outputPath);

      let exists = false;
      try {
        await fs.access(outputPath);
        exists = true;
      } catch {}

      if (exists && !isForce) {
        console.log(`  [skip]  ${relPath}`);
        totalSkipped++;
        continue;
      }

      const fullPrompt = (img.prompt + styleSuffix).slice(0, 4000);

      console.log(`  [gen]   ${relPath}  (${img.size})`);
      if (isDryRun) {
        console.log(`          prompt: ${fullPrompt.slice(0, 150)}...`);
        estCost += COST_PER_IMAGE[quality] || 0;
        continue;
      }

      const t0 = Date.now();
      try {
        const buf = await generateImage({
          apiKey,
          model,
          prompt: fullPrompt,
          size: img.size,
          quality,
        });
        await fs.writeFile(outputPath, buf);
        const ms = Date.now() - t0;
        console.log(
          `          OK saved ${(buf.length / 1024).toFixed(0)}KB in ${(ms / 1000).toFixed(1)}s`,
        );
        totalGenerated++;
        estCost += COST_PER_IMAGE[quality] || 0;
      } catch (err) {
        console.error(`          FAIL ${err.message}`);
        totalErrors++;
      }
    }
  }

  console.log(`\n========================================================`);
  console.log(`summary`);
  console.log(`========================================================`);
  console.log(`generated:  ${totalGenerated}`);
  console.log(`skipped:    ${totalSkipped}`);
  console.log(`errors:     ${totalErrors}`);
  console.log(`est. cost:  $${estCost.toFixed(2)} USD`);
  console.log(``);

  if (totalErrors > 0) process.exit(2);
}

main().catch((err) => {
  console.error(`\n[FATAL] ${err.stack || err.message}`);
  process.exit(1);
});
