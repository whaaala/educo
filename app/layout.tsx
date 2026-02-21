import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Educo",
  description: "School Management System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Anton&family=Abril+Fatface&family=Bebas+Neue&family=Bitter:ital,wght@0,400;0,700;1,400;1,700&family=Caveat:wght@400;700&family=Comfortaa:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,700;1,400;1,700&family=Crimson+Text:ital,wght@0,400;0,700;1,400;1,700&family=DM+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Dancing+Script:wght@400;700&family=EB+Garamond:ital,wght@0,400;0,700;1,400;1,700&family=Fira+Code:wght@400;700&family=Fredoka:wght@400;700&family=Great+Vibes&family=IBM+Plex+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Indie+Flower&family=JetBrains+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Karla:ital,wght@0,400;0,700;1,400;1,700&family=Lato:ital,wght@0,400;0,700;1,400;1,700&family=Lexend:wght@400;700&family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lobster&family=Lora:ital,wght@0,400;0,700;1,400;1,700&family=Manrope:wght@400;700&family=Merriweather:ital,wght@0,400;0,700;1,400;1,700&family=Montserrat:ital,wght@0,400;0,700;1,400;1,700&family=Noto+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Nunito:ital,wght@0,400;0,700;1,400;1,700&family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&family=Oswald:wght@400;700&family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&family=PT+Serif:ital,wght@0,400;0,700;1,400;1,700&family=Pacifico&family=Patrick+Hand&family=Permanent+Marker&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Poppins:ital,wght@0,400;0,700;1,400;1,700&family=Raleway:ital,wght@0,400;0,700;1,400;1,700&family=Righteous&family=Roboto:ital,wght@0,400;0,700;1,400;1,700&family=Roboto+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Rubik:ital,wght@0,400;0,700;1,400;1,700&family=Sacramento&family=Satisfy&family=Shadows+Into+Light&family=Source+Code+Pro:ital,wght@0,400;0,700;1,400;1,700&family=Source+Sans+3:ital,wght@0,400;0,700;1,400;1,700&family=Space+Mono:ital,wght@0,400;0,700;1,400;1,700&family=Ubuntu:ital,wght@0,400;0,700;1,400;1,700&family=Work+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className={`${geistSans.variable} ${geistMono.variable} antialiased h-full bg-gray-50 dark:bg-[#0f1115] midnight:bg-[#0a0e27] purple:bg-[#1a0b2e] transition-colors duration-300`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
