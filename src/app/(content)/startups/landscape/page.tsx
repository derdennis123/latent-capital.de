import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { createMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "German AI Startup Landscape",
    description:
      "Interaktive Übersicht der deutschen AI-Startup-Landschaft nach Kategorie, Funding-Phase und Standort.",
    url: "/startups/landscape",
  });
}

export default function StartupLandscapePage() {
  return (
    <Container className="py-16">
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          German AI Startup Landscape
        </h1>
        <p className="text-[#666] text-lg max-w-2xl">
          Eine interaktive Übersicht der deutschen AI-Startup-Landschaft,
          kategorisiert nach Branche, Funding-Phase und Standort.
        </p>
      </header>

      <div className="glass rounded-2xl p-16 text-center max-w-2xl mx-auto">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#6C5CE7]/10 mb-6">
          <svg
            className="w-8 h-8 text-[#6C5CE7]"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5"
            />
          </svg>
        </div>
        <h2 className="font-serif text-2xl font-bold mb-3">Coming Soon</h2>
        <p className="text-[#666]">
          Die interaktive Startup-Landscape-Karte wird derzeit entwickelt.
          Abonniere unseren Newsletter, um benachrichtigt zu werden, sobald
          sie verfügbar ist.
        </p>
      </div>
    </Container>
  );
}
