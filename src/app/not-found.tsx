import Link from "next/link";
import Container from "@/components/layout/Container";

export default function NotFound() {
  return (
    <Container className="py-32 flex items-center justify-center">
      <div className="glass rounded-2xl p-12 text-center max-w-lg">
        <p className="text-[#6C5CE7] text-sm font-medium uppercase tracking-wider mb-4">
          404
        </p>
        <h1 className="font-serif text-4xl font-bold mb-4">
          Seite nicht gefunden
        </h1>
        <p className="text-[#666] mb-8">
          Die angeforderte Seite existiert leider nicht oder wurde verschoben.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-[#6C5CE7] text-white px-6 py-2.5 text-sm font-medium hover:bg-[#5A4BD1] transition-colors"
        >
          Zurück zur Startseite
        </Link>
      </div>
    </Container>
  );
}
