"use client";

import React, { useRef, useState, useLayoutEffect, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui";

/* ---------- One image for desktop / tablet / mobile ----------
   Matches the Figma crops (people large, intro top-left, glass card bottom-right)
   and guarantees neither the intro text nor the card ever touches a head or face.
   FACE = both heads (hair-top to chin, left woman to right woman) as fractions
   of the photo. Change IMAGE_SRC / IMG_W / IMG_H / FACE only if the photo changes. */
const IMAGE_SRC = "/images/my-purpose.webp"; // <- single photo for all 3 layouts
const IMG_W = 3714;
const IMG_H = 2527;
const FACE = { x0: 0.42, x1: 0.61, y0: 0.48, y1: 0.565 };
const GAP = 24; // minimum clear space (px) between the heads and any text / card

/* How big the two heads should look (fraction of section width) and where they
   should sit (anchor as fraction of section) - tuned to the Figma frames. */
const lookFor = (W) =>
  W >= 1024 ? { size: 0.49, ax: 0.5, ay: 0.36 }   // desktop
    : W >= 768 ? { size: 0.6, ax: 0.45, ay: 0.42 }  // tablet
      : { size: 0.85, ax: 0.5, ay: 0.42 };            // mobile

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// element rect relative to the section (ignores framer-motion transforms)
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
  const look = lookFor(W);
  const cover = Math.max(W / IMG_W, H / IMG_H);
  const zTarget = (look.size * W) / ((FACE.x1 - FACE.x0) * IMG_W) / cover;
  const blocks = obstacles.map((o) => ({
    x0: o.x0 - GAP, y0: o.y0 - GAP, x1: o.x1 + GAP, y1: o.y1 + GAP,
  }));
  const card = obstacles[obstacles.length - 1]; // the glass card is always last

  // zooms ordered by closeness to the Figma-like zoom
  const zoomsFrom = (zMin) => {
    const zs = [];
    for (let z = zMin; z <= 3; z += 0.05) zs.push(z);
    return zs.sort((a, b) => Math.abs(a - zTarget) - Math.abs(b - zTarget));
  };

  const search = (zooms, bottomEdge) => {
    for (const z of zooms) {
      const s = cover * z, w = IMG_W * s, h = IMG_H * s;
      if (w < W - 0.5) continue; // must always fill the width
      let best = null, bestD = Infinity;
      for (let L = 0; L >= W - w - 0.5; L -= 10) {
        for (let T = 0; T >= bottomEdge - h - 0.5; T -= 10) {
          const f = {
            x0: L + FACE.x0 * w, x1: L + FACE.x1 * w,
            y0: T + FACE.y0 * h, y1: T + FACE.y1 * h,
          };
          if (f.x0 < GAP || f.x1 > W - GAP || f.y0 < GAP || f.y1 > H - GAP) continue;
          if (blocks.some((b) => hit(f, b))) continue;
          const d =
            Math.abs((f.x0 + f.x1) / 2 - look.ax * W) +
            Math.abs((f.y0 + f.y1) / 2 - look.ay * H);
          if (d < bestD) { bestD = d; best = { L, T, w, h }; }
        }
      }
      if (best) return best;
    }
    return null;
  };

  // 1) image fully covers the section (preferred)
  let r = search(zoomsFrom(1), H);
  // 2) narrow phones: let the image end inside the glass card (its bottom edge
  //    fades into the page), so the faces can sit higher, clear of the card
  if (!r) {
    const bottomEdge = Math.min(H, card.y0 + 0.4 * (card.y1 - card.y0));
    r = search(zoomsFrom(Math.max(W / (IMG_W * cover), 0.6)), bottomEdge);
  }
  if (r) return r;

  const w = IMG_W * cover, h = IMG_H * cover; // no clean fit: centred cover
  return { L: (W - w) / 2, T: (H - h) / 2, w, h };
}

export default function MyPurpose() {
  const sectionRef = useRef(null);
  const introRef = useRef(null);
  const headerRef = useRef(null);
  const textRef = useRef(null);
  const cardRef = useRef(null);
  const [pos, setPos] = useState(null);

  useIsoLayoutEffect(() => {
    const section = sectionRef.current;
    const intro = introRef.current;
    const card = cardRef.current;
    const head = headerRef.current;
    const text = textRef.current;
    if (!section || !intro || !card || !head || !text) return;

    const run = () =>
      setPos(
        fitImage(section.offsetWidth, section.offsetHeight, [
          rectIn(section, head),
          rectIn(section, text),
          rectIn(section, card),
        ])
      );

    run();
    const ro = new ResizeObserver(() => requestAnimationFrame(run));
    [section, intro, head, text, card].forEach((el) => ro.observe(el));
    document.fonts?.ready.then(run);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="my-purpose-section"
      aria-label="My Purpose - Igniting Mindz"
      className="relative w-full overflow-hidden bg-[#FEFEFE] min-h-[1000px] md:min-h-[888px] lg:min-h-[782px] flex items-center justify-center"
    >
      {/* Background Image (one image for all layouts) with Dual Gradient Overlay */}
      <div
        id="purpose-bg-image"
        className="absolute inset-0 w-full h-full z-0 overflow-hidden pointer-events-none"
      >
        <Image
          src={IMAGE_SRC}
          alt="My Purpose - Dr. Sini Rajesh"
          width={IMG_W}
          height={IMG_H}
          priority
          sizes="(max-width: 1440px) 100vw, 2000px"
          style={
            pos
              ? {
                position: "absolute", maxWidth: "none", left: pos.L, top: pos.T, width: pos.w, height: pos.h,
                // soft bottom edge, only visible when the image ends above the section bottom
                WebkitMaskImage: "linear-gradient(180deg, #000 calc(100% - 140px), transparent 100%)",
                maskImage: "linear-gradient(180deg, #000 calc(100% - 140px), transparent 100%)",
              }
              : { position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "50% 55%" }
          }
        />
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, #FEFEFE 0%, rgba(193, 190, 179, 0) 24%), linear-gradient(360deg, #FEFEFE 0%, rgba(193, 190, 179, 0) 20%)",
          }}
        />
      </div>

      {/* Main Content Container */}
      <div
        id="purpose-container"
        className="
          w-full max-w-[1440px] mx-auto
          px-[clamp(16px,4.7vw,20px)] md:px-[clamp(28px,7.29vw,56px)] lg:px-[clamp(40px,6.94vw,100px)]
          pt-[20px] md:pt-[47px] lg:pt-[clamp(40px,4.5vw,60px)]
          pb-[24px] md:pb-[42px] lg:pb-[clamp(32px,4vw,60px)]
          relative z-10
          flex flex-col justify-between
          gap-[clamp(170px,22vh,220px)] md:gap-[clamp(32px,5vw,60px)]
          min-h-[1000px] md:min-h-[888px] lg:min-h-[782px]
        "
      >
        {/* Top-Left Content */}
        <motion.div
          ref={introRef}
          id="purpose-intro-card"
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="
            flex flex-col
            w-full max-w-[385px] md:max-w-[660px] lg:max-w-[420px] xl:max-w-[346px]
            gap-[24px] md:gap-[30px] lg:gap-[clamp(14px,1.5vw,16px)]
            self-start
          "
        >
          <header ref={headerRef} className="flex flex-col items-start gap-[clamp(12px,1.5vw,16px)] md:gap-[16px] w-full">
            <Badge text="My Purpose" id="badge-my-purpose" className="w-fit" />
            <h2
              className="
                font-serif font-bold italic text-[#141414]
                text-[clamp(26px,20px+1.8vw,36px)] md:text-[clamp(32px,3.8vw,40px)] lg:text-[41.62px]
                leading-[1.18] md:leading-[1.15] lg:leading-[45px]
                tracking-normal m-0 w-full
              "
            >
              Some names describe what you do. Others describe why you do it
            </h2>
          </header>

          <div
            ref={textRef}
            id="purpose-intro-text"
            className="flex flex-col gap-2 w-full md:max-w-[600px] lg:max-w-[260px]"
          >
            <p
              className="
                font-sans font-normal text-[#141414]/75
                text-[clamp(14px,13.1px+0.2vw,16px)]
                leading-[140%] tracking-normal m-0 w-full
              "
            >
              For me, Igniting Mindz is the latter.
            </p>
            <p
              className="
                font-sans font-normal text-[#141414]/75
                text-[clamp(14px,13.1px+0.2vw,16px)]
                leading-[140%] tracking-normal m-0 w-full
                lg:max-w-[255px]
              "
            >
              People search for happiness, peace, confidence and success, and often look for the answers outside themselves.
            </p>
          </div>
        </motion.div>

        {/* Bottom-Right Glass Reflection Card */}
        <motion.div
          ref={cardRef}
          id="purpose-reflection-card"
          initial={{ opacity: 0, y: 30, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="
            box-border
            w-full max-w-[385px] md:max-w-[518px]
            p-[20px]
            flex flex-col
            gap-[clamp(8px,1vw,12px)]
            bg-[#D07578]/50
            rounded-[12px]
            shadow-[0_4px_30px_rgba(0,0,0,0.1)]
            backdrop-blur-[25px]
            border border-white/25
            self-center md:self-end lg:mt-auto
          "
        >
          <div
            id="purpose-inner-paragraphs"
            className="flex flex-col gap-[clamp(8px,1vw,12px)] w-full"
          >
            <p className="font-sans font-normal text-white text-[clamp(13.5px,13px+0.2vw,15.5px)] leading-[140%] tracking-normal m-0 w-full">
              In reality, there is enormous potential within us but that potential sometimes remains hidden beneath limiting beliefs, self-doubt, old patterns or simply a lack of awareness.
            </p>
            <p className="font-sans font-normal text-white text-[clamp(13.5px,13px+0.2vw,15.5px)] leading-[140%] tracking-normal m-0 w-full">
              I wanted my work to help people discover the power within themselves. And when I tried to capture that purpose in just a few words, one thought kept coming back to me: Igniting Mindz.
            </p>
            <p className="font-sans font-normal text-white text-[clamp(13.5px,13px+0.2vw,15.5px)] leading-[140%] tracking-normal m-0 w-full">
              When a mind is ignited, awareness grows, perspective changes and new possibilities begin to open.
            </p>
          </div>

          <div
            id="purpose-conclusion"
            className="flex flex-col gap-[clamp(8px,1vw,10px)] w-full"
          >
            <h3 className="font-serif font-bold italic text-white text-[clamp(16.5px,15.5px+0.35vw,19.5px)] leading-[1.25] tracking-normal m-0 w-full">
              When you ignite a mind, you open the door to possibilities
            </h3>
            <p className="font-sans font-normal text-white text-[clamp(13.5px,13px+0.2vw,15.5px)] leading-[140%] tracking-normal m-0 w-full">
              That belief is the thread that connects everything I do today from personal transformation and mentoring to leadership development, HR consultancy and Organisation Development.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}