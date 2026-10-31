// F12: health endpoint. File: app/api/health/route.ts
// Pair with an external uptime monitor and a public status page.
export const GET = () => Response.json({ status: "ok", ts: Date.now() });
