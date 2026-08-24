import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import SiteNavBar from "@/components/SiteNavBar";
import PageLoader from "@/components/PageLoader";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Upwork Text Formatter",
  description:
    "Format bold, italic, underline, bullets, numbered lists, and links as plain Unicode text that survives pasting into Upwork.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        {/* Material Symbols powers every icon in the toolbar, nav, and feature
            sections. Google's stylesheet ships both the @font-face and the
            .material-symbols-outlined class, so no extra CSS is needed. */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..0&display=swap"
        />
      </head>
      <body className={`${poppins.variable} antialiased`}>
        {/* Shown immediately on first paint, fades out shortly after — see
            PageLoader.tsx for why this needs its own fixed minimum time
            rather than gating on data that's already there. */}
        <PageLoader />
        {/* Rendered once here, outside both pages, so it stays mounted (no
            resize/flash) when navigating between / and /editor. See
            SiteNavBar.tsx for why. */}
        <SiteNavBar />
        {children}
      </body>
    </html>
  );
}
