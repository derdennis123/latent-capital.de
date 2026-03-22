import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { createMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Premium werden",
    description:
      "Werde Premium-Mitglied bei Latent Capital. Vollständiger Zugang zu allen Deep Dives, Premium-Newsletter und exklusiven Analysen.",
    url: "/membership",
  });
}

export default function MembershipPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h1
          className="font-serif text-4xl md:text-5xl font-bold mb-4"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Premium werden
        </h1>
        <p
          className="text-[#666] text-lg"
          style={{ fontFamily: "Inter, sans-serif" }}
        >
          Vollständiger Zugang zu allen Deep Dives, exklusiven Analysen und dem
          Premium-Newsletter.
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="mx-auto max-w-4xl grid gap-8 lg:grid-cols-2">
        {/* Monthly */}
        <div className="relative bg-white/60 backdrop-blur-xl rounded-2xl border border-black/5 p-8 flex flex-col">
          <h3
            className="text-xl font-bold text-[#1a1a1a] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Monatlich
          </h3>
          <div className="mb-6">
            <span
              className="text-3xl font-bold text-[#1a1a1a]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              &euro;19
            </span>
            <span
              className="text-sm text-[#666] ml-1"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              / Monat
            </span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {[
              "Alle Artikel vollständig lesen",
              "Premium Deep Dives per E-Mail",
              "Archiv aller Premium-Inhalte",
              "Jederzeit kündbar",
            ].map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm text-[#666]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#999"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 mt-0.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <a
            href="#"
            className="inline-flex items-center justify-center w-full py-3 px-8 rounded-full bg-white/60 backdrop-blur-md border border-black/5 text-[#1a1a1a] font-medium text-sm hover:bg-white/80 transition-all"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Monatlich starten
          </a>
        </div>

        {/* Yearly */}
        <div className="relative bg-white/60 backdrop-blur-xl rounded-2xl border border-[#6C5CE7]/30 ring-1 ring-[#6C5CE7]/20 p-8 flex flex-col">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <span
              className="inline-block bg-[#6C5CE7] text-white text-xs font-medium px-4 py-1 rounded-full"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              2 Monate gratis
            </span>
          </div>
          <h3
            className="text-xl font-bold text-[#1a1a1a] mb-2"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Jährlich
          </h3>
          <div className="mb-6">
            <span
              className="text-3xl font-bold text-[#1a1a1a]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              &euro;149
            </span>
            <span
              className="text-sm text-[#666] ml-1"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              / Jahr
            </span>
            <span
              className="block text-xs text-[#6C5CE7] mt-1"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Entspricht &euro;12,42 / Monat
            </span>
          </div>
          <ul className="space-y-3 mb-8 flex-1">
            {[
              "Alle Artikel vollständig lesen",
              "Premium Deep Dives per E-Mail",
              "Archiv aller Premium-Inhalte",
              "2 Monate kostenlos",
            ].map((feature) => (
              <li
                key={feature}
                className="flex items-start gap-3 text-sm text-[#666]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6C5CE7"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0 mt-0.5"
                >
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span>{feature}</span>
              </li>
            ))}
          </ul>
          <a
            href="#"
            className="inline-flex items-center justify-center w-full py-3 px-8 rounded-full bg-[#6C5CE7] text-white font-medium text-sm hover:bg-[#5A4BD1] transition-colors shadow-sm hover:shadow-md"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Jährlich starten
          </a>
        </div>
      </div>

      {/* What you get */}
      <div className="mx-auto mt-20 max-w-2xl text-center">
        <h2
          className="font-serif text-2xl font-bold mb-8"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Was du bekommst
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 text-left">
          {[
            {
              title: "Premium Deep Dives",
              desc: "Vollständige Analysen zu Foundation Models, AI-Startups und Markttrends — direkt in dein Postfach.",
            },
            {
              title: "Unbegrenzter Zugang",
              desc: "Alle Artikel auf latent-capital.de ohne Paywall. Plus Zugriff auf das vollständige Archiv.",
            },
            {
              title: "Wöchentlicher Newsletter",
              desc: "Das kostenlose AI-Briefing bekommst du natürlich weiterhin — plus den exklusiven Premium-Newsletter.",
            },
            {
              title: "Jederzeit kündbar",
              desc: "Keine Vertragsbindung. Du kannst dein Abo jederzeit zum Ende der Laufzeit kündigen.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="bg-white/60 backdrop-blur-xl rounded-xl border border-black/5 p-6"
            >
              <h3
                className="font-semibold text-[#1a1a1a] mb-2"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {item.title}
              </h3>
              <p
                className="text-sm text-[#666] leading-relaxed"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Container>
  );
}
