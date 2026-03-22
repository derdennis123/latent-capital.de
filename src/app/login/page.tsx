"use client";

import { useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Container from "@/components/layout/Container";
import GlassCard from "@/components/ui/GlassCard";

const ERROR_MESSAGES: Record<string, string> = {
  invalid_token: "Der Link ist ungültig. Bitte fordere einen neuen an.",
  expired: "Der Link ist abgelaufen. Bitte fordere einen neuen an.",
  server: "Ein Fehler ist aufgetreten. Bitte versuche es erneut.",
  google_denied: "Google-Anmeldung wurde abgebrochen.",
  google_failed: "Google-Anmeldung fehlgeschlagen. Bitte versuche es erneut.",
};

function LoginForm() {
  const searchParams = useSearchParams();
  const errorCode = searchParams.get("error");

  const [email, setEmail] = useState("");
  const [state, setState] = useState<
    "idle" | "loading" | "sent" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/auth/send-magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        throw new Error(data.error || "Fehler beim Senden");
      }

      setState("sent");
    } catch (err) {
      setState("error");
      setErrorMsg(
        err instanceof Error ? err.message : "Ein Fehler ist aufgetreten."
      );
    }
  }

  if (state === "sent") {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">&#9993;</div>
        <h2
          className="text-2xl font-bold mb-3 text-[#1a1a1a]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Check dein Postfach
        </h2>
        <p className="text-[#666] mb-6">
          Wir haben dir einen Login-Link an{" "}
          <span className="font-medium text-[#1a1a1a]">{email}</span>{" "}
          geschickt.
        </p>
        <p className="text-sm text-[#999]">
          Kein Link erhalten?{" "}
          <button
            onClick={() => setState("idle")}
            className="text-[#6C5CE7] hover:underline cursor-pointer"
          >
            Erneut senden
          </button>
        </p>
      </div>
    );
  }

  return (
    <>
      {errorCode && ERROR_MESSAGES[errorCode] && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-100 text-red-700 text-sm text-center">
          {ERROR_MESSAGES[errorCode]}
        </div>
      )}

      {/* Google Sign In */}
      <a
        href="/api/auth/google"
        className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-full border border-black/10 bg-white hover:bg-gray-50 transition-colors text-sm font-medium text-[#333]"
      >
        <svg width="18" height="18" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Mit Google anmelden
      </a>

      {/* Divider */}
      <div className="flex items-center gap-4 my-6">
        <div className="flex-1 h-px bg-black/10" />
        <span className="text-xs text-[#999] font-medium">ODER</span>
        <div className="flex-1 h-px bg-black/10" />
      </div>

      {/* Magic Link Form */}
      <form onSubmit={handleSubmit}>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-[#333] mb-2"
        >
          E-Mail-Adresse
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="deine@email.de"
          className="w-full px-4 py-3 rounded-xl border border-black/10 bg-white/80 text-[#1a1a1a] placeholder-[#999] focus:outline-none focus:ring-2 focus:ring-[#6C5CE7]/30 focus:border-[#6C5CE7] transition-all text-sm"
        />

        {state === "error" && errorMsg && (
          <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
        )}

        <button
          type="submit"
          disabled={state === "loading"}
          className="mt-4 w-full py-3 px-4 rounded-full bg-[#6C5CE7] text-white font-medium text-sm hover:bg-[#5A4BD1] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
        >
          {state === "loading" ? "Wird gesendet..." : "Magic Link senden"}
        </button>
      </form>

      <p className="mt-6 text-center text-xs text-[#999]">
        Mit der Anmeldung akzeptierst du unsere{" "}
        <Link href="/datenschutz" className="text-[#6C5CE7] hover:underline">
          Datenschutzrichtlinie
        </Link>
        .
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-md">
        <div className="text-center mb-8">
          <h1
            className="text-3xl font-bold text-[#1a1a1a] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Anmelden
          </h1>
          <p className="text-[#666]">
            Melde dich an oder erstelle ein kostenloses Konto.
          </p>
        </div>

        <GlassCard className="p-8">
          <Suspense fallback={null}>
            <LoginForm />
          </Suspense>
        </GlassCard>
      </div>
    </Container>
  );
}
