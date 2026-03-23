import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { createMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Impressum",
    description: "Impressum und Angaben gemäß § 5 TMG von Latent Capital.",
    url: "/impressum",
  });
}

export default function ImpressumPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-3xl">
        <h1
          className="font-serif text-4xl md:text-5xl font-bold mb-12"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Impressum
        </h1>

        <div className="space-y-10 text-[#444] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
          <section>
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">
              Angaben gemäß § 5 TMG
            </h2>
            <p>
              holidayhunter UG &amp; Co. KG
              <br />
              Silbeker Weg 35
              <br />
              33142 Büren
              <br />
              Deutschland
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">
              Vertreten durch
            </h2>
            <p>
              Persönlich haftende Gesellschafterin: holidayhunter
              Geschäftsführungs-UG
              <br />
              Geschäftsführer: Dennis Grote
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">
              Kontakt
            </h2>
            <p>
              E-Mail:{" "}
              <a
                href="mailto:hello@latent-capital.de"
                className="text-[#6C5CE7] hover:underline"
              >
                hello@latent-capital.de
              </a>
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">
              Handelsregister
            </h2>
            <p>
              Registergericht: Amtsgericht Paderborn
              <br />
              Registernummer: HRA 6540
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">
              Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV
            </h2>
            <p>
              Dennis Grote
              <br />
              Silbeker Weg 35
              <br />
              33142 Büren
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#1a1a1a] mb-3">
              Streitschlichtung
            </h2>
            <p>
              Die Europäische Kommission stellt eine Plattform zur
              Online-Streitbeilegung (OS) bereit:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6C5CE7] hover:underline"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
            </p>
            <p className="mt-3">
              Wir sind nicht bereit oder verpflichtet, an
              Streitbeilegungsverfahren vor einer
              Verbraucherschlichtungsstelle teilzunehmen.
            </p>
          </section>
        </div>
      </div>
    </Container>
  );
}
