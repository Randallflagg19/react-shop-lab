import { Oswald } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";

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
      <body className="min-h-full flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
