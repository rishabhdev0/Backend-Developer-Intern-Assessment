// F9: validated, rate-limited, spam-resistant inquiry endpoint
// File: app/api/inquiry/route.ts
import { z } from "zod";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { queue } from "@/lib/queue"; // e.g. BullMQ / SQS wrapper

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(5, "15 m"),
});

const Inquiry = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().email().max(254),
  company: z.string().trim().max(120).optional(),
  industry: z.string().trim().max(80).optional(),
  message: z.string().trim().min(10).max(2000),
  website: z.string().max(0).optional(), // honeypot: must stay empty
});

// Consistent error contract: { error, requestId } and never a stack trace
function problem(status: number, error: string, extra: object = {}) {
  return Response.json({ error, requestId: crypto.randomUUID(), ...extra }, { status });
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "anon";
  const { success, reset } = await ratelimit.limit(ip);
  if (!success) {
    return Response.json(
      { error: "rate_limited" },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((reset - Date.now()) / 1000)) },
      }
    );
  }

  const parsed = Inquiry.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return problem(422, "validation_failed", { fields: parsed.error.flatten().fieldErrors });
  }

  // Bots fill the hidden field: pretend success, drop silently
  if (parsed.data.website) return Response.json({ status: "accepted" }, { status: 202 });

  // Async: never block the request on SMTP
  await queue.add("inquiry-email", parsed.data, {
    attempts: 3,
    backoff: { type: "exponential", delay: 2000 },
  });

  return Response.json({ status: "accepted" }, { status: 202 });
}
