"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

export default function CheckoutBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, refresh } = useAuth();
  const success = searchParams.get("success");
  const cancelled = searchParams.get("cancelled");

  const [refreshing, setRefreshing] = useState(false);
  const [upgraded, setUpgraded] = useState(false);
  const [email, setEmail] = useState("");
  const [magicLinkState, setMagicLinkState] = useState<
    "idle" | "loading" | "sent" | "error"
  >("idle");

  // Auto-refresh session for logged-in users after successful checkout
  const attemptRefresh = useCallback(async () => {
    if (!user || upgraded || refreshing) return;

    setRefreshing(true);

    // Retry a few times — Ghost may need a moment to process the Stripe webhook
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        const res = await fetch("/api/auth/refresh", { method: "POST" });
        if (res.ok) {
          const data = (await res.json()) as {
            user: { status: string } | null;
          };
          if (
            data.user &&
            (data.user.status === "paid" || data.user.status === "comped")
          ) {
            setUpgraded(true);
            await refresh();
            return;
          }
        }
      } catch {
        // ignore, retry
      }

      // Wait before retrying (1s, 2s, 3s, 4s)
      if (attempt < 4) {
        await new Promise((r) => setTimeout(r, (attempt + 1) * 1000));
      }
    }

    setRefreshing(false);
  }, [user, upgraded, refreshing, refresh]);

  useEffect(() => {
    if (success === "true" && user && user.status === "free") {
      attemptRefresh();
    }
  }, [success, user, attemptRefresh]);

  // Redirect upgraded users to account
  useEffect(() => {
    if (upgraded) {
      const timer = setTimeout(() => router.push("/account"), 2000);
      return () => clearTimeout(timer);
    }
  }, [upgraded, router]);

  async function handleSendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setMagicLinkState("loading");
    try {
      const res = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setMagicLinkState("sent");
    } catch {
      setMagicLinkState("error");
    }
  }

  if (success === "true") {
    // User was logged in and upgrade succeeded
    if (upgraded) {
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
            className="text-[#666] leading-relaxed"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Dein Account wurde auf Premium aktualisiert. Du wirst gleich
            weitergeleitet...
          </p>
        </div>
      );
    }

    // User was logged in, still refreshing
    if (user && user.status === "free" && refreshing) {
      return (
        <div className="mx-auto max-w-2xl mb-12 p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-[#6C5CE7]/20 text-center">
          <div className="animate-spin text-4xl mb-4">&#9881;</div>
          <h2
            className="text-2xl font-bold text-[#1a1a1a] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Zahlung wird verarbeitet...
          </h2>
          <p
            className="text-[#666] leading-relaxed"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Dein Premium-Zugang wird aktiviert. Einen Moment bitte.
          </p>
        </div>
      );
    }

    // User was already paid (e.g. refreshed the page)
    if (user && (user.status === "paid" || user.status === "comped")) {
      return (
        <div className="mx-auto max-w-2xl mb-12 p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-[#6C5CE7]/20 text-center">
          <div className="text-4xl mb-4">&#10003;</div>
          <h2
            className="text-2xl font-bold text-[#1a1a1a] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Du bist Premium-Mitglied!
          </h2>
          <p
            className="text-[#666] leading-relaxed mb-6"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Du hast vollen Zugang zu allen Inhalten.
          </p>
          <Link
            href="/account"
            className="inline-block py-2.5 px-6 rounded-full bg-[#6C5CE7] text-white font-medium text-sm hover:bg-[#5A4BD1] transition-colors"
          >
            Zu deinem Konto
          </Link>
        </div>
      );
    }

    // User is NOT logged in — need to send magic link
    if (!user) {
      if (magicLinkState === "sent") {
        return (
          <div className="mx-auto max-w-2xl mb-12 p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-[#6C5CE7]/20 text-center">
            <div className="text-4xl mb-4">&#9993;</div>
            <h2
              className="text-2xl font-bold text-[#1a1a1a] mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Login-Link gesendet!
            </h2>
            <p
              className="text-[#666] leading-relaxed"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Wir haben dir einen Login-Link an{" "}
              <span className="font-medium text-[#1a1a1a]">{email}</span>{" "}
              geschickt. Klicke den Link um dich einzuloggen und alle
              Premium-Inhalte freizuschalten.
            </p>
          </div>
        );
      }

      return (
        <div className="mx-auto max-w-2xl mb-12 p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-[#6C5CE7]/20 text-center">
          <div className="text-4xl mb-4">&#10003;</div>
          <h2
            className="text-2xl font-bold text-[#1a1a1a] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Zahlung erfolgreich!
          </h2>
          <p
            className="text-[#666] leading-relaxed mb-6"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Gib deine E-Mail-Adresse ein um einen Login-Link zu erhalten und
            alle Premium-Inhalte freizuschalten.
          </p>
          <form
            onSubmit={handleSendMagicLink}
            className="max-w-sm mx-auto flex gap-2"
          >
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="deine@email.de"
              required
              className="flex-1 px-4 py-3 rounded-xl border border-black/10 bg-white/80 text-sm text-[#1a1a1a] placeholder:text-[#999] outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 transition-all"
              style={{ fontFamily: "Inter, sans-serif" }}
            />
            <button
              type="submit"
              disabled={magicLinkState === "loading"}
              className="px-6 py-3 rounded-xl bg-[#6C5CE7] text-white text-sm font-medium hover:bg-[#5A4BD1] transition-colors disabled:opacity-50 cursor-pointer"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {magicLinkState === "loading" ? "..." : "Senden"}
            </button>
          </form>
          {magicLinkState === "error" && (
            <p
              className="text-sm text-red-500 mt-3"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Etwas ist schiefgelaufen. Bitte versuche es erneut.
            </p>
          )}
        </div>
      );
    }

    // Fallback
    return null;
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
