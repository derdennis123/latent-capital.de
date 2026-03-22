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
        Noch kein Premium-Mitglied?{" "}
        <Link href="/membership" className="text-[#6C5CE7] hover:underline">
          Jetzt Premium werden
        </Link>
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
            Premium-Login
          </h1>
          <p className="text-[#666]">
            Anmelden für Premium-Mitglieder. Gib deine E-Mail-Adresse ein
            und wir senden dir einen Login-Link.
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
