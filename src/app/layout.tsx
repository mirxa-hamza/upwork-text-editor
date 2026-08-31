import type { Metadata, Viewport } from "next";
import { Poppins } from "next/font/google";
import SiteNavBar from "@/components/SiteNavBar";
import PageLoader from "@/components/PageLoader";
import { siteConfig } from "@/lib/siteConfig";
import "./globals.css";

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  alternates: {
    canonical: "/",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
    },
  },
  // Only emitted when GOOGLE_SITE_VERIFICATION is set in hosting; harmless
  // to leave unset if Search Console was verified by DNS record instead.
  verification: siteConfig.googleSiteVerification
    ? { google: siteConfig.googleSiteVerification }
    : undefined,
  // No `images` array here on purpose — app/opengraph-image.tsx is picked
  // up automatically by Next's file-convention metadata resolver and
  // injected into both openGraph.images and twitter.images. Declaring it
  // again here would just duplicate the og:image/twitter:image tags.
  openGraph: {
    type: "website",
    url: "/",
    siteName: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#108a00",
};

// SoftwareApplication structured data — describes the tool itself so search
// engines can render rich results (price, category) in the SERP. Kept
// deliberately free of `aggregateRating`/`review` fields since there's no
// real review data behind them; fabricating those violates Google's
// structured-data guidelines and risks a manual action.
const softwareApplicationJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: siteConfig.name,
  url: siteConfig.url,
  description: siteConfig.description,
  applicationCategory: "BusinessApplication",
  operatingSystem: "Any (runs in any modern web browser)",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
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
            .material-symbols-outlined class, so no extra CSS is needed.
            Preconnect to both the stylesheet host and the font-file host it
            references so the DNS/TLS handshake overlaps with page load
            instead of only starting once the stylesheet request returns. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-25..0&display=swap"
        />
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationJsonLd) }}
        />
      </head>
      <body className={`${poppins.variable} antialiased bg-slate-50`}>
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
