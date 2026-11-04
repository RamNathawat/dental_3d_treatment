import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
  preload: true,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#d97706",
};

export const metadata: Metadata = {
  title: {
    default: "Orthodontic 3D | Clinical Treatment Progression",
    template: "%s | Orthodontic 3D",
  },
  description:
    "Interactive 3D orthodontic treatment progression portal — manage patient aligner cases, in-browser CAD processing, and 60 FPS shareable smile progression.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 selection:bg-amber-100 selection:text-amber-900">
        <div id="main-content">{children}</div>
      </body>
    </html>
  );
}