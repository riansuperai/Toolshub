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
  metadataBase: new URL("https://toolshub.hazenco.nl"),
  title: {
    default: "Hazenco Toolshub",
    template: "%s | Hazenco Toolshub"
  },
  description:
    "Hazenco's bibliotheek van werkende automation-tools: workflows, AI agents, plugins, extensies, skills en themes voor het Nederlandse MKB.",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    siteName: "Hazenco Toolshub",
    url: "https://toolshub.hazenco.nl",
    title: "Hazenco Toolshub",
    description:
      "Door Hazenco gebouwde automation-tools voor het Nederlandse MKB."
  },
  twitter: {
    card: "summary_large_image",
    title: "Hazenco Toolshub",
    description:
      "Door Hazenco gebouwde automation-tools voor het Nederlandse MKB."
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
