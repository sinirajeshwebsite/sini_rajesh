import React from "react";
import Link from "next/link";
import PageHero from "@/components/common/PageHero";
import { Badge } from "@/components/ui";
import SayHello from "@/components/home/SayHello";
import Footer from "@/components/common/Footer";

export default function NotFound() {
  return (
    <main className="w-full min-h-screen bg-[#FEFEFE] flex flex-col justify-between">
      {/* Signature Page Hero with HeaderNav */}
      <PageHero
        card={true}
        heading="Page Not Found"
        title="404"
        info="The page you are looking for may have been moved, renamed, or is taking a quiet pause. Take a breath and let us guide you back to where you need to be."
        height="clamp(240px, 20vw, 300px)"
        cardClassName="!h-[clamp(240px,20vw,300px)] !min-h-[clamp(240px,20vw,300px)]"
        bgColor="bg-[#BA676A]"
        bgImage="/images/hero-bg-image.webp"
        bgPosition="center 24%"
      />

      {/* Main Content Layout — Styled identically to the Asking Why section in My Story */}
      <section
        id="not-found-inquiry-section"
        aria-label="Finding Your Way Forward"
        className="w-full bg-[#FEFEFE] overflow-hidden"
      >
        <div
          id="not-found-inquiry-layout"
          className="
            w-full max-w-[1440px] mx-auto
            px-[clamp(20px,6.94vw,100px)]
            py-[clamp(44px,4.5vw,70px)]
            flex flex-col
            items-center
            gap-[clamp(36px,4.17vw,56px)]
          "
        >
          {/* Header Block with Signature Badge */}
          <header
            id="not-found-header"
            className="
              w-full max-w-[844px]
              flex flex-col items-center
              gap-[clamp(16px,2.08vw,24px)]
              text-center
            "
          >
            <Badge text="Finding Your Way" id="badge-not-found" />

            <div className="w-full flex justify-center">
              <h2
                className="
                  font-serif font-bold italic
                  text-[clamp(28px,20px+1.5vw,41.62px)]
                  leading-tight lg:leading-[45px]
                  tracking-normal text-[#141414]
                  m-0 text-center
                  max-w-[560px]
                "
              >
                Every Uncharted Turn Can Lead to Meaningful Direction
              </h2>
            </div>
            <p className="font-sans font-normal text-[#141414]/75 text-[clamp(14px,13.1px+0.2vw,16px)] leading-[150%] max-w-[540px] m-0">
              While this specific address isn&apos;t available, here are three central pathways where you can continue exploring:
            </p>
          </header>

          {/* 3 Inquiry Cards (Asking Why signature cards) */}
          <div
            id="not-found-cards-grid"
            className="
              w-full
              grid grid-cols-1 lg:grid-cols-3
              gap-[clamp(20px,1.67vw,24px)]
            "
          >
            {/* Card 1: Executive & Personal Coaching */}
            <Link
              href="/services/coaching"
              id="card-coaching-pathway"
              className="
                box-border
                w-full
                bg-[#FEFEFE]
                rounded-[16px]
                border border-[#D07578]/50
                p-[clamp(24px,2.5vw,36px)_clamp(20px,1.67vw,24px)_clamp(24px,1.94vw,28px)]
                flex flex-col justify-between
                gap-[clamp(28px,4vw,50px)]
                transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(208,117,120,0.15)] hover:border-[#D07578]/90
                group
              "
            >
              <div className="w-10 h-10 flex-shrink-0" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="20" cy="20" r="15" stroke="#D07578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polygon points="20,9 25,18 20,21 15,22" fill="#D07578" opacity="0.2" />
                  <polygon points="20,9 25,18 20,21 15,22" stroke="#D07578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <polygon points="20,31 15,22 20,19 25,18" stroke="#D07578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="20" cy="20" r="2" fill="#D07578" />
                </svg>
              </div>

              <div className="flex flex-col gap-[clamp(16px,1.67vw,24px)] w-full">
                <h3
                  className="
                    font-serif font-semibold italic text-[#D07578]
                    text-[clamp(20px,18px+0.54vw,25.81px)]
                    leading-[110%] tracking-normal m-0
                    lg:min-h-[58px]
                    flex items-start
                    group-hover:text-[#BA676A] transition-colors
                  "
                >
                  Where can you find renewed clarity?
                </h3>

                <div className="flex flex-col gap-3 w-full">
                  <p
                    className="
                      font-sans font-normal text-[#141414]/75
                      text-[clamp(14px,13.1px+0.2vw,16px)]
                      leading-[140%] tracking-normal m-0
                    "
                  >
                    Explore executive and personal coaching grounded in{" "}
                    <strong className="font-serif font-bold italic text-[1.12em] text-[#141414]">
                      The TEA of Your Life
                    </strong>{" "}
                    framework to unlock inner alignment, self-awareness, and authentic leadership.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 font-sans font-medium text-[14px] text-[#D07578] group-hover:text-[#BA676A] transition-colors">
                <span>Explore Coaching</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </div>
            </Link>

            {/* Card 2: Organisation Development */}
            <Link
              href="/services/organisation-development"
              id="card-od-pathway"
              className="
                box-border
                w-full
                bg-[#FEFEFE]
                rounded-[16px]
                border border-[#D07578]/50
                p-[clamp(24px,2.5vw,36px)_clamp(20px,1.67vw,24px)_clamp(24px,1.94vw,28px)]
                flex flex-col justify-between
                gap-[clamp(28px,4vw,50px)]
                transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(208,117,120,0.15)] hover:border-[#D07578]/90
                group
              "
            >
              <div className="w-10 h-10 flex-shrink-0" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 5V13M10 27V35M30 27V35" stroke="#D07578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="15" y="13" width="10" height="8" rx="2" stroke="#D07578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="5" y="27" width="10" height="8" rx="2" stroke="#D07578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <rect x="25" y="27" width="10" height="8" rx="2" stroke="#D07578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 21V24H10M20 24H30" stroke="#D07578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="flex flex-col gap-[clamp(16px,1.67vw,24px)] w-full">
                <h3
                  className="
                    font-serif font-semibold italic text-[#D07578]
                    text-[clamp(20px,18px+0.54vw,25.81px)]
                    leading-[110%] tracking-normal m-0
                    lg:min-h-[58px]
                    flex items-start
                    group-hover:text-[#BA676A] transition-colors
                  "
                >
                  How do human systems thrive together?
                </h3>

                <div className="flex flex-col gap-3 w-full">
                  <p
                    className="
                      font-sans font-normal text-[#141414]/75
                      text-[clamp(14px,13.1px+0.2vw,16px)]
                      leading-[140%] tracking-normal m-0
                    "
                  >
                    Discover holistic organisational interventions that create the space to strengthen people, purpose, culture architectures, and sustainable enterprise growth.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 font-sans font-medium text-[14px] text-[#D07578] group-hover:text-[#BA676A] transition-colors">
                <span>Explore Organisation Development</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </div>
            </Link>

            {/* Card 3: Reflections & Mindset Insights */}
            <Link
              href="/blogs"
              id="card-blogs-pathway"
              className="
                box-border
                w-full
                bg-[#FEFEFE]
                rounded-[16px]
                border border-[#D07578]/50
                p-[clamp(24px,2.5vw,36px)_clamp(20px,1.67vw,24px)_clamp(24px,1.94vw,28px)]
                flex flex-col justify-between
                gap-[clamp(28px,4vw,50px)]
                transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
                hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(208,117,120,0.15)] hover:border-[#D07578]/90
                group
              "
            >
              <div className="w-10 h-10 flex-shrink-0" aria-hidden="true">
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.66669 31.6667C10.8334 30.5 16.6667 30.5 20 33.3333C23.3334 30.5 29.1667 30.5 33.3334 31.6667V8.33333C29.1667 7.16667 23.3334 7.16667 20 10C16.6667 7.16667 10.8334 7.16667 6.66669 8.33333V31.6667Z" stroke="#D07578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M20 10V33.3333" stroke="#D07578" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="flex flex-col gap-[clamp(16px,1.67vw,24px)] w-full">
                <h3
                  className="
                    font-serif font-semibold italic text-[#D07578]
                    text-[clamp(20px,18px+0.54vw,25.81px)]
                    leading-[110%] tracking-normal m-0
                    lg:min-h-[58px]
                    flex items-start
                    group-hover:text-[#BA676A] transition-colors
                  "
                >
                  What happens when you shift perspective?
                </h3>

                <div className="flex flex-col gap-3 w-full">
                  <p
                    className="
                      font-sans font-normal text-[#141414]/75
                      text-[clamp(14px,13.1px+0.2vw,16px)]
                      leading-[140%] tracking-normal m-0
                    "
                  >
                    Read Dr. Sini&apos;s doctoral insights, articles on leadership resilience, happiness at work, and the profound link between mindset, thoughts, emotions and behavior.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2 font-sans font-medium text-[14px] text-[#D07578] group-hover:text-[#BA676A] transition-colors">
                <span>Read Articles</span>
                <span className="transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true">
                  →
                </span>
              </div>
            </Link>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center h-[46px] px-8 rounded-[8px] bg-[#D07578] hover:bg-[#BA676A] text-white font-sans font-medium text-[15px] shadow-sm hover:shadow-[0_8px_20px_rgba(208,117,120,0.3)] transition-all duration-300"
            >
              Return to Homepage
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-[46px] px-8 rounded-[8px] border border-[#141414]/20 hover:border-[#BA676A] hover:text-[#BA676A] text-[#141414] bg-white font-sans font-medium text-[15px] transition-all duration-300"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      {/* Say Hello Section */}
      <SayHello heading="Your next chapter may begin with a simple conversation." />

      {/* Global Footer */}
      <Footer />
    </main>
  );
}
