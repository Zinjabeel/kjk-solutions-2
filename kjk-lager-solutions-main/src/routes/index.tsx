import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ClipboardList, HardHat, Phone, ShieldCheck } from "lucide-react";
const heroImg = "https://kjklager.se/wp-content/uploads/Pallställ-Polypall-2.gif";
const bannerNew = "https://kjklager.se/wp-content/uploads/2016/01/imgthumb_detail-19-e1585837915635.jpg";
const bannerUsed = "https://kjklager.se/wp-content/uploads/2016/01/imgthumb_detail-8-1-e1588662709686.jpg";
import { useProducts } from "@/hooks/useProducts";
import { ProductCard } from "@/components/site/ProductCard";
import { CategoryGrid } from "@/components/site/CategoryGrid";
import { RAW_PRODUCTS } from "@/lib/catalog";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "KJK Lagerprodukter AB — Ny & begagnad lagerinredning" },
      {
        name: "description",
        content:
          "Nya och begagnade pallställ, hyllställ och lagerinredning. 50+ års erfarenhet av projektering, montage och besiktning i hela Sverige.",
      },
      { property: "og:url", content: "/" },
    ],
    links: [{ rel: "canonical", href: "/" }],
  }),
  component: Home,
});

function Home() {
  const { data: products = [] } = useProducts();
  const featured = products.filter((p) => {
    const price = parseFloat(p.node.priceRange.minVariantPrice.amount);
    return price > 0 && p.node.images.edges.length > 0;
  }).slice(0, 6);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt="Industrilager med pallställ"
            width={1920}
            height={1080}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-charcoal/90 via-charcoal/60 to-charcoal/15" />
        </div>
        <div className="relative container-tight pt-24 pb-28 lg:pt-36 lg:pb-44 text-bone">
          <p className="eyebrow text-bone/70">Sedan 1972 · Lagerinredning</p>
          <h1 className="mt-4 font-display text-4xl sm:text-5xl lg:text-7xl leading-[0.95] max-w-4xl">
            Ny &amp; begagnad lagerinredning — pallställ, hyllställ och tillbehör.
          </h1>
          <p className="mt-6 max-w-xl text-base lg:text-lg text-bone/80 leading-relaxed">
            Vi säljer och köper begagnad och ny lagerinredning. Hör av dig så hjälper vi till att hitta den bästa
            lösningen för just ditt företag — projektering, montage och besiktning ingår.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link
              to="/produkter"
              className="group inline-flex items-center gap-2 bg-safety text-safety-foreground px-6 py-4 text-sm font-semibold tracking-wide hover:bg-safety/90"
            >
              {RAW_PRODUCTS.length}+ produkter
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              to="/begagnat"
              className="inline-flex items-center gap-2 border border-bone/30 text-bone px-6 py-4 text-sm font-semibold tracking-wide hover:bg-bone/10"
            >
              Begagnat &amp; cirkulärt
            </Link>
          </div>

          <dl className="mt-16 lg:mt-24 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-3xl border-t border-bone/20 pt-8">
            {[
              ["50+", "År i branschen"],
              ["745", "Produkter online"],
              ["12k", "Ton återbrukat"],
              ["800+", "Besiktningar/år"],
            ].map(([n, l]) => (
              <div key={l}>
                <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-bone/60">{l}</dt>
                <dd className="mt-2 font-display text-3xl lg:text-4xl">{n}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section aria-labelledby="kategorier" className="container-tight py-20 lg:py-28">
        <div className="mb-12 max-w-2xl">
          <p className="eyebrow">Sortiment</p>
          <h2 id="kategorier" className="mt-3 font-display text-3xl lg:text-5xl leading-tight">
            Allt för lager, industri och verkstad
          </h2>
          <p className="mt-4 text-muted-foreground leading-relaxed">
            Från pallställ och hyllställ till grenställ, entresol, arbetsplatser och säkerhetsprodukter — samma
            sortiment som på kjklager.se.
          </p>
        </div>
        <CategoryGrid />
      </section>

      <section aria-labelledby="sortiment" className="border-y border-border">
        <h2 id="sortiment" className="sr-only">
          Nytt och begagnat
        </h2>
        <div className="grid md:grid-cols-2">
          {[
            {
              to: "/kategori/pallstall",
              img: bannerNew,
              eyebrow: "Nytt",
              title: "Ny lagerinredning",
              desc: "Skräddarsydda system med fabriksgaranti och full dokumentation.",
            },
            {
              to: "/begagnat",
              img: bannerUsed,
              eyebrow: "Begagnat",
              title: "Begagnad lagerinredning",
              desc: "Kvalitetstestade komponenter — upp till 60 % lägre pris och 90 % lägre CO₂.",
            },
          ].map((b) => (
            <Link
              key={b.to}
              to={b.to}
              className="group relative block aspect-[4/3] md:aspect-[5/6] overflow-hidden bg-charcoal"
            >
              <img
                src={b.img}
                alt={b.title}
                width={1280}
                height={1280}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover opacity-80 group-hover:opacity-95 group-hover:scale-[1.02] transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-8 lg:p-12 text-bone">
                <p className="eyebrow text-safety">{b.eyebrow}</p>
                <h3 className="mt-2 font-display text-3xl lg:text-5xl tracking-tight">{b.title}</h3>
                <p className="mt-3 max-w-md text-sm lg:text-base text-bone/80">{b.desc}</p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold tracking-wide">
                  Se sortiment
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="container-tight py-24 lg:py-32">
        <div className="grid lg:grid-cols-[1fr_2fr] gap-12 lg:gap-20">
          <div>
            <p className="eyebrow">Tjänster</p>
            <h2 className="mt-3 font-display text-3xl lg:text-5xl leading-[1.05]">
              Helhetsansvar från ritbord till besiktning.
            </h2>
            <p className="mt-5 text-muted-foreground leading-relaxed">
              Sedan 1972 har vi byggt lager för Sveriges mest krävande verksamheter. Montage, demontering,
              besiktning och köp av begagnad inredning — vi hjälper företag i hela Sverige.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-px bg-border">
            {[
              {
                icon: ClipboardList,
                eyebrow: "01",
                title: "Projektering",
                desc: "CAD-ritade lösningar anpassade för din volym, flöde och godshantering.",
              },
              {
                icon: HardHat,
                eyebrow: "02",
                title: "Montage",
                desc: "Certifierade montörer levererar nyckelfärdigt — i tid och utan driftstopp.",
              },
              {
                icon: ShieldCheck,
                eyebrow: "03",
                title: "Besiktning",
                desc: "Årlig säkerhetsbesiktning enligt SS-EN 15635 med digital rapport.",
              },
            ].map((p) => (
              <div key={p.title} className="bg-background p-8">
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-safety">{p.eyebrow}</p>
                <p.icon className="mt-4 h-8 w-8 text-charcoal" strokeWidth={1.5} />
                <h3 className="mt-5 font-display text-xl">{p.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-secondary/30">
        <div className="container-tight py-24 lg:py-32">
          <div className="flex items-end justify-between mb-12 gap-4 flex-wrap">
            <div>
              <p className="eyebrow">Utvalt sortiment</p>
              <h2 className="mt-3 font-display text-3xl lg:text-5xl">Populära produkter</h2>
            </div>
            <Link
              to="/produkter"
              className="inline-flex items-center gap-2 text-sm font-semibold border-b border-charcoal pb-1"
            >
              Alla {RAW_PRODUCTS.length} produkter <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-border bg-charcoal text-bone">
        <div className="container-tight py-16 lg:py-20 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <p className="eyebrow text-bone/60">Kontakt</p>
            <h2 className="mt-2 font-display text-2xl lg:text-4xl">Vi hjälper dig hitta rätt lösning</h2>
            <p className="mt-3 text-bone/70 text-sm max-w-md">
              Måndag–fredag 07:00–17:00 · Stockholm, Göteborg och Malmö
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="tel:0854353155"
              className="inline-flex items-center gap-2 bg-safety text-safety-foreground px-6 py-4 text-sm font-semibold tracking-wide hover:bg-safety/90"
            >
              <Phone className="h-4 w-4" />
              08-543 531 55
            </a>
            <a
              href="mailto:info@kjk.se"
              className="inline-flex items-center gap-2 border border-bone/30 px-6 py-4 text-sm font-semibold tracking-wide hover:bg-bone/10"
            >
              info@kjk.se
            </a>
          </div>
        </div>
      </section>
    </>
  );
}

