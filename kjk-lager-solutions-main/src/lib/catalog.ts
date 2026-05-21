import productsJson from "@/data/products.json";
import { CATEGORIES, getCategory, type CategoryDef } from "@/data/categories";
import type { ShopifyProduct } from "@/lib/shopify";
import { fetchProducts as fetchShopifyProducts } from "@/lib/shopify";

export interface RawProduct {
  name: string;
  slug: string;
  description: string;
  price: number | null;
  currency: string;
  image: string | null;
  categories: Array<{ slug: string; name: string }>;
  tags: string[];
  inStock: boolean;
  permalink: string;
  source?: string;
}

export interface CatalogNode extends ShopifyProduct["node"] {
  /** WooCommerce / kjklager product URL for external checkout */
  permalink?: string;
  /** True when product is not synced to Shopify — use offert or external link */
  catalogOnly?: boolean;
}

export type CatalogProduct = { node: CatalogNode };

const RAW_PRODUCTS = productsJson as RawProduct[];

function isUsedProduct(raw: RawProduct): boolean {
  const text = `${raw.name} ${raw.tags.join(" ")} ${raw.categories.map((c) => c.name).join(" ")}`.toLowerCase();
  return (
    text.includes("begagnat") ||
    text.includes("begagnade") ||
    raw.tags.some((t) => t.includes("begagnat"))
  );
}

function isIdentifierProduct(raw: RawProduct): boolean {
  return raw.categories.some((c) =>
    ["pallstall-typ-benamning", "hyllstall-typ", "identifiera-ert-stall"].includes(c.slug),
  );
}

export function rawToCatalogProduct(raw: RawProduct, catalogOnly = true): CatalogProduct {
  const used = isUsedProduct(raw);
  const identifier = isIdentifierProduct(raw);
  const price = raw.price ?? 0;
  const variantId = catalogOnly
    ? `gid://kjk/CatalogVariant/${raw.slug}`
    : `gid://shopify/ProductVariant/${raw.slug}`;

  return {
    node: {
      id: `gid://kjk/CatalogProduct/${raw.slug}`,
      title: raw.name,
      description: raw.description,
      handle: raw.slug,
      productType: raw.categories[0]?.name ?? undefined,
      vendor: identifier ? "KJK · Identifiering" : used ? "KJK · Begagnat" : "KJK Lagerprodukter",
      tags: [
        ...raw.tags,
        ...(used ? ["begagnat"] : ["nytt"]),
        ...(identifier ? ["identifiering"] : []),
        raw.categories[0]?.slug ?? "",
      ].filter(Boolean),
      priceRange: {
        minVariantPrice: {
          amount: String(price),
          currencyCode: raw.currency,
        },
      },
      images: raw.image
        ? { edges: [{ node: { url: raw.image, altText: raw.name } }] }
        : { edges: [] },
      variants: {
        edges: [
          {
            node: {
              id: variantId,
              title: "Standard",
              price: { amount: String(price), currencyCode: raw.currency },
              availableForSale: raw.inStock && price > 0 && !identifier,
              selectedOptions: [],
            },
          },
        ],
      },
      options: [],
      permalink: raw.permalink,
      catalogOnly: catalogOnly || identifier || price <= 0,
    },
  };
}

function shopifyToCatalog(p: ShopifyProduct): CatalogProduct {
  return {
    node: {
      ...p.node,
      catalogOnly: false,
    },
  };
}

/** Merge Shopify storefront products over catalog entries with the same handle */
export async function fetchAllProducts(opts?: { query?: string }): Promise<CatalogProduct[]> {
  const shopify = await fetchShopifyProducts({ first: 100, query: opts?.query }).catch(() => []);
  const shopifyByHandle = new Map(shopify.map((p) => [p.node.handle, p]));

  let catalog = RAW_PRODUCTS.map((raw) => {
    const shop = shopifyByHandle.get(raw.slug);
    if (shop) return shopifyToCatalog(shop);
    return rawToCatalogProduct(raw, true);
  });

  // Shopify-only products not in catalog JSON
  for (const p of shopify) {
    if (!catalog.some((c) => c.node.handle === p.node.handle)) {
      catalog.push(shopifyToCatalog(p));
    }
  }

  if (opts?.query?.trim()) {
    const q = opts.query.trim().toLowerCase();
    catalog = catalog.filter((p) => {
      const n = p.node;
      return (
        n.title.toLowerCase().includes(q) ||
        n.description.toLowerCase().includes(q) ||
        (n.tags ?? []).some((t) => t.toLowerCase().includes(q)) ||
        (n.vendor ?? "").toLowerCase().includes(q)
      );
    });
  }

  return catalog;
}

export function fetchProductByHandle(handle: string): CatalogProduct | null {
  const raw = RAW_PRODUCTS.find((p) => p.slug === handle);
  if (!raw) return null;
  return rawToCatalogProduct(raw, true);
}

export function productMatchesCategory(product: CatalogProduct, category: CategoryDef): boolean {
  const slugs = product.node.tags ?? [];
  const catSlugs = RAW_PRODUCTS.find((r) => r.slug === product.node.handle)?.categories.map((c) => c.slug) ?? [];

  if (category.matchSlugs.some((s) => catSlugs.includes(s))) return true;
  if (category.matchTags?.some((t) => slugs.some((tag) => tag.toLowerCase().includes(t)))) return true;

  const title = product.node.title.toLowerCase();
  const slug = category.slug;
  if (slug === "pallstall" && (title.includes("pallställ") || title.includes("pallstall"))) return true;
  if (slug === "hyllstall" && (title.includes("hyllställ") || title.includes("hyllstall"))) return true;
  if (slug === "grenstall" && title.includes("grenställ")) return true;
  if (slug === "begagnat" && isUsedProduct(RAW_PRODUCTS.find((r) => r.slug === product.node.handle)!)) return true;

  return false;
}

export function filterByCategory(products: CatalogProduct[], categorySlug: string): CatalogProduct[] {
  const cat = getCategory(categorySlug);
  if (!cat) return products;
  return products.filter((p) => productMatchesCategory(p, cat));
}

export function filterUsed(products: CatalogProduct[]): CatalogProduct[] {
  return products.filter((p) => {
    const raw = RAW_PRODUCTS.find((r) => r.slug === p.node.handle);
    return raw ? isUsedProduct(raw) : (p.node.tags ?? []).includes("begagnat");
  });
}

export { CATEGORIES, getCategory, RAW_PRODUCTS };

export function isCatalogOnly(product: CatalogProduct | ShopifyProduct): boolean {
  const node = product.node as CatalogNode;
  return node.catalogOnly === true || node.variants.edges[0]?.node.id.startsWith("gid://kjk/");
}
