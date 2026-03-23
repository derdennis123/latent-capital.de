"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function CheckoutBanner() {
  const searchParams = useSearchParams();
  const success = searchParams.get("success");
  const cancelled = searchParams.get("cancelled");

  if (success === "true") {
    return (
      <div className="mx-auto max-w-2xl mb-12 p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-[#6C5CE7]/20 text-center">
        <div className="text-4xl mb-4">&#10003;</div>
        <h2
          className="text-2xl font-bold text-[#1a1a1a] mb-3"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Willkommen bei Latent Capital Premium!
        </h2>
        <p
          className="text-[#666] leading-relaxed mb-6"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Wir haben dir eine E-Mail mit einem Login-Link geschickt. Klicke den
          Link um dich einzuloggen und alle Inhalte freizuschalten.
        </p>
        <Link
          href="/"
          className="inline-block py-2.5 px-6 rounded-full bg-[#6C5CE7] text-white font-medium text-sm hover:bg-[#5A4BD1] transition-colors"
        >
          Zur Startseite
        </Link>
      </div>
    );
  }

  if (cancelled === "true") {
    return (
      <div className="mx-auto max-w-2xl mb-12 p-6 rounded-2xl bg-white/60 backdrop-blur-xl border border-black/5 text-center">
        <p
          className="text-[#666]"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Zahlung abgebrochen. Du kannst es jederzeit erneut versuchen.
        </p>
      </div>
    );
  }

  return null;
}
