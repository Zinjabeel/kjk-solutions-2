import { createFileRoute } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { useMemo } from "react";
import { useProducts } from "@/hooks/useProducts";
import { ProductGrid } from "@/components/site/ProductGrid";
import { filterUsed } from "@/lib/catalog";

export const Route = createFileRoute("/begagnat")({
  head: () => ({
    meta: [
      { title: "Begagnat — Begagnade pallställ & lagerinredning | KJK" },
      {
        name: "description",
        content:
          "Kvalitetstestade begagnade pallställ, hyllställ och lagerinredning. Cirkulär ekonomi — upp till 60% lägre pris och 90% lägre CO₂.",
      },
      { property: "og:url", content: "/begagnat" },
    ],
    links: [{ rel: "canonical", href: "/begagnat" }],
  }),
  component: UsedPage,
});

function UsedPage() {
  const { data: products = [], isLoading } = useProducts();
  const used = useMemo(() => filterUsed(products), [products]);

  return (
    <>
      <section className="bg-charcoal text-bone border-b border-border">
        <div className="container-tight py-20 lg:py-28 grid lg:grid-cols-[1.5fr_1fr] gap-12 items-end">
          <div>
            <p className="eyebrow text-safety">Cirkulär ekonomi</p>
            <h1 className="mt-3 font-display text-4xl lg:text-7xl leading-[0.95]">
              Begagnad lagerinredning.
              <br />
              <span className="text-safety">90% mindre CO₂.</span>
            </h1>
            <p className="mt-6 max-w-xl text-bone/75 leading-relaxed">
              Vi köper in, rekonditionerar och kvalitetstestar ställage från avvecklade lager. Varje komponent
              kontrolleras enligt SS-EN 15635 innan den får ny tjänstgöring.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-px bg-bone/15 border border-bone/15">
            {[
              ["–60%", "Pris vs. nytt"],
              ["–90%", "CO₂-avtryck"],
              ["12k", "Ton återbrukat"],
            ].map(([n, l]) => (
              <div key={l} className="bg-charcoal p-5">
                <Leaf className="h-4 w-4 text-safety mb-3" />
                <div className="font-display text-2xl">{n}</div>
                <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.18em] text-bone/60">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-tight py-16 lg:py-24">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Laddar begagnat sortiment…</p>
        ) : (
          <ProductGrid products={used} defaultCondition="used" />
        )}
      </section>
    </>
  );
}

