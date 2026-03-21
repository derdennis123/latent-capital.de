import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Container from "@/components/layout/Container";
import PostGrid from "@/components/posts/PostGrid";
import { getPostsByTag, getTagBySlug } from "@/lib/ghost";
import { createMetadata } from "@/lib/seo/metadata";

export const revalidate = 300;

const TOPIC_SLUGS = [
  "infrastructure",
  "models",
  "agents",
  "regulation",
  "finance",
  "tutorials",
];

const TOPIC_INTROS: Record<string, { title: string; description: string }> = {
  infrastructure: {
    title: "AI Infra & Compute",
    description:
      "Cloud, Chips, Rechenzentren und die Infrastruktur hinter der AI-Revolution. Von GPU-Clustern über Custom Silicon bis hin zu europäischen Sovereign-Cloud-Initiativen.",
  },
  models: {
    title: "Foundation Models & Research",
    description:
      "LLMs, Multimodal Models, Benchmarks und die neueste AI-Forschung. Analysen zu GPT, Claude, Gemini, Llama und den neuesten Open-Source-Modellen.",
  },
  agents: {
    title: "AI Agents & Automation",
    description:
      "Autonome Agenten, Workflow-Automation und die Zukunft der Arbeit mit AI. Von Coding-Agents über Research-Assistenten bis zu Enterprise-Automation.",
  },
  regulation: {
    title: "European AI & Regulation",
    description:
      "AI Act, Datenschutz, Governance und die europäische AI-Politik. Wie Regulierung Innovation formt und was Unternehmen wissen müssen.",
  },
  finance: {
    title: "AI x Finance",
    description:
      "AI im Finanzsektor, algorithmische Strategien und die Schnittstellen zwischen künstlicher Intelligenz und Kapitalmärkten.",
  },
  tutorials: {
    title: "Playbooks",
    description:
      "Praktische Anleitungen und Tutorials für den Einsatz von AI-Tools. Hands-on Guides für Entwickler, Product Manager und Entscheider.",
  },
};

export function generateStaticParams() {
  return TOPIC_SLUGS.map((slug) => ({ slug }));
}

interface TopicPageProps {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}

export async function generateMetadata({
  params,
}: TopicPageProps): Promise<Metadata> {
  const { slug } = await params;
  const topic = TOPIC_INTROS[slug];

  if (!topic) return {};

  try {
    const tag = await getTagBySlug(slug);
    return createMetadata({
      title: tag?.name ?? topic.title,
      description: tag?.description ?? topic.description,
      url: `/themen/${slug}`,
    });
  } catch {
    return createMetadata({
      title: topic.title,
      description: topic.description,
      url: `/themen/${slug}`,
    });
  }
}

export default async function TopicPage({ params, searchParams }: TopicPageProps) {
  const { slug } = await params;
  const { page: pageParam } = await searchParams;
  const currentPage = Number(pageParam) || 1;

  const topic = TOPIC_INTROS[slug];
  if (!topic) notFound();

  try {
    const postsResponse = await getPostsByTag(slug, {
      page: currentPage,
      limit: 12,
    });

    return (
      <Container className="py-16">
        <header className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            {topic.title}
          </h1>
          <p className="text-[#666] text-lg max-w-2xl">
            {topic.description}
          </p>
        </header>

        {postsResponse.posts.length > 0 ? (
          <PostGrid posts={postsResponse.posts} />
        ) : (
          <div className="glass rounded-2xl p-12 text-center">
            <p className="text-[#666]">
              Noch keine Artikel zu diesem Thema. Schau bald wieder vorbei.
            </p>
          </div>
        )}
      </Container>
    );
  } catch {
    return (
      <Container className="py-16">
        <header className="mb-12">
          <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">
            {topic.title}
          </h1>
          <p className="text-[#666] text-lg max-w-2xl">
            {topic.description}
          </p>
        </header>
        <div className="glass rounded-2xl p-12 text-center">
          <p className="text-[#666]">
            Inhalte konnten nicht geladen werden. Bitte versuche es später
            erneut.
          </p>
        </div>
      </Container>
    );
  }
}
