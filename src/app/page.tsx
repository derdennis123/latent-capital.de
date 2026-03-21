import Container from "@/components/layout/Container";
import HeroSection from "@/components/home/HeroSection";
import CategoryPreview from "@/components/home/CategoryPreview";
import NewsletterCTA from "@/components/home/NewsletterCTA";
import PostCardFeatured from "@/components/posts/PostCardFeatured";
import { getFeaturedPosts, getPostsByTag } from "@/lib/ghost";

export const revalidate = 300;

export default async function HomePage() {
  try {
    const [featuredPosts, deepDives, startups, interviews] = await Promise.all([
      getFeaturedPosts(1),
      getPostsByTag("deep-dive", { limit: 4 }),
      getPostsByTag("startup", { limit: 4 }),
      getPostsByTag("interview", { limit: 4 }),
    ]);

    const featured = featuredPosts[0] ?? null;

    return (
      <>
        <HeroSection />

        <Container className="py-12">
          {featured && (
            <section className="mb-16">
              <PostCardFeatured post={featured} />
            </section>
          )}

          <CategoryPreview
            title="Deep Dives"
            description="Tiefgehende Analysen zu AI-Technologien und deren Auswirkungen"
            posts={deepDives.posts}
            href="/deep-dives"
            className="mb-16"
          />

          <CategoryPreview
            title="AI Startups"
            description="Die spannendsten AI-Startups aus Deutschland und Europa"
            posts={startups.posts}
            href="/startups"
            className="mb-16"
          />

          <CategoryPreview
            title="Interviews"
            description="Gespräche mit den Köpfen hinter Deutschlands AI-Szene"
            posts={interviews.posts}
            href="/interviews"
            className="mb-16"
          />
        </Container>

        <NewsletterCTA />
      </>
    );
  } catch {
    return (
      <>
        <HeroSection />

        <Container className="py-20">
          <div className="glass rounded-2xl p-12 text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-2xl font-bold mb-4">
              Inhalte werden geladen...
            </h2>
            <p className="text-muted">
              Die Verbindung zum CMS konnte nicht hergestellt werden. Bitte
              versuche es später erneut.
            </p>
          </div>
        </Container>

        <NewsletterCTA />
      </>
    );
  }
}
