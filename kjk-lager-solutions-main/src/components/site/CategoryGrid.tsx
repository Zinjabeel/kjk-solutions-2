import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/data/categories";
import { RAW_PRODUCTS, productMatchesCategory } from "@/lib/catalog";
import { rawToCatalogProduct } from "@/lib/catalog";

function countForCategory(slug: string) {
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return 0;
  return RAW_PRODUCTS.filter((raw) => {
    const p = rawToCatalogProduct(raw, true);
    return productMatchesCategory(p, cat);
  }).length;
}

const FEATURED_SLUGS = [
  "pallstall",
  "hyllstall",
  "grenstall",
  "entresolplan",
  "arbetsplats",
  "pallhantering",
  "lagerlador",
  "sakerhet",
  "begagnat",
  "identifiera",
] as const;

export function CategoryGrid() {
  const items = FEATURED_SLUGS.map((slug) => {
    const cat = CATEGORIES.find((c) => c.slug === slug)!;
    const count =
      slug === "begagnat"
        ? RAW_PRODUCTS.filter((r) =>
            `${r.name} ${r.tags.join(" ")}`.toLowerCase().match(/begagnat|begagnade/),
          ).length
        : countForCategory(slug);
    const to = slug === "begagnat" ? "/begagnat" : `/kategori/${slug}`;
    return { ...cat, count, to };
  });

  return (
    <div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
      {items.map((c) => (
        <Link
          key={c.slug}
          to={c.to}
          className="group bg-background p-6 lg:p-8 hover:bg-secondary/50 transition-colors min-h-[140px] flex flex-col"
        >
          <p className="eyebrow text-safety">{c.eyebrow}</p>
          <h3 className="mt-2 font-display text-xl lg:text-2xl leading-tight">{c.title}</h3>
          <p className="mt-auto pt-4 flex items-center justify-between text-sm">
            <span className="font-mono text-xs text-muted-foreground">{c.count} produkter</span>
            <ArrowRight className="h-4 w-4 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
          </p>
        </Link>
      ))}
    </div>
  );
}
