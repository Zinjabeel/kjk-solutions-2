import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { ArrowLeft, Check, ExternalLink, Loader2, Mail, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { fetchProductByHandle as fetchShopifyProduct } from "@/lib/shopify";
import {
  fetchProductByHandle as fetchCatalogProduct,
  isCatalogOnly,
  type CatalogProduct,
} from "@/lib/catalog";
import { useCartStore } from "@/stores/cartStore";

async function loadProduct(handle: string): Promise<CatalogProduct["node"] | null> {
  const catalog = fetchCatalogProduct(handle);
  if (!catalog) return null;

  try {
    const shopify = await fetchShopifyProduct(handle);
    if (shopify) {
      return { ...shopify, catalogOnly: false, permalink: catalog.node.permalink };
    }
  } catch {
    /* Shopify optional */
  }

  return catalog.node;
}

export const Route = createFileRoute("/produkt/$handle")({
  head: ({ params }) => ({
    meta: [
      { title: `Produkt — ${params.handle} | KJK Lagerprodukter` },
      { property: "og:url", content: `/produkt/${params.handle}` },
    ],
    links: [{ rel: "canonical", href: `/produkt/${params.handle}` }],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data: product, isLoading, error } = useQuery({
    queryKey: ["product", handle],
    queryFn: () => loadProduct(handle),
  });

  const addItem = useCartStore((s) => s.addItem);
  const isLoadingCart = useCartStore((s) => s.isLoading);
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);
  const [qty, setQty] = useState(1);

  const catalogProduct: CatalogProduct | null = product ? { node: product } : null;
  const catalogOnly = catalogProduct ? isCatalogOnly(catalogProduct) : true;

  const variants = product?.variants.edges.map((e) => e.node) ?? [];
  const variant = useMemo(
    () => variants.find((v) => v.id === selectedVariantId) ?? variants[0],
    [variants, selectedVariantId],
  );
  const images = product?.images.edges ?? [];

  if (isLoading) {
    return (
      <div className="container-tight py-32 text-center text-muted-foreground">Laddar produkt…</div>
    );
  }
  if (error || !product) {
    throw notFound();
  }

  const specs = parseSpecs(product.description, product.title);
  const price = variant ? parseFloat(variant.price.amount) : 0;
  const hasPrice = price > 0;
  const isGuide = (product.tags ?? []).includes("identifiering");

  const onAdd = async () => {
    if (!variant || catalogOnly) return;
    await addItem({
      product: { node: product },
      variantId: variant.id,
      variantTitle: variant.title,
      price: variant.price,
      quantity: qty,
      selectedOptions: variant.selectedOptions ?? [],
    });
  };

  return (
    <article className="container-tight py-10 lg:py-16">
      <Link
        to="/produkter"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8"
      >
        <ArrowLeft className="h-4 w-4" /> Tillbaka till sortimentet
      </Link>

      <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 lg:gap-16">
        <div>
          <div className="aspect-[4/3] bg-secondary overflow-hidden border border-border">
            {images[activeImage] ? (
              <img
                src={images[activeImage].node.url}
                alt={images[activeImage].node.altText ?? product.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full flex items-center justify-center bg-gradient-to-br from-secondary to-muted">
                <span className="font-display text-8xl text-muted-foreground/25">{product.title.charAt(0)}</span>
              </div>
            )}
          </div>
          {images.length > 1 && (
            <div className="mt-3 grid grid-cols-5 gap-2">
              {images.map((img, i) => (
                <button
                  key={img.node.url}
                  type="button"
                  onClick={() => setActiveImage(i)}
                  className={`aspect-square overflow-hidden border ${
                    i === activeImage ? "border-charcoal" : "border-border"
                  }`}
                >
                  <img src={img.node.url} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-28 self-start">
          {product.vendor && <p className="eyebrow">{product.vendor}</p>}
          <h1 className="mt-2 font-display text-3xl lg:text-5xl leading-tight">{product.title}</h1>

          {!isGuide && (
            <div className="mt-6 flex items-baseline gap-3">
              {hasPrice ? (
                <>
                  <span className="font-display text-3xl">{price.toLocaleString("sv-SE")}</span>
                  <span className="font-mono text-sm text-muted-foreground">
                    {variant?.price.currencyCode ?? "SEK"} · exkl. moms
                  </span>
                </>
              ) : (
                <span className="font-display text-2xl text-muted-foreground">Pris på förfrågan</span>
              )}
            </div>
          )}

          {product.options.length > 0 && product.options[0].values.length > 1 && (
            <div className="mt-8 space-y-5">
              {product.options.map((opt) => (
                <div key={opt.name}>
                  <p className="eyebrow mb-2">{opt.name}</p>
                  <div className="flex flex-wrap gap-2">
                    {variants.map((v) => {
                      const value = v.selectedOptions.find((o) => o.name === opt.name)?.value;
                      const active = v.id === variant?.id;
                      if (!value) return null;
                      return (
                        <button
                          key={v.id + opt.name}
                          type="button"
                          onClick={() => setSelectedVariantId(v.id)}
                          className={`px-4 py-2 text-sm border ${
                            active
                              ? "border-charcoal bg-charcoal text-bone"
                              : "border-border hover:border-charcoal"
                          }`}
                        >
                          {value}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-8 flex flex-col gap-3">
            {!isGuide && !catalogOnly && (
              <div className="flex items-stretch gap-3">
                <div className="flex items-center border border-border">
                  <button
                    type="button"
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    className="h-12 w-12 hover:bg-secondary"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-mono">{qty}</span>
                  <button type="button" onClick={() => setQty((q) => q + 1)} className="h-12 w-12 hover:bg-secondary">
                    +
                  </button>
                </div>
                <Button
                  onClick={onAdd}
                  disabled={!variant || isLoadingCart}
                  className="flex-1 h-12 rounded-none bg-safety text-safety-foreground hover:bg-safety/90 font-semibold tracking-wide"
                >
                  {isLoadingCart ? <Loader2 className="h-4 w-4 animate-spin" /> : "Lägg i varukorg"}
                </Button>
              </div>
            )}

            {product.permalink && (
              <a
                href={product.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 h-12 bg-charcoal text-bone hover:bg-charcoal/90 font-semibold tracking-wide transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                {catalogOnly ? "Köp i webbshop" : "Se även i webbshop"}
              </a>
            )}

            <a
              href={`mailto:info@kjk.se?subject=${encodeURIComponent("Offert: " + product.title)}`}
              className="flex items-center justify-center gap-2 h-12 border border-charcoal text-charcoal hover:bg-charcoal hover:text-bone font-semibold tracking-wide transition-colors"
            >
              <Mail className="h-4 w-4" />
              Begär offert · 08-543 531 55
            </a>
          </div>

          {!isGuide && (
            <ul className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
              {[
                { icon: ShieldCheck, label: "Besiktigat enligt SS-EN 15635" },
                { icon: Truck, label: "Frakt i hela Sverige" },
                { icon: Check, label: "30 dagars öppet köp" },
                { icon: Check, label: "Faktura för företag" },
              ].map((b) => (
                <li key={b.label} className="flex items-center gap-2 text-muted-foreground">
                  <b.icon className="h-4 w-4 text-safety" /> {b.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="mt-20 grid lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-16 border-t border-border pt-12">
        {specs.length > 0 && (
          <div>
            <h2 className="eyebrow mb-4">Tekniska data</h2>
            <table className="w-full text-sm">
              <tbody>
                {specs.map(([k, v]) => (
                  <tr key={k} className="border-b border-border">
                    <th className="text-left py-3 font-medium text-muted-foreground w-1/2">{k}</th>
                    <td className="py-3 font-mono">{v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <div className={specs.length === 0 ? "lg:col-span-2" : ""}>
          <h2 className="eyebrow mb-4">{isGuide ? "Om denna typ" : "Beskrivning"}</h2>
          <p className="text-base leading-relaxed text-foreground/85 whitespace-pre-line">
            {product.description || "Kontakta oss för mer information om denna produkt."}
          </p>
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.title,
            description: product.description,
            image: images.map((i) => i.node.url),
            brand: product.vendor ?? "KJK Lagerprodukter AB",
            offers: variant && hasPrice
              ? {
                  "@type": "Offer",
                  priceCurrency: variant.price.currencyCode,
                  price: variant.price.amount,
                  availability: variant.availableForSale
                    ? "https://schema.org/InStock"
                    : "https://schema.org/OutOfStock",
                }
              : undefined,
          }),
        }}
      />
    </article>
  );
}

function parseSpecs(desc: string, title: string): Array<[string, string]> {
  const specs: Array<[string, string]> = [];
  const text = `${title} ${desc ?? ""}`;
  const mv = text.match(/(\d{2,5})\s*kg/i);
  if (mv) specs.push(["Maxvikt", `${mv[1]} kg`]);
  const dim = text.match(/(\d{3,5})\s*[×x*]\s*(\d{3,5})(?:\s*[×x*]\s*(\d{3,5}))?\s*(mm|cm)?/i);
  if (dim) specs.push(["Mått (B×D×H)", `${dim[1]}×${dim[2]}${dim[3] ? "×" + dim[3] : ""} ${dim[4] ?? "mm"}`]);
  const h = text.match(/höjd[:\s]*(\d{3,5})\s*mm/i);
  if (h) specs.push(["Höjd", `${h[1]} mm`]);
  const w = text.match(/bredd[:\s]*(\d{3,5})\s*mm/i);
  if (w) specs.push(["Bredd", `${w[1]} mm`]);
  if (specs.length === 0 && /pallställ|hyllställ|grenställ/i.test(title)) {
    specs.push(["Typ", title.split(" ").slice(0, 3).join(" ")]);
  }
  return specs;
}



