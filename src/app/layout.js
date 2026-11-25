import { Cormorant_Garamond, Manrope, Instrument_Sans } from "next/font/google";
import "@/styles/globals.css";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-serif",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const instrumentSans = Instrument_Sans({
  subsets: ["latin"],
  variable: "--font-instrument",
  display: "swap",
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://sinirajesh.com"),
  title: "Dr. Sini Rajesh | Founder of Igniting Mindz",
  description:
    "Transform from Within, Grow with Clarity, Create Lasting Impact. Dr. Sini Rajesh - Mentor, HR Expert, Board Advisor, Organisation Development Specialist, Life Coach, Happypreneur.",
  keywords: [
    "Sini Rajesh",
    "Igniting Mindz",
    "Life Coach",
    "HR Expert",
    "Mentor",
    "Board Advisor",
    "Organisation Development Specialist",
    "Happypreneur",
  ],
  authors: [{ name: "Dr. Sini Rajesh" }],
  icons: {
    icon: [
      { url: "/icon.png", sizes: "192x192", type: "image/png" },
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/images/logo-header.svg", type: "image/svg+xml" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Dr. Sini Rajesh | Founder of Igniting Mindz",
    description:
      "Transform from Within, Grow with Clarity, Create Lasting Impact. Dr. Sini Rajesh - Mentor, HR Expert, Board Advisor, Organisation Development Specialist, Life Coach, Happypreneur.",
    url: "https://sinirajesh.com",
    siteName: "Dr. Sini Rajesh",
    images: [
      {
        url: "/images/footer-logo.webp",
        width: 1200,
        height: 630,
        alt: "Dr. Sini Rajesh - Igniting Mindz Logo",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dr. Sini Rajesh | Founder of Igniting Mindz",
    description:
      "Transform from Within, Grow with Clarity, Create Lasting Impact.",
    images: ["/images/footer-logo.webp"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${cormorantGaramond.variable} ${manrope.variable} ${instrumentSans.variable}`}
    >
      <body
        suppressHydrationWarning
        className="bg-[#FEFEFE] text-[#141414] antialiased font-sans"
      >
        {children}
      </body>
    </html>
  );
}
