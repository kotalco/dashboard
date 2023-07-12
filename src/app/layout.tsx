import type { Metadata } from "next";
import { Nunito } from "next/font/google";

import "./globals.css";

const nunito = Nunito({
  weight: ["400", "600", "700"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const metadata: Metadata = {
  title: "Kotal Pro",
  icons: { icon: "/images/logo.svg" },
  viewport: { width: "device-width", initialScale: 1 },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${nunito.variable}`}>{children}</body>
    </html>
  );
}
