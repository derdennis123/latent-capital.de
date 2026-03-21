import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { createMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Datenschutzerklärung",
    description:
      "Datenschutzerklärung von Latent Capital gemäß DSGVO.",
    url: "/datenschutz",
  });
}

export default function DatenschutzPage() {
  return (
    <Container className="py-16">
      <div className="mx-auto max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">
          Datenschutzerklärung
        </h1>
        <div className="glass rounded-2xl p-8 text-center text-[#999]">
          [Datenschutzerklärung wird hier eingefügt — Informationen gemäß DSGVO]
        </div>
      </div>
    </Container>
  );
}
