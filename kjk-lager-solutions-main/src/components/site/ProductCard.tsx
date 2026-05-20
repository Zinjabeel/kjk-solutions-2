import { Link } from "@tanstack/react-router";
import { ExternalLink, Loader2, Mail, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useCartStore } from "@/stores/cartStore";
import { isCatalogOnly, type CatalogProduct } from "@/lib/catalog";

function isUsed(p: CatalogProduct["node"]): boolean {
  const tags = (p.tags ?? []).map((t) => t.toLowerCase());
  if (tags.includes("begagnat") || tags.includes("used")) return true;
  return /begagnat|used/i.test(p.title);
}

function isIdentifier(p: CatalogProduct["node"]): boolean {
  const tags = (p.tags ?? []).map((t) => t.toLowerCase());
  return tags.includes("identifiering");
}

export function ProductCard({ product }: { product: CatalogProduct }) {
  const p = product.node;
  const img = p.images?.edges?.[0]?.node;
  const variant = p.variants?.edges?.[0]?.node;
  const addItem = useCartStore((s) => s.addItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const used = isUsed(p);
  const identifier = isIdentifier(p);
  const catalogOnly = isCatalogOnly(product);
  const price = parseFloat(p.priceRange.minVariantPrice.amount);
  const hasPrice = price > 0;

  const onAdd = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!variant || catalogOnly) return;
    await addItem({
      product,
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: 1,
      selectedOptions: variant.selectedOptions ?? [],
    });
  };

  const externalAction = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (p.permalink) window.open(p.permalink, "_blank", "noopener");
    else window.location.href = `mailto:info@kjk.se?subject=Offert: ${encodeURIComponent(p.title)}`;
  };

  return (
    <Link
      to="/produkt/$handle"
      params={{ handle: p.handle }}
      className="group block bg-card border border-border hover:border-charcoal transition-colors"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        {img ? (
          <img
            src={img.url}
            alt={img.altText ?? p.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="w-full h-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
            <span className="font-display text-4xl text-muted-foreground/30">{p.title.charAt(0)}</span>
          </span>
        )}
        <div className="absolute top-3 left-3 flex flex-wrap gap-2">
          {identifier ? (
            <Badge className="rounded-none bg-steel/90 text-bone border-0 font-mono text-[10px] uppercase tracking-wider">
              Guide
            </Badge>
          ) : used ? (
            <Badge className="rounded-none bg-charcoal text-bone border-0 font-mono text-[10px] uppercase tracking-wider">
              Begagnat
            </Badge>
          ) : (
            <Badge className="rounded-none bg-bone text-charcoal border border-border font-mono text-[10px] uppercase tracking-wider">
              Nytt
            </Badge>
          )}
        </div>
        {catalogOnly ? (
          <button
            type="button"
            onClick={externalAction}
            className="absolute bottom-0 right-0 h-11 px-3 flex items-center justify-center gap-1.5 bg-charcoal text-bone translate-y-full group-hover:translate-y-0 transition-transform text-xs font-semibold tracking-wide"
            aria-label={p.permalink ? "Öppna webbshop" : "Begär offert"}
          >
            {p.permalink ? (
              <>
                <ExternalLink className="h-4 w-4" /> Köp
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" /> Offert
              </>
            )}
          </button>
        ) : (
          <button
            type="button"
            onClick={onAdd}
            disabled={isLoading || !variant}
            className="absolute bottom-0 right-0 h-11 w-11 flex items-center justify-center bg-safety text-safety-foreground translate-y-full group-hover:translate-y-0 transition-transform"
            aria-label="Lägg i varukorg"
          >
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-5 w-5" />}
          </button>
        )}
      </span>
      <div className="p-5">
        {p.vendor && <div className="eyebrow mb-1.5 truncate">{p.vendor}</span>}
        <h3 className="font-display text-base font-semibold leading-snug line-clamp-2">{p.title}</h3>
        <div className="mt-3 flex items-baseline justify-between gap-2">
          {hasPrice ? (
            <span className="font-mono text-sm">
              {price.toLocaleString("sv-SE")}{" "}
              <span className="text-muted-foreground">{p.priceRange.minVariantPrice.currencyCode}</span>
            </span>
          ) : (
            <span className="text-sm text-muted-foreground">Pris på förfrågan</span>
          )}
          {!identifier && <span className="text-xs text-muted-foreground shrink-0">exkl. moms</span>}
        </div>
      </div>
    </Link>
  );
}
