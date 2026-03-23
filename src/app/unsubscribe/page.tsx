"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import Link from "next/link";
import Container from "@/components/layout/Container";
import GlassCard from "@/components/ui/GlassCard";

type State = "choose" | "loading" | "done" | "error" | "missing_uuid";

function UnsubscribeFlow() {
  const searchParams = useSearchParams();
  const uuid = searchParams.get("uuid");

  const [state, setState] = useState<State>(uuid ? "choose" : "missing_uuid");
  const [email, setEmail] = useState<string | null>(null);
  const [showResubscribe, setShowResubscribe] = useState(false);

  async function handleUnsubscribe(mode: "newsletter" | "all") {
    setState("loading");

    try {
      const res = await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uuid, mode }),
      });

      if (!res.ok) {
        const data = (await res.json()) as { error?: string };
        if (data.error === "member_not_found") {
          setState("error");
          return;
        }
        throw new Error(data.error || "Fehler");
      }

      const data = (await res.json()) as { email: string };
      setEmail(data.email);
      setState("done");
    } catch {
      setState("error");
    }
  }

  if (state === "missing_uuid") {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">&#128270;</div>
        <h2
          className="text-2xl font-bold mb-3 text-[#1a1a1a]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Link ung&uuml;ltig
        </h2>
        <p className="text-[#666] mb-6">
          Dieser Abmelde-Link ist nicht g&uuml;ltig. Bitte verwende den Link
          aus deiner E-Mail.
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

  if (state === "loading") {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4 animate-pulse">&#9993;</div>
        <p className="text-[#666]">Wird verarbeitet...</p>
      </div>
    );
  }

  if (state === "done") {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">&#10003;</div>
        <h2
          className="text-2xl font-bold mb-3 text-[#1a1a1a]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Du wurdest abgemeldet
        </h2>
        <p className="text-[#666] mb-6">
          {email && (
            <>
              <span className="font-medium text-[#1a1a1a]">{email}</span>{" "}
              erh&auml;lt keine weiteren E-Mails von uns.
            </>
          )}
          {!email && <>Du erh&auml;ltst keine weiteren E-Mails von uns.</>}
        </p>

        {!showResubscribe ? (
          <button
            onClick={() => setShowResubscribe(true)}
            className="text-sm text-[#6C5CE7] hover:underline cursor-pointer mb-6 block mx-auto"
          >
            War das ein Versehen? Wieder anmelden
          </button>
        ) : (
          <div className="mb-6">
            <p className="text-sm text-[#666] mb-3">
              Du kannst dich jederzeit &uuml;ber unsere Newsletter-Seite wieder
              anmelden.
            </p>
            <Link
              href="/newsletter"
              className="inline-block py-2.5 px-6 rounded-full bg-[#6C5CE7] text-white font-medium text-sm hover:bg-[#5A4BD1] transition-colors"
            >
              Newsletter wieder abonnieren
            </Link>
          </div>
        )}

        <Link
          href="/"
          className="inline-block text-sm text-[#999] hover:text-[#666] transition-colors"
        >
          &larr; Zur Startseite
        </Link>
      </div>
    );
  }

  if (state === "error") {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-4">&#9888;</div>
        <h2
          className="text-2xl font-bold mb-3 text-[#1a1a1a]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Etwas ist schiefgelaufen
        </h2>
        <p className="text-[#666] mb-6">
          Die Abmeldung konnte nicht durchgef&uuml;hrt werden. Bitte versuche
          es sp&auml;ter erneut oder kontaktiere uns.
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

  // state === "choose"
  return (
    <div className="py-4">
      <div className="text-center mb-8">
        <div className="text-4xl mb-4">&#9993;</div>
        <h2
          className="text-2xl font-bold mb-3 text-[#1a1a1a]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Newsletter abbestellen
        </h2>
        <p className="text-[#666]">
          W&auml;hle aus, welche E-Mails du nicht mehr erhalten m&ouml;chtest.
        </p>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => handleUnsubscribe("newsletter")}
          className="w-full text-left p-5 rounded-xl border border-black/10 bg-white/80 hover:bg-white/90 transition-all cursor-pointer group"
        >
          <div className="font-medium text-[#1a1a1a] mb-1 group-hover:text-[#6C5CE7] transition-colors">
            Nur Newsletter abmelden
          </div>
          <div className="text-sm text-[#666]">
            Du erh&auml;ltst keinen w&ouml;chentlichen Newsletter mehr, aber
            wichtige Account-E-Mails bleiben aktiv.
          </div>
        </button>

        <button
          onClick={() => handleUnsubscribe("all")}
          className="w-full text-left p-5 rounded-xl border border-black/10 bg-white/80 hover:bg-white/90 transition-all cursor-pointer group"
        >
          <div className="font-medium text-[#1a1a1a] mb-1 group-hover:text-[#6C5CE7] transition-colors">
            Alle E-Mails abmelden
          </div>
          <div className="text-sm text-[#666]">
            Du erh&auml;ltst keine E-Mails mehr von Latent Capital.
          </div>
        </button>
      </div>

      <div className="mt-6 text-center">
        <Link
          href="/"
          className="text-sm text-[#999] hover:text-[#666] transition-colors"
        >
          Abbrechen &mdash; zur&uuml;ck zur Startseite
        </Link>
      </div>
    </div>
  );
}

export default function UnsubscribePage() {
  return (
    <Container className="py-20">
      <div className="mx-auto max-w-md">
        <GlassCard className="p-8">
          <Suspense fallback={null}>
            <UnsubscribeFlow />
          </Suspense>
        </GlassCard>
      </div>
    </Container>
  );
}
