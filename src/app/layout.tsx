import type { Metadata } from "next";
import { DM_Sans, DM_Serif_Display } from "next/font/google";
import { Providers } from "./providers";
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
  title: "Hazenco Marketplace",
  description: "Nederlandse marketplace voor automation workflows, AI agents, plugins, extensies, skills en themes."
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
      </body>
    </html>
  );
}
