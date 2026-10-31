// F10: consent-gated analytics (client component) and double opt-in newsletter

// --- Analytics loaded only after consent (components/Analytics.tsx) ---
/*
import Script from "next/script";

export function Analytics({ consentGiven }: { consentGiven: boolean }) {
  if (!consentGiven) return null;
  return (
    <Script
      src="https://www.googletagmanager.com/gtag/js?id=G-XXXX"
      strategy="lazyOnload"
    />
  );
}
*/

// --- Newsletter: store consent, activate only after the email link is clicked ---
export async function subscribe(email: string, db: any, sendMail: any) {
  const token = crypto.randomUUID();
  await db.subscriber.upsert({
    where: { email },
    create: { email, token, status: "pending", consentAt: new Date() },
    update: {},
  });
  await sendMail(email, `https://www.cynbit.in/newsletter/confirm?token=${token}`);
  // Mark status "active" only when /newsletter/confirm is visited.
  // Include an unsubscribe link in every email.
}
