import type { Metadata } from "next";
import Link from "next/link";
import Container from "@/components/layout/Container";
import GlassCard from "@/components/ui/GlassCard";
import { getTags } from "@/lib/ghost";
import { createMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;

export function generateMetadata(): Metadata {
  return createMetadata({
    title: "Themen",
    description:
      "Alle Themenfelder rund um Künstliche Intelligenz: Infrastruktur, Foundation Models, Agents, Regulierung und mehr.",
    url: "/themen",
  });
}

const TOPICS = [
  {
    slug: "infrastructure",
    name: "AI Infra & Compute",
    description:
      "Cloud, Chips, Rechenzentren und die Infrastruktur hinter der AI-Revolution.",
  },
  {
    slug: "models",
    name: "Foundation Models & Research",
    description:
      "LLMs, Multimodal Models, Benchmarks und die neueste AI-Forschung.",
  },
  {
    slug: "agents",
    name: "AI Agents & Automation",
    description:
      "Autonome Agenten, Workflow-Automation und die Zukunft der Arbeit mit AI.",
  },
  {
    slug: "regulation",
    name: "European AI & Regulation",
    description:
      "AI Act, Datenschutz, Governance und die europäische AI-Politik.",
  },
  {
    slug: "finance",
    name: "AI x Finance",
    description:
      "AI im Finanzsektor, Krypto-Schnittstellen und algorithmische Strategien.",
  },
  {
    slug: "tutorials",
    name: "Playbooks",
    description:
      "Praktische Anleitungen und Tutorials für den Einsatz von AI-Tools.",
  },
];

export default async function ThemenPage() {
  let ghostTags: { slug: string; count?: { posts: number } }[] = [];

  try {
    ghostTags = await getTags();
  } catch {
    // Ghost not available - show topics without post counts
  }

  const tagCountMap = new Map(
    ghostTags.map((t) => [t.slug, t.count?.posts ?? 0])
  );

  return (
    <Container className="py-16">
      <header className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
          Themen
        </h1>
        <p className="text-[#666] text-lg max-w-2xl">
          Entdecke unsere Themenfelder — von AI-Infrastruktur über Foundation
          Models bis hin zu Regulierung und praktischen Playbooks.
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {TOPICS.map((topic) => {
          const postCount = tagCountMap.get(topic.slug) ?? 0;

          return (
            <Link key={topic.slug} href={`/themen/${topic.slug}`}>
              <GlassCard hover className="p-8 h-full">
                <h2 className="font-serif text-xl font-bold mb-2">
                  {topic.name}
                </h2>
                <p className="text-sm text-[#666] leading-relaxed mb-4">
                  {topic.description}
                </p>
                {postCount > 0 && (
                  <p className="text-xs text-[#999]">
                    {postCount} {postCount === 1 ? "Artikel" : "Artikel"}
                  </p>
                )}
              </GlassCard>
            </Link>
          );
        })}
      </div>
    </Container>
  );
}
