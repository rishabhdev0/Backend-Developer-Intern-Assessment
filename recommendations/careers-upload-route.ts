// F14: safe handling of career applications (illustrative)
// File: app/api/apply/route.ts
import { z } from "zod";

const Application = z.object({
  fullName: z.string().trim().min(2).max(100),
  email: z.string().email().max(254),
  roleSlug: z.string().regex(/^[a-z0-9-]{3,80}$/),
  consent: z.literal(true), // explicit consent required
});

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED = new Set(["application/pdf"]);

export async function POST(req: Request) {
  const form = await req.formData();
  const parsed = Application.safeParse({
    fullName: form.get("fullName"),
    email: form.get("email"),
    roleSlug: form.get("roleSlug"),
    consent: form.get("consent") === "true",
  });
  if (!parsed.success) {
    return Response.json({ error: "validation_failed" }, { status: 422 });
  }

  const file = form.get("resume");
  if (file instanceof File) {
    if (!ALLOWED.has(file.type) || file.size > MAX_BYTES) {
      return Response.json({ error: "invalid_file" }, { status: 422 });
    }
    // Verify magic bytes (%PDF), scan for malware, store privately
    // (object storage, server-side encryption), never serve from a public path.
  }

  // Store consent timestamp and a retention date; delete after the hiring cycle.
  return Response.json({ status: "received" }, { status: 202 });
}
