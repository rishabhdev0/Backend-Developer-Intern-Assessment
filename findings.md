# Findings

Prepared by: Rishabh Pandey | Target: https://www.cynbit.in | Observed: 31 October 2026 | Method: passive only

| ID | Category | Severity | Finding | Evidence | Impact | Fix |
|---|---|---|---|---|---|---|
| F1 | Security headers | Medium | No CSP, `X-Content-Type-Options`, `X-Frame-Options`/`frame-ancestors`, `Referrer-Policy`, `Permissions-Policy` | `curl -I` on `/` and `/random-page-123` | Clickjacking and MIME-sniffing exposure; no defense in depth against XSS | Add headers in `next.config.js`; start CSP in report-only mode |
| F2 | Transport | Low | HSTS `max-age=63072000` without `includeSubDomains` or `preload` | `Strict-Transport-Security` header | Subdomains (e.g. product apps) not covered | Add `includeSubDomains; preload` |
| F3 | Routing | Low | Apex to www uses `307 Temporary Redirect` | `curl -I https://cynbit.in` | Search engines treat move as temporary; extra round trip uncached | Use `308` / `301` |
| F4 | Data / SEO | Low | `og:url` is `https://cynbit.in` on every page; `og:image` uses apex while links use `www` | Page metadata | Duplicate-content signals, wrong share previews | Per-page `alternates.canonical` and `openGraph.url` |
| F5 | Performance | Medium | About 10 RSC prefetches on load; 40 requests and 2,821 kB on home, 51 and 2,888 kB on `/contact` | DevTools Network | Extra requests on mobile data | `prefetch={false}` for low-priority links |
| F6 | Performance | Low (downgraded) | Slower prefetch of `careers`, `case-studies`, blog, `diaries` may reflect cache state rather than dynamic rendering | DevTools Network | Unclear; needs re-test with Disable cache | ISR via `generateStaticParams` and `revalidate` if confirmed |
| F7 | Caching | Info (downgraded) | `max-age=0, must-revalidate` is the Vercel default for static HTML; CDN returns `HIT`; `logo.svg` revalidates (`304`) | Headers, Network | Small | Longer `max-age` with `stale-while-revalidate` for static assets |
| F8 | CORS | Info | `Access-Control-Allow-Origin: *` on static pages | Headers | Harmless for public content; risky if applied to data endpoints | Restrict origin on any data endpoint |
| F9 | Data validation | Medium | Client-side validation only observed on inquiry form | Browser "Please fill out this field" popup, no request sent | Server-side validation, rate limiting, bot protection **Not verified** | Zod validation, rate limit, honeypot, queue |
| F10 | Privacy | Low (needs verification) | GA4 loads on page load; consent gating not verified; `/cookies` page exists | Network tab, site map | DPDP Act 2023 consent expectations | Load analytics only after consent |
| F11 | Data exposure | Info | Emails and phone numbers in plain text | Footer and contact page | Scraping and spam | Single contact route; render client-side |
| F12 | Observability | Info (needs verification) | 99.9% uptime claim; no status page seen in reviewed pages | Page content | Claim not publicly verifiable | `/api/health` and a status page |
| F13 | Data / SEO | Low | `/diaries` shares homepage title/description; career pages use consent text as meta description | Site-map query (as indexed) | Weak search snippets, duplicate metadata | Per-page `generateMetadata` |
| F14 | Data handling | Medium (needs verification) | About 20 career postings with application forms and consent checkbox | Site-map query | Applicant PII and possible file uploads need strict validation and storage | Upload limits, type allow-list, signed URLs, retention policy |
| F15 | Routing / SEO | Low (verified) | `sitemap.xml` lists all 82 URLs on the apex host, which `307`-redirects to `www` | `sitemap.xml` and `curl -I https://cynbit.in` | Crawlers are sent to redirecting URLs; slower indexing, mixed signals | Emit `www` URLs; use one base-URL constant |
| F17 | Data / SEO | Low (verified) | `lastmod` of every core page equals generation time (`2026-10-31T15:45:57.521Z`); fixed `changefreq` and `priority` | `sitemap.xml` | Crawlers learn to ignore `lastmod`; wasted crawl budget | Use real `updatedAt` per page; drop `changefreq`/`priority` |
| F18 | Architecture / config | Low (inference) | Site URL setting is apex (sitemap, `robots.txt` Sitemap line, `og:url`, `og:image`) while the platform redirects apex to `www` | Sitemap, `robots.txt`, page metadata, `curl -I` | Root cause of F2, F3, F4, F15 | One canonical host, referenced from one constant; `308` for the other |
| F19 | Information disclosure / auth | Low (verified listing, behaviour not tested) | `robots.txt` lists `/api/`, `/admin/`, `/portal/` | `robots.txt` | Reveals that API, admin and portal areas exist; robots is not access control | Enforce authentication, MFA for admin, `noindex`/`no-store` headers, rate limits, firewall rules; do not rely on robots |
| F20 | Crawler config | Info (verified) | `Crawl-delay: 1`; apex Sitemap URL | `robots.txt` | Google ignores crawl-delay; apex sitemap URL redirects | Remove crawl-delay; use `SITE_URL` |
| F16 | Performance | Low (needs verification) | Material Symbols icon font loaded from Google Fonts | Network tab | Extra cross-origin request and weight | Self-host a subset or use inline SVG |

## Positive findings

- 182 ms document response from a Mumbai edge node
- Statically prerendered homepage (`X-Nextjs-Prerender: 1`, `X-Vercel-Cache: HIT`)
- Correct cached `404` with no stack trace
- No `X-Powered-By`; compression enabled; HSTS present
- Correct `Vary` headers for RSC caching
- Clean browser console in incognito
