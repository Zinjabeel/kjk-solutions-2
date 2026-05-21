import { createFileRoute } from "@tanstack/react-router";
import { Building2, History, Leaf, Users } from "lucide-react";

export const Route = createFileRoute("/om-oss")({
  head: () => ({
    meta: [
      { title: "Om KJK Lagerprodukter AB — Om oss" },
      {
        name: "description",
        content:
          "Läs om KJK Lagerprodukter AB, specialister på lagerinredning i Sverige med över 50 års erfarenhet.",
      },
      { property: "og:url", content: "/om-oss" },
    ],
    links: [{ rel: "canonical", href: "/om-oss" }],
  }),
  component: AboutUs,
});

function AboutUs() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-charcoal via-charcoal to-charcoal/95">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 bg-safety rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-safety/50 rounded-full blur-3xl" />
        </div>
        <div className="relative container-tight pt-20 pb-20 lg:pt-32 lg:pb-32 text-bone">
          <p className="eyebrow text-safety">Vår historia</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-6xl leading-[0.95] max-w-3xl">
            Om KJK Lagerprodukter AB
          </h1>
          <p className="mt-6 max-w-2xl text-base lg:text-lg text-bone/80 leading-relaxed">
            Specialister på lagerinredning i Sverige – över 50 års erfarenhet
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="container-tight py-16 lg:py-24">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Left Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* About Section */}
            <div>
              <h2 className="font-display text-2xl lg:text-3xl mb-6">Vem är vi?</h2>
              <div className="space-y-4 text-foreground/80 leading-relaxed">
                <p>
                  KJK Lagerprodukter AB har över 50 års erfarenhet inom ny och begagnad lagerinredning och är en 
                  etablerad partner för företag i hela Sverige. Vi levererar säkra, effektiva och kostnadseffektiva 
                  lagerlösningar anpassade för lager, industri och logistikverksamhet.
                </p>
                <p>
                  Vi erbjuder ett brett sortiment av bland annat pallställ, hyllställ, entresolplan, nätväggar 
                  och övrig lagerutrustning. Genom nära samarbeten med ledande tillverkare i Sverige och 
                  internationellt kan vi även erbjuda kompletteringar till befintliga system, reservdelar samt 
                  dokumentation för äldre pallställ och hyllställ.
                </p>
                <p>
                  Med ett omfattande lager av både ny och begagnad lagerinredning kan vi säkerställa snabba 
                  leveranser över hela Sverige – oavsett om det gäller kompletteringar eller större projekt.
                </p>
              </div>
            </div>

            {/* Services Section */}
            <div>
              <h2 className="font-display text-2xl lg:text-3xl mb-6">Vad erbjuder vi?</h2>
              <div className="space-y-4 text-foreground/80 leading-relaxed mb-8">
                <p>
                  Utöver försäljning erbjuder vi även projektering, montage, demontage, besiktning och 
                  reparationer av lagerinredning. Vår långa erfarenhet och breda kompetens gör oss till en 
                  trygg helhetspartner inom lagerlösningar och industriell inredning.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                  <Building2 className="h-6 w-6 text-safety mb-3" />
                  <h3 className="font-semibold mb-2">Projektering</h3>
                  <p className="text-sm text-foreground/70">
                    Skräddarsydda lagerlösningar för dina behov
                  </p>
                </div>
                <div className="border border-border rounded-lg p-4 hover:bg-secondary/50 transition-colors">
                  <Users className="h-6 w-6 text-safety mb-3" />
                  <h3 className="font-semibold mb-2">Montage & Demontage</h3>
                  <p className="text-sm text-foreground/70">
                    Professionell installation och ommontering
                  </p>
                </div>
              </div>
            </div>

            {/* History Section */}
            <div>
              <h2 className="font-display text-2xl lg:text-3xl mb-6 flex items-center gap-3">
                <History className="h-6 w-6 text-safety" />
                Vår historia
              </h2>
              <div className="space-y-6 text-foreground/80 leading-relaxed">
                <div>
                  <h3 className="font-semibold text-foreground mb-2">1997 — Grundandet</h3>
                  <p>
                    KJK Lagerprodukter AB grundades genom en sammanslagning av JK Stilmontage AB och 
                    KGH Produkter AB. JK Stilmontage var ett renodlat montageföretag, medan KGH Produkter 
                    arbetade med montering och handel av begagnad lagerinredning sedan slutet av 1970-talet.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">2004–2006 — Expansion</h3>
                  <p>
                    År 2004 öppnades säljkontor i Arboga, och 2005 etablerades huvudkontor i Stocksund. 
                    År 2006 förvärvades en ny lager- och produktionsfastighet i Åkersberga.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">2007–2012 — Internationell närvaro</h3>
                  <p>
                    År 2007 blev OY Rackman AB i Finland vår återförsäljare. 2012 förvärvades en 3000 m² 
                    fastighet i Arboga som idag fungerar som huvudlager och produktionsanläggning.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">2016–2024 — Modernisering</h3>
                  <p>
                    2016 flyttades all lagerhållning till Arboga. 2022 förvärvade vi e-handelsplattformen 
                    ellpe-lagerinredning.se. 2024 flyttades även huvudkontoret till Arboga, där vår 
                    kompletta verksamhet nu är samlad.
                  </p>
                </div>
              </div>
            </div>

            {/* Quality & Environment */}
            <div className="border-t pt-12">
              <h2 className="font-display text-2xl lg:text-3xl mb-6 flex items-center gap-3">
                <Leaf className="h-6 w-6 text-safety" />
                Kvalitet & miljö
              </h2>
              <div className="space-y-4 text-foreground/80 leading-relaxed">
                <p>
                  KJK Lagerprodukter AB:s målsättning är att tillhandahålla produkter och tjänster inom 
                  förvaring, hantering och logistik som uppfyller eller överträffar kunders, medarbetares 
                  och samhällets krav.
                </p>
                <p>
                  Vi arbetar aktivt för en hållbar utveckling och säkerställer att vår verksamhet följer 
                  gällande lagar, förordningar samt våra egna högt ställda miljö- och kvalitetsmål.
                </p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Info Box */}
            <div className="bg-gradient-to-br from-secondary to-secondary/50 rounded-lg p-8 sticky top-24 space-y-6">
              <div>
                <p className="eyebrow text-safety mb-2">Sedan</p>
                <p className="font-display text-3xl">1997</p>
              </div>
              <div>
                <p className="eyebrow text-safety mb-2">Erfarenhet</p>
                <p className="font-display text-3xl">50+</p>
                <p className="text-sm text-foreground/70">år inom branschen</p>
              </div>
              <div>
                <p className="eyebrow text-safety mb-2">Huvudkontor</p>
                <p className="font-semibold">Arboga</p>
              </div>
              <div className="border-t pt-6">
                <p className="text-sm text-foreground/70 mb-4">
                  Kontakta oss för att diskutera din lagerlösning.
                </p>
                <a
                  href="/produkter"
                  className="inline-flex items-center justify-center w-full bg-safety text-safety-foreground px-4 py-3 text-sm font-semibold rounded hover:bg-safety/90 transition-colors"
                >
                  Se vårt sortiment
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Image Banner */}
      <section className="border-t border-b border-border py-16 lg:py-24 bg-secondary/30">
        <div className="container-tight">
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-center">
            <div>
              <h2 className="font-display text-2xl lg:text-3xl mb-4">
                En trygg partner för dina lagerlösningar
              </h2>
              <p className="text-foreground/80 leading-relaxed mb-6">
                Med decennier av erfarenhet, ett brett sortiment och ett dedikerat team, är vi redo att 
                hjälpa ditt företag få den bästa lagerlösningen.
              </p>
              <ul className="space-y-3 text-foreground/80">
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-safety flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="h-2 w-2 bg-background rounded-full" />
                  </div>
                  <span>Snabba leveranser över hela Sverige</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-safety flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="h-2 w-2 bg-background rounded-full" />
                  </div>
                  <span>Projekterings- och monteringstjänster</span>
                </li>
                <li className="flex items-start gap-3">
                  <div className="h-5 w-5 rounded-full bg-safety flex items-center justify-center mt-0.5 flex-shrink-0">
                    <span className="h-2 w-2 bg-background rounded-full" />
                  </div>
                  <span>Miljömedveten och hållbar verksamhet</span>
                </li>
              </ul>
            </div>
            <div className="bg-gradient-to-br from-safety/10 to-safety/5 rounded-lg h-80 flex items-center justify-center">
              <div className="text-center">
                <Building2 className="h-16 w-16 text-safety/40 mx-auto mb-4" />
                <p className="text-foreground/40 text-sm">Lager & lagerlösningar</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-tight py-20 lg:py-28 text-center">
        <h2 className="font-display text-2xl lg:text-3xl mb-6 max-w-2xl mx-auto">
          Behöver du en lagerlösning?
        </h2>
        <p className="text-lg text-foreground/70 mb-10 max-w-xl mx-auto">
          Kontakta oss idag för en kostnadsfri konsultation. Vi hjälper dig hitta den perfekta lösningen 
          för ditt företag.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <a
            href="/produkter"
            className="inline-flex items-center justify-center bg-safety text-safety-foreground px-8 py-4 text-sm font-semibold hover:bg-safety/90 transition-colors rounded"
          >
            Utforska produkter
          </a>
          <a
            href="/"
            className="inline-flex items-center justify-center border border-border px-8 py-4 text-sm font-semibold hover:bg-secondary transition-colors rounded"
          >
            Tillbaka till start
          </a>
        </div>
      </section>
    </div>
  );
}
