import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import GlassCard from "@/components/ui/GlassCard";
import { createMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Über uns",
    description:
      "Die Mission hinter Latent Capital: AI-Intelligence für den deutschsprachigen Raum.",
    url: "/about",
  });
}

export default function AboutPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-12">
          Über Latent Capital
        </h1>

        <div className="space-y-8">
          <GlassCard className="p-8">
            <h2 className="font-serif text-2xl font-bold mb-4">Mission</h2>
            <div className="space-y-4 text-[#666] leading-relaxed">
              <p>
                Latent Capital liefert strategische AI-Intelligence für
                Entscheider, Gründer und Investoren im deutschsprachigen Raum.
                Wir analysieren die wichtigsten Entwicklungen in Künstlicher
                Intelligenz — von Foundation Models über Startup-Ökosysteme bis
                hin zu regulatorischen Veränderungen.
              </p>
              <p>
                Unser Ziel: Die Lücke zwischen der englischsprachigen
                AI-Berichterstattung und dem deutschsprachigen Markt schließen.
                Mit fundierter Analyse statt Hype, strategischer Einordnung
                statt Nachrichtenticker.
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="font-serif text-2xl font-bold mb-4">Der Autor</h2>
            <div className="space-y-4 text-[#666] leading-relaxed">
              <p>
                [Hier werden Informationen über den Autor eingefügt —
                Hintergrund, Expertise und Motivation hinter Latent Capital.]
              </p>
            </div>
          </GlassCard>

          <GlassCard className="p-8">
            <h2 className="font-serif text-2xl font-bold mb-4">Kontakt</h2>
            <div className="text-[#666]">
              <p>Für Anfragen, Kooperationen oder Feedback:</p>
              <p className="mt-2">
                <a
                  href="mailto:kontakt@latent-capital.de"
                  className="text-[#6C5CE7] underline underline-offset-2"
                >
                  kontakt@latent-capital.de
                </a>
              </p>
            </div>
          </GlassCard>
        </div>
      </div>
    </Container>
  );
}
