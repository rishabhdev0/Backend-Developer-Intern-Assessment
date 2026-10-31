// F11: do not publish every email and phone number as plain text in the footer
// F16: stop loading the full Google icon font

// ---------- F11: simple scrape-resistant contact link (client component) ----------
"use client";
import { useEffect, useState } from "react";

export function ContactEmail() {
  const [email, setEmail] = useState("");
  // Assemble after load so basic scrapers reading raw HTML do not find it
  useEffect(() => setEmail(["opportunities", "cynbit.in"].join("@")), []);
  return email ? <a href={`mailto:${email}`}>{email}</a> : <span>Contact us</span>;
}
// Better still: keep one contact route (/contact) and let the form do the work.

// ---------- F16: inline SVG icons instead of the full Material Symbols font ----------
// Option A: use a small icon library with tree-shaking
//   import { Mail, Phone } from "lucide-react";
//   <Mail size={20} />
//
// Option B: self-host a subset of the icon font with next/font/local
//   import localFont from "next/font/local";
//   const icons = localFont({ src: "./material-symbols-subset.woff2", display: "swap" });
//
// Either way, this removes a cross-origin request to fonts.googleapis.com
