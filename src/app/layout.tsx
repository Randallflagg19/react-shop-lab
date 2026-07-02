import { Oswald } from "next/font/google";
import type { Metadata } from "next";
import "./globals.css";
import "./arcane-theme.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: {
    default: "AI Slop Shop",
    template: "%s | AI Slop Shop",
  },
  description: "Невозможные товары для сомнительной реальности.",
  applicationName: "AI Slop Shop",
};

const oswald = Oswald({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-display",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" className={`h-full antialiased ${oswald.variable}`}>
      <body className="min-h-full flex flex-col" data-arcane-app>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
