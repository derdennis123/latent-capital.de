"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthProvider";
import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";

export default function CheckoutBanner() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, refresh } = useAuth();
  const success = searchParams.get("success");
  const cancelled = searchParams.get("cancelled");
  const sessionId = searchParams.get("session_id");

  const [loginState, setLoginState] = useState<
    "idle" | "logging-in" | "success" | "error"
  >("idle");
  const [email, setEmail] = useState("");
  const [magicLinkState, setMagicLinkState] = useState<
    "idle" | "loading" | "sent" | "error"
  >("idle");
  const loginAttempted = useRef(false);

  // Instant login via Stripe session verification
  const attemptCheckoutLogin = useCallback(async () => {
    if (!sessionId || loginAttempted.current) return;
    loginAttempted.current = true;
    setLoginState("logging-in");

    try {
      const res = await fetch("/api/auth/checkout-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId }),
      });

      if (res.ok) {
        const data = (await res.json()) as {
          user: { status: string } | null;
        };
        if (
          data.user &&
          (data.user.status === "paid" || data.user.status === "comped")
        ) {
          setLoginState("success");
          await refresh();
          return;
        }
      }

      // Checkout login didn't result in paid status — fall back to manual flow
      setLoginState("error");
    } catch {
      setLoginState("error");
    }
  }, [sessionId, refresh]);

  // Trigger instant login when we have a session_id
  useEffect(() => {
    if (success === "true" && sessionId) {
      attemptCheckoutLogin();
    }
  }, [success, sessionId, attemptCheckoutLogin]);

  // Fallback: if user was already logged in and session refreshed shows paid
  useEffect(() => {
    if (
      success === "true" &&
      user &&
      (user.status === "paid" || user.status === "comped") &&
      loginState !== "success"
    ) {
      setLoginState("success");
    }
  }, [success, user, loginState]);

  // Redirect after successful login
  useEffect(() => {
    if (loginState === "success") {
      const timer = setTimeout(() => router.push("/"), 2500);
      return () => clearTimeout(timer);
    }
  }, [loginState, router]);

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
    // Login successful — show welcome message
    if (loginState === "success") {
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
            Dein Premium-Zugang ist aktiv. Du wirst gleich weitergeleitet...
          </p>
        </div>
      );
    }

    // Verifying payment / logging in
    if (loginState === "logging-in") {
      return (
        <div className="mx-auto max-w-2xl mb-12 p-8 rounded-2xl bg-white/60 backdrop-blur-xl border border-[#6C5CE7]/20 text-center">
          <div className="animate-spin text-4xl mb-4">&#9881;</div>
          <h2
            className="text-2xl font-bold text-[#1a1a1a] mb-3"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Zahlung wird verifiziert...
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

    // Instant login failed or no session_id — show magic link fallback
    if (loginState === "error" || !sessionId) {
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
