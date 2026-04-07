import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Orbitron } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { WrongNetworkBanner } from "@/components/wrong-network-banner";

const orbitron = Orbitron({
  subsets: ["latin"],
  variable: "--font-orbitron",
  display: "swap",
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseAppId =
  process.env.NEXT_PUBLIC_BASE_APP_ID ?? "69d4b14f91c13596e8962105";

export const metadata: Metadata = {
  title: "Neon Honk Heist",
  description: "Cyberpunk stealth grid game on Base — swipe to move, clear sectors, daily check-in.",
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ??
      "https://untitled-goose-game-six.vercel.app",
  ),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta name="base:app_id" content={baseAppId} />
      </head>
      <body
        className={`${geistSans.variable} ${orbitron.variable} ${geistMono.variable} min-h-dvh font-sans antialiased`}
      >
        <Providers>
          <WrongNetworkBanner />
          <div className="mx-auto flex min-h-dvh max-w-3xl flex-col px-4 pb-10 pt-4">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
