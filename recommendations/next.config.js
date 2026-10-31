// F1, F2, F3, F7: security headers, HSTS, permanent redirect, asset caching
/** @type {import('next').NextConfig} */
module.exports = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          // Roll CSP out as Content-Security-Policy-Report-Only first, then enforce.
          // Allow: www.googletagmanager.com, www.google-analytics.com,
          //        fonts.googleapis.com, fonts.gstatic.com
        ],
      },
      {
        source: "/:path*.(svg|png|jpg|webp|woff2)",
        headers: [
          // Use `immutable` only for fingerprinted files.
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "cynbit.in" }],
        destination: "https://www.cynbit.in/:path*",
        permanent: true, // 308
      },
    ];
  },
};
