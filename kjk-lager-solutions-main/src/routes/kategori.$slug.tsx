import { createFileRoute } from "@tanstack/react-router";
import { useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/site/ProductGrid";
import { getCategory } from "@/data/categories";
import { filterByCategory } from "@/lib/catalog";

export const Route = createFileRoute("/kategori/$slug")({
  head: ({ params }) => {
    const c = getCategory(params.slug);
    return {
      meta: [
        {
          title: c
            ? `${c.title} — Köp ${c.title.toLowerCase()} | KJK Lagerprodukter`
            : "Kategori",
        },
        { name: "description", content: c?.description ?? "Lagerinredning från KJK." },
        { property: "og:url", content: `/kategori/${params.slug}` },
      ],
      links: [{ rel: "canonical", href: `/kategori/${params.slug}` }],
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { slug } = Route.useParams();
  const c = getCategory(slug);
  const { data: products = [], isLoading } = useProducts();

  const filtered = useMemo(
    () => (c ? filterByCategory(products, slug) : []),
    [products, c, slug],
  );

  if (!c) {
    return (
      <section className="container-tight py-24">
        <h1 className="font-display text-3xl">Kategorin hittades inte</h1>
        <p className="mt-3 text-muted-foreground">
          Gå till <a href="/produkter" className="underline">alla produkter</a> för att bläddra i sortimentet.
        </p>
      </section>
    );
  }

  return (
    <section className="container-tight py-16 lg:py-24">
      <header className="mb-12 max-w-2xl">
        <p className="eyebrow">{c.eyebrow}</p>
        <h1 className="mt-3 font-display text-4xl lg:text-6xl">{c.title}</h1>
        <p className="mt-4 text-muted-foreground leading-relaxed">{c.description}</p>
        <p className="mt-3 font-mono text-xs uppercase tracking-widest text-muted-foreground">
          {filtered.length} produkter i denna kategori
        </p>
      </header>
      {isLoading ? (
        <p className="text-sm text-muted-foreground">Laddar sortiment…</p>
      ) : (
        <ProductGrid products={filtered} />
      )}
    </section>
  );
}
