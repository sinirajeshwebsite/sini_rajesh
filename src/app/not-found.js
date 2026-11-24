import React from "react";
import Link from "next/link";
import PageHero from "@/components/common/PageHero";
import SayHello from "@/components/home/SayHello";
import Footer from "@/components/common/Footer";

const HELPFUL_PATHS = [
  {
    category: "1-on-1 & Leadership",
    title: "Executive & Personal Coaching",
    description:
      "Explore executive coaching grounded in The TEA of Your Life framework to unlock purpose and authentic leadership.",
    href: "/services/coaching",
    action: "Explore Coaching",
  },
  {
    category: "Enterprise & Scale",
    title: "Organisation Development",
    description:
      "Discover holistic organizational interventions that align business strategy with human potential and culture.",
    href: "/services/organisation-development",
    action: "Explore OD",
  },
  {
    category: "Reflections & Mindset",
    title: "Insights & Perspectives",
    description:
      "Read Dr. Sini's thought leadership on leadership resilience, workplace happiness, and human behavior.",
    href: "/blogs",
    action: "Read Articles",
  },
];

export default function NotFound() {
  return (
    <main className="w-full min-h-screen bg-[#FEFEFE] flex flex-col justify-between">
      {/* Signature Page Hero with HeaderNav */}
      <PageHero
        card={true}
        heading="404 — Page Not Found"
        title={"Finding Clarity on\nAn Uncharted Path"}
        info="The page you are looking for may have been moved, renamed, or is taking a quiet pause. Take a breath and let us guide you back to where you need to be."
        height="clamp(240px, 20vw, 300px)"
        cardClassName="!h-[clamp(240px,20vw,300px)] !min-h-[clamp(240px,20vw,300px)]"
        bgColor="bg-[#BA676A]"
        bgImage="/images/hero-bg-image.webp"
        bgPosition="center 24%"
      />

      {/* Main Content: Thoughtful navigation guidance */}
      <section className="relative w-full max-w-[1440px] mx-auto px-[clamp(20px,6.94vw,100px)] py-[clamp(48px,6vw,80px)] flex flex-col items-center">
        {/* Subtle Watermark 404 behind the section header */}
        <div className="relative w-full max-w-[800px] mx-auto flex flex-col items-center text-center mb-[clamp(32px,4vw,52px)]">
          <span
            className="font-serif italic font-bold text-[clamp(80px,14vw,160px)] leading-none text-[#BA676A]/10 select-none pointer-events-none -mb-[clamp(40px,7vw,76px)] tracking-tight"
            aria-hidden="true"
          >
            404
          </span>
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#FAF6F0] border border-[#EFE8DF] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D07578]" />
            <span className="font-sans font-medium text-[12.5px] text-[#141414]/75 tracking-wider uppercase">
              A Moment of Reflection
            </span>
          </div>
          <h2 className="font-serif font-bold italic text-[clamp(28px,3.2vw,44px)] leading-[1.2] text-[#141414] m-0">
            Every detour is an invitation to explore.
          </h2>
          <p className="font-sans font-normal text-[clamp(14.5px,1.1vw,16px)] leading-[160%] text-[#141414]/70 max-w-[560px] m-0 mt-3">
            While this specific address isn&apos;t available, here are a few pathways where you can continue your journey with Dr. Sini Rajesh:
          </p>
        </div>

        {/* 3 Pathway Cards */}
        <div className="w-full max-w-[1240px] grid grid-cols-1 md:grid-cols-3 gap-[clamp(16px,2vw,28px)] mb-[clamp(40px,5vw,60px)]">
          {HELPFUL_PATHS.map((item) => (
            <Link
              key={item.title}
              href={item.href}
              className="group flex flex-col justify-between p-[clamp(22px,2vw,28px)] rounded-[14px] bg-[#FDF7F2] border border-[#D07578]/20 hover:border-[#D07578]/60 hover:shadow-[0_12px_32px_rgba(208,117,120,0.12)] hover:-translate-y-1 transition-all duration-300"
            >
              <div>
                <span className="inline-block font-sans font-semibold text-[11.5px] uppercase tracking-wider text-[#D07578] mb-2.5">
                  {item.category}
                </span>
                <h3 className="font-serif font-bold italic text-[clamp(20px,1.5vw,24px)] leading-snug text-[#141414] group-hover:text-[#BA676A] transition-colors m-0 mb-2.5">
                  {item.title}
                </h3>
                <p className="font-sans font-normal text-[14px] leading-[150%] text-[#141414]/70 m-0">
                  {item.description}
                </p>
              </div>
              <div className="pt-6 flex items-center gap-2 font-sans font-medium text-[13.5px] text-[#BA676A] group-hover:text-[#8D566B] transition-colors">
                <span>{item.action}</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center h-[46px] px-7 rounded-[8px] bg-[#D07578] hover:bg-[#BA676A] text-white font-sans font-medium text-[15px] shadow-sm hover:shadow-[0_8px_20px_rgba(208,117,120,0.3)] transition-all duration-300"
          >
            Return to Homepage
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center justify-center h-[46px] px-7 rounded-[8px] border border-[#141414]/20 hover:border-[#BA676A] hover:text-[#BA676A] text-[#141414] bg-white font-sans font-medium text-[15px] transition-all duration-300"
          >
            Get in Touch
          </Link>
        </div>
      </section>

      {/* Say Hello Section */}
      <SayHello heading="Your next chapter may begin with a simple conversation." />

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
