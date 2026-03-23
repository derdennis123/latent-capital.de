import type { Metadata } from "next";
import { Suspense } from "react";
import Container from "@/components/layout/Container";
import { createMetadata } from "@/lib/seo/metadata";
import CheckoutBanner from "./CheckoutBanner";
import MembershipContent from "./MembershipContent";

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
      <Suspense fallback={null}>
        <CheckoutBanner />
      </Suspense>
      <MembershipContent />
    </Container>
  );
}
