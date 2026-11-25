"use client";

import React, { useState, useRef, useLayoutEffect, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui";

/* ---------- DESKTOP-ONLY face-safe fit (>= 1025px) ----------
   Mobile / tablet / 1024px keep the original CSS + controls untouched.
   FACE = hair-top to chin, left to right, as fractions of the image.
   Change IMG_W / IMG_H / FACE only if new-chapter.webp has a different size or crop. */
const DESKTOP_MIN = 1025;
const IMG_W = 1536; // real pixel size of new-chapter.webp (was 1280 -> caused stretching)
const IMG_H = 864;
const FACE = { x0: 0.31, x1: 0.435, y0: 0.18, y1: 0.46 }; // tight hair-top to chin box
const EDGE = 12; // min distance (px) between face and the section edges
const MAX_ZOOM = 3;
// [gap to text, gap to card] in px, tried in order. The text gap never shrinks below 24px,
// only the card gap relaxes, so the heading/paragraph can never land on the face.
const TIERS = [[32, 24], [24, 12], [24, 0], [24, -30], [24, -80], [24, -9999]];

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function rectIn(section, el) {
  let x = 0, y = 0, n = el;
  while (n && n !== section) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent;
  }
  return { x0: x, y0: y, x1: x + el.offsetWidth, y1: y + el.offsetHeight };
}

const hit = (a, b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0;

function fitImage(W, H, obstacles) {
  const cover = Math.max(W / IMG_W, H / IMG_H);

  for (const gaps of TIERS) {
    const blocks = obstacles.map((o, i) => ({
      x0: o.x0 - gaps[i], y0: o.y0 - gaps[i], x1: o.x1 + gaps[i], y1: o.y1 + gaps[i],
    }));

    for (let z = 1; z <= MAX_ZOOM; z += 0.05) {
      const s = cover * z, w = IMG_W * s, h = IMG_H * s;
      const cL = (W - w) / 2, cT = (H - h) / 2;
      let best = null, bestD = Infinity;
      for (let L = 0; L >= W - w - 0.5; L -= 8) {
        for (let T = 0; T >= H - h - 0.5; T -= 8) {
          const f = {
            x0: L + FACE.x0 * w, x1: L + FACE.x1 * w,
            y0: T + FACE.y0 * h, y1: T + FACE.y1 * h,
          };
          if (f.x0 < EDGE || f.x1 > W - EDGE || f.y0 < EDGE || f.y1 > H - EDGE) continue;
          if (blocks.some((b) => hit(f, b))) continue;
          const d = Math.abs(L - cL) + Math.abs(T - cT);
          if (d < bestD) { bestD = d; best = { L, T, w, h }; }
        }
      }
      if (best) return best;
    }
  }
  const w = IMG_W * cover, h = IMG_H * cover;
  return { L: (W - w) / 2, T: (H - h) / 2, w, h };
}

export default function NewChapter() {
  const [isDesktop, setIsDesktop] = useState(false);
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const cardRef = useRef(null);
  const [pos, setPos] = useState(null);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= DESKTOP_MIN);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Desktop: measure section + text + card, then place the image so the face is clear
  useIsoLayoutEffect(() => {
    if (!isDesktop) return;
    const section = sectionRef.current;
    const intro = introRef.current;
    const card = cardRef.current;
    if (!section || !intro || !card) return;

    const run = () =>
      setPos(
        fitImage(section.offsetWidth, section.offsetHeight, [
          rectIn(section, intro),
          rectIn(section, card),
        ])
      );

    run();
    const ro = new ResizeObserver(() => requestAnimationFrame(run));
    [section, intro, card].forEach((el) => ro.observe(el));
    document.fonts?.ready.then(run);
    return () => ro.disconnect();
  }, [isDesktop]);

  return (
    <section
      ref={sectionRef}
      id="new-chapter-section"
      aria-label="A New Chapter"
      className="relative w-full h-[clamp(888px,calc(1381px-64.14vw),1108px)] md:h-[clamp(800px,calc(988.6px-13.1vw),888px)] lg:h-[800px] overflow-hidden bg-[#FEFEFE]"
    >
      {/* Scoped Responsive Styles with Final Approved Values (mobile / tablet / 1024px) */}
      <style>{`
        /* Mobile (< 768px): object-position: 38.5% 50%, zoom: 1 */
        .new-chapter-bg-image {
          object-position: 38.5% 50%;
          transform: scale(1);
          transform-origin: 38.5% 50%;
        }

        /* Tablet (768px - 1023px): object-position: 38% 2%, zoom: 1.15 */
        @media (min-width: 768px) and (max-width: 1023px) {
          .new-chapter-bg-image {
            object-position: 38% 2%;
            transform: scale(1.15);
            transform-origin: 38% 2%;
          }
        }

        /* 1024px (iPad Pro): object-position: 0% 50%, zoom: 1 */
        @media (min-width: 1024px) and (max-width: 1024px) {
          .new-chapter-bg-image {
            object-position: 0% 50%;
            transform: scale(1);
            transform-origin: 0% 50%;
          }
        }

        /* Desktop (>= 1025px) is positioned by the face-safe fit in JS */
      `}</style>

      {/* Edge-to-Edge Full-Bleed Background Image matching Footer */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none">
        <div className="w-full h-full absolute inset-0 select-none overflow-hidden">
          {isDesktop ? (
            <Image
              src="/images/new-chapter.webp"
              alt="A New Chapter - Igniting Mindz"
              width={IMG_W}
              height={IMG_H}
              priority
              draggable={false}
              sizes="(max-width: 1440px) 160vw, 2300px"
              className="pointer-events-none select-none"
              style={
                pos
                  ? { position: "absolute", maxWidth: "none", left: pos.L, top: pos.T, width: pos.w, height: pos.h }
                  : { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 30%" }
              }
            />
          ) : (
            <Image
              src="/images/new-chapter.webp"
              alt="A New Chapter - Igniting Mindz"
              fill
              priority
              draggable={false}
              className="new-chapter-bg-image object-cover w-full h-full pointer-events-none select-none"
              sizes="100vw"
            />
          )}
        </div>

        {/* Linear Gradient Overlay: spans 100% edge-to-edge */}
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none z-[1] bg-[linear-gradient(180deg,#FEFEFE_0%,rgba(254,254,254,0)_12%),linear-gradient(360deg,#FEFEFE_0%,rgba(193,190,179,0)_20%)]"
        />
      </div>

      {/* Content Container: Centered up to 1440px */}
      <div
        id="new-chapter-banner"
        className="relative w-full max-w-[1440px] h-full mx-auto pointer-events-none"
      >
        <motion.div
          ref={introRef}
          id="new-chapter-intro"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto absolute z-[5] flex flex-col gap-[clamp(14px,1.8vw+8px,28px)] top-[clamp(32px,6vw,50px)] left-[clamp(20px,4.7vw,50px)] right-[clamp(20px,4.7vw,50px)] w-auto max-w-none lg:top-[75px] lg:left-[80px] lg:right-auto lg:w-[501px] lg:max-w-[501px]"
        >
          <header className="w-full flex flex-col gap-[clamp(10px,1vw+6px,14px)]">
            <Badge
              text="New Chapter"
              id="badge-new-chapter"
              className="w-fit"
            />

            <h2 className="font-serif font-bold italic text-[#141414] text-[clamp(28px,17.7px+2.42vw,41.62px)] leading-tight md:leading-[45px] tracking-normal m-0 w-full max-w-none lg:max-w-[501px]">
              When Success Began to Mean Something More
            </h2>
          </header>

          <p className="font-sans font-normal text-[#141414]/75 text-[clamp(14px,13.1px+0.2vw,16px)] leading-[140%] m-0 w-full max-w-none lg:max-w-[360px]">
            My corporate journey has given me opportunities to learn, lead, grow and work with some wonderful people. I am grateful for the experiences and responsibilities that had shaped me along the way.
          </p>
        </motion.div>

        <motion.div
          ref={cardRef}
          id="new-chapter-reflection-card"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="pointer-events-auto absolute z-[5] rounded-[clamp(12px,0.5vw+10px,16px)] overflow-hidden bg-[#D07578]/80 backdrop-blur-[25px] border border-white/20 p-[clamp(16px,1.2vw+11px,20px)] flex flex-col gap-[clamp(6px,0.8vw+4px,10px)] shadow-[0_8px_32px_rgba(208,117,120,0.25)] bottom-[clamp(28px,6.6vw,44px)] left-[clamp(16px,3.8vw,24px)] right-[clamp(16px,3.8vw,24px)] md:left-auto md:right-[clamp(50px,calc(-7.1px+7.44vw),100px)] md:bottom-[clamp(44px,calc(1.7px+5.5vw),81px)] md:w-[clamp(518px,calc(499.7px+2.38vw),534px)] lg:right-[100px] lg:bottom-[81px] lg:w-[534px]"
        >
          <p className="font-sans font-normal text-white text-[clamp(14px,13.1px+0.2vw,16px)] leading-[130%] m-0">
            Reaching a milestone makes you look towards the next one. And sometimes, it makes you ask a completely different question. Over time, I found myself reflecting on one question:
          </p>

          <blockquote className="font-serif font-bold italic text-white text-[clamp(18px,16.7px+0.23vw,20px)] leading-[110%] m-0">
            “What if I could use what I had learnt to help many more people?”
          </blockquote>

          <div id="new-chapter-reflection-body" className="w-full flex flex-col gap-[clamp(4px,0.5vw+2px,6px)]">
            <p className="font-sans font-normal text-white text-[clamp(14px,13.1px+0.2vw,16px)] leading-[130%] m-0">
              I had been blessed with a fulfilling career and many opportunities along the way. And increasingly, I felt a desire to give back, contribute and create a wider impact.
            </p>

            <p className="font-sans font-normal text-white text-[clamp(14px,13.1px+0.2vw,16px)] leading-[130%] m-0">
              So, in 2017, I stepped away from my corporate career. Not because I was unhappy with the journey behind me. Quite the opposite.
            </p>

            <p className="font-sans font-semibold text-white text-[clamp(14px,13.1px+0.2vw,16px)] leading-[130%] m-0">
              I was ready to widen the circle of people I could impact.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}