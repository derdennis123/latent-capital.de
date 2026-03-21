import type { Metadata } from "next";
import Container from "@/components/layout/Container";
import { createMetadata } from "@/lib/seo/metadata";

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "AI Startup Funding Tracker",
    description:
      "Aktuelle Funding-Runden, Investitionen und Finanzierungstrends im deutschen AI-Startup-Ökosystem.",
    url: "/startups/funding",
  });
}

export default function StartupFundingPage() {
  return (
    <Container className="py-16">
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          AI Startup Funding Tracker
        </h1>
        <p className="text-[#666] text-lg max-w-2xl">
          Aktuelle Funding-Runden, Investitionen und Finanzierungstrends im
          deutschen AI-Startup-Ökosystem.
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
              d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 className="font-serif text-2xl font-bold mb-3">Coming Soon</h2>
        <p className="text-[#666]">
          Der Funding Tracker wird derzeit entwickelt. Abonniere unseren
          Newsletter, um benachrichtigt zu werden, sobald er verfügbar ist.
        </p>
      </div>
    </Container>
  );
}
