import { useMemo, useState } from "react";
import { ProductCard } from "./ProductCard";
import type { CatalogProduct } from "@/lib/catalog";

type Condition = "all" | "new" | "used";

function isUsed(p: CatalogProduct["node"]): boolean {
  const tags = (p.tags ?? []).map((t) => t.toLowerCase());
  if (tags.includes("begagnat") || tags.includes("used")) return true;
  return /begagnat|used/i.test(p.title);
}

function maxvikt(p: CatalogProduct["node"]): number | null {
  const text = `${p.title} ${p.description}`.toLowerCase();
  const m = text.match(/(\d{2,5})\s*kg/);
  return m ? parseInt(m[1], 10) : null;
}

export function ProductGrid({
  products,
  defaultCondition = "all",
}: {
  products: CatalogProduct[];
  defaultCondition?: Condition;
}) {
  const [condition, setCondition] = useState<Condition>(defaultCondition);
  const [minLoad, setMinLoad] = useState<number>(0);
  const [brand, setBrand] = useState<string>("all");
  const [sort, setSort] = useState<"name" | "price-asc" | "price-desc">("name");

  const brands = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => p.node.vendor && set.add(p.node.vendor));
    return Array.from(set).sort();
  }, [products]);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const used = isUsed(p.node);
      if (condition === "new" && used) return false;
      if (condition === "used" && !used) return false;
      if (brand !== "all" && p.node.vendor !== brand) return false;
      if (minLoad > 0) {
        const mv = maxvikt(p.node);
        if (mv === null || mv < minLoad) return false;
      }
      return true;
    });

    list = [...list].sort((a, b) => {
      const pa = parseFloat(a.node.priceRange.minVariantPrice.amount);
      const pb = parseFloat(b.node.priceRange.minVariantPrice.amount);
      if (sort === "price-asc") return pa - pb || a.node.title.localeCompare(b.node.title, "sv");
      if (sort === "price-desc") return pb - pa || a.node.title.localeCompare(b.node.title, "sv");
      return a.node.title.localeCompare(b.node.title, "sv");
    });

    return list;
  }, [products, condition, minLoad, brand, sort]);

  return (
    <div className="grid lg:grid-cols-[260px_1fr] gap-10">
      <aside className="space-y-8 lg:sticky lg:top-28 lg:self-start">
        <div>
          <h3 className="eyebrow mb-3">Skick</h3>
          <div className="flex flex-col">
            {(
              [
                ["all", "Alla"],
                ["new", "Nytt"],
                ["used", "Begagnat"],
              ] as const
            ).map(([k, label]) => (
              <button
                key={k}
                type="button"
                onClick={() => setCondition(k)}
                className={`text-left py-2 text-sm border-b border-border transition-colors ${
                  condition === k ? "text-charcoal font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="eyebrow mb-3">Sortering</h3>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as typeof sort)}
            className="w-full h-10 border border-border bg-background px-3 text-sm focus:outline-none focus:border-charcoal"
          >
            <option value="name">Namn A–Ö</option>
            <option value="price-asc">Pris: lägst först</option>
            <option value="price-desc">Pris: högst först</option>
          </select>
        </div>

        <div>
          <h3 className="eyebrow mb-3">Maxvikt min. {minLoad ? `${minLoad} kg` : "—"}</h3>
          <input
            type="range"
            min={0}
            max={3000}
            step={100}
            value={minLoad}
            onChange={(e) => setMinLoad(parseInt(e.target.value, 10))}
            className="w-full accent-safety"
          />
          <div className="mt-1 flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>0</span>
            <span>3000 kg</span>
          </div>
        </div>

        {brands.length > 1 && (
          <div>
            <h3 className="eyebrow mb-3">Märke / typ</h3>
            <div className="flex flex-col max-h-48 overflow-y-auto">
              <button
                type="button"
                onClick={() => setBrand("all")}
                className={`text-left py-2 text-sm border-b border-border ${
                  brand === "all" ? "text-charcoal font-medium" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Alla
              </button>
              {brands.map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBrand(b)}
                  className={`text-left py-2 text-sm border-b border-border ${
                    brand === b ? "text-charcoal font-medium" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      <div>
        <div className="mb-6 flex items-baseline justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            {filtered.length} av {products.length} produkter
          </p>
        </div>
        {filtered.length === 0 ? (
          <div className="border border-dashed border-border py-24 text-center">
            <p className="text-muted-foreground text-sm">
              Inga produkter matchar filtren. Justera urvalet eller{" "}
              <a href="mailto:info@kjk.se" className="underline text-foreground">
                kontakta oss
              </a>{" "}
              för hjälp.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((p) => (
              <ProductCard key={p.node.id} product={p} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars



