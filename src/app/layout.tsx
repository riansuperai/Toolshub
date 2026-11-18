import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { Providers } from "./providers";
import { GoogleAnalytics } from "@/components/google-analytics";
import { CookieBanner } from "@/components/cookie-banner";
import "./globals.css";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap"
});

const dmSerifDisplay = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-heading",
  display: "swap"
});

export const metadata: Metadata = {
  metadataBase: new URL("https://hazenco.nl"),
  title: {
    default: "Hazenco, Wij automatiseren en bouwen wat jouw bedrijf sneller maakt",
    template: "%s | Hazenco"
  },
  description:
    "Nederlandse B2B-partner voor maatwerk weboplossingen, workflow-automatisering en AI-workflows. Klein team, direct contact, done-for-you levering.",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Hazenco",
    url: "https://hazenco.nl",
    title: "Hazenco, Wij automatiseren en bouwen wat jouw bedrijf sneller maakt",
    description:
      "Nederlandse B2B-partner voor maatwerk weboplossingen, workflow-automatisering en AI-workflows."
  },
  twitter: {
    card: "summary_large_image",
    title: "Hazenco",
    description:
      "Nederlandse B2B-partner voor maatwerk weboplossingen, workflow-automatisering en AI-workflows."
  },
  // Verifieert de URL-property in Google Search Console. Staat hier naast de
  // DNS-TXT van de domein-property: bij een DNS-verhuizing sneuvelt dat record
  // makkelijk (gebeurd bij de overstap TransIP -> Hostinger), deze tag niet.
  verification: {
    google: "XZ52x0RzV0AbAmJa0v1Pxa9fsjTR2QviVhGr23Y2w5w"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${dmSans.variable} ${dmSerifDisplay.variable}`}>
      <body>
        <Providers>{children}</Providers>
        <CookieBanner />
        <GoogleAnalytics />
      </body>
    </html>
  );
}
