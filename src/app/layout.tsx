import type { Metadata } from "next";
import { EB_Garamond } from "next/font/google";
import { LanguageProvider } from "@/i18n/LanguageContext";
import { SessionProvider } from "@/context/SessionContext";
import LiveKitSession from "@/components/livekit/LiveKitSession";
import TranscriptPanel from "@/components/livekit/TranscriptPanel";
import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Le studio des parfums | AI-Powered Perfumery",
  description:
    "Discover your perfect scent with Rose, your AI personal perfumer. Luxury fragrances crafted with cutting-edge technology.",
  icons: {
    icon: "/logo-sdp.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="light" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={`${garamond.variable} bg-background-light text-text-dark h-screen overflow-hidden antialiased`}
        suppressHydrationWarning
      >
        <LanguageProvider>
          <SessionProvider>
            <LiveKitSession>
              {children}
              <TranscriptPanel />
            </LiveKitSession>
          </SessionProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
