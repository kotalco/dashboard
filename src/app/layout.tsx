import type { Metadata, Viewport } from "next";
import { Toaster } from "sonner";
import { Nunito } from "next/font/google";

import { ModalProvider } from "@/providers/modal-provider";
import "./globals.css";

const nunito = Nunito({
  weight: ["400", "600", "700"],
  display: "swap",
  subsets: ["latin"],
  variable: "--font-nunito",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Kotal Pro",
  icons: { icon: "/images/logo.svg" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${nunito.variable}`}>
        <ModalProvider />
        <Toaster richColors />
        {children}
      </body>
    </html>
  );
}
