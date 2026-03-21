import Container from "@/components/layout/Container";
import GlassCard from "@/components/ui/GlassCard";
import NewsletterForm from "@/components/ui/NewsletterForm";

interface NewsletterCTAProps {
  readerCount?: number;
}

export default function NewsletterCTA({ readerCount }: NewsletterCTAProps) {
  return (
    <section className="py-16">
      <Container>
        <GlassCard className="relative overflow-hidden p-8 sm:p-12 lg:p-16">
          {/* Purple accent bar */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#6C5CE7] to-[#a29bfe]" />

          <div className="max-w-2xl mx-auto text-center">
            <h2
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Bleib informiert
            </h2>
            <p
              className="text-[#666] text-base sm:text-lg leading-relaxed mb-8"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Die wichtigsten Entwicklungen aus dem deutschen AI-Ökosystem
              — kompakt und kuratiert, direkt in dein Postfach.
            </p>
            {readerCount && readerCount > 0 && (
              <p
                className="text-sm text-[#999] mb-6"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                Schließe dich{" "}
                <span className="font-semibold text-[#6C5CE7]">
                  {readerCount.toLocaleString("de-DE")}+
                </span>{" "}
                Leser:innen an
              </p>
            )}
            <div className="max-w-md mx-auto">
              <NewsletterForm />
            </div>
          </div>
        </GlassCard>
      </Container>
    </section>
  );
}
