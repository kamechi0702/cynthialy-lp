/**
 * cynthialy LP — 画像生成カタログ
 * ----------------------------------------------------------------
 * scripts/generate-images.mjs から読み込まれる、ページ別の画像定義。
 *
 * 構造：
 *   pages.{slug}.basePath  … 出力先ディレクトリ（プロジェクトルート相対）
 *   pages.{slug}.images[]  … その配下の画像定義
 *     filename             … 出力ファイル名（拡張子は .png）
 *     prompt               … 主題の説明（英語推奨、defaultSuffix が末尾に付く）
 *     size                 … OpenAI gpt-image-1 がサポートするサイズ
 *     promptOverride?      … defaultSuffix を上書きしたい場合だけ使う
 *
 * 新ページを追加するときは、pages に新エントリを追加するだけ。
 * 例:
 *   top: {
 *     basePath: "public/img/top",
 *     images: [
 *       { filename: "hero.png", size: "1536x1024", prompt: "..." },
 *     ],
 *   },
 */

export const IMAGE_CATALOG = {
  // ----- グローバル設定 -----
  defaultModel: "gpt-image-1",
  defaultQuality: "medium", // "low" | "medium" | "high" | "auto"

  // 全プロンプトの末尾に追加されるブランドスタイル指示。
  // ここを変えると LP 全体のトーンが揃う。
  defaultSuffix: [
    " — neutral and muted color palette compatible with deep green (#0d2623) and gold (#e8de9f) corporate brand",
    "no visible text or logos",
    "photorealistic style, not illustration",
    "shallow depth of field",
    "professional documentary corporate photography",
    "soft natural lighting",
  ].join(", "),

  // OpenAI gpt-image-1 がサポートするサイズ
  //   "1024x1024"  正方形 (1:1)
  //   "1024x1536"  縦長   (2:3)
  //   "1536x1024"  横長   (3:2)
  //   "auto"       任意

  // ----- ページ別画像定義 -----
  pages: {
    wazatsugu: {
      basePath: "public/img/wazatsugu",
      images: [
        {
          filename: "hero-backdrop.png",
          size: "1536x1024",
          prompt:
            "Documentary photograph of a senior Japanese factory technician in his 60s being interviewed in a bright industrial workshop, wearing a clean work uniform, calm dignified atmosphere",
        },
        {
          filename: "approach-session.png",
          size: "1536x1024",
          prompt:
            "Young Japanese employee and senior expert sitting together at a laptop in a bright modern conference room, collaborative engaged conversation, paper notes around them",
        },
        {
          filename: "usecase-factory.png",
          size: "1536x1024",
          prompt:
            "Japanese manufacturing quality inspection line, two workers in clean uniforms examining a precision metal part with calipers, focused QC task, modern factory lighting",
        },
        {
          filename: "usecase-office.png",
          size: "1536x1024",
          prompt:
            "Japanese DX consulting team in a bright modern meeting room, writing business process flow on a whiteboard with colorful sticky notes, collaborative atmosphere",
        },
      ],
    },

    // 例：将来 TOP ページの画像を追加する場合
    // top: {
    //   basePath: "public/img/top",
    //   images: [
    //     {
    //       filename: "hero-bg.png",
    //       size: "1536x1024",
    //       prompt: "Wide angle photograph of a modern Japanese corporate office...",
    //     },
    //   ],
    // },
  },
};
