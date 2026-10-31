# Backend Check of cynbit.in

**By:** Rishabh Pandey  
**For:** Backend Developer Intern Assessment  
**Date:** 31 October 2026

## What I did

I looked at the Cynbit website like a normal visitor, using only my browser and a few simple checks. I did **not** log in, send any forms, test private pages, or put any load on the site. If I could not check something safely, I wrote "not verified".

## How the site is built (in simple words)

- It is built with **Next.js** and hosted on **Vercel**.
- Pages are prepared in advance and served from a **nearby server in Mumbai**, so the homepage loads fast (about 0.18 seconds).
- It has a **contact form**, a **newsletter**, and **job application forms**.
- It also has about 80 pages: blogs, case studies, jobs and diaries.
- A public file (`robots.txt`) shows that the site also has **API, admin and portal** areas.

## What is already good

- Fast loading from a nearby server.
- A proper "page not found" page that does not leak technical details.
- HTTPS is turned on, and the browser console has no errors.

## Main problems and simple fixes

| # | Problem | Simple fix |
|---|---|---|
| 1 | The site can't decide between `cynbit.in` and `www.cynbit.in`. The redirect, the sitemap, the robots file and the share tags all disagree. This looks like **one small settings mistake**. | Pick `www`, use it everywhere, and redirect the other one permanently. |
| 2 | Some standard browser safety settings are missing. | Add a few standard headers. |
| 3 | The contact form only checks input in the browser. I could not check the server side. | Check on the server too, limit how often one person can submit, and block bots. |
| 4 | Job application forms collect personal data and probably files. | Accept only small PDFs, store them privately, and delete them after hiring. |
| 5 | The robots file lists `/admin`, `/portal` and `/api`, which points people to them. | Protect them with login and extra verification, and don't list them. |
| 6 | The sitemap says every page changed "just now". | Use the real date each page changed. |
| 7 | The page loads many extra links and a large icon font in the background. | Load fewer links in advance and use smaller icons. |
| 8 | Analytics may start before the visitor agrees. | Start it only after consent. |

There are 20 smaller points in total. See [`findings.md`](findings.md) for the full list with evidence.

## Code for the fixes

Short example code for each fix is in the [`recommendations/`](recommendations) folder:

| Fix | File |
|---|---|
| Safety headers, one redirect rule, caching | [`next.config.js`](recommendations/next.config.js) |
| Correct page links and share tags | [`metadata.tsx`](recommendations/metadata.tsx), [`generate-metadata.tsx`](recommendations/generate-metadata.tsx) |
| Fewer background loads | [`prefetch-and-isr.tsx`](recommendations/prefetch-and-isr.tsx) |
| Safer contact form (checks, limits, bot trap) | [`inquiry-route.ts`](recommendations/inquiry-route.ts) |
| Safer job applications | [`careers-upload-route.ts`](recommendations/careers-upload-route.ts) |
| Login protection for admin and portal | [`robots-and-middleware.ts`](recommendations/robots-and-middleware.ts) |
| One site address and a correct sitemap | [`sitemap.ts`](recommendations/sitemap.ts) |
| Analytics consent and newsletter confirmation | [`consent-and-newsletter.ts`](recommendations/consent-and-newsletter.ts) |
| Restricting who can call the API | [`cors.ts`](recommendations/cors.ts) |
| Health check | [`health-route.ts`](recommendations/health-route.ts) |
| Hiding plain-text contact details and a smaller icon set | [`contact-and-icons.tsx`](recommendations/contact-and-icons.tsx) |

## What to fix first

1. Add the safety headers (easy).
2. Make the contact form check data on the server.
3. Protect the admin and portal areas.
4. Safer job applications.
5. Fix the `www` confusion (one setting).
6. Everything else.

## What I did not test

- I did not send forms or log in, so server checks, limits and login safety are **unknown**.
- The code examples are samples and are **not tested**.
- The company's own claims (like "99.9% uptime") cannot be checked from outside.
- Some points are my best guess from patterns, and are marked "inference" in [`findings.md`](findings.md).

## Evidence

Screenshots and raw results are in the [`evidence/`](evidence) folder: the Network tab, the headers, the sitemap and the robots file.

## Summary

The site is built on a sound, fast setup. Most problems are small and easy to fix, and many come from one settings mistake. The biggest things to improve are the safety checks on forms and the protection of the admin and portal areas.
