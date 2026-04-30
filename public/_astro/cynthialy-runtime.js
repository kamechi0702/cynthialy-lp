/**
 * cynthialy-runtime.js
 * ---------------------------------------------------------------
 * ミラーHTMLを Astro に丸ごと取り込んだ後、Nuxt JS バンドルが
 * Nuxt ランタイムの欠如でエラー終了するため、必要最小限の
 * インタラクションだけをバニラJSで再実装するランタイムです。
 *
 * 実装済み:
 * - <loop-box>   ロゴ等の無限横スクロール Web Component
 * - video.autoplay mute 化＋手動 load()/play() キック
 * - .sd.appear   IntersectionObserver でフェードイン
 * - {{image*.value}} の残留プレースホルダ <img> を非表示化
 */

(function () {
  'use strict';

  /* ===================== <loop-box> ===================== */
  //
  // Studio SSR の <loop-box> は 2 系統の子を持つ:
  //   .loop-sizer  …計測用（visibility:hidden のまま保持する）
  //   .loop-track  …実際の可視トラック (position:absolute, data-fill-clone で
  //                 既に後半に複製が焼き込まれている)
  //
  // したがってここでは .loop-track にだけアニメーションを付与し、
  // .loop-sizer は触らない。複製も追加しない（SSR 済み）。
  class LoopBox extends HTMLElement {
    connectedCallback() {
      if (this._initialized) return;
      this._initialized = true;

      // ミラー SSR 済みのトラックを優先して使う
      let track = this.querySelector('.loop-track');

      // 万一 .loop-track が無い環境 (未 SSR / dev 書き換え) では
      // sizer をもとにトラックを自前で作る
      if (!track) {
        const sizer = this.querySelector('.loop-sizer');
        if (!sizer) return;
        track = document.createElement('div');
        track.className = 'loop-track';
        track.style.cssText =
          'position:absolute;left:0;top:0;height:100%;display:flex;flex-direction:row;gap:inherit;justify-content:flex-start;align-items:flex-start;min-width:100%;';
        // sizer の子を 2 倍複製してトラックへ
        Array.from(sizer.children).forEach((el) => {
          track.appendChild(el.cloneNode(true));
        });
        Array.from(sizer.children).forEach((el) => {
          const c = el.cloneNode(true);
          c.setAttribute('data-fill-clone', 'true');
          track.appendChild(c);
        });
        this.appendChild(track);
      }

      // sizer は measurement 用のまま隠しておく（触らない）
      const sizer = this.querySelector('.loop-sizer');
      if (sizer) sizer.style.visibility = 'hidden';

      // speed 属性: Studio では「60=60秒で1周」の意味で扱う
      const speed = Number(this.getAttribute('speed')) || 60;

      track.style.willChange = 'transform';
      track.style.animation = `cy-loopbox ${speed}s linear infinite`;

      if (!document.getElementById('cy-loopbox-kf')) {
        const style = document.createElement('style');
        style.id = 'cy-loopbox-kf';
        style.textContent = `@keyframes cy-loopbox {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }`;
        document.head.appendChild(style);
      }
    }
  }
  if (!customElements.get('loop-box')) {
    customElements.define('loop-box', LoopBox);
  }

  /* ===================== 背景動画 autoplay ===================== */
  function kickVideos() {
    document.querySelectorAll('video').forEach((v) => {
      try {
        v.muted = true;
        v.defaultMuted = true;
        v.playsInline = true;
        if (v.paused) {
          const p = v.play();
          if (p && p.catch) p.catch(() => {});
        }
      } catch (_) {}
    });
  }

  /* ===================== .sd.appear fade-in ===================== */
  function bootAppear() {
    if (!('IntersectionObserver' in window)) return;
    // ミラーの .sd.appear は CSS 側で opacity:0 → opacity:1 になる前提。
    // ミラーから CSS をそのまま使っているので、ここでは class 付与だけでよい。
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add('is-appeared');
            io.unobserve(en.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.05 },
    );
    document.querySelectorAll('.sd.appear').forEach((el) => io.observe(el));
  }

  /* ===================== 残留プレースホルダ非表示 ===================== */
  function hidePlaceholderImgs() {
    document.querySelectorAll('img').forEach((img) => {
      const s = img.getAttribute('src') || '';
      if (/\{\{[^}]+\}\}/.test(s)) {
        img.style.display = 'none';
        img.setAttribute('data-cy-hidden', '1');
      }
    });
  }

  /* ===================== Cynthialy ロゴ差し込み =====================
   * Studio の SSR が吐く 215x48 の空 SVG プレースホルダ（フッター・ヘッダー
   * のロゴ位置）を、テキストロゴ "Cynthialy" に置換する。
   * 本家サイトでは Nuxt hydration が動的に実 SVG を流し込むが、ローカルでは
   * Nuxt を起動しないためここで補完する。
   */
  function injectCynthialyLogos() {
    document.querySelectorAll('img').forEach((img) => {
      if (img.dataset.cyHidden) return;
      const s = img.getAttribute('src') || '';
      if (
        s.startsWith('data:image/svg+xml') &&
        /width=(?:'|%27)?215(?:'|%27)?/.test(s) &&
        /height=(?:'|%27)?48(?:'|%27)?/.test(s)
      ) {
        const span = document.createElement('span');
        span.textContent = 'Cynthialy';
        span.setAttribute('data-cy-logo', '1');
        span.style.cssText =
          'display:inline-block;font-family:"Lato","Inter",sans-serif;font-weight:700;font-size:28px;color:#e8de9f;letter-spacing:0.04em;line-height:1;';
        img.replaceWith(span);
      }
    });
  }

  /* ===================== boot ===================== */
  function boot() {
    hidePlaceholderImgs();
    injectCynthialyLogos();
    bootAppear();
    kickVideos();
    // 視認できるようになったらもう一度だけ動画を叩く（iOS 対策）
    setTimeout(kickVideos, 800);
  }

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    boot();
  } else {
    document.addEventListener('DOMContentLoaded', boot);
  }
})();
