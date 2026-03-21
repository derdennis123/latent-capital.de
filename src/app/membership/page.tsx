import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import PricingCard from "@/components/membership/PricingCard";
import { createMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Membership",
    description:
      "Werde Mitglied bei Latent Capital und erhalte Zugang zu exklusiven Deep Dives, Playbooks und der AI-Community.",
    url: "/membership",
  });
}

export default function MembershipPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-2xl text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          Membership
        </h1>
        <p className="text-[#666] text-lg">
          Wähle den Plan, der zu dir passt. Alle Mitglieder erhalten Zugang zum
          wöchentlichen Newsletter mit AI-Analysen.
        </p>
      </div>

      <div className="mx-auto max-w-4xl grid gap-8 lg:grid-cols-2">
        <PricingCard
          tier={{
            name: "Free",
            price: "€0",
            features: [
              "Wöchentlicher Newsletter",
              "Zugang zu allen öffentlichen Artikeln",
              "Deep Dives & Startup-Analysen",
              "Interviews & Insights",
              "RSS Feed",
            ],
            ctaLabel: "Kostenlos registrieren",
            ctaHref: "/newsletter",
          }}
        />

        <PricingCard
          tier={{
            name: "Premium",
            price: "€12 / Monat",
            highlighted: true,
            features: [
              "Alles aus Free",
              "Exklusive Playbooks & Tutorials",
              "Erweiterte Startup-Analysen",
              "Frühzeitiger Zugang zu neuen Features",
              "Zugang zur Member-Community",
              "Archiv aller Premium-Inhalte",
            ],
            ctaLabel: "Premium werden",
            ctaHref: "/newsletter",
          }}
        />
      </div>

      <div className="mx-auto mt-20 max-w-3xl">
        <h2 className="font-serif text-2xl font-bold text-center mb-8">
          Feature-Vergleich
        </h2>
        <div className="glass overflow-hidden rounded-2xl">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-black/5">
                <th className="px-6 py-4 font-medium text-[#666]">Feature</th>
                <th className="px-6 py-4 text-center font-medium text-[#666]">
                  Free
                </th>
                <th className="px-6 py-4 text-center font-medium text-[#6C5CE7]">
                  Premium
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/5">
              {(
                [
                  ["Wöchentlicher Newsletter", true, true],
                  ["Öffentliche Artikel", true, true],
                  ["Deep Dives", true, true],
                  ["Startup-Analysen", true, true],
                  ["Playbooks & Tutorials", false, true],
                  ["Erweiterte Analysen", false, true],
                  ["Member-Community", false, true],
                  ["Premium-Archiv", false, true],
                ] as const
              ).map(([feature, free, premium]) => (
                <tr key={feature}>
                  <td className="px-6 py-3 text-[#333]">{feature}</td>
                  <td className="px-6 py-3 text-center">
                    {free ? (
                      <span className="text-green-600">&#10003;</span>
                    ) : (
                      <span className="text-[#ccc]">&mdash;</span>
                    )}
                  </td>
                  <td className="px-6 py-3 text-center">
                    {premium ? (
                      <span className="text-[#6C5CE7]">&#10003;</span>
                    ) : (
                      <span className="text-[#ccc]">&mdash;</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Container>
  );
}
