import Link from "next/link";

const navigationLinks = [
  { label: "Curated", href: "/startups" },
  { label: "Insights", href: "/deep-dives" },
  { label: "Library", href: "/themen" },
];

const legalLinks = [
  { label: "Impressum", href: "/impressum" },
  { label: "Datenschutz", href: "/datenschutz" },
];

export default function Footer() {
  return (
    <footer className="bg-white/50 backdrop-blur-sm border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo + Tagline */}
          <div className="md:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-[#6C5CE7] text-xl leading-none">
                &#9638;
              </span>
              <span
                className="text-sm font-bold tracking-[0.2em] text-[#1a1a1a]"
                style={{ fontFamily: "Inter, sans-serif" }}
              >
                LATENT CAPITAL
              </span>
            </Link>
            <p
              className="text-sm text-[#666] max-w-sm leading-relaxed"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              AI-gesteuerte Analysen und kuratierte Einblicke in Startups,
              Technologie und Innovation im deutschsprachigen Raum.
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4
              className="text-xs font-semibold tracking-[0.15em] text-[#1a1a1a] mb-4 uppercase"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Navigation
            </h4>
            <ul className="space-y-2">
              {navigationLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/subscribe"
                  className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
                  style={{ fontFamily: "Inter, sans-serif" }}
                >
                  Newsletter
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4
              className="text-xs font-semibold tracking-[0.15em] text-[#1a1a1a] mb-4 uppercase"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Legal
            </h4>
            <ul className="space-y-2">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-[#666] hover:text-[#1a1a1a] transition-colors"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 pt-8 border-t border-black/5">
          <p
            className="text-xs text-[#666]"
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            &copy; {new Date().getFullYear()} Latent Capital. Alle Rechte
            vorbehalten.
          </p>
        </div>
      </div>
    </footer>
  );
}
