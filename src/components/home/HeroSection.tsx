import Container from "@/components/layout/Container";
import NewsletterForm from "@/components/ui/NewsletterForm";
import GlassBlob from "@/components/animations/GlassBlob";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40">
      {/* Decorative blobs */}
      <GlassBlob size="lg" className="absolute -top-20 -right-20 opacity-60" />
      <GlassBlob size="md" className="absolute top-40 -left-16 opacity-40" />
      <GlassBlob size="sm" className="absolute bottom-10 right-1/3 opacity-30" />

      <Container className="relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <h1
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#1a1a1a] leading-tight mb-6"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            AI Intelligence{" "}
            <span className="text-[#6C5CE7]">f&uuml;r Deutschland</span>
          </h1>
          <p
            className="text-lg sm:text-xl text-[#666] leading-relaxed mb-10 max-w-2xl mx-auto"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            Deep Dives, Interviews und Analysen aus der Welt der
            k&uuml;nstlichen Intelligenz. Von Foundation Models bis
            Finanzierung.
          </p>
          <div className="max-w-md mx-auto">
            <NewsletterForm />
          </div>
        </div>
      </Container>
    </section>
  );
}
