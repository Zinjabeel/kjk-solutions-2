import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/site/ProductGrid";
import { CATEGORIES } from "@/data/categories";
import { RAW_PRODUCTS } from "@/lib/catalog";

const search = z.object({ q: z.string().optional() });

export const Route = createFileRoute("/produkter")({
  validateSearch: search,
  head: () => ({
    meta: [
      { title: `Alla produkter (${RAW_PRODUCTS.length}) — Lagerinredning | KJK` },
      {
        name: "description",
        content:
          "Bläddra hela sortimentet av nya och begagnade pallställ, hyllställ, grenställ, entresol och lagerutrustning.",
      },
      { property: "og:url", content: "/produkter" },
    ],
    links: [{ rel: "canonical", href: "/produkter" }],
  }),
  component: ProductsPage,
});

function ProductsPage() {
  const { q } = Route.useSearch();
  const { data: products = [], isLoading } = useProducts(q);

  return (
    <section className="container-tight py-16 lg:py-24">
      <header className="mb-10 max-w-2xl">
        <p className="eyebrow">Sortiment</p>
        <h1 className="mt-3 font-display text-4xl lg:text-6xl">
          {q ? `Sökning: “${q}”` : "Alla produkter"}
        </h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">
          {RAW_PRODUCTS.length} produkter från KJK Lagerprodukter — samma sortiment som kjklager.se och vår
          webbshop. Filtrera på skick, lastkapacitet och märke.
        </p>
      </header>

      <div className="mb-12 flex flex-wrap gap-2">
        {CATEGORIES.slice(0, 10).map((c) => (
          <Link
            key={c.slug}
            to="/kategori/$slug"
            params={{ slug: c.slug }}
            className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider border border-border hover:border-charcoal hover:bg-secondary transition-colors"
          >
            {c.title}
          </Link>
        ))}
        <Link
          to="/begagnat"
          className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider border border-charcoal bg-charcoal text-bone"
        >
          Begagnat
        </Link>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Laddar sortiment…</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </section>
  );
}
