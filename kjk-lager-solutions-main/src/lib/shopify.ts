import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN = "kjk-lager-solutions-u7u1g.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "71c56131a150d3d0c5316e7755035208";

export interface ShopifyProduct {
  node: {
    id: string;
    title: string;
    description: string;
    handle: string;
    productType?: string;
    vendor?: string;
    tags?: string[];
    priceRange: {
      minVariantPrice: { amount: string; currencyCode: string };
    };
    images: {
      edges: Array<{ node: { url: string; altText: string | null } }>;
    };
    variants: {
      edges: Array<{
        node: {
          id: string;
          title: string;
          price: { amount: string; currencyCode: string };
          availableForSale: boolean;
          selectedOptions: Array<{ name: string; value: string }>;
        };
      }>;
    };
    options: Array<{ name: string; values: string[] }>;
  };
}

export async function storefrontApiRequest(query: string, variables: Record<string, unknown> = {}) {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description: "Shopify API requires an active billing plan. Visit admin.shopify.com to upgrade.",
    });
    return null;
  }

  if (!response.ok) {
    throw new Error(`Shopify HTTP ${response.status}`);
  }

  const data = await response.json();
  if (data.errors) {
    throw new Error(`Shopify: ${data.errors.map((e: { message: string }) => e.message).join(", ")}`);
  }
  return data;
}

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges {
        node {
          id title description handle productType vendor tags
          priceRange { minVariantPrice { amount currencyCode } }
          images(first: 5) { edges { node { url altText } } }
          variants(first: 10) {
            edges {
              node {
                id title availableForSale
                price { amount currencyCode }
                selectedOptions { name value }
              }
            }
          }
          options { name values }
        }
      }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    productByHandle(handle: $handle) {
      id title description handle productType vendor tags
      priceRange { minVariantPrice { amount currencyCode } }
      images(first: 8) { edges { node { url altText } } }
      variants(first: 20) {
        edges {
          node {
            id title availableForSale
            price { amount currencyCode }
            selectedOptions { name value }
          }
        }
      }
      options { name values }
    }
  }
`;

export async function fetchProducts(opts?: { first?: number; query?: string }): Promise<ShopifyProduct[]> {
  const data = await storefrontApiRequest(PRODUCTS_QUERY, {
    first: opts?.first ?? 50,
    query: opts?.query ?? null,
  });
  return data?.data?.products?.edges ?? [];
}

export async function fetchProductByHandle(handle: string): Promise<ShopifyProduct["node"] | null> {
  const data = await storefrontApiRequest(PRODUCT_BY_HANDLE_QUERY, { handle });
  return data?.data?.productByHandle ?? null;
}

/* ---------- Cart ---------- */

const CART_QUERY = `query cart($id: ID!) { cart(id: $id) { id totalQuantity } }`;

const CART_CREATE_MUTATION = `
  mutation cartCreate($input: CartInput!) {
    cartCreate(input: $input) {
      cart {
        id checkoutUrl
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_ADD_MUTATION = `
  mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
    cartLinesAdd(cartId: $cartId, lines: $lines) {
      cart {
        id
        lines(first: 100) { edges { node { id merchandise { ... on ProductVariant { id } } } } }
      }
      userErrors { field message }
    }
  }
`;

const CART_LINES_UPDATE_MUTATION = `
  mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
    cartLinesUpdate(cartId: $cartId, lines: $lines) { cart { id } userErrors { field message } }
  }
`;

const CART_LINES_REMOVE_MUTATION = `
  mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
    cartLinesRemove(cartId: $cartId, lineIds: $lineIds) { cart { id } userErrors { field message } }
  }
`;

function formatCheckoutUrl(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.set("channel", "online_store");
    return u.toString();
  } catch {
    return url;
  }
}

function isCartNotFoundError(errs: Array<{ message: string }>): boolean {
  return errs.some((e) => {
    const m = e.message.toLowerCase();
    return m.includes("cart not found") || m.includes("does not exist");
  });
}

import type { CartItem } from "@/stores/cartStore";

export async function createShopifyCart(item: CartItem) {
  const data = await storefrontApiRequest(CART_CREATE_MUTATION, {
    input: { lines: [{ quantity: item.quantity, merchandiseId: item.variantId }] },
  });
  const errs = data?.data?.cartCreate?.userErrors ?? [];
  if (errs.length > 0) {
    console.error("cartCreate", errs);
    return null;
  }
  const cart = data?.data?.cartCreate?.cart;
  if (!cart?.checkoutUrl) return null;
  const lineId = cart.lines.edges[0]?.node?.id;
  if (!lineId) return null;
  return { cartId: cart.id, checkoutUrl: formatCheckoutUrl(cart.checkoutUrl), lineId };
}

export async function addLineToShopifyCart(cartId: string, item: CartItem) {
  const data = await storefrontApiRequest(CART_LINES_ADD_MUTATION, {
    cartId,
    lines: [{ quantity: item.quantity, merchandiseId: item.variantId }],
  });
  const errs = data?.data?.cartLinesAdd?.userErrors ?? [];
  if (isCartNotFoundError(errs)) return { success: false, cartNotFound: true };
  if (errs.length > 0) return { success: false };
  const lines = data?.data?.cartLinesAdd?.cart?.lines?.edges ?? [];
  const newLine = lines.find(
    (l: { node: { id: string; merchandise: { id: string } } }) =>
      l.node.merchandise.id === item.variantId,
  );
  return { success: true as const, lineId: newLine?.node?.id };
}

export async function updateShopifyCartLine(cartId: string, lineId: string, quantity: number) {
  const data = await storefrontApiRequest(CART_LINES_UPDATE_MUTATION, {
    cartId,
    lines: [{ id: lineId, quantity }],
  });
  const errs = data?.data?.cartLinesUpdate?.userErrors ?? [];
  if (isCartNotFoundError(errs)) return { success: false, cartNotFound: true };
  if (errs.length > 0) return { success: false };
  return { success: true };
}

export async function removeLineFromShopifyCart(cartId: string, lineId: string) {
  const data = await storefrontApiRequest(CART_LINES_REMOVE_MUTATION, {
    cartId,
    lineIds: [lineId],
  });
  const errs = data?.data?.cartLinesRemove?.userErrors ?? [];
  if (isCartNotFoundError(errs)) return { success: false, cartNotFound: true };
  if (errs.length > 0) return { success: false };
  return { success: true };
}

export async function syncCartCheck(cartId: string) {
  return storefrontApiRequest(CART_QUERY, { id: cartId });
}
