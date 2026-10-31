// F5: stop prefetching low-priority routes on every page load
import Link from "next/link";

export function FooterLinks() {
  return <Link href="/careers" prefetch={false}>Careers</Link>;
}

// F6: in routes that render dynamically (careers, case-studies, blog, diaries),
// serve from cache and refresh hourly instead of rendering on each request.
export const revalidate = 3600;
