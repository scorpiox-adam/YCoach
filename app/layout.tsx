import type { Metadata, Viewport } from "next";
import { Manrope, Sora } from "next/font/google";

import { AppBootstrap } from "@/components/providers/app-bootstrap";
import { QueryProvider } from "@/components/providers/query-provider";
import "./globals.css";

const display = Sora({
  subsets: ["latin"],
  variable: "--font-display"
});

const body = Manrope({
  subsets: ["latin"],
  variable: "--font-body"
});

export const metadata: Metadata = {
  title: "YCoach",
  description: "Coach perso mobile-first pour entraînement, nutrition et progression.",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "YCoach"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#d2613f"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${display.variable} ${body.variable}`}>
      <body>
        <QueryProvider>
          <AppBootstrap />
          {children}
        </QueryProvider>
      </body>
    </html>
  );
}

