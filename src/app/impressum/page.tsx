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
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">
          Impressum
        </h1>
        <div className="glass rounded-2xl p-8 text-center text-[#999]">
          [Impressum wird hier eingefügt — Angaben gemäß § 5 TMG]
        </div>
      </div>
    </Container>
  );
}
