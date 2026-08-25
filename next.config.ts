import type { NextConfig } from "next";
import path from "path";

// Baseline response headers — none of these were set before (a default
// Next.js app ships with none of them). They don't affect SEO ranking
// directly, but a security audit or SEO tool flags their absence, and
// they're a zero-risk addition for a static, client-side-only tool like
// this one (no cookies, no embedding use case to preserve).
const securityHeaders = [
  // Stops browsers from guessing a response's MIME type from its content,
  // which can be abused to execute a file Next didn't intend to be a script.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Sends the referring page's origin (not full URL) to other sites when a
  // link here is followed, and nothing at all on a downgrade to HTTP.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // No known need to be framed by another site, and no benefit to allowing
  // it, so deny clickjacking-style embedding outright.
  { key: "X-Frame-Options", value: "DENY" },
  // This tool doesn't use the camera, microphone, or geolocation — say so
  // explicitly rather than leaving every browser feature available by
  // default to any script that ends up running on the page.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  // Pin the file-tracing and Turbopack roots to THIS project directory so
  // Next.js doesn't walk up to the parent folder and pick up a stray
  // package-lock.json there, which corrupts the routes manifest at runtime
  // and causes "routesManifest.dataRoutes is not iterable".
  outputFileTracingRoot: path.resolve(__dirname),
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;

