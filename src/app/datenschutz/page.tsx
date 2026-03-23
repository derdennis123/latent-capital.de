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
        <h1
          className="font-serif text-4xl md:text-5xl font-bold mb-12"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Datenschutzerklärung
        </h1>

        <div className="space-y-10 text-[#444] leading-relaxed" style={{ fontFamily: "Inter, sans-serif" }}>
          {/* 1. Datenschutz auf einen Blick */}
          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
              1. Datenschutz auf einen Blick
            </h2>
            <p>
              Der Schutz Ihrer persönlichen Daten ist uns ein wichtiges
              Anliegen. Diese Datenschutzerklärung informiert Sie darüber,
              welche Daten wir erheben, wie wir sie verwenden und welche Rechte
              Ihnen zustehen.
            </p>
            <div className="mt-4">
              <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">
                Verantwortlicher
              </h3>
              <p>
                holidayhunter UG &amp; Co. KG
                <br />
                Silbeker Weg 35
                <br />
                33142 Büren
                <br />
                E-Mail:{" "}
                <a
                  href="mailto:hello@latent-capital.de"
                  className="text-[#6C5CE7] hover:underline"
                >
                  hello@latent-capital.de
                </a>
              </p>
            </div>
          </section>

          {/* 2. Cookies und Einwilligung */}
          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
              2. Cookies und Einwilligung
            </h2>
            <p>
              Unsere Website nutzt Cookies. Dies sind kleine Textdateien, die
              auf Ihrem Endgerät gespeichert werden.
            </p>
            <ul className="mt-4 space-y-3 list-disc list-inside">
              <li>
                <strong>Notwendige Cookies:</strong> Diese Cookies sind
                technisch erforderlich für den Betrieb der Website (z.B.
                Session-Cookies für die Anmeldung). Sie werden ohne
                Einwilligung gesetzt, da sie für die Grundfunktion der Website
                unerlässlich sind.
              </li>
              <li>
                <strong>Analyse-Cookies:</strong> Zur Analyse des
                Nutzungsverhaltens setzen wir Google Analytics ein. Diese
                Cookies werden nur nach Ihrer ausdrücklichen Einwilligung über
                den Cookie-Banner gesetzt.
              </li>
            </ul>
            <p className="mt-4">
              Sie können Ihre Einwilligung jederzeit über den Cookie-Banner
              widerrufen. Rechtsgrundlagen: Art. 6 Abs. 1 lit. f DSGVO
              (berechtigtes Interesse) für notwendige Cookies und Art. 6 Abs. 1
              lit. a DSGVO (Einwilligung) für Analyse-Cookies.
            </p>
          </section>

          {/* 3. Datenerhebung auf dieser Website */}
          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
              3. Datenerhebung auf dieser Website
            </h2>

            <div>
              <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">
                Newsletter-Anmeldung und Mitgliedschaft
              </h3>
              <p>
                Wenn Sie sich für unseren Newsletter anmelden oder eine
                Premium-Mitgliedschaft abschließen, erheben wir Ihre
                E-Mail-Adresse und ggf. Ihren Namen. Diese Daten werden zur
                Zustellung des Newsletters, zur Verwaltung Ihrer Mitgliedschaft
                und zur Abwicklung der Zahlung verwendet.
              </p>
              <p className="mt-2">
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO
                (Vertragserfüllung) sowie Art. 6 Abs. 1 lit. a DSGVO
                (Einwilligung bei Newsletter-Anmeldung).
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">
                Zahlungsabwicklung
              </h3>
              <p>
                Für die Abwicklung von Premium-Mitgliedschaften nutzen wir den
                Zahlungsdienstleister Stripe (Stripe, Inc., 354 Oyster Point
                Blvd, South San Francisco, CA 94080, USA). Bei der Zahlung
                werden Ihre Zahlungsdaten direkt von Stripe verarbeitet. Wir
                selbst speichern keine Kreditkarten- oder Kontodaten.
              </p>
              <p className="mt-2">
                Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO
                (Vertragserfüllung).
              </p>
            </div>

            <div className="mt-6">
              <h3 className="text-base font-semibold text-[#1a1a1a] mb-2">
                Server-Logfiles
              </h3>
              <p>
                Bei jedem Zugriff auf unsere Website werden automatisch
                technische Daten erfasst: IP-Adresse, Browsertyp und -version,
                Betriebssystem, Referrer-URL sowie Datum und Uhrzeit des
                Zugriffs. Diese Daten werden nicht mit anderen Datenquellen
                zusammengeführt.
              </p>
              <p className="mt-2">
                Rechtsgrundlage: Art. 6 Abs. 1 lit. f DSGVO (berechtigtes
                Interesse an der technischen Bereitstellung und Sicherheit der
                Website).
              </p>
            </div>
          </section>

          {/* 4. Google Analytics */}
          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
              4. Google Analytics
            </h2>
            <p>
              Diese Website nutzt Google Analytics, einen Webanalysedienst der
              Google Ireland Limited (&quot;Google&quot;), Gordon House, Barrow
              Street, Dublin 4, Irland. Google Analytics verwendet Cookies, die
              eine Analyse Ihrer Benutzung der Website ermöglichen.
            </p>
            <p className="mt-3">
              Die durch das Cookie erzeugten Informationen über Ihre Benutzung
              dieser Website werden in der Regel an einen Server von Google in
              den USA übertragen und dort gespeichert. Wir haben die
              IP-Anonymisierung aktiviert, sodass Ihre IP-Adresse von Google
              innerhalb von Mitgliedstaaten der EU oder in anderen
              Vertragsstaaten des Abkommens über den Europäischen
              Wirtschaftsraum zuvor gekürzt wird.
            </p>
            <p className="mt-3">
              Google Analytics wird nur nach Ihrer ausdrücklichen Einwilligung
              über den Cookie-Banner aktiviert. Sie können Ihre Einwilligung
              jederzeit widerrufen.
            </p>
            <p className="mt-3">
              Rechtsgrundlage: Art. 6 Abs. 1 lit. a DSGVO (Einwilligung).
              Weitere Informationen finden Sie in der{" "}
              <a
                href="https://policies.google.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#6C5CE7] hover:underline"
              >
                Datenschutzerklärung von Google
              </a>
              .
            </p>
          </section>

          {/* 5. E-Mail-Versand */}
          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
              5. E-Mail-Versand
            </h2>
            <p>
              Für den Versand von Transaktions-E-Mails (z.B. Login-Links,
              Zahlungsbestätigungen) und Newslettern nutzen wir den Dienst
              Mailgun (Mailgun Technologies, Inc., 112 E Pecan St #1135, San
              Antonio, TX 78205, USA). Dabei werden Ihre E-Mail-Adresse und der
              E-Mail-Inhalt über die Server von Mailgun verarbeitet. Wir nutzen
              den EU-Endpunkt von Mailgun.
            </p>
            <p className="mt-2">
              Rechtsgrundlage: Art. 6 Abs. 1 lit. b DSGVO (Vertragserfüllung)
              und Art. 6 Abs. 1 lit. f DSGVO (berechtigtes Interesse).
            </p>
          </section>

          {/* 6. Speicherdauer */}
          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
              6. Speicherdauer
            </h2>
            <p>
              Ihre personenbezogenen Daten werden nur so lange gespeichert, wie
              es für die jeweiligen Verarbeitungszwecke erforderlich ist oder
              gesetzliche Aufbewahrungspflichten bestehen. Mitgliedschaftsdaten
              werden nach Beendigung der Mitgliedschaft und Ablauf der
              gesetzlichen Aufbewahrungsfristen gelöscht.
            </p>
          </section>

          {/* 7. Ihre Rechte */}
          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
              7. Ihre Rechte
            </h2>
            <p className="mb-4">
              Sie haben gemäß DSGVO folgende Rechte bezüglich Ihrer
              personenbezogenen Daten:
            </p>
            <ul className="space-y-2 list-disc list-inside">
              <li>Recht auf Auskunft (Art. 15 DSGVO)</li>
              <li>Recht auf Berichtigung (Art. 16 DSGVO)</li>
              <li>Recht auf Löschung (Art. 17 DSGVO)</li>
              <li>
                Recht auf Einschränkung der Verarbeitung (Art. 18 DSGVO)
              </li>
              <li>Recht auf Datenübertragbarkeit (Art. 20 DSGVO)</li>
              <li>Widerspruchsrecht (Art. 21 DSGVO)</li>
              <li>
                Recht auf Widerruf erteilter Einwilligungen (Art. 7 Abs. 3
                DSGVO)
              </li>
            </ul>
            <p className="mt-4">
              Zur Ausübung Ihrer Rechte wenden Sie sich bitte an:{" "}
              <a
                href="mailto:hello@latent-capital.de"
                className="text-[#6C5CE7] hover:underline"
              >
                hello@latent-capital.de
              </a>
            </p>
            <p className="mt-3">
              Sie haben zudem das Recht, sich bei einer Aufsichtsbehörde zu
              beschweren. Zuständige Aufsichtsbehörde ist die
              Landesbeauftragte für Datenschutz und Informationsfreiheit
              Nordrhein-Westfalen.
            </p>
          </section>

          {/* 8. Änderungen */}
          <section>
            <h2 className="text-xl font-semibold text-[#1a1a1a] mb-4">
              8. Änderungen dieser Datenschutzerklärung
            </h2>
            <p>
              Wir behalten uns vor, diese Datenschutzerklärung anzupassen, um
              sie an geänderte Rechtslagen oder bei Änderungen des Dienstes
              sowie der Datenverarbeitung anzupassen. Es gilt die jeweils
              aktuelle, auf dieser Website veröffentlichte Fassung.
            </p>
          </section>

          <p className="text-sm text-[#999] pt-4">
            Stand: März 2026
          </p>
        </div>
      </div>
    </Container>
  );
}
