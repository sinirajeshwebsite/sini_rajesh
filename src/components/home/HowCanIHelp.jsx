"use client";
import React, { useRef, useLayoutEffect, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

/* ---------- Face-safe image fit (<= 1024px and >= 1537px only) ----------
   1025px - 1536px keeps the original CSS transform untouched (the approved 1440 look).
   Everywhere else the CSS transform is used as the preferred position and is only
   nudged (move / zoom) when a face would touch the text, the card, the edge of the
   section, or sit under the white top/bottom fade. */
const KEEP_CSS_MIN = 1025;
const KEEP_CSS_MAX = 1536;
const IMG_NW = 3714; // natural size of how-can-i-help.webp
const IMG_NH = 2527;
// head boxes as fractions of the image: [left, top, right, bottom]
const FACES = [
  [0.397, 0.487, 0.466, 0.555], // woman on the sofa
  [0.571, 0.489, 0.608, 0.543], // woman in the armchair
];
// white fade height as a fraction of the section height
const FADE_SMALL = { top: 0.2, bottom: 0.12 };    // <= 1024px (reduced, not removed)
const FADE_DESKTOP = { top: 0.405, bottom: 0.235 }; // >= 1025px (original)
// clearance tiers: tried in order until a clear position is found
const FIT_TIERS = [
  { gap: 20, white: 0.12, edge: 12 },
  { gap: 12, white: 0.2, edge: 8 },
  { gap: 4, white: 0.35, edge: 4 },
  { gap: 0, white: 1, edge: 0 },
];

function helpRectIn(section, el) {
  let x = 0, y = 0, n = el;
  while (n && n !== section) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent;
  }
  return { x0: x, y0: y, x1: x + el.offsetWidth, y1: y + el.offsetHeight };
}

function helpReadCssTransform(el) {
  el.style.transform = "";
  const t = getComputedStyle(el).transform;
  let z = 1, tx = 0, ty = 0;
  const m = t && t !== "none" ? t.match(/matrix(3d)?\((.+)\)/) : null;
  if (m) {
    const n = m[2].split(",").map(parseFloat);
    if (m[1]) { z = n[0]; tx = n[12]; ty = n[13]; }
    else { z = n[0]; tx = n[4]; ty = n[5]; }
  }
  return { z, tx, ty };
}

function helpFadeAt(y, H, fade) {
  return Math.max(
    Math.max(0, 1 - y / (fade.top * H)),
    Math.max(0, 1 - (H - y) / (fade.bottom * H))
  );
}

function fitHelpImage(W, H, obstacles, pref, fade) {
  const s0 = Math.max(W / IMG_NW, H / IMG_NH);
  const cw0 = IMG_NW * s0, ch0 = IMG_NH * s0;

  const facesAt = (z, tx, ty) =>
    FACES.map(([u0, v0, u1, v1]) => ({
      x0: W / 2 + z * (u0 - 0.5) * cw0 + tx, x1: W / 2 + z * (u1 - 0.5) * cw0 + tx,
      y0: H / 2 + z * (v0 - 0.5) * ch0 + ty, y1: H / 2 + z * (v1 - 0.5) * ch0 + ty,
    }));

  const clear = (z, tx, ty, blocks, t) =>
    facesAt(z, tx, ty).every((f) => {
      if (f.x0 < t.edge || f.x1 > W - t.edge || f.y0 < t.edge || f.y1 > H - t.edge) return false;
      if (blocks.some((b) => f.x0 < b.x1 && f.x1 > b.x0 && f.y0 < b.y1 && f.y1 > b.y0)) return false;
      const w = Math.max(helpFadeAt(f.y0, H, fade), helpFadeAt((f.y0 + f.y1) / 2, H, fade), helpFadeAt(f.y1, H, fade));
      return w <= t.white;
    });

  for (const t of FIT_TIERS) {
    const blocks = obstacles.map((o) => ({
      x0: o.x0 - t.gap, y0: o.y0 - t.gap, x1: o.x1 + t.gap, y1: o.y1 + t.gap,
    }));
    // the approved CSS position is kept whenever it is already clear
    if (clear(pref.z, pref.tx, pref.ty, blocks, t)) return { ...pref, changed: false };

    let best = null, bestC = Infinity;
    for (let z = Math.max(1, pref.z * 0.6); z <= pref.z * 1.4; z += 0.02) {
      const mx = Math.max(0, (z * cw0 - W) / 2), my = Math.max(0, (z * ch0 - H) / 2);
      const xa = Math.max(-mx, pref.tx - 320), xb = Math.min(mx, pref.tx + 320);
      const ya = Math.max(-my, pref.ty - 320), yb = Math.min(my, pref.ty + 320);
      for (let tx = xa; tx <= xb; tx += 8) {
        for (let ty = ya; ty <= yb; ty += 8) {
          const c = Math.abs(tx - pref.tx) + Math.abs(ty - pref.ty) + (800 * Math.abs(z - pref.z)) / pref.z;
          if (c >= bestC) continue;
          if (clear(z, tx, ty, blocks, t)) { bestC = c; best = { z, tx, ty }; }
        }
      }
    }
    if (best) return { ...best, changed: true };
  }
  return { ...pref, changed: false };
}

function applyHelpImageFit(section, wrap, head, card) {
  const vw = window.innerWidth;
  if (vw >= KEEP_CSS_MIN && vw <= KEEP_CSS_MAX) { wrap.style.transform = ""; return; }
  const pref = helpReadCssTransform(wrap);
  const fade = vw >= KEEP_CSS_MIN ? FADE_DESKTOP : FADE_SMALL;
  const r = fitHelpImage(
    section.offsetWidth, section.offsetHeight,
    [helpRectIn(section, head), helpRectIn(section, card)],
    pref, fade
  );
  wrap.style.transform = r.changed
    ? `translate3d(${r.tx.toFixed(1)}px, ${r.ty.toFixed(1)}px, 0) scale(${r.z.toFixed(3)})`
    : "";
}

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

export default function HowCanIHelp() {
  const sectionRef = useRef(null);
  const imageRef = useRef(null);
  const headingRef = useRef(null);
  const cardRef = useRef(null);

  // Measure the real text + card, then nudge the photo only where a face would be covered
  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    const wrap = imageRef.current;
    const head = headingRef.current;
    const card = cardRef.current;
    if (!section || !wrap || !head || !card) return;

    const run = () => applyHelpImageFit(section, wrap, head, card);

    run();
    const ro = new ResizeObserver(() => requestAnimationFrame(run));
    [section, head, card].forEach((el) => ro.observe(el));
    window.addEventListener("resize", run);
    document.fonts?.ready.then(run);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", run);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="how-can-i-help-section"
      className="relative w-full flex justify-center overflow-hidden bg-[#FEFEFE] px-[clamp(16px,4vw,60px)] xl:px-[clamp(24px,6.94vw,100px)]"
      aria-labelledby="help-heading"
    >
      {/* Scoped Responsive Fluid Image Styles */}
      <style>{`
        .help-image-transform {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          transform-origin: center center;
          will-change: transform;
          /* Mobile (< 768px): Reference 425px -> x: -43px, y: -178px, zoom: 1.79 */
          transform: translate3d(
            clamp(-80px, calc(-43 * 100vw / 425), -30px),
            clamp(-280px, calc(-178 * 100vw / 425), -130px),
            0
          ) scale(1.79);
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .help-image-transform {
            /* Tablet (768px - 1024px): Reference 768px -> x: -7px, y: -209px, zoom: 1.82 */
            transform: translate3d(
              clamp(-15px, calc(-7 * 100vw / 768), 0px),
              clamp(-285px, calc(-209 * 100vw / 768), -195px),
              0
            ) scale(1.82);
          }
        }

        @media (min-width: 1025px) {
          .help-image-transform {
            /* Desktop (1025px+): Reference 1440px -> x: -403px, y: -132px, zoom: 1.99 */
            transform: translate3d(
              clamp(-550px, calc(-403 * 100vw / 1440), -280px),
              clamp(-185px, calc(-132 * 100vw / 1440), -90px),
              0
            ) scale(1.99);
          }
        }

        /* White fade: mobile / tablet / 1024px keep it, but shorter so faces stay clear.
           (top 20% / bottom 12% instead of 40.5% / 23.5%) */
        .help-gradient {
          background:
            linear-gradient(180deg, #FEFEFE 0%, rgba(193, 190, 179, 0) 20%),
            linear-gradient(360deg, #FEFEFE 0%, rgba(193, 190, 179, 0) 12%);
        }

        /* Desktop (>= 1025px): original fade, unchanged */
        @media (min-width: 1025px) {
          .help-gradient {
            background:
              linear-gradient(180deg, #FEFEFE 0%, rgba(193, 190, 179, 0) 40.5%),
              linear-gradient(360deg, #FEFEFE 0%, rgba(193, 190, 179, 0) 23.5%);
          }
        }
      `}</style>

      {/* Background Image Canvas with Fluid Responsive Layout */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none">
        <div ref={imageRef} className="help-image-transform select-none">
          <Image
            src="/images/how-can-i-help.webp"
            alt="How Can I Help Background"
            fill
            priority
            draggable={false}
            className="object-cover object-center pointer-events-none select-none"
          />
        </div>

        {/* White fade overlay (top + bottom) */}
        <div className="help-gradient absolute inset-0 pointer-events-none" />
      </div>

      <div
        id="help-container"
        className="relative z-10 flex flex-col items-center justify-between md:block w-full max-w-[1240px] min-h-[720px] sm:min-h-[780px] md:min-h-[860px] lg:min-h-[740px] pt-[clamp(30px,4vw,60px)] pb-[clamp(40px,4vw+10px,60px)] lg:pt-[50px] lg:pb-[60px] pointer-events-none"
      >
        {/* Content Container */}
        <div
          id="help-content-wrapper"
          className="relative z-10 w-full h-full flex flex-col justify-between md:block pointer-events-none"
        >
          {/* Heading Block */}
          <motion.div
            ref={headingRef}
            id="help-heading-block"
            initial={{ opacity: 0, y: 25 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative -top-6 sm:-top-8 md:absolute md:top-[-6px] lg:top-[-6px] md:left-0 lg:left-0 w-full max-w-[387px] flex flex-col gap-2.5 pointer-events-auto"
          >
            <div
              id="help-title-group"
              className="flex flex-col w-full max-w-[332px] gap-1.5"
            >
              {/* Badge */}
              <div id="help-badge" className="flex items-center gap-2.5 h-[13px]">
                <span
                  className="w-1.5 h-1.5 rounded-full bg-[#D07578] shrink-0"
                  aria-hidden="true"
                />
                <span className="font-serif font-bold italic text-[#D07578] text-[clamp(18px,16px+0.35vw,20px)] leading-none whitespace-nowrap">
                  How can I help?
                </span>
              </div>

              {/* Main Heading */}
              <h2
                id="help-heading"
                className="font-serif font-bold italic text-[#141414] text-[clamp(28px,20px+2.15vw,41.62px)] leading-[1.08] m-0 flex items-center whitespace-nowrap"
              >
                Igniting Mindz!
              </h2>
            </div>

            {/* Description Paragraph */}
            <p className="w-full max-w-[387px] font-sans font-normal text-[#141414]/75 lg:text-[#141414] text-[clamp(14px,13.2px+0.25vw,16px)] leading-[1.3] m-0">
              Igniting Mindz was born from a belief that has guided much of my
              life and work:{" "}
              <strong className="font-bold italic text-[#141414]">
                When you ignite a mind, you open the door to possibilities.
              </strong>
            </p>
          </motion.div>

          {/* Glassmorphism Card */}
          <motion.div
            ref={cardRef}
            id="help-glass-card"
            initial={{ opacity: 0, y: 35, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="group/card relative mt-[clamp(130px,18vw,180px)] md:mt-0 md:absolute md:top-[420px] md:right-0 lg:top-[285px] lg:right-[-25px] xl:right-[-50px] lg:left-auto w-full max-w-[518px] h-auto flex flex-col justify-between gap-4 sm:gap-5 rounded-[12px] p-4 sm:p-5 bg-[#D07578]/50 backdrop-blur-[25px] cursor-default select-text pointer-events-auto"
          >
            {/* Top Text in Glass Card */}
            <motion.div
              id="help-card-upper"
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex flex-col w-full max-w-[478px] gap-2"
            >
              <p className="w-full font-sans font-light text-white text-[clamp(13px,12.5px+0.2vw,15px)] leading-[1.38] m-0">
                It is the platform through which I bring together my work in
                personal transformation, mentoring, leadership development, HR,
                and Organisation Development. While the interventions may be
                different, the purpose remains the same:
              </p>

              <blockquote className="w-full font-sans font-semibold text-white text-[clamp(13px,12.5px+0.2vw,15px)] leading-[1.38] m-0 not-italic">
                “To inspire people, discover what is possible, build the confidence and capability to pursue it, and create transformation that makes a meaningful difference.”
              </blockquote>
            </motion.div>

            {/* Bullet Points in Glass Card */}
            <div id="help-pillars-list" className="flex flex-col w-full max-w-[478px] gap-2 sm:gap-2.5">
              {/* Item 1 */}
              <motion.div
                id="help-pillar-1"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.25 }}
                className="group/item flex items-center gap-2.5 w-full max-w-full lg:max-w-[273px] min-h-[22px] pb-2 sm:pb-2.5 border-b border-white/25 cursor-default transition-colors hover:bg-white/5 rounded px-1.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 transition-transform duration-300 group-hover/item:scale-125 group-hover/item:shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                <div className="font-sans font-normal text-white text-[clamp(13px,12.5px+0.2vw,14px)] md:text-[15px] lg:text-[14px] leading-tight lg:whitespace-nowrap select-text">
                  When individuals grow, leaders evolve
                </div>
              </motion.div>

              {/* Item 2 */}
              <motion.div
                id="help-pillar-2"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="group/item flex items-center gap-2.5 w-full max-w-full lg:max-w-[326px] min-h-[22px] pb-2 sm:pb-2.5 border-b border-white/25 cursor-default transition-colors hover:bg-white/5 rounded px-1.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 transition-transform duration-300 group-hover/item:scale-125 group-hover/item:shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                <div className="font-sans font-normal text-white text-[clamp(13px,12.5px+0.2vw,14px)] md:text-[15px] lg:text-[14px] leading-tight lg:whitespace-nowrap select-text">
                  When leaders evolve, organisations transform
                </div>
              </motion.div>

              {/* Item 3 */}
              <motion.div
                id="help-pillar-3"
                initial={{ opacity: 0, x: -15 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.45 }}
                className="group/item flex items-start gap-2.5 w-full max-w-[478px] min-h-[22px] pb-2 sm:pb-2.5 border-b border-white/25 cursor-default transition-colors hover:bg-white/5 rounded px-1.5"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-white shrink-0 mt-1 transition-transform duration-300 group-hover/item:scale-125 group-hover/item:shadow-[0_0_4px_rgba(255,255,255,0.8)]" />
                <div className="font-sans font-normal text-white text-[clamp(13px,12.5px+0.2vw,14px)] md:text-[15px] lg:text-[14px] leading-[135%] select-text">
                  And when organisations transform, their impact can extend far
                  beyond the workplace
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

    </section>
  );
}